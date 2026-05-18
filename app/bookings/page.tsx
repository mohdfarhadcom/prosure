'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import BookingCard from '@/components/BookingCard'
import Link from 'next/link'

type Booking = {
  id: string
  date: string
  slot: string
  amount: number
  status: string
  created_at: string
  booking_items?: { services?: { name: string } }[]
}

export default function BookingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [subTab, setSubTab] = useState<'one-time' | 'recurring'>('one-time')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings((data.bookings || []) as Booking[])
      }
    } catch (err) {
      console.error('[bookings] fetch error:', err)
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <main className="page px-4 py-8">
        <h1 className="font-bold text-xl mb-6">Your bookings</h1>
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm mb-4">Sign in to see your bookings.</p>
          <Link href="/login?redirect=/bookings" className="text-[#F5A623] font-semibold">Sign in</Link>
        </div>
      </main>
    )
  }

  const DONE = ['completed', 'cancelled', 'refund_pending', 'refunded']
  const upcoming = bookings.filter(b => !DONE.includes(b.status))
  const past = bookings.filter(b => DONE.includes(b.status))
  const shown = tab === 'upcoming' ? upcoming : past

  return (
    <main className="page px-4 py-6">
      <h1 className="font-bold text-xl mb-6">Your bookings</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-4">
        <button onClick={() => setTab('upcoming')} className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === 'upcoming' ? 'border-[#F5A623] text-[#F5A623]' : 'border-transparent text-gray-400'}`}>
          Upcoming
        </button>
        <button onClick={() => setTab('past')} className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === 'past' ? 'border-[#F5A623] text-[#F5A623]' : 'border-transparent text-gray-400'}`}>
          Past
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSubTab('one-time')}
          className={`flex-1 py-2 rounded-2xl text-sm font-semibold transition-colors ${subTab === 'one-time' ? 'bg-[#F5A623] text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          One-time
        </button>
        <button
          onClick={() => setSubTab('recurring')}
          className={`flex-1 py-2 rounded-2xl text-sm font-semibold transition-colors ${subTab === 'recurring' ? 'bg-[#F5A623] text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Recurring
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
      ) : shown.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg>
          </div>
          <p className="text-gray-400 text-sm mb-4">No {tab} bookings</p>
          <Link href="/" className="text-[#F5A623] font-semibold">Book a service</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {shown.map(b => (
            <BookingCard
              key={b.id}
              id={b.id}
              date={b.date}
              slot={b.slot}
              amount={b.amount}
              status={b.status}
              services={b.booking_items?.map(bi => bi.services?.name || 'Service').filter(Boolean) || ['House help']}
            />
          ))}
        </div>
      )}
    </main>
  )
}
