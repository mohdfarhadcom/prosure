import { NextResponse } from 'next/server'
import { getRazorpayInstance } from '@/lib/razorpay'

export async function POST(req: Request) {
  try {
    const { amount, bookingId } = await req.json()
    if (!amount) return NextResponse.json({ error: 'Amount required' }, { status: 400 })

    const rp = getRazorpayInstance()
    const order = await rp.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: bookingId || `order_${Date.now()}`,
      notes: { bookingId: bookingId || '' },
    })

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Order creation failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
