import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { requireUser } from '@/lib/userSession'

export async function POST(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null) as { bookingId?: string; rating?: number } | null
  const rating = Number(body?.rating)
  if (!body?.bookingId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const db = getSupabaseAdmin()
  const { data: booking } = await db.from('bookings').select('user_id, status, rated_at').eq('id', body.bookingId).single()
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  if (booking.user_id !== auth.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (booking.status !== 'completed') {
    return NextResponse.json({ error: 'Can only rate completed bookings' }, { status: 409 })
  }
  if (booking.rated_at) {
    return NextResponse.json({ error: 'Already rated' }, { status: 409 })
  }

  const { error } = await db.from('bookings')
    .update({ rating, rated_at: new Date().toISOString() })
    .eq('id', body.bookingId)
    .eq('user_id', auth.userId)
    .is('rated_at', null)
  if (error) {
    console.error('[rate]', error.message)
    return NextResponse.json({ error: 'Could not save rating' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
