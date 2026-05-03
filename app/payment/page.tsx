'use client'
import { useEffect, useRef, Suspense } from 'react'
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
  const opened = useRef(false)

  const amount = parseInt(params.get('amount') || '0')
  const bookingId = params.get('bookingId') || ''

  useEffect(() => { if (!user) router.replace('/login?redirect=/payment') }, [user])

  const cancelPendingBooking = async () => {
    if (!bookingId) return
    await fetch('/api/cancel-booking', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    }).catch(() => {})
  }

  const openRazorpay = async () => {
    if (opened.current || !amount || !user) return
    opened.current = true

    const orderRes = await fetch('/api/create-order', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, bookingId }),
    })
    const { orderId, error } = await orderRes.json()
    if (error) { alert('Could not start payment. Please try again.'); router.back(); return }

    const opts = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      name: 'Zilpo',
      description: 'Home service booking',
      order_id: orderId,
      prefill: { contact: user?.phone || '' },
      theme: { color: '#F5A623' },
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...response, bookingId }),
        })
        const data = await verifyRes.json()
        if (data.success) {
          clear()
          router.replace(bookingId ? `/booking/${bookingId}` : '/bookings')
        } else {
          await cancelPendingBooking()
          alert('Payment verification failed. Please try again.')
          router.replace('/cart')
        }
      },
      modal: {
        ondismiss: async () => {
          await cancelPendingBooking()
          router.back()
        },
      },
    }
    const rp = new window.Razorpay(opts)
    rp.open()
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={openRazorpay} />
      <main className="page px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#FFF3DC] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <p className="text-gray-500 text-sm">Opening payment...</p>
        </div>
      </main>
    </>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="page px-4 py-8 text-gray-400 text-sm text-center">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  )
}
