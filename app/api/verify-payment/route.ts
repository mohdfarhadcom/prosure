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
    }

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Payment verification failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
