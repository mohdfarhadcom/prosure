import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const { bookingId, rating } = await req.json()
    if (!bookingId || !rating || rating < 1 || rating > 5)
      return NextResponse.json({ error: 'Invalid' }, { status: 400 })

    const db = getSupabaseAdmin()
    await db.from('bookings').update({ rating, rated_at: new Date().toISOString() }).eq('id', bookingId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
