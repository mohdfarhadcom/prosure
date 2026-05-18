'use client'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useRef, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useLocation } from '@/context/LocationContext'
import { supabase } from '@/lib/supabaseClient'

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false })

type Booking = {
  id: string; date: string; slot: string; amount: number; status: string;
  booking_type: string; booking_mode?: string; duration: number;
  rating: number | null; rated_at: string | null; created_at?: string;
  payment_id?: string | null; professional_id?: string | null;
  address?: string; user_id?: string;
  workers?: { id?: string; lat: number; lng: number; name: string }
}

const STATUS_STEPS = ['confirmed', 'accepted', 'en route', 'in progress', 'completed']
const FINDING_DURATION = 10 * 60 // 10 minutes

function useFakePros(center: { lat: number; lng: number }) {
  const base = useMemo(() => Array.from({ length: 5 }, () => ({
    lat: center.lat + (Math.random() - 0.5) * 0.018,
    lng: center.lng + (Math.random() - 0.5) * 0.022,
  })), []) // eslint-disable-line react-hooks/exhaustive-deps

  const [positions, setPositions] = useState(base)

  useEffect(() => {
    const id = setInterval(() => {
      setPositions(prev => prev.map(p => ({
        lat: p.lat + (Math.random() - 0.5) * 0.0003,
        lng: p.lng + (Math.random() - 0.5) * 0.0003,
      })))
    }, 2500)
    return () => clearInterval(id)
  }, [])

  return positions
}

function FindingStrip({ createdAt, extendedAt, onTimeout }: {
  createdAt?: string
  extendedAt?: number | null
  onTimeout: () => void
}) {
  const [secs, setSecs] = useState(0)
  const firedRef = useRef(false)

  useEffect(() => {
    firedRef.current = false
    const startMs = extendedAt ?? (createdAt ? new Date(createdAt).getTime() : Date.now())
    const duration = FINDING_DURATION
    const tick = () => {
      const elapsed = (Date.now() - startMs) / 1000
      setSecs(Math.min(elapsed, duration))
      if (elapsed >= duration && !firedRef.current) {
        firedRef.current = true
        onTimeout()
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [createdAt, extendedAt])

  const mins = Math.floor((FINDING_DURATION - secs) / 60)
  const s = Math.floor((FINDING_DURATION - secs) % 60)
  return <span className="text-xs text-gray-400">{mins}:{String(s).padStart(2, '0')} remaining</span>
}

function TimeoutModal({ onWait, onRefund, refunding }: {
  onWait: () => void; onRefund: () => void; refunding: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <h2 className="font-bold text-lg text-center mb-1">Still looking...</h2>
        <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
          We haven&apos;t found a professional nearby yet. Wait a bit longer or cancel and get your money back instantly.
        </p>
        <button onClick={onWait} className="w-full bg-[#F5A623] text-white font-bold py-3.5 rounded-2xl text-sm mb-3 shadow-[0_4px_16px_rgba(245,166,35,0.3)]">
          Wait 5 more minutes
        </button>
        <button onClick={onRefund} disabled={refunding} className="w-full border border-red-200 text-red-500 font-semibold py-3.5 rounded-2xl text-sm disabled:opacity-50">
          {refunding ? 'Processing refund...' : 'Cancel & get refund'}
        </button>
      </div>
    </div>
  )
}

// Uber-style full screen for instant bookings
function InstantFindingScreen({ booking, onCancel, cancelling }: {
  booking: Booking; onCancel: () => void; cancelling: boolean
}) {
  const [dots, setDots] = useState('.')
  const [extendedAt, setExtendedAt] = useState<number | null>(null)
  const [showTimeout, setShowTimeout] = useState(false)
  const [refunding, setRefunding] = useState(false)

  const { location: userLocation } = useLocation()
  const center = useMemo(() => userLocation
    ? { lat: userLocation.lat, lng: userLocation.lng }
    : { lat: 28.6139, lng: 77.2090 },
  [userLocation?.lat, userLocation?.lng]) // eslint-disable-line react-hooks/exhaustive-deps
  const fakePros = useFakePros(center)

  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 500)
    return () => clearInterval(id)
  }, [])

  const handleRefund = async () => {
    setRefunding(true)
    try {
      if (booking.payment_id) {
        await fetch('/api/refund', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: booking.id, paymentId: booking.payment_id, amount: booking.amount }),
        })
      } else {
        await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', booking.id)
      }
    } catch {}
    setRefunding(false)
    setShowTimeout(false)
    onCancel()
  }

  return (
    <main className="fixed inset-0 bg-white flex flex-col z-20">
      {showTimeout && (
        <TimeoutModal
          onWait={() => { setExtendedAt(Date.now()); setShowTimeout(false) }}
          onRefund={handleRefund}
          refunding={refunding}
        />
      )}

      {/* Full map */}
      <div className="flex-1 relative">
        <MapComponent
          center={center}
          fakeMarkers={fakePros}
          height="100%"
          defaultZoom={14}
        />

        {/* Searching pulse overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 animate-ping absolute inset-0" />
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/10 absolute inset-0 scale-150 animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 bg-white rounded-xl p-2.5 shadow-md"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>

      {/* Bottom sheet */}
      <div className="bg-white rounded-t-3xl shadow-[0_-4px_30px_rgba(0,0,0,0.12)] px-5 pt-5 pb-8">
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-black text-xl text-gray-900 leading-tight">Finding your professional{dots}</h2>
            <p className="text-sm text-gray-500 mt-1">Connecting you within 10–15 minutes</p>
          </div>
          <FindingStrip
            createdAt={booking.created_at}
            extendedAt={extendedAt}
            onTimeout={() => setShowTimeout(true)}
          />
        </div>

        {/* Animated progress */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-5">
          <div
            className="h-full rounded-full"
            style={{
              width: '60%',
              background: 'linear-gradient(90deg, #F5A623, #FF6B35)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Service info */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Service details</span>
            <span className="text-xs font-bold text-[#F5A623]">⚡ Instant</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">Home service</span>
            <span className="font-bold">₹{booking.amount}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Booking ID: {booking.id.slice(0, 8)}...</span>
            <span>Paid · UPI</span>
          </div>
        </div>

        {/* Pro count indicator */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F5A623] to-[#FF6B35] border-2 border-white flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">P</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">5 professionals nearby · checking availability</p>
        </div>

        <button
          onClick={onCancel}
          disabled={cancelling}
          className="w-full border border-red-100 text-red-500 font-semibold py-3.5 rounded-2xl text-sm disabled:opacity-50"
        >
          {cancelling ? 'Cancelling...' : 'Cancel & get refund'}
        </button>
      </div>
    </main>
  )
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { location: userLocation } = useLocation()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [refunding, setRefunding] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submittingRating, setSubmittingRating] = useState(false)
  const [ratingDone, setRatingDone] = useState(false)
  const [workerLocation, setWorkerLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!user) return
    fetchBooking()
    const ch = supabase
      .channel(`booking-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${id}` }, p => {
        setBooking(prev => prev ? { ...prev, ...(p.new as Partial<Booking>) } : null)
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [id, user])

  // Live worker location subscription
  const bookingProId = booking?.professional_id
  useEffect(() => {
    if (!bookingProId) return
    const ch = supabase
      .channel(`worker-loc-${bookingProId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workers', filter: `id=eq.${bookingProId}` }, p => {
        const w = p.new as { lat?: number; lng?: number }
        if (w.lat && w.lng) setWorkerLocation({ lat: w.lat, lng: w.lng })
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [bookingProId])

  const fetchBooking = async () => {
    const { data } = await supabase.from('bookings').select('*, workers(*)').eq('id', id).single()
    setBooking(data as Booking)
    setLoading(false)
  }

  const submitRating = async () => {
    if (!rating) return
    setSubmittingRating(true)
    await fetch('/api/rate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: id, rating }) })
    setRatingDone(true)
    setSubmittingRating(false)
    setBooking(prev => prev ? { ...prev, rating, rated_at: new Date().toISOString() } : null)
  }

  const ratingSubmitted = booking?.rated_at || ratingDone
  const submittedRating = ratingDone ? rating : (booking?.rating ?? 0)

  const initiateRefund = async (b: Booking) => {
    setRefunding(true)
    try {
      if (b.payment_id) {
        const res = await fetch('/api/refund', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: b.id, paymentId: b.payment_id, amount: b.amount }),
        })
        const data = await res.json()
        if (data.success || data.refund_pending) {
          setBooking(prev => prev ? { ...prev, status: 'refund_pending' } : null)
          if (!data.success) {
            alert('Refund has been flagged for manual processing. Our team will process it within 24 hours. Support: +91 99353 67449')
          }
        } else {
          throw new Error(data.error)
        }
      } else {
        await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
        setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      alert(`Could not process refund: ${msg}\n\nContact support: +91 99353 67449 or team@thezilpo.com`)
    }
    setRefunding(false)
  }

  const cancel = async () => {
    if (!booking) return
    const msg = booking.payment_id
      ? 'Cancel this booking? Your payment will be refunded within 5–7 business days.'
      : 'Cancel this booking?'
    if (!confirm(msg)) return
    setCancelling(true)
    await initiateRefund(booking)
    setCancelling(false)
  }

  if (loading) return <div className="page px-4 py-8 text-gray-400 text-sm">Loading...</div>
  if (!booking) return <div className="page px-4 py-8"><p className="text-gray-400 text-sm">Booking not found.</p></div>

  // Uber-style full screen for instant bookings being searched
  const isInstantPending = booking.booking_mode === 'instant' && ['pending', 'confirmed'].includes(booking.status)
  if (isInstantPending) {
    return (
      <InstantFindingScreen
        booking={booking}
        onCancel={cancel}
        cancelling={cancelling || refunding}
      />
    )
  }

  const stepIdx = STATUS_STEPS.indexOf(booking.status)
  const progress = stepIdx < 0 ? 0 : Math.round((stepIdx / (STATUS_STEPS.length - 1)) * 100)
  const mapCenter = workerLocation
    ?? (booking.workers ? { lat: booking.workers.lat, lng: booking.workers.lng } : null)
    ?? (userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : { lat: 28.6139, lng: 77.2090 })
  const showMap = !['cancelled', 'refund_pending', 'refunded'].includes(booking.status)
  const isCancelable = !['completed', 'cancelled', 'refund_pending', 'refunded'].includes(booking.status)
  const statusColor = booking.status === 'completed' ? 'bg-green-50 text-green-700' :
    booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
    booking.status === 'refund_pending' ? 'bg-blue-50 text-blue-600' :
    booking.status === 'refunded' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'

  return (
    <>
    <main className="page">
      <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="font-semibold text-base">Booking details</h1>
        <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-xl capitalize ${statusColor}`}>
          {booking.status === 'refund_pending' ? 'Refund in progress' : booking.status}
        </span>
      </header>

      {booking.status === 'refund_pending' && (
        <div className="mx-4 mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-sm font-semibold text-blue-800 mb-1">Refund initiated</p>
          <p className="text-xs text-blue-600">Your payment will be returned within 5–7 business days to your original payment method.</p>
        </div>
      )}
      {booking.status === 'refunded' && (
        <div className="mx-4 mt-4 bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div>
            <p className="text-sm font-semibold text-green-800">Refund processed ✓</p>
            <p className="text-xs text-green-600">Payment has been returned to your account.</p>
          </div>
        </div>
      )}

      {!['cancelled', 'refund_pending'].includes(booking.status) && (
        <div className="px-4 pt-4 pb-2">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #F5A623, #FF6B35)' }} />
          </div>
          <div className="flex justify-between mt-1.5">
            {STATUS_STEPS.map((step, i) => (
              <span key={step} className={`text-[9px] font-semibold capitalize ${i <= stepIdx ? 'text-[#F5A623]' : 'text-gray-300'}`}>{step}</span>
            ))}
          </div>
        </div>
      )}

      {showMap && (
        <div className="mt-3">
          <MapComponent center={mapCenter} showWorkers height="220px" defaultZoom={15} />
          {booking.workers && (
            <p className="text-center text-xs text-gray-400 py-2">
              {booking.status === 'en route' ? 'Professional is on the way' : 'Live professional location'}
            </p>
          )}
        </div>
      )}

      <div className="px-4 mt-4 flex flex-col gap-4 pb-28">
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3">Booking info</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{booking.date}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Time</span><span>{booking.slot}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Duration</span><span>{booking.duration >= 60 ? `${booking.duration / 60} hr` : `${booking.duration} min`}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Mode</span><span className="capitalize">{booking.booking_mode || 'scheduled'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount paid</span><span className="font-semibold">₹{booking.amount}</span></div>
          </div>
        </div>

        {booking.workers && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-1">Your professional</h3>
            <p className="text-sm">{booking.workers.name}</p>
            <p className="text-xs text-gray-400 mt-1">Contact shared via masked call only</p>
          </div>
        )}

        <div className="bg-[#FFF3DC] rounded-xl p-4 text-xs text-gray-700">
          Damage policy: up to ₹6,000 per booking. Not applicable on promo bookings.
        </div>

        {booking.status === 'completed' && !booking.rated_at && !ratingDone && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="font-bold text-base text-gray-900 mb-1">How was the service?</p>
            <p className="text-xs text-gray-400 mb-4">Rate your experience</p>
            <div className="flex justify-center gap-3 mb-5">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star)}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill={(hoverRating || rating) >= star ? '#F5A623' : 'none'} stroke="#F5A623" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
              ))}
            </div>
            <button onClick={submitRating} disabled={!rating || submittingRating} className="w-full bg-[#F5A623] text-white font-bold py-3.5 rounded-2xl disabled:opacity-40">
              {submittingRating ? 'Submitting...' : 'Submit rating'}
            </button>
          </div>
        )}

        {ratingSubmitted && booking.status === 'completed' && (
          submittedRating <= 3 ? (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-sm font-bold text-amber-800">Sorry to hear that!</p>
              </div>
              <p className="text-xs text-amber-700 mb-3 leading-relaxed">If you have an issue to report, please reach out to our support team — we&apos;re here to help.</p>
              <a href="mailto:team@thezilpo.com" className="text-xs font-semibold text-amber-800 block mb-1">✉ team@thezilpo.com</a>
              <a href="tel:+919935367449" className="text-xs font-semibold text-amber-800 block">📞 For immediate support call +91 99353 67449</a>
            </div>
          ) : (
            <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#22C55E"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <p className="text-sm font-semibold text-green-800">Thanks for your rating!</p>
            </div>
          )
        )}

      </div>
    </main>

    {isCancelable && (
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white border-t border-gray-100 z-40">
        <button onClick={cancel} disabled={cancelling || refunding} className="w-full border border-red-200 text-red-500 font-semibold py-4 rounded-2xl disabled:opacity-50">
          {cancelling || refunding ? 'Processing...' : booking.payment_id ? 'Cancel & get refund' : 'Cancel booking'}
        </button>
      </div>
    )}
    </>
  )
}
