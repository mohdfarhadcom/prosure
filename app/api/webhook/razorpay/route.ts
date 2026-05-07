import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET!

    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
    if (expected !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const eventType: string = event.event

    if (eventType === 'payment.captured') {
      const payment = event.payload?.payment?.entity
      if (!payment) return NextResponse.json({ ok: true })

      const paymentId: string = payment.id
      const bookingId: string = payment.notes?.bookingId || ''
      const amount: number = Math.round(payment.amount / 100)

      if (bookingId) {
        const db = getSupabaseAdmin()
        // Only update if still pending — avoids overwriting if checkout handler already ran
        await db
          .from('bookings')
          .update({ payment_id: paymentId, status: 'confirmed' })
          .eq('id', bookingId)
          .eq('status', 'pending')
      }
    }

    if (eventType === 'payment.failed') {
      const payment = event.payload?.payment?.entity
      const bookingId: string = payment?.notes?.bookingId || ''
      if (bookingId) {
        const db = getSupabaseAdmin()
        await db
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId)
          .eq('status', 'pending')
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook/razorpay]', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
