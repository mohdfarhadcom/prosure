'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { supabase } from '@/lib/supabaseClient'
import { distanceMetres } from '@/lib/googleMaps'
import GpsOffModal from '@/components/GpsOffModal'
import Navbar from '@/components/Navbar'

const ACCEPT_WINDOW = 90

type IncomingOrder = {
  id: string
  address: string
  lat: number
  lng: number
  amount: number
  duration: number
  date?: string
  slot?: string
  service_type?: string
  booking_type?: string
  booking_mode?: string
  user_id?: string
  customerName?: string
  isScheduled?: boolean
}

export default function HomePage() {
  const { pro, loading } = useAuth()
  const { t } = useI18n()
  const router = useRouter()

  // null = not yet read from localStorage — prevents "go offline" effect firing on mount
  const [online, setOnline] = useState<boolean | null>(null)
  const [showGpsModal, setShowGpsModal] = useState(false)
  const [gpsRetrying, setGpsRetrying] = useState(false)
  const [incomingOrder, setIncomingOrder] = useState<IncomingOrder | null>(null)
  const [accepting, setAccepting] = useState(false)
  const [timer, setTimer] = useState(ACCEPT_WINDOW)
  const [todayEarnings, setTodayEarnings] = useState(0)
  const [todayJobs, setTodayJobs] = useState(0)
  const proLat = useRef<number | null>(null)
  const proLng = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Read online state from localStorage — runs only on client
  useEffect(() => {
    const saved = localStorage.getItem('zilpo_pro_online')
    setOnline(saved === 'true')
  }, [])

  useEffect(() => {
    if (!loading && !pro) router.replace('/login')
  }, [pro, loading, router])

  // GPS watch — push location to server while online (throttled)
  useEffect(() => {
    if (!pro || !online) return
    let lastSent = 0
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        proLat.current = pos.coords.latitude
        proLng.current = pos.coords.longitude
        // Throttle to 1 request / 5 seconds — geolocation can fire often
        const now = Date.now()
        if (now - lastSent < 5000) return
        lastSent = now
        fetch('/api/pro/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        }).catch(() => {})
      },
      () => { setShowGpsModal(true) },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [online, pro?.id])

  // Remove from workers only when explicitly set offline (never on initial null)
  useEffect(() => {
    if (online !== false || !pro) return
    fetch('/api/pro/location', { method: 'DELETE' }).catch(() => {})
  }, [online, pro?.id])

  // Today stats
  useEffect(() => {
    if (!pro) return
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    supabase
      .from('bookings')
      .select('amount')
      .eq('professional_id', pro.id)
      .eq('status', 'completed')
      .gte('created_at', today.toISOString())
      .then(({ data }) => {
        if (data) {
          setTodayJobs(data.length)
          setTodayEarnings(data.reduce((s, b) => s + (b.amount || 0), 0) * 0.8)
        }
      })
  }, [pro?.id])

  // Enrich order with customer name
  const enrichOrder = useCallback(async (booking: IncomingOrder) => {
    if (!booking.user_id) return booking
    const { data } = await supabase.from('users').select('name').eq('id', booking.user_id).single()
    return { ...booking, customerName: data?.name || '' }
  }, [])

  // Check for pending orders missed while offline
  const checkForPendingOrders = useCallback(async () => {
    if (!pro || !proLat.current || !proLng.current) return
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'confirmed')
      .is('professional_id', null)
      .gte('created_at', tenMinsAgo)
      .order('created_at', { ascending: false })
      .limit(3)
    if (!data || data.length === 0) return
    for (const booking of data) {
      if (pro.service_type && booking.service_type && pro.service_type !== booking.service_type) continue
      if (booking.lat && booking.lng) {
        const dist = distanceMetres(proLat.current, proLng.current, booking.lat, booking.lng)
        if (dist > 1000) continue
      }
      const enriched = await enrichOrder({ ...booking, isScheduled: booking.booking_mode === 'schedule' })
      setIncomingOrder(enriched)
      setTimer(ACCEPT_WINDOW)
      break
    }
  }, [pro, enrichOrder])

  // Real-time order subscription (instant + scheduled)
  useEffect(() => {
    if (!pro || !online) return
    const channel = supabase
      .channel(`pro-orders-${pro.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings' }, async payload => {
        const booking = payload.new as IncomingOrder & { status: string }
        if (booking.status !== 'confirmed') return
        if (booking.booking_mode === 'instant' && (booking as unknown as { professional_id?: string }).professional_id) return
        if (pro.service_type && booking.service_type && pro.service_type !== booking.service_type) return
        if (proLat.current && proLng.current && booking.lat && booking.lng) {
          const dist = distanceMetres(proLat.current, proLng.current, booking.lat, booking.lng)
          if (dist > 1000) return
        }
        const enriched = await enrichOrder({ ...booking, isScheduled: booking.booking_mode === 'schedule' })
        setIncomingOrder(enriched)
        setTimer(ACCEPT_WINDOW)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [online, pro?.id, pro?.service_type, enrichOrder])

  // Check for missed orders when going online or returning to app
  useEffect(() => {
    if (!online) return
    checkForPendingOrders()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') checkForPendingOrders()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [online, checkForPendingOrders])

  // Countdown timer
  useEffect(() => {
    if (!incomingOrder) return
    if (timer <= 0) { setIncomingOrder(null); return }
    timerRef.current = setTimeout(() => setTimer(s => s - 1), 1000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [incomingOrder, timer])

  const acceptOrder = async () => {
    if (!incomingOrder || !pro) return
    setAccepting(true)
    try {
      const res = await fetch('/api/accept-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: incomingOrder.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setIncomingOrder(null)
        router.push(`/orders/${incomingOrder.id}`)
      } else if (res.status === 409) {
        // Lost the race — silently drop the toast
        setIncomingOrder(null)
      } else {
        alert(data?.error || 'Could not accept order')
      }
    } catch {
      alert('Network error. Try again.')
    }
    setAccepting(false)
  }

  const rejectOrder = () => setIncomingOrder(null)

  const goOnlineWithLocation = (pos: GeolocationPosition) => {
    proLat.current = pos.coords.latitude
    proLng.current = pos.coords.longitude
    setOnline(true)
    localStorage.setItem('zilpo_pro_online', 'true')
    setShowGpsModal(false)
    setGpsRetrying(false)
  }

  const handleGpsError = (err: GeolocationPositionError) => {
    setGpsRetrying(false)
    if (err.code === 2) {
      setShowGpsModal(true)
    } else {
      setOnline(true)
      localStorage.setItem('zilpo_pro_online', 'true')
    }
  }

  const toggleOnline = () => {
    if (online) {
      setOnline(false)
      localStorage.setItem('zilpo_pro_online', 'false')
    } else {
      try {
        navigator.geolocation.getCurrentPosition(goOnlineWithLocation, handleGpsError, {
          enableHighAccuracy: true, timeout: 10000, maximumAge: 0,
        })
      } catch {
        setOnline(true)
        localStorage.setItem('zilpo_pro_online', 'true')
      }
    }
  }

  const retryGps = () => {
    setGpsRetrying(true)
    navigator.geolocation.getCurrentPosition(goOnlineWithLocation, handleGpsError, {
      enableHighAccuracy: true, timeout: 10000, maximumAge: 0,
    })
  }

  if (loading || !pro) return null
  const isOnline = online === true
  const greeting = `${t.hi}, ${pro.name.split(' ')[0]}`
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  return (
    <>
      {showGpsModal && (
        <GpsOffModal onDismiss={() => setShowGpsModal(false)} onRetry={retryGps} retrying={gpsRetrying} />
      )}

      <main className="page">
        <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="gradient-text font-black text-2xl tracking-tighter">zilpo</span>
              <span className="text-xs text-gray-400 ml-1">pro</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${isOnline ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              <div className={`relative w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
                {isOnline && <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />}
              </div>
              {online === null ? '...' : isOnline ? t.online : t.offline}
            </div>
          </div>
          <p className="text-base font-semibold text-gray-900 mt-3">{greeting}</p>
          <p className="text-xs text-gray-400">{pro.service_type === 'home_help' ? t.homeHelp : t.homeCook}</p>
        </header>

        <div className="px-4 mt-4">
          {online === null ? (
            <div className="w-full py-4 rounded-2xl bg-gray-100 animate-pulse" />
          ) : (
            <button
              onClick={toggleOnline}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all shadow-sm ${
                isOnline ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-[#F5A623] text-white shadow-[0_4px_20px_rgba(245,166,35,0.35)]'
              }`}
            >
              {isOnline ? t.goOffline : t.goOnline}
            </button>
          )}
        </div>

        <div className="px-4 mt-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">Today&apos;s earnings</p>
            <p className="font-bold text-xl text-gray-900">Rs {Math.round(todayEarnings)}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">Jobs today</p>
            <p className="font-bold text-xl text-gray-900">{todayJobs}</p>
          </div>
        </div>

        <div className="px-4 mt-6">
          {isOnline ? (
            <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="relative w-3 h-3 rounded-full bg-green-500 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Looking for orders nearby</p>
                <p className="text-xs text-green-600">Instant orders within 1km · Scheduled orders in Orders tab</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <p className="text-sm font-semibold text-gray-700">{t.noOrders}</p>
              <p className="text-xs text-gray-400 mt-1">{t.goOnlinePrompt}</p>
            </div>
          )}
        </div>

        {pro.status !== 'approved' && (
          <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>
                <p className="text-sm font-semibold text-amber-800">{t.pendingApproval}</p>
                <p className="text-xs text-amber-600 mt-0.5">{t.approvalNote}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {incomingOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end max-w-[430px] mx-auto">
          <div className="w-full bg-white rounded-t-3xl overflow-hidden" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between px-6 pt-6 mb-4">
              <div>
                <p className="font-bold text-lg text-gray-900">
                  {incomingOrder.isScheduled ? '📅 Scheduled Order' : t.newOrder}
                </p>
                <p className="text-xs text-gray-400">
                  {incomingOrder.isScheduled ? `${incomingOrder.date || ''} · ${incomingOrder.slot || ''}` : t.nearbyOrder}
                </p>
              </div>
              <div className="relative w-14 h-14 flex-shrink-0">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#F3F4F6" strokeWidth="4" />
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#F5A623" strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - timer / ACCEPT_WINDOW)}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">{timer}</span>
                </div>
              </div>
            </div>

            <div className="mx-6 mb-3 bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{incomingOrder.customerName || 'Customer'}</p>
                  <p className="text-xs text-gray-500">{incomingOrder.service_type === 'home_cook' ? 'Home Cook' : 'Home Help'}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2 flex items-start gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/></svg>
                {incomingOrder.address}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-[#F5A623]">Rs {incomingOrder.amount}</span>
                <span className="text-xs text-gray-400">· {incomingOrder.duration} min</span>
                {proLat.current && proLng.current && incomingOrder.lat && (
                  <span className="text-xs text-gray-400">
                    · {(() => {
                      const d = distanceMetres(proLat.current!, proLng.current!, incomingOrder.lat, incomingOrder.lng)
                      return d < 1000 ? `${Math.round(d)}m` : `${(d / 1000).toFixed(1)}km`
                    })()} away
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  · ~{proLat.current && proLng.current && incomingOrder.lat
                    ? Math.max(1, Math.round(distanceMetres(proLat.current, proLng.current, incomingOrder.lat, incomingOrder.lng) / 250))
                    : '?'} min ETA
                </span>
              </div>
            </div>

            {mapsKey && proLat.current && proLng.current && (
              <div className="mx-6 mb-4 rounded-2xl overflow-hidden" style={{ height: 160 }}>
                <iframe
                  src={`https://www.google.com/maps/embed/v1/directions?key=${mapsKey}&origin=${proLat.current},${proLng.current}&destination=${incomingOrder.lat},${incomingOrder.lng}&mode=driving&zoom=13`}
                  width="100%" height="160" style={{ border: 0 }} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
            {(!mapsKey || !proLat.current) && (
              <div className="mx-6 mb-4 rounded-2xl bg-gray-100 flex items-center justify-center" style={{ height: 80 }}>
                <p className="text-xs text-gray-400">Enable location to see route</p>
              </div>
            )}

            <div className="flex gap-3 px-6 pb-8">
              <button onClick={rejectOrder} className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-200 text-gray-600">
                {t.reject}
              </button>
              <button onClick={acceptOrder} disabled={accepting}
                className="flex-[2] py-3.5 rounded-2xl font-bold text-sm bg-[#F5A623] text-white disabled:opacity-50 shadow-[0_4px_20px_rgba(245,166,35,0.35)]">
                {accepting ? t.accepting : t.accept}
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </>
  )
}
