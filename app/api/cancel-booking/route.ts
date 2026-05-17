import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json()
    if (!bookingId) return NextResponse.json({ ok: false, error: 'Missing bookingId' }, { status: 400 })
    const db = getSupabaseAdmin()
    const { error } = await db.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId).eq('status', 'pending')
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Cancel failed'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
