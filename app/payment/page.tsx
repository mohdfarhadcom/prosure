'use client'
import { useEffect, useRef, useState, Suspense } from 'react'
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const [errMsg, setErrMsg] = useState('')

  const amount = parseInt(params.get('amount') || '0')
  const bookingId = params.get('bookingId') || ''

  useEffect(() => { if (!user) router.replace('/login?redirect=/payment') }, [user])

  // Bail out if amount is invalid — prevents infinite loading screen
  useEffect(() => {
    if (!amount) {
      setErrMsg('Invalid payment amount. Please go back and try again.')
    }
  }, [amount])

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

    // Timeout guard — if checkout never opens within 12s, show an error
    timeoutRef.current = setTimeout(async () => {
      await cancelPendingBooking()
      setErrMsg('Payment could not be opened. Please go back and try again.')
    }, 12000)

    let orderId: string
    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, bookingId }),
      })
      const json = await orderRes.json()
      if (json.error || !json.orderId) {
        clearTimeout(timeoutRef.current)
        await cancelPendingBooking()
        setErrMsg('Could not create payment order. Please go back and try again.')
        return
      }
      orderId = json.orderId
    } catch {
      clearTimeout(timeoutRef.current)
      await cancelPendingBooking()
      setErrMsg('Network error. Please check your connection and go back to try again.')
      return
    }

    const opts = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      name: 'Zilpo',
      description: 'Home service booking',
      order_id: orderId,
      prefill: { contact: user?.phone || '', email: user?.email || '' },
      theme: { color: '#F5A623' },
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        clearTimeout(timeoutRef.current)
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
          setErrMsg('Payment verification failed. Please contact support if amount was deducted.')
        }
      },
      modal: {
        ondismiss: async () => {
          clearTimeout(timeoutRef.current)
          await cancelPendingBooking()
          router.back()
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'payment.failed': async (response: any) => {
        clearTimeout(timeoutRef.current)
        console.error('[payment] failed:', response.error)
        await cancelPendingBooking()
        setErrMsg(`Payment failed: ${response.error?.description || 'Please try again or use a different payment method.'}`)
      },
    }
    clearTimeout(timeoutRef.current)
    const rp = new window.Razorpay(opts)
    rp.open()
  }

  if (errMsg) {
    return (
      <main className="page px-4 py-8 flex items-center justify-center">
        <div className="text-center max-w-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p className="text-gray-800 text-sm font-semibold mb-1">Payment error</p>
          <p className="text-gray-500 text-xs mb-5">{errMsg}</p>
          <button onClick={() => router.back()} className="px-5 py-2.5 bg-[#F5A623] text-white text-sm font-bold rounded-xl">
            Go back
          </button>
        </div>
      </main>
    )
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
          <p className="text-gray-400 text-xs mt-1">₹{amount}</p>
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
