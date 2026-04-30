'use client'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useLocation } from '@/context/LocationContext'
import { useState } from 'react'
import Link from 'next/link'

const GST_RATE = 0.18
const SERVICE_FEE = 20

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
    if (promo.toUpperCase() === 'ZILPO10') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
    }
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
        <div className="text-center py-16">
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
      <div className="flex flex-col gap-3 mb-4">
        {items.map(item => (
          <div key={item.slug} className="flex items-center justify-between py-3 border-b border-gray-50">
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-gray-400">Rs {item.price} each</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-2 py-1">
                <button onClick={() => remove(item.slug)} className="text-gray-400 w-5 h-5 flex items-center justify-center">-</button>
                <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                <button onClick={() => add({ slug: item.slug, name: item.name, price: item.price, original: item.original })} className="text-gray-400 w-5 h-5 flex items-center justify-center">+</button>
              </div>
              <span className="text-sm font-semibold w-16 text-right">Rs {item.price * item.qty}</span>
            </div>
          </div>
        ))}
      </div>

      <Link href="/" className="text-[#F5A623] text-sm font-medium block mb-6">
        + Add more services
      </Link>

      {/* Location */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Delivery location</p>
            <p className="text-sm font-medium mt-0.5">
              {location ? location.address.split(',').slice(0, 2).join(',') : 'No location set'}
            </p>
          </div>
          <Link href="/location" className="text-[#F5A623] text-xs font-semibold">Change</Link>
        </div>
      </div>

      {/* Promo */}
      <div className="flex gap-2 mb-6">
        <input
          value={promo}
          onChange={e => setPromo(e.target.value.toUpperCase())}
          placeholder="Promo code"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F5A623]"
        />
        <button onClick={applyPromo} className="px-4 py-3 border border-[#F5A623] text-[#F5A623] rounded-xl text-sm font-semibold">
          Apply
        </button>
      </div>
      {promoApplied && <p className="text-green-600 text-sm -mt-4 mb-4">10% off applied.</p>}
      {promoError && <p className="text-red-500 text-sm -mt-4 mb-4">{promoError}</p>}

      {/* Bill */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-sm mb-3">Bill details</h3>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Item total</span><span>Rs {subtotal}</span></div>
          {discount > 0 && <div className="flex justify-between text-green-600"><span>Promo discount</span><span>- Rs {discount}</span></div>}
          <div className="flex justify-between"><span className="text-gray-600">GST and service fee</span><span>Rs {gst + SERVICE_FEE}</span></div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200 mt-1">
            <span>To pay</span>
            <span>Rs {toPay}</span>
          </div>
        </div>
      </div>

      {/* Commission note */}
      <p className="text-xs text-gray-400 mb-6 text-center">20% platform fee included. Rest goes to your professional.</p>

      <button onClick={proceed} className="w-full bg-[#F5A623] text-white font-semibold py-4 rounded-2xl text-base">
        {user ? 'Proceed to pay' : 'Login to continue'}
      </button>
    </main>
  )
}
