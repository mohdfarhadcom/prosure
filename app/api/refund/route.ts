import { NextResponse } from 'next/server'
import { getRazorpayInstance } from '@/lib/razorpay'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  let bookingId: string | undefined
  let paymentId: string | undefined
  let amount: number | undefined
  try {
    const body = await req.json()
    bookingId = body.bookingId
    paymentId = body.paymentId
    amount = body.amount
    if (!paymentId) return NextResponse.json({ error: 'No payment to refund' }, { status: 400 })

    const rp = getRazorpayInstance()
    await (rp.payments as unknown as { refund: (id: string, opts: object) => Promise<unknown> })
      .refund(paymentId, {
        amount: (amount ?? 0) * 100,
        speed: 'optimum',
        notes: { bookingId: bookingId || '' },
      })

    if (bookingId) {
      const db = getSupabaseAdmin()
      await db.from('bookings').update({ status: 'refund_pending' }).eq('id', bookingId)
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Refund failed'
    console.error('[refund] Razorpay error:', msg, { bookingId, paymentId, amount })
    if (bookingId) {
      const db = getSupabaseAdmin()
      await db.from('bookings').update({ status: 'refund_pending' }).eq('id', bookingId)
    }
    return NextResponse.json({ success: false, refund_pending: true, error: msg }, { status: 500 })
  }
}
