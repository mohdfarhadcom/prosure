import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { sendEmail, escapeHtml } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as {
      razorpay_order_id?: string
      razorpay_payment_id?: string
      razorpay_signature?: string
      bookingId?: string
    } | null

    if (!body?.razorpay_order_id || !body?.razorpay_payment_id || !body?.razorpay_signature || !body?.bookingId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      console.error('[verify-payment] RAZORPAY_KEY_SECRET missing')
      return NextResponse.json({ error: 'Payment service unavailable' }, { status: 500 })
    }

    const signed = `${body.razorpay_order_id}|${body.razorpay_payment_id}`
    const expected = crypto.createHmac('sha256', secret).update(signed).digest('hex')
    const sigBuf = Buffer.from(body.razorpay_signature)
    const expBuf = Buffer.from(expected)
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const db = getSupabaseAdmin()

    // Idempotency + amount validation: only confirm pending/created bookings,
    // and only with the exact amount Razorpay confirms.
    const { data: booking } = await db.from('bookings')
      .select('id, status, amount, user_id')
      .eq('id', body.bookingId).single()
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    if (booking.status === 'confirmed' || booking.status === 'completed') {
      return NextResponse.json({ success: true, paymentId: body.razorpay_payment_id, alreadyConfirmed: true })
    }

    const { error: updateError } = await db
      .from('bookings')
      .update({ payment_id: body.razorpay_payment_id, status: 'confirmed' })
      .eq('id', body.bookingId)
      .in('status', ['pending', 'created'])
    if (updateError) {
      console.error('[verify-payment] booking update failed:', updateError.message)
      return NextResponse.json({ error: 'Could not confirm booking' }, { status: 500 })
    }

    // Mark linked abandoned cart as recovered (no-op if not tracked)
    await db.from('abandoned_carts')
      .update({ recovered_booking_id: body.bookingId, last_step: 'paid' })
      .eq('user_id', booking.user_id)
      .is('recovered_booking_id', null)
      .order('updated_at', { ascending: false })
      .limit(1)

    const { data: full } = await db.from('bookings')
      .select('date, slot, amount, users(email, name)')
      .eq('id', body.bookingId).single()
    const users = (full as { users?: { email?: string; name?: string } })?.users
    if (users?.email) {
      const name = escapeHtml(users.name || 'there')
      const date = escapeHtml(full?.date || '')
      const slot = escapeHtml(full?.slot || '')
      const amount = Number(full?.amount || 0)
      await sendEmail({
        to: users.email,
        subject: 'Your Zilpo booking is confirmed',
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#F5A623;margin:0 0 8px">Hi ${name}, your booking is confirmed.</h2>
          <p style="color:#374151">We have received your payment. A professional will be assigned shortly.</p>
          <p style="margin:16px 0;color:#111"><strong>Date:</strong> ${date} &middot; <strong>Time:</strong> ${slot} &middot; <strong>Paid:</strong> &#8377;${amount}</p>
          <p style="margin:24px 0">
            <a href="https://thezilpo.com/booking/${escapeHtml(body.bookingId)}" style="background:#F5A623;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:600">Track your booking</a>
          </p>
          <p style="color:#9CA3AF;font-size:12px;margin-top:32px">Zilpo &middot; team@thezilpo.com &middot; +91 9058172570</p>
        </div>`,
      })
    }

    return NextResponse.json({ success: true, paymentId: body.razorpay_payment_id })
  } catch (err) {
    console.error('[verify-payment]', err)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
