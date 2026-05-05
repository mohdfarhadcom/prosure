'use client'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false })

type Booking = {
  id: string; date: string; slot: string; amount: number; status: string;
  booking_type: string; duration: number; rating: number | null; rated_at: string | null;
  workers?: { lat: number; lng: number; name: string }
}

const STATUS_STEPS = ['confirmed', 'en route', 'in progress', 'completed']

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submittingRating, setSubmittingRating] = useState(false)
  const [ratingDone, setRatingDone] = useState(false)

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

  const cancel = async () => {
    if (!confirm('Cancel this booking?')) return
    setCancelling(true)
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null)
    setCancelling(false)
  }

  if (loading) return <div className="page px-4 py-8 text-gray-400 text-sm">Loading...</div>
  if (!booking) return <div className="page px-4 py-8"><p className="text-gray-400 text-sm">Booking not found.</p></div>

  const stepIdx = STATUS_STEPS.indexOf(booking.status)
  const workerCenter = booking.workers
    ? { lat: booking.workers.lat, lng: booking.workers.lng }
    : { lat: 28.6139, lng: 77.2090 }

  return (
    <main className="page">
      <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="font-semibold text-base">Booking details</h1>
      </header>

      {/* Status tracker */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-0 mb-6">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                i <= stepIdx ? 'bg-[#F5A623] border-[#F5A623] text-white' : 'border-gray-200 text-gray-300'
              }`}>
                {i + 1}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 ${i < stepIdx ? 'bg-[#F5A623]' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center font-semibold capitalize text-[#F5A623]">{booking.status}</p>
      </div>

      {/* Map */}
      {['en route', 'in progress'].includes(booking.status) && (
        <div className="mb-4">
          <MapComponent center={workerCenter} showWorkers height="220px" />
          <p className="text-center text-xs text-gray-400 py-2">Live worker location</p>
        </div>
      )}

      {/* Details */}
      <div className="px-4 flex flex-col gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3">Booking info</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{booking.date}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Time</span><span>{booking.slot}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Duration</span><span>{booking.duration} hr</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount paid</span><span className="font-semibold">Rs {booking.amount}</span></div>
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
          Damage policy: up to Rs 6,000 per booking. Not applicable on promo bookings.
        </div>

        {/* Rating */}
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#22C55E" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <p className="text-sm font-semibold text-green-800">Thanks for your rating!</p>
          </div>
        )}

        {!['completed', 'cancelled'].includes(booking.status) && (
          <button
            onClick={cancel}
            disabled={cancelling}
            className="w-full border border-red-200 text-red-500 font-semibold py-4 rounded-2xl disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel booking'}
          </button>
        )}
      </div>
    </main>
  )
}
