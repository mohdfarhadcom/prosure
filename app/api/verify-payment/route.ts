import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await req.json()

    const secret = process.env.RAZORPAY_KEY_SECRET!
    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (bookingId) {
      const db = getSupabaseAdmin()
      await db.from('bookings').update({ payment_id: razorpay_payment_id, status: 'confirmed' }).eq('id', bookingId)

      // Send confirmation email
      const { data: booking } = await db.from('bookings').select('*, users(email, name)').eq('id', bookingId).single()
      const email = (booking as { users?: { email?: string } })?.users?.email
      const name = (booking as { users?: { name?: string } })?.users?.name || 'there'
      if (email) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://getzilpo.com'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: 'Your Zilpo booking is confirmed! ✅',
            html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#F5A623">Hi ${name}! Your booking is confirmed 🎉</h2>
              <p>We have received your payment and your booking is now confirmed.</p>
              <p><strong>Date:</strong> ${booking?.date || ''} · <strong>Time:</strong> ${booking?.slot || ''}</p>
              <p style="margin:24px 0">
                <a href="https://getzilpo.com/booking/${bookingId}" style="background:#F5A623;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold">Track your booking</a>
              </p>
              <p style="color:#999;font-size:12px">Zilpo · House help on demand · team@getzilpo.com</p>
            </div>`,
          }),
        }).catch(() => {})
      }
    }

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Payment verification failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
