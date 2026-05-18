import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  let body = ''
  try {
    body = await req.text()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const signature = req.headers.get('x-razorpay-signature') || ''
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) {
    console.error('[webhook] RAZORPAY_WEBHOOK_SECRET missing')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: { event?: string; payload?: { payment?: { entity?: Record<string, unknown> } } }
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const payment = event.payload?.payment?.entity
  if (!payment) return NextResponse.json({ ok: true, skipped: true })

  const paymentId = String(payment.id || '')
  const orderId = String(payment.order_id || '')
  const notesBookingId = String((payment.notes as { bookingId?: string })?.bookingId || '')
  const amountPaise = Number(payment.amount || 0)

  if (!paymentId || !orderId) return NextResponse.json({ ok: true, skipped: true })

  const db = getSupabaseAdmin()

  // Idempotency: if any booking already has this payment_id, no further action.
  const { data: alreadyApplied } = await db.from('bookings')
    .select('id').eq('payment_id', paymentId).limit(1).maybeSingle()
  if (alreadyApplied) return NextResponse.json({ ok: true, alreadyApplied: true })

  if (!notesBookingId) return NextResponse.json({ ok: true, skipped: true })

  // Validate booking + amount match
  const { data: booking } = await db.from('bookings')
    .select('id, status, amount, payment_id')
    .eq('id', notesBookingId).single()
  if (!booking) return NextResponse.json({ ok: true, skipped: true })

  const expectedPaise = (Number(booking.amount) || 0) * 100
  if (event.event === 'payment.captured') {
    if (amountPaise !== expectedPaise) {
      console.error('[webhook] amount mismatch', { paymentId, bookingId: booking.id, expectedPaise, amountPaise })
      return NextResponse.json({ ok: true, skipped: true })
    }
    if (!booking.payment_id && booking.status !== 'completed' && booking.status !== 'refunded') {
      await db.from('bookings')
        .update({ payment_id: paymentId, status: 'confirmed' })
        .eq('id', booking.id)
        .in('status', ['pending', 'created'])
    }
  } else if (event.event === 'payment.failed') {
    if (!booking.payment_id) {
      await db.from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id)
        .in('status', ['pending', 'created'])
    }
  }

  return NextResponse.json({ ok: true })
}
