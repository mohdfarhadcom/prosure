'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { supabase } from '@/lib/supabaseClient'
import { distanceMetres } from '@/lib/googleMaps'
import Navbar from '@/components/Navbar'

const ACCEPT_WINDOW = 90 // seconds to accept an order

type IncomingOrder = {
  id: string
  service_name: string
  address: string
  lat: number
  lng: number
  total: number
  duration: number
  scheduled_at: string
  customer_phone?: string
}

export default function HomePage() {
  const { pro, setPro, loading } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const [online, setOnline] = useState(false)
  const [incomingOrder, setIncomingOrder] = useState<IncomingOrder | null>(null)
  const [accepting, setAccepting] = useState(false)
  const [timer, setTimer] = useState(ACCEPT_WINDOW)
  const [todayEarnings, setTodayEarnings] = useState(0)
  const [todayJobs, setTodayJobs] = useState(0)
  const proLat = useRef<number | null>(null)
  const proLng = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!loading && !pro) router.replace('/login')
  }, [pro, loading, router])

  // Update worker position
  useEffect(() => {
    if (!pro || !online) return
    const watchId = navigator.geolocation.watchPosition(
      async pos => {
        proLat.current = pos.coords.latitude
        proLng.current = pos.coords.longitude
        await supabase.from('workers').upsert({
          id: pro.id,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: pro.name,
          status: 'available',
        })
        setPro({ ...pro, lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [online, pro?.id])

  // Go offline — remove from workers
  useEffect(() => {
    if (!pro || online) return
    supabase.from('workers').delete().eq('id', pro.id).then(() => {})
  }, [online, pro?.id])

  // Fetch today stats
  useEffect(() => {
    if (!pro) return
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    supabase
      .from('bookings')
      .select('total')
      .eq('professional_id', pro.id)
      .eq('status', 'completed')
      .gte('scheduled_at', today.toISOString())
      .then(({ data }) => {
        if (data) {
          setTodayJobs(data.length)
          setTodayEarnings(data.reduce((s, b) => s + (b.total || 0), 0) * 0.8)
        }
      })
  }, [pro?.id])

  // Real-time order subscription
  useEffect(() => {
    if (!pro || !online) return

    const channel = supabase
      .channel('new-bookings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        payload => {
          const booking = payload.new as IncomingOrder & { status: string; service_type?: string }
          if (booking.status !== 'pending') return
          // Check service type match
          if (pro.service_type === 'home_help' && booking.service_type !== 'home_help') return
          if (pro.service_type === 'home_cook' && booking.service_type !== 'home_cook') return
          // Check 500m radius
          if (proLat.current && proLng.current && booking.lat && booking.lng) {
            const dist = distanceMetres(proLat.current, proLng.current, booking.lat, booking.lng)
            if (dist > 500) return
          }
          setIncomingOrder(booking)
          setTimer(ACCEPT_WINDOW)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [online, pro?.id, pro?.service_type])

  // Countdown for incoming order
  useEffect(() => {
    if (!incomingOrder) return
    if (timer <= 0) {
      setIncomingOrder(null)
      return
    }
    timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [incomingOrder, timer])

  const acceptOrder = async () => {
    if (!incomingOrder || !pro) return
    setAccepting(true)
    const { error } = await supabase
      .from('bookings')
      .update({ professional_id: pro.id, status: 'accepted' })
      .eq('id', incomingOrder.id)
      .eq('status', 'pending') // prevent race condition
    setAccepting(false)
    if (!error) {
      setIncomingOrder(null)
      router.push(`/orders/${incomingOrder.id}`)
    }
  }

  const rejectOrder = () => setIncomingOrder(null)

  const toggleOnline = () => {
    if (!online) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          proLat.current = pos.coords.latitude
          proLng.current = pos.coords.longitude
          setOnline(true)
        },
        () => setOnline(true)
      )
    } else {
      setOnline(false)
    }
  }

  if (loading || !pro) return null

  const greeting = `${t.hi}, ${pro.name.split(' ')[0]}`

  return (
    <>
      <main className="page">
        {/* Header */}
        <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="gradient-text font-black text-2xl tracking-tighter">zilpo</span>
              <span className="text-xs text-gray-400 ml-1">pro</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${online ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                <div className={`relative w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`}>
                  {online && <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />}
                </div>
                {online ? t.online : t.offline}
              </div>
            </div>
          </div>
          <p className="text-base font-semibold text-gray-900 mt-3">{greeting}</p>
          <p className="text-xs text-gray-400">{pro.service_type === 'home_help' ? t.homeHelp : t.homeCook}</p>
        </header>

        {/* Online toggle */}
        <div className="px-4 mt-4">
          <button
            onClick={toggleOnline}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all shadow-sm ${
              online
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-[#F5A623] text-white shadow-[0_4px_20px_rgba(245,166,35,0.35)]'
            }`}
          >
            {online ? t.goOffline : t.goOnline}
          </button>
        </div>

        {/* Today stats */}
        <div className="px-4 mt-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">Today's earnings</p>
            <p className="font-bold text-xl text-gray-900">Rs {Math.round(todayEarnings)}</p>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">this week</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">Jobs today</p>
            <p className="font-bold text-xl text-gray-900">{todayJobs}</p>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">completed</p>
          </div>
        </div>

        {/* Status message */}
        <div className="px-4 mt-6">
          {online ? (
            <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="relative w-3 h-3 rounded-full bg-green-500 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Looking for orders nearby</p>
                <p className="text-xs text-green-600">You will receive notifications for orders within 500m</p>
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

        {/* Approval notice */}
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

      {/* Incoming order modal */}
      {incomingOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end max-w-[430px] mx-auto">
          <div className="w-full bg-white rounded-t-3xl p-6 slide-up">
            {/* Timer ring */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-lg text-gray-900">{t.newOrder}</p>
                <p className="text-xs text-gray-400">{t.nearbyOrder}</p>
              </div>
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#F3F4F6" strokeWidth="4" />
                  <circle
                    cx="28" cy="28" r="24" fill="none" stroke="#F5A623" strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - timer / ACCEPT_WINDOW)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">{timer}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <p className="font-semibold text-sm text-gray-900 mb-1">{incomingOrder.service_name}</p>
              <p className="text-xs text-gray-500 mb-2 flex items-start gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/></svg>
                {incomingOrder.address}
              </p>
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#F5A623]">Rs {incomingOrder.total}</span>
                <span className="text-xs text-gray-400">· {incomingOrder.duration} min</span>
                {proLat.current && proLng.current && incomingOrder.lat && (
                  <span className="text-xs text-gray-400">
                    · {distanceMetres(proLat.current, proLng.current, incomingOrder.lat, incomingOrder.lng) < 1000
                      ? `${Math.round(distanceMetres(proLat.current, proLng.current, incomingOrder.lat, incomingOrder.lng))}m`
                      : `${(distanceMetres(proLat.current, proLng.current, incomingOrder.lat, incomingOrder.lng) / 1000).toFixed(1)}km`
                    } away
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={rejectOrder}
                className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500 transition-colors"
              >
                {t.reject}
              </button>
              <button
                onClick={acceptOrder}
                disabled={accepting}
                className="flex-[2] py-3.5 rounded-2xl font-bold text-sm bg-[#F5A623] text-white disabled:opacity-50 shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
              >
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
