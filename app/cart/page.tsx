'use client'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useLocation } from '@/context/LocationContext'
import { useState } from 'react'
import Link from 'next/link'

const GST_RATE = 0.18
const SERVICE_FEE = 20

// Payment app SVG icons
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
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

  const subtotal = total
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const gst = Math.round((subtotal - discount) * GST_RATE)
  const toPay = subtotal - discount + gst + SERVICE_FEE

  const applyPromo = () => {
    if (promo.toUpperCase() === 'ZILPO10') { setPromoApplied(true); setPromoError('') }
    else setPromoError('Invalid promo code')
  }

  const proceed = () => {
    if (!user) { router.push('/login?redirect=/cart'); return }
    if (!location) { router.push('/location'); return }
    router.push(`/payment?amount=${toPay}`)
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

      {/* Services */}
      <div className="flex flex-col gap-0 mb-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {items.map((item, idx) => (
          <div key={item.slug} className={`flex items-center gap-3 px-4 py-4 ${idx < items.length - 1 ? 'border-b border-gray-50' : ''}`}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Rs {item.price} each</p>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-2 py-1.5">
              <button onClick={() => remove(item.slug)} className="text-gray-500 w-5 h-5 flex items-center justify-center font-bold">-</button>
              <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
              <button onClick={() => add({ slug: item.slug, name: item.name, price: item.price, original: item.original })} className="text-gray-500 w-5 h-5 flex items-center justify-center font-bold">+</button>
            </div>
            <span className="text-sm font-bold text-gray-900 w-16 text-right">Rs {item.price * item.qty}</span>
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

      {/* Promo */}
      <div className="flex gap-2 mb-5">
        <input
          value={promo}
          onChange={e => setPromo(e.target.value.toUpperCase())}
          placeholder="Enter promo code"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F5A623]"
        />
        <button onClick={applyPromo} className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${promoApplied ? 'bg-green-50 text-green-600 border border-green-200' : 'border border-[#F5A623] text-[#F5A623] hover:bg-[#FFF3DC]'}`}>
          {promoApplied ? 'Applied' : 'Apply'}
        </button>
      </div>
      {promoError && <p className="text-red-500 text-sm -mt-3 mb-4">{promoError}</p>}

      {/* Bill breakdown */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-5">
        <h3 className="font-bold text-sm mb-3">Bill details</h3>
        <div className="flex flex-col gap-2.5 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Item total</span><span className="font-medium">Rs {subtotal}</span></div>
          {discount > 0 && <div className="flex justify-between text-green-600"><span>Promo discount (10%)</span><span>- Rs {discount}</span></div>}
          <div className="flex justify-between"><span className="text-gray-500">GST (18%)</span><span className="font-medium">Rs {gst}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Service fee</span><span className="font-medium">Rs {SERVICE_FEE}</span></div>
          <div className="h-px bg-gray-200 my-1" />
          <div className="flex justify-between font-extrabold text-base">
            <span>Total payable</span>
            <span className="text-[#F5A623]">Rs {toPay}</span>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5">
        <h3 className="font-semibold text-sm mb-3 text-gray-700">Accepted payments</h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <UpiIcon />
            <span className="text-[10px] text-gray-500">UPI</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <GpayIcon />
            <span className="text-[10px] text-gray-500">GPay</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <PhonepeIcon />
            <span className="text-[10px] text-gray-500">PhonePe</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <CardIcon />
            <span className="text-[10px] text-gray-500">Card</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center">
              <span className="text-white text-[9px] font-black">NET</span>
            </div>
            <span className="text-[10px] text-gray-500">Netbank</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4 text-center">20% platform fee included. Rest paid to your professional.</p>

      <button onClick={proceed} className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base shadow-[0_4px_20px_rgba(245,166,35,0.35)]">
        {user ? `Pay Rs ${toPay}` : 'Login to continue'}
      </button>
    </main>
  )
}
