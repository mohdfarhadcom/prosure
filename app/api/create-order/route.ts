import { NextResponse } from 'next/server'
import { getRazorpayInstance } from '@/lib/razorpay'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { requireUser } from '@/lib/userSession'

export async function POST(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null) as { bookingId?: string } | null
  if (!body?.bookingId) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: 'RAZORPAY_NOT_CONFIGURED' }, { status: 503 })
  }

  const db = getSupabaseAdmin()
  const { data: booking } = await db.from('bookings')
    .select('id, user_id, status, amount, payment_id')
    .eq('id', body.bookingId).single()

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  if (booking.user_id !== auth.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (booking.payment_id) return NextResponse.json({ error: 'Already paid' }, { status: 409 })
  if (!['pending', 'created'].includes(booking.status)) {
    return NextResponse.json({ error: 'Booking not payable' }, { status: 409 })
  }
  const amount = Number(booking.amount || 0)
  if (!Number.isInteger(amount) || amount <= 0 || amount > 500000) {
    return NextResponse.json({ error: 'Invalid booking amount' }, { status: 400 })
  }

  try {
    const rp = getRazorpayInstance()
    const order = await rp.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: booking.id.slice(0, 40),
      notes: { bookingId: booking.id, userId: auth.userId },
    })
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (err) {
    console.error('[create-order]', err)
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 })
  }
}
