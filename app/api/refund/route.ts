import { NextResponse } from 'next/server'
import { getRazorpayInstance } from '@/lib/razorpay'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { requireUser } from '@/lib/userSession'

export async function POST(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null) as { bookingId?: string } | null
  if (!body?.bookingId) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const db = getSupabaseAdmin()
  const { data: booking } = await db.from('bookings')
    .select('id, user_id, status, amount, payment_id, created_at')
    .eq('id', body.bookingId).single()

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  if (booking.user_id !== auth.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (['refund_pending', 'refunded', 'completed'].includes(booking.status)) {
    return NextResponse.json({ error: `Cannot refund a ${booking.status} booking` }, { status: 409 })
  }
  if (!booking.payment_id) {
    // No money was charged — just mark cancelled.
    const { error: upErr } = await db.from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', booking.id)
      .neq('status', 'cancelled')
    if (upErr) return NextResponse.json({ error: 'Cancel failed' }, { status: 500 })
    return NextResponse.json({ success: true, cancelled: true })
  }

  // Optimistic lock: only flip to refund_pending if status is still confirmed/accepted.
  const { data: locked, error: lockErr } = await db.from('bookings')
    .update({ status: 'refund_pending' })
    .eq('id', booking.id)
    .in('status', ['confirmed', 'accepted', 'pending'])
    .select('id').single()
  if (lockErr || !locked) {
    return NextResponse.json({ error: 'Booking is no longer refundable' }, { status: 409 })
  }

  try {
    const rp = getRazorpayInstance()
    await (rp.payments as unknown as { refund: (id: string, opts: object) => Promise<unknown> })
      .refund(booking.payment_id, {
        amount: (booking.amount ?? 0) * 100,
        speed: 'optimum',
        notes: { bookingId: booking.id },
      })
    return NextResponse.json({ success: true })
  } catch (err) {
    // Razorpay failed — keep the booking in refund_pending so admin can finish manually.
    console.error('[refund] Razorpay error:', err)
    return NextResponse.json({
      success: false, refund_pending: true,
      error: 'Refund has been queued for manual processing.'
    }, { status: 500 })
  }
}
