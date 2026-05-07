'use client'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false })

type Booking = {
  id: string; date: string; slot: string; amount: number; status: string;
  booking_type: string; booking_mode?: string; duration: number;
  rating: number | null; rated_at: string | null; created_at?: string;
  payment_id?: string | null;
  workers?: { lat: number; lng: number; name: string }
}

const STATUS_STEPS = ['confirmed', 'en route', 'in progress', 'completed']
const FINDING_DURATION = 5 * 60 // 5 minutes in seconds
const EXTEND_DURATION = 5 * 60  // extend by another 5 minutes

function FindingStrip({ createdAt, extendedAt, onTimeout }: {
  createdAt?: string
  extendedAt?: number | null
  onTimeout: () => void
}) {
  const [progress, setProgress] = useState(0)
  const firedRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    firedRef.current = false
    const startMs = extendedAt ?? (createdAt ? new Date(createdAt).getTime() : Date.now())
    const duration = extendedAt ? EXTEND_DURATION : FINDING_DURATION

    const tick = () => {
      const elapsed = (Date.now() - startMs) / 1000
      const pct = Math.min((elapsed / duration) * 100, 100)
      setProgress(pct)
      if (pct >= 100 && !firedRef.current) {
        firedRef.current = true
        onTimeout()
      }
    }
    tick()
    intervalRef.current = setInterval(tick, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [createdAt, extendedAt])

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-gray-700">Finding a professional nearby...</span>
        <span className="text-xs text-[#F5A623] font-bold">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #F5A623, #FF6B35)' }}
        />
      </div>
    </div>
  )
}

function TimeoutModal({ onWait, onRefund, refunding }: {
  onWait: () => void
  onRefund: () => void
  refunding: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <h2 className="font-bold text-lg text-center mb-1">Still looking...</h2>
        <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
          We haven&apos;t found a professional nearby yet. Do you want to wait a bit longer or cancel and get your money back?
        </p>
        <button
          onClick={onWait}
          className="w-full bg-[#F5A623] text-white font-bold py-3.5 rounded-2xl text-sm mb-3 shadow-[0_4px_16px_rgba(245,166,35,0.3)]"
        >
          Wait 5 more minutes
        </button>
        <button
          onClick={onRefund}
          disabled={refunding}
          className="w-full border border-red-200 text-red-500 font-semibold py-3.5 rounded-2xl text-sm disabled:opacity-50"
        >
          {refunding ? 'Processing refund...' : 'Cancel & get refund'}
        </button>
      </div>
    </div>
  )
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [refunding, setRefunding] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submittingRating, setSubmittingRating] = useState(false)
  const [ratingDone, setRatingDone] = useState(false)
  const [showTimeoutModal, setShowTimeoutModal] = useState(false)
  const [extendedAt, setExtendedAt] = useState<number | null>(null)

  useEffect(() => {
    if (!user) return
    fetchBooking()
    const ch = supabase
      .channel(`booking-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${id}` }, p => {
        setBooking(prev => prev ? { ...prev, ...(p.new as Partial<Booking>) } : null)
        // Hide timeout modal if professional was found
        if ((p.new as Partial<Booking>).status === 'en route') setShowTimeoutModal(false)
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [id, user])

  const fetchBooking = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*, workers(*)')
      .eq('id', id)
      .single()
    setBooking(data as Booking)
    setLoading(false)
  }

  const submitRating = async () => {
    if (!rating) return
    setSubmittingRating(true)
    await fetch('/api/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: id, rating }),
    })
    setRatingDone(true)
    setSubmittingRating(false)
    setBooking(prev => prev ? { ...prev, rating, rated_at: new Date().toISOString() } : null)
  }

  const initiateRefund = async (bookingToRefund: Booking) => {
    setRefunding(true)
    try {
      if (bookingToRefund.payment_id) {
        const res = await fetch('/api/refund', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: bookingToRefund.id,
            paymentId: bookingToRefund.payment_id,
            amount: bookingToRefund.amount,
          }),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error || 'Refund failed')
        setBooking(prev => prev ? { ...prev, status: 'refund_pending' } : null)
      } else {
        await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
        setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null)
      }
    } catch {
      alert('Could not process refund automatically. Please contact support at team@getzilpo.com')
    }
    setRefunding(false)
    setShowTimeoutModal(false)
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

  const handleTimeout = () => {
    if (booking?.booking_mode === 'instant') setShowTimeoutModal(true)
  }

  const handleWaitMore = () => {
    setExtendedAt(Date.now())
    setShowTimeoutModal(false)
  }

  if (loading) return <div className="page px-4 py-8 text-gray-400 text-sm">Loading...</div>
  if (!booking) return <div className="page px-4 py-8"><p className="text-gray-400 text-sm">Booking not found.</p></div>

  const stepIdx = STATUS_STEPS.indexOf(booking.status)
  const progress = stepIdx < 0 ? 0 : Math.round((stepIdx / (STATUS_STEPS.length - 1)) * 100)

  const mapCenter = booking.workers
    ? { lat: booking.workers.lat, lng: booking.workers.lng }
    : { lat: 28.6139, lng: 77.2090 }

  const showMap = !['cancelled', 'refund_pending', 'refunded'].includes(booking.status)
  const isPending = ['pending', 'confirmed'].includes(booking.status)
  const isInstantPending = isPending && booking.booking_mode === 'instant'
  const isCancelable = !['completed', 'cancelled', 'refund_pending', 'refunded'].includes(booking.status)

  const statusColor =
    booking.status === 'completed' ? 'bg-green-50 text-green-700' :
    booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
    booking.status === 'refund_pending' ? 'bg-blue-50 text-blue-600' :
    'bg-amber-50 text-amber-700'

  return (
    <main className="page">
      {showTimeoutModal && booking && (
        <TimeoutModal
          onWait={handleWaitMore}
          onRefund={() => initiateRefund(booking)}
          refunding={refunding}
        />
      )}

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
          <p className="text-xs text-blue-600">Your payment will be returned within 5–7 business days to the original payment method.</p>
        </div>
      )}

      {booking.status !== 'cancelled' && booking.status !== 'refund_pending' && (
        <div className="px-4 pt-4 pb-2">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #F5A623, #FF6B35)' }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            {STATUS_STEPS.map((step, i) => (
              <span key={step} className={`text-[9px] font-semibold capitalize ${i <= stepIdx ? 'text-[#F5A623]' : 'text-gray-300'}`}>
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {showMap && (
        <div className="mt-3">
          <MapComponent
            center={mapCenter}
            showWorkers
            height="220px"
            defaultZoom={isPending ? 13 : 15}
          />
          {isPending && (
            <FindingStrip
              createdAt={booking.created_at}
              extendedAt={extendedAt}
              onTimeout={handleTimeout}
            />
          )}
          {!isPending && booking.workers && (
            <p className="text-center text-xs text-gray-400 py-2">
              {booking.status === 'en route' ? 'Professional is on the way' : 'Live professional location'}
            </p>
          )}
        </div>
      )}

      <div className="px-4 mt-4 flex flex-col gap-4 pb-8">
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3">Booking info</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{booking.date}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Time</span><span>{booking.slot}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Duration</span><span>{booking.duration} hr</span></div>
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
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24"
                    fill={(hoverRating || rating) >= star ? '#F5A623' : 'none'}
                    stroke="#F5A623" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
              ))}
            </div>
            <button
              onClick={submitRating}
              disabled={!rating || submittingRating}
              className="w-full bg-[#F5A623] text-white font-bold py-3.5 rounded-2xl disabled:opacity-40"
            >
              {submittingRating ? 'Submitting...' : 'Submit rating'}
            </button>
          </div>
        )}

        {(booking.rated_at || ratingDone) && booking.status === 'completed' && (
          <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#22C55E"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <p className="text-sm font-semibold text-green-800">Thanks for your rating!</p>
          </div>
        )}

        {isCancelable && (
          <button
            onClick={cancel}
            disabled={cancelling || refunding}
            className="w-full border border-red-200 text-red-500 font-semibold py-4 rounded-2xl disabled:opacity-50"
          >
            {cancelling || refunding ? 'Cancelling...' : booking.payment_id ? 'Cancel & get refund' : 'Cancel booking'}
          </button>
        )}

        {isInstantPending && (
          <p className="text-center text-xs text-gray-400">
            Instant bookings automatically cancel and refund if no professional is found within 5 minutes.
          </p>
        )}
      </div>
    </main>
  )
}
