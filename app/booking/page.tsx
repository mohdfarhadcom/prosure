'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useLocation } from '@/context/LocationContext'
import { supabase } from '@/lib/supabaseClient'
import { SERVICES } from '@/lib/services'
import { format, addDays } from 'date-fns'

const SLOTS = Array.from({ length: 27 }, (_, i) => {
  const totalMins = 7 * 60 + i * 30
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  const suffix = h >= 12 ? 'PM' : 'AM'
  const display = `${h > 12 ? h - 12 : h}:${m === 0 ? '00' : m} ${suffix}`
  return display
})

const DATES = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1))

function BookingContent() {
  const router = useRouter()
  const params = useSearchParams()
  const type = params.get('type') || 'schedule'
  const hours = parseFloat(params.get('hours') || '1')

  const { user } = useAuth()
  const { items, total, clear } = useCart()
  const { location } = useLocation()

  const [tab, setTab] = useState<'hourly' | 'services'>(type === 'hourly' ? 'hourly' : 'services')
  const [selectedDate, setSelectedDate] = useState<Date>(DATES[0])
  const [selectedSlot, setSelectedSlot] = useState(SLOTS[0])
  const [selectedHours, setSelectedHours] = useState(hours)
  const [selectedServices, setSelectedServices] = useState<string[]>(items.map(i => i.slug))
  const [loading, setLoading] = useState(false)

  const hourlyPrice = Math.round(selectedHours * 99)
  const servicesPrice = total

  const bookingAmount = tab === 'hourly' ? hourlyPrice : servicesPrice

  const proceed = async () => {
    if (!user) { router.push('/login?redirect=/booking'); return }
    if (!location) { router.push('/location'); return }
    if (bookingAmount === 0) return

    setLoading(true)
    try {
      const { data: booking, error } = await supabase.from('bookings').insert({
        user_id: user.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        slot: selectedSlot,
        duration: tab === 'hourly' ? selectedHours : 1,
        amount: bookingAmount,
        booking_type: tab,
        status: 'pending',
      }).select().single()

      if (error) throw error

      if (tab === 'services' && selectedServices.length > 0) {
        const svcRows = selectedServices.map(slug => {
          const s = SERVICES.find(x => x.slug === slug)
          return { booking_id: booking.id, service_id: null, price: s?.base || 0 }
        })
        await supabase.from('booking_items').insert(svcRows)
      }

      router.push(`/payment?amount=${bookingAmount}&bookingId=${booking.id}`)
    } catch {
      alert('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="font-semibold text-base">Schedule booking</h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button onClick={() => setTab('hourly')} className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === 'hourly' ? 'border-[#F5A623] text-[#F5A623]' : 'border-transparent text-gray-400'}`}>
          Hourly
        </button>
        <button onClick={() => setTab('services')} className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === 'services' ? 'border-[#F5A623] text-[#F5A623]' : 'border-transparent text-gray-400'}`}>
          Individual services
        </button>
      </div>

      <div className="px-4 py-6 flex flex-col gap-6">
        {/* Tab content */}
        {tab === 'hourly' ? (
          <div>
            <h3 className="font-semibold text-sm mb-3">Duration</h3>
            <div className="flex gap-2 flex-wrap">
              {[0.5, 1, 1.5, 2, 2.5, 3].map(h => (
                <button
                  key={h}
                  onClick={() => setSelectedHours(h)}
                  className={`px-4 py-2 rounded-xl text-sm border transition-colors ${selectedHours === h ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'border-gray-200 text-gray-700'}`}
                >
                  {h} hr – Rs {Math.round(h * 99)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-sm mb-3">Select services</h3>
            <div className="flex flex-col gap-2">
              {SERVICES.map(s => (
                <label key={s.slug} className="flex items-center justify-between border border-gray-100 rounded-xl p-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(s.slug)}
                      onChange={e => setSelectedServices(prev =>
                        e.target.checked ? [...prev, s.slug] : prev.filter(x => x !== s.slug)
                      )}
                      className="w-4 h-4 accent-[#F5A623]"
                    />
                    <span className="text-sm">{s.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#F5A623]">Rs {s.base}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Date picker */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Select date</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {DATES.map(d => (
              <button
                key={d.toISOString()}
                onClick={() => setSelectedDate(d)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-colors ${
                  format(selectedDate, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
                    ? 'bg-[#F5A623] text-white border-[#F5A623]'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <span className="text-xs">{format(d, 'EEE')}</span>
                <span className="font-bold">{format(d, 'd')}</span>
                <span className="text-xs">{format(d, 'MMM')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time slots */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Select time</h3>
          <div className="flex flex-wrap gap-2">
            {SLOTS.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-2 rounded-xl text-xs border transition-colors ${
                  selectedSlot === slot ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'border-gray-200 text-gray-700'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-2">Booking summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{format(selectedDate, 'EEE, MMM d')} at {selectedSlot}</span>
            <span className="font-bold">Rs {bookingAmount}</span>
          </div>
        </div>

        <button
          onClick={proceed}
          disabled={loading || bookingAmount === 0}
          className="w-full bg-[#F5A623] text-white font-semibold py-4 rounded-2xl disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Proceed to pay'}
        </button>
      </div>
    </main>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="page px-4 py-8 text-gray-400 text-sm">Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}
