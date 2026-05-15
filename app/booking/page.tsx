'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useLocation } from '@/context/LocationContext'
import { supabase } from '@/lib/supabaseClient'
import { SERVICES } from '@/lib/services'
import { format, addDays } from 'date-fns'


// Consistent prices matching home page
const HOURLY_PRICES: Record<number, number> = { 0.5: 49, 1: 99, 1.5: 149, 2: 189, 2.5: 249, 3: 299 }

const SLOTS = ['7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM',
  '7:00 PM','7:30 PM','8:00 PM']

function BookingContent() {
  const router = useRouter()
  const params = useSearchParams()
  const type = params.get('type') || 'services'
  const initHours = parseFloat(params.get('hours') || '1')

  const { user } = useAuth()
  const { items, add } = useCart()
  const { location } = useLocation()

  // Redirect hourly bookings to cart
  useEffect(() => {
    if (type !== 'hourly' || !initHours) return
    const price = HOURLY_PRICES[initHours] ?? Math.round(initHours * 99)
    const origMap: Record<number, number> = { 0.5: 125, 1: 250, 1.5: 325, 2: 450, 2.5: 549, 3: 649 }
    const original = origMap[initHours] ?? Math.round(price * 2.5)
    add({ slug: `hourly-${initHours}`, name: `${initHours} hr Home Help`, price, original })
    router.replace('/cart')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate dates client-side only to avoid SSR hydration mismatch
  const dates = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1)), [])

  const [tab, setTab] = useState<'hourly' | 'services'>(type === 'hourly' ? 'hourly' : 'services')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState(SLOTS[4]) // default 9:00 AM
  const [selectedHours, setSelectedHours] = useState(initHours)
  const [selectedServices, setSelectedServices] = useState<string[]>(items.map(i => i.slug))
  const [loading, setLoading] = useState(false)

  const chosenDate = selectedDate ?? dates[0]
  const hourlyPrice = HOURLY_PRICES[selectedHours] ?? Math.round(selectedHours * 99)
  // Compute total from the checkboxes directly, not from CartContext
  const servicesPrice = useMemo(
    () => selectedServices.reduce((sum, slug) => sum + (SERVICES.find(s => s.slug === slug)?.base ?? 0), 0),
    [selectedServices]
  )
  const bookingAmount = tab === 'hourly' ? hourlyPrice : servicesPrice

  const proceed = async () => {
    if (!user) { router.push('/login?redirect=/booking'); return }
    if (!location) { router.push('/location'); return }
    if (bookingAmount === 0) { alert('Please select at least one service or duration.'); return }

    setLoading(true)
    try {
      const { data: booking, error } = await supabase.from('bookings').insert({
        user_id: user.id,
        date: format(chosenDate, 'yyyy-MM-dd'),
        slot: selectedSlot,
        duration: tab === 'hourly' ? selectedHours : 1,
        amount: bookingAmount,
        booking_type: tab,
        status: 'pending',
      }).select().single()

      if (error) throw error
      router.push(`/payment?amount=${bookingAmount}&bookingId=${booking.id}`)
    } catch (err) {
      console.error(err)
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
        <h1 className="font-semibold text-base">Book a service</h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button onClick={() => setTab('hourly')}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === 'hourly' ? 'border-[#F5A623] text-[#F5A623]' : 'border-transparent text-gray-400'}`}>
          Book by hour
        </button>
        <button onClick={() => setTab('services')}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === 'services' ? 'border-[#F5A623] text-[#F5A623]' : 'border-transparent text-gray-400'}`}>
          Individual services
        </button>
      </div>

      <div className="px-4 py-5 flex flex-col gap-6">
        {tab === 'hourly' ? (
          <div>
            <h3 className="font-semibold text-sm mb-3">Select duration</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(HOURLY_PRICES).map(([h, price]) => (
                <button
                  key={h}
                  onClick={() => setSelectedHours(parseFloat(h))}
                  className={`py-3 rounded-xl text-sm border transition-colors text-center ${selectedHours === parseFloat(h) ? 'bg-[#F5A623] text-white border-[#F5A623] font-bold' : 'border-gray-200 text-gray-700'}`}
                >
                  <span className="font-bold">{h} hr</span>
                  <span className="block text-xs mt-0.5 opacity-80">₹{price}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-sm mb-3">Select services</h3>
            <div className="flex flex-col gap-2">
              {SERVICES.map(s => (
                <label key={s.slug} className="flex items-center justify-between border border-gray-100 rounded-xl p-3 cursor-pointer hover:border-[#F5A623]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(s.slug)}
                      onChange={e => setSelectedServices(prev =>
                        e.target.checked ? [...prev, s.slug] : prev.filter(x => x !== s.slug)
                      )}
                      className="w-4 h-4 accent-[#F5A623]"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{s.name}</span>
                      <span className="text-xs text-gray-400 block">{s.duration} min</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#F5A623]">₹{s.base}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Date picker */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Select date</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {dates.map(d => (
              <button
                key={format(d, 'yyyy-MM-dd')}
                onClick={() => setSelectedDate(d)}
                className={`flex-shrink-0 flex flex-col items-center w-14 py-3 rounded-xl border transition-colors ${
                  format(chosenDate, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
                    ? 'bg-[#F5A623] text-white border-[#F5A623]'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <span className="text-[10px] font-medium">{format(d, 'EEE')}</span>
                <span className="font-bold text-base">{format(d, 'd')}</span>
                <span className="text-[10px]">{format(d, 'MMM')}</span>
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
                  selectedSlot === slot ? 'bg-[#F5A623] text-white border-[#F5A623] font-bold' : 'border-gray-200 text-gray-700'
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
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">{format(chosenDate, 'EEE, MMM d')} at {selectedSlot}</span>
          </div>
          {tab === 'services' && selectedServices.length > 0 && (
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected</span>
            </div>
          )}
          <div className="flex justify-between text-base font-extrabold">
            <span>Total</span>
            <span className={bookingAmount > 0 ? 'text-[#F5A623]' : 'text-gray-400'}>
              {bookingAmount > 0 ? `₹${bookingAmount}` : '—'}
            </span>
          </div>
        </div>

        <button
          onClick={proceed}
          disabled={loading || bookingAmount === 0}
          className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-50 shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
        >
          {loading ? 'Booking...' : bookingAmount > 0 ? `Pay ₹${bookingAmount}` : 'Select a service'}
        </button>
      </div>
    </main>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="page px-4 py-8 text-gray-400 text-sm text-center">Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}
