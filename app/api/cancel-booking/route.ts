import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { requireUser } from '@/lib/userSession'

export async function POST(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null) as { bookingId?: string } | null
  if (!body?.bookingId) return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })

  const db = getSupabaseAdmin()
  const { data: booking } = await db.from('bookings').select('user_id, status').eq('id', body.bookingId).single()
  if (!booking) return NextResponse.json({ ok: false, error: 'Booking not found' }, { status: 404 })
  if (booking.user_id !== auth.userId) return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })

  const { error, data: updated } = await db.from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', body.bookingId)
    .eq('status', 'pending')
    .select('id')
  if (error) {
    console.error('[cancel-booking]', error.message)
    return NextResponse.json({ ok: false, error: 'Cancel failed' }, { status: 500 })
  }
  if (!updated || updated.length === 0) {
    return NextResponse.json({ ok: false, error: 'Cannot cancel — booking is no longer pending' }, { status: 409 })
  }
  return NextResponse.json({ ok: true })
}
