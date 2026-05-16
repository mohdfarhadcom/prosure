'use client'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useLocation } from '@/context/LocationContext'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { format, addDays } from 'date-fns'

const SERVICE_FEE = 20
const VISITING_FEE = 59
const VISITING_FEE_THRESHOLD = 499
const TIP_OPTIONS = [0, 20, 50, 100]
const SLOTS = [
  '7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM',
  '7:00 PM','7:30 PM','8:00 PM',
]

function getSurge(): { fee: number; label: string } {
  const h = new Date().getHours()
  const d = new Date().getDay()
  const weekend = d === 0 || d === 6
  const peak = (h >= 7 && h < 10) || (h >= 17 && h < 21)
  if (peak && weekend) return { fee: 50, label: 'Weekend peak surge' }
  if (peak) return { fee: 30, label: 'Peak hours surge' }
  if (weekend) return { fee: 20, label: 'Weekend surge' }
  return { fee: 0, label: '' }
}

const UpiIcon = () => (
  <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
    <span className="text-white text-[10px] font-black">UPI</span>
  </div>
)
const GpayIcon = () => (
  <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
    <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064 5.963 5.963 0 014.123 1.6l2.853-2.853A10.026 10.026 0 0012.545 3C7.021 3 2.543 7.477 2.543 13s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" fill="#4285F4"/></svg>
  </div>
)
const PhonepeIcon = () => (
  <div className="w-9 h-9 rounded-xl bg-[#5f259f] flex items-center justify-center flex-shrink-0">
    <span className="text-white text-[10px] font-black">Pe</span>
  </div>
)
const CardIcon = () => (
  <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  </div>
)

export default function CartPage() {
  const router = useRouter()
  const { items, remove, add, total, clear } = useCart()
  const { user } = useAuth()
  const { location } = useLocation()
  const [promo, setPromo] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<'ZILPO10' | 'TEST' | null>(null)
  const [promoError, setPromoError] = useState('')
  const [bookingMode, setBookingMode] = useState<'schedule' | 'instant'>('instant')
  const [tip, setTip] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState('9:00 AM')

  const dates = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1)), [])
  const chosenDate = selectedDate ?? dates[0]

  const surge = useMemo(() => getSurge(), [])

  const hourlyItem = items.find(i => i.slug.startsWith('hourly-'))
  const isHourlyCart = !!hourlyItem
  const hourlyHours = hourlyItem ? parseFloat(hourlyItem.slug.replace('hourly-', '')) : 0

  const subtotal = total
  const visitingFee = subtotal < VISITING_FEE_THRESHOLD ? VISITING_FEE : 0
  const promoDiscount10 = appliedPromo === 'ZILPO10' ? Math.round(subtotal * 0.1) : 0
  const normalTotal = subtotal - promoDiscount10 + visitingFee + surge.fee + SERVICE_FEE + tip
  const toPay = appliedPromo === 'TEST' ? 0 : normalTotal
  const testDiscount = appliedPromo === 'TEST' ? normalTotal : 0

  const applyPromo = () => {
    const code = promo.trim()
    setPromoError('')
    if (code.toUpperCase() === 'ZILPO10') {
      setAppliedPromo('ZILPO10')
    } else if (code === 'OwbhnsJue736+#;jhe') {
      setAppliedPromo('TEST')
    } else {
      setPromoError('Invalid promo code')
    }
  }

  const removePromo = () => {
    setAppliedPromo(null)
    setPromo('')
    setPromoError('')
  }

  const [proceeding, setProceeding] = useState(false)

  const proceed = async () => {
    if (!user) { router.push('/login?redirect=/cart'); return }
    if (!location) { router.push('/location'); return }
    setProceeding(true)

    // Compute slot for instant bookings
    const now = new Date()
    const mins = now.getMinutes() < 30 ? 30 : 0
    now.setMinutes(mins, 0, 0)
    if (mins === 0) now.setHours(now.getHours() + 1)
    const h = now.getHours()
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    const instantSlot = `${h12}:${String(now.getMinutes()).padStart(2, '0')} ${ampm}`
    const today = new Date().toISOString().split('T')[0]

    const bookingDate = bookingMode === 'instant' ? today : format(chosenDate, 'yyyy-MM-dd')
    const bookingSlot = bookingMode === 'instant' ? instantSlot : selectedSlot

    const { data: booking, error } = await supabase.from('bookings').insert({
      user_id: user.id,
      date: bookingDate,
      slot: bookingSlot,
      duration: isHourlyCart ? hourlyHours : 1,
      amount: toPay,
      booking_type: isHourlyCart ? 'hourly' : 'services',
      booking_mode: bookingMode,
      status: 'pending',
    }).select().single()

    if (error || !booking) {
      setProceeding(false)
      alert('Could not create booking. Please try again.')
      return
    }

    // Free booking (test promo) — skip payment
    if (toPay === 0) {
      await supabase.from('bookings').update({ status: 'confirmed', payment_id: 'test_free' }).eq('id', booking.id)
      clear()
      router.replace(`/booking/${booking.id}`)
      return
    }

    router.push(`/payment?amount=${toPay}&mode=${bookingMode}&bookingId=${booking.id}`)
    setProceeding(false)
  }

  if (items.length === 0) {
    return (
      <main className="page px-4 py-8">
        <h1 className="font-bold text-xl mb-6">Your cart</h1>
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/></svg>
          </div>
          <p className="text-gray-400 text-sm mb-4">No services added yet.</p>
          <Link href="/" className="text-[#F5A623] font-semibold">Browse services</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page px-4 py-6">
      <h1 className="font-bold text-xl mb-6">Your cart</h1>

      {/* Booking mode toggle */}
      <div className="mb-5">
        <p className="text-xs text-gray-400 mb-2">When do you need the service?</p>
        <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setBookingMode('instant')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${bookingMode === 'instant' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            ⚡ Instant
          </button>
          <button
            onClick={() => setBookingMode('schedule')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${bookingMode === 'schedule' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            Schedule
          </button>
        </div>
        {bookingMode === 'instant' && (
          <p className="text-xs text-[#F5A623] mt-2 text-center">⚡ Connect to a professional within 10–15 minutes</p>
        )}
      </div>

      {/* Schedule: date + time picker */}
      {bookingMode === 'schedule' && (
        <div className="mb-5 bg-gray-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">Select date</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar mb-4">
            {dates.map(d => (
              <button
                key={format(d, 'yyyy-MM-dd')}
                onClick={() => setSelectedDate(d)}
                className={`flex-shrink-0 flex flex-col items-center w-14 py-3 rounded-xl border transition-colors ${
                  format(chosenDate, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
                    ? 'bg-[#F5A623] text-white border-[#F5A623]'
                    : 'border-gray-200 text-gray-700 bg-white'
                }`}
              >
                <span className="text-[10px] font-medium">{format(d, 'EEE')}</span>
                <span className="font-bold text-base">{format(d, 'd')}</span>
                <span className="text-[10px]">{format(d, 'MMM')}</span>
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Select time</p>
          <div className="flex flex-wrap gap-2">
            {SLOTS.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-2 rounded-xl text-xs border transition-colors ${
                  selectedSlot === slot ? 'bg-[#F5A623] text-white border-[#F5A623] font-bold' : 'border-gray-200 text-gray-700 bg-white'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Booked for {format(chosenDate, 'EEE, MMM d')} at {selectedSlot}
          </p>
        </div>
      )}

      {/* Services */}
      <div className="flex flex-col gap-0 mb-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {items.map((item, idx) => (
          <div key={item.slug} className={`flex items-center gap-3 px-4 py-4 ${idx < items.length - 1 ? 'border-b border-gray-50' : ''}`}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">₹{item.price}{item.slug.startsWith('hourly-') ? '' : ' each'}</p>
            </div>
            {item.slug.startsWith('hourly-') ? (
              <button onClick={() => remove(item.slug)} className="text-xs text-red-500 font-semibold px-3 py-1.5 border border-red-100 rounded-xl">Remove</button>
            ) : (
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-2 py-1.5">
                <button onClick={() => remove(item.slug)} className="text-gray-500 w-5 h-5 flex items-center justify-center font-bold">−</button>
                <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                <button onClick={() => add({ slug: item.slug, name: item.name, price: item.price, original: item.original })} className="text-gray-500 w-5 h-5 flex items-center justify-center font-bold">+</button>
              </div>
            )}
            <span className="text-sm font-bold text-gray-900 w-16 text-right">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      <Link href="/" className="flex items-center gap-2 text-[#F5A623] text-sm font-semibold mb-6">
        <span className="text-lg leading-none">+</span> Add more services
      </Link>

      {/* Location */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-[#FFF3DC] rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Service location</p>
            <p className="text-sm font-medium truncate mt-0.5">
              {location ? location.address.split(',').slice(0, 2).join(',').trim() : 'No location set'}
            </p>
          </div>
        </div>
        <Link href="/location" className="text-[#F5A623] text-xs font-bold ml-2 flex-shrink-0">Change</Link>
      </div>

      {/* Tip */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Tip your professional</p>
            <p className="text-[10px] text-green-600 font-medium mt-0.5">100% goes to them · no commission</p>
          </div>
          {tip > 0 && <span className="text-sm font-bold text-[#F5A623]">+₹{tip}</span>}
        </div>
        <div className="flex gap-2">
          {TIP_OPTIONS.map(t => (
            <button
              key={t}
              onClick={() => setTip(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${tip === t ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'border-gray-200 text-gray-600 hover:border-[#F5A623]'}`}
            >
              {t === 0 ? 'None' : `₹${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* Promo */}
      {!appliedPromo ? (
        <div className="flex gap-2 mb-4">
          <input
            value={promo}
            onChange={e => setPromo(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F5A623]"
          />
          <button onClick={applyPromo} className="px-4 py-3 rounded-xl text-sm font-bold border border-[#F5A623] text-[#F5A623] hover:bg-[#FFF3DC] transition-colors">
            Apply
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-sm">✓</span>
            <span className="text-sm font-semibold text-green-800">
              {appliedPromo === 'TEST' ? 'Test code — total ₹0' : 'ZILPO10 — 10% off item total'}
            </span>
          </div>
          <button onClick={removePromo} className="text-xs text-gray-400 font-semibold">Remove</button>
        </div>
      )}
      {promoError && <p className="text-red-500 text-xs -mt-2 mb-4">{promoError}</p>}

      {/* Bill breakdown */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-5">
        <h3 className="font-bold text-sm mb-3">Bill details</h3>
        <div className="flex flex-col gap-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Item total</span>
            <span className="font-medium">₹{subtotal}</span>
          </div>
          {promoDiscount10 > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Promo (ZILPO10 · 10% off)</span>
              <span>− ₹{promoDiscount10}</span>
            </div>
          )}
          {testDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Special discount</span>
              <span>− ₹{testDiscount}</span>
            </div>
          )}
          {visitingFee > 0 && (
            <div className="flex justify-between">
              <div>
                <span className="text-gray-500">Visiting fee</span>
                <p className="text-[10px] text-gray-400">Waived on orders ₹{VISITING_FEE_THRESHOLD}+</p>
              </div>
              <span className="font-medium">₹{visitingFee}</span>
            </div>
          )}
          {surge.fee > 0 && (
            <div className="flex justify-between">
              <div>
                <span className="text-amber-600 font-semibold">⚡ {surge.label}</span>
                <p className="text-[10px] text-gray-400">High demand right now</p>
              </div>
              <span className="font-medium text-amber-600">₹{surge.fee}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Service fee</span>
            <span className="font-medium">₹{SERVICE_FEE}</span>
          </div>
          {tip > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Tip (to professional)</span>
              <span className="font-medium">₹{tip}</span>
            </div>
          )}
          <div className="h-px bg-gray-200 my-1" />
          <div className="flex justify-between font-extrabold text-base">
            <span>Total payable</span>
            <span className="text-[#F5A623]">₹{toPay}</span>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5">
        <h3 className="font-semibold text-sm mb-3 text-gray-700">Accepted payments</h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {[
            { icon: <UpiIcon />, label: 'UPI' },
            { icon: <GpayIcon />, label: 'GPay' },
            { icon: <PhonepeIcon />, label: 'PhonePe' },
            { icon: <CardIcon />, label: 'Card' },
            {
              icon: <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center"><span className="text-white text-[9px] font-black">NET</span></div>,
              label: 'Netbank',
            },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              {icon}
              <span className="text-[10px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4 text-center">₹20 service fee keeps Zilpo running. Tips go 100% to your professional.</p>

      <button onClick={proceed} disabled={proceeding} className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base shadow-[0_4px_20px_rgba(245,166,35,0.35)] disabled:opacity-60">
        {proceeding ? 'Preparing...' : user ? (toPay === 0 ? 'Confirm booking (free)' : `Pay ₹${toPay}`) : 'Login to continue'}
      </button>
    </main>
  )
}
