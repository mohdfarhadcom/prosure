'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'

type Booking = {
  id: string
  booking_type: string
  date: string
  slot: string
  address: string
  lat?: number
  lng?: number
  amount: number
  status: string
  duration?: number
}

export default function OrderDetailPage() {
  const { pro, loading } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [booking, setBooking] = useState<Booking | null>(null)
  const [completing, setCompleting] = useState(false)
  const [otpInput, setOtpInput] = useState('')
  const [otpError, setOtpError] = useState('')
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (!loading && !pro) router.replace('/login')
  }, [pro, loading, router])

  useEffect(() => {
    if (!id) return
    supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => setBooking(data as Booking))
  }, [id])

  useEffect(() => {
    if (!id) return
    const ch = supabase
      .channel(`booking-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${id}` }, p => {
        setBooking(p.new as Booking)
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [id])

  const verifyAndStart = async () => {
    if (!booking || !pro) return
    setOtpError('')
    setStarting(true)
    try {
      const res = await fetch('/api/start-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id, code: otpInput.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setOtpError(data?.error || 'Could not start the service.')
      } else {
        setOtpInput('')
      }
    } catch {
      setOtpError('Network error. Try again.')
    }
    setStarting(false)
  }

  const markComplete = async () => {
    if (!booking || !pro) return
    setCompleting(true)
    await fetch('/api/complete-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: booking.id, professionalId: pro.id }),
    })
    setCompleting(false)
  }

  if (loading || !pro) return null
  if (!booking) return (
    <main className="page px-4 py-6">
      <div className="h-6 w-32 shimmer rounded mb-4" />
      {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 rounded-xl shimmer mb-3" />)}
    </main>
  )

  const dateStr = booking.date
    ? new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '—'
  const timeStr = booking.slot || '—'

  const durLabel = booking.duration
    ? (booking.duration >= 60 ? `${booking.duration / 60} hr` : `${booking.duration} min`)
    : ''
  const serviceLabel = booking.booking_type === 'hourly'
    ? `${durLabel} Home Help`
    : 'Home Services'

  const proEarning = Math.round((booking.amount || 0) * 0.8)

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    'in progress': 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const statusLabel: Record<string, string> = {
    pending: t.statusPending,
    confirmed: t.statusPending,
    accepted: t.statusAccepted,
    'in progress': 'In Progress',
    completed: t.statusCompleted,
    cancelled: t.statusCancelled,
  }

  return (
    <>
      <main className="page">
        <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="font-semibold text-base">{t.orderDetail}</h1>
          <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-xl ${statusColor[booking.status] || 'bg-gray-100 text-gray-600'}`}>
            {statusLabel[booking.status] || booking.status}
          </span>
        </header>

        <div className="px-4 mt-4 pb-40">
          {/* Service */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-3">
            <p className="text-xs text-gray-400 mb-0.5">{t.service}</p>
            <p className="font-bold text-base text-gray-900">{serviceLabel}</p>
            {durLabel && <p className="text-xs text-gray-500 mt-0.5">{durLabel}</p>}
          </div>

          {/* Date & time */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-0.5">{t.date}</p>
              <p className="font-semibold text-sm text-gray-900">{dateStr}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-0.5">{t.time}</p>
              <p className="font-semibold text-sm text-gray-900">{timeStr}</p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-3">
            <p className="text-xs text-gray-400 mb-0.5">{t.address}</p>
            <p className="font-medium text-sm text-gray-900">{booking.address || '—'}</p>
          </div>

          {/* Amount */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-3">
            <p className="text-xs text-gray-400 mb-0.5">{t.amount}</p>
            <div className="flex items-baseline gap-2">
              <p className="font-bold text-xl text-[#F5A623]">{t.rs} {booking.amount}</p>
              <p className="text-xs text-gray-400">You earn: ₹{proEarning}</p>
            </div>
          </div>

          {/* OTP entry — shown when accepted (arrived at customer, need start code) */}
          {booking.status === 'accepted' && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <p className="text-sm font-bold text-blue-800">Ask customer for start code</p>
              </div>
              <p className="text-xs text-blue-600 mb-3">Customer can see their 4-digit code on the Zilpo app. Enter it below to start the service.</p>
              <input
                type="number"
                inputMode="numeric"
                maxLength={4}
                value={otpInput}
                onChange={e => { setOtpInput(e.target.value.slice(0, 4)); setOtpError('') }}
                placeholder="Enter 4-digit code"
                className="w-full border border-blue-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-blue-400 bg-white mb-2"
              />
              {otpError && <p className="text-xs text-red-500 text-center mb-2">{otpError}</p>}
            </div>
          )}

          {booking.status === 'completed' && (
            <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">Job completed!</p>
                <p className="text-xs text-green-600">₹{proEarning} will be added to your wallet after 7 days</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sticky action buttons */}
      {(booking.status === 'accepted' || booking.status === 'in progress') && (
        <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 flex flex-col gap-2 bg-white border-t border-gray-100 pt-3 z-40">
          {booking.lat && booking.lng && booking.status === 'accepted' && (
            <a
              href={`https://maps.google.com/?q=${booking.lat},${booking.lng}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gray-100 text-gray-700 text-center flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {t.navigate}
            </a>
          )}
          {booking.status === 'accepted' && (
            <button
              onClick={verifyAndStart}
              disabled={otpInput.length < 4 || starting}
              className="w-full py-4 rounded-2xl font-bold text-base bg-[#F5A623] text-white disabled:opacity-40 shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
            >
              {starting ? 'Starting...' : 'Start Service'}
            </button>
          )}
          {booking.status === 'in progress' && (
            <button
              onClick={markComplete}
              disabled={completing}
              className="w-full py-4 rounded-2xl font-bold text-base bg-[#F5A623] text-white disabled:opacity-50 shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
            >
              {completing ? t.saving : t.markComplete}
            </button>
          )}
        </div>
      )}

      <Navbar />
    </>
  )
}
