import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json()
    if (!bookingId) return NextResponse.json({ ok: true })
    const db = getSupabaseAdmin()
    await db.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId).eq('status', 'pending')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
