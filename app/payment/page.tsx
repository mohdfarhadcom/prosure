'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void }
  }
}

function PaymentContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { user } = useAuth()
  const { clear } = useCart()

  const amount = parseInt(params.get('amount') || '0')
  const bookingId = params.get('bookingId') || ''

  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const razorpayConfigured = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

  useEffect(() => {
    if (!user) router.push('/login?redirect=/payment')
  }, [user])

  const pay = async () => {
    if (!razorpayConfigured) {
      alert('Payments are being set up. Please check back shortly.')
      return
    }
    if (!scriptLoaded) { alert('Payment loading. Please wait.'); return }
    setLoading(true)
    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, bookingId }),
      })
      const { orderId, error } = await orderRes.json()
      if (error === 'RAZORPAY_NOT_CONFIGURED') {
        alert('Payments are being set up. Your booking is saved.')
        router.push(bookingId ? `/booking/${bookingId}` : '/bookings')
        return
      }
      if (error) throw new Error(error)

      const opts = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Zilpo',
        description: 'House help booking',
        order_id: orderId,
        prefill: { contact: user?.phone || '' },
        theme: { color: '#F5A623' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, bookingId }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            clear()
            router.push(bookingId ? `/booking/${bookingId}` : '/bookings')
          } else {
            alert('Payment verification failed.')
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      }
      const rp = new window.Razorpay(opts)
      rp.open()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <main className="page px-4 py-6">
        <header className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="font-semibold text-base">Payment</h1>
        </header>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">Amount to pay</p>
          <p className="text-4xl font-extrabold">Rs {amount}</p>
          <p className="text-xs text-gray-400 mt-2">Includes GST and service fee</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-sm mb-3">Accepted payment methods</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#F5A623] flex-shrink-0" />UPI (PhonePe, GPay, Paytm)</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#F5A623] flex-shrink-0" />Debit or credit card</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#F5A623] flex-shrink-0" />Net banking</div>
          </div>
        </div>

        <div className="bg-[#FFF3DC] rounded-xl p-4 mb-8 text-xs text-gray-700">
          <strong>Cancellation:</strong> Full refund if cancelled 3+ hours before. No refund within 3 hours. Full refund if worker cancels.
        </div>

        {!razorpayConfigured && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-4 text-sm text-yellow-800">
            Payments will be live once the domain is set up. Your booking will still be saved.
          </div>
        )}

        <button
          onClick={pay}
          disabled={loading || !amount}
          className="w-full bg-[#F5A623] text-white font-semibold py-4 rounded-2xl text-base disabled:opacity-50"
        >
          {loading ? 'Processing...' : razorpayConfigured ? `Pay Rs ${amount}` : 'Confirm booking'}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">Payments secured by Razorpay</p>
      </main>
    </>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="page px-4 py-8 text-gray-400 text-sm">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  )
}
