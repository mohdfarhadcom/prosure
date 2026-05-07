import { NextResponse } from 'next/server'
import { getRazorpayInstance } from '@/lib/razorpay'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const { bookingId, paymentId, amount } = await req.json()
    if (!paymentId) return NextResponse.json({ error: 'No payment to refund' }, { status: 400 })

    const rp = getRazorpayInstance()
    await (rp.payments as unknown as { refund: (id: string, opts: object) => Promise<unknown> })
      .refund(paymentId, {
        amount: amount * 100,
        speed: 'normal',
        notes: { bookingId: bookingId || '' },
      })

    if (bookingId) {
      const db = getSupabaseAdmin()
      await db.from('bookings').update({ status: 'refund_pending' }).eq('id', bookingId)
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Refund failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
