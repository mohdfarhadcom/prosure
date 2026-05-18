import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { getUserSession } from '@/lib/userSession'

const ALLOWED_CATEGORIES = [
  'booking_issue', 'payment_issue', 'refund_issue', 'pro_behavior',
  'app_bug', 'account', 'low_rating', 'other'
]

type Body = {
  category?: string
  message?: string
  bookingId?: string | null
  rating?: number | null
  phone?: string
  name?: string
  subject?: string
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as Body | null
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (message.length < 5 || message.length > 2000) {
    return NextResponse.json({ error: 'Please describe the issue in 5–2000 characters' }, { status: 400 })
  }

  const category = ALLOWED_CATEGORIES.includes(String(body.category)) ? body.category as string : 'other'
  const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 120) : null
  const rating = body.rating != null && Number.isInteger(Number(body.rating)) && Number(body.rating) >= 1 && Number(body.rating) <= 5
    ? Number(body.rating) : null

  const session = getUserSession(req)
  const db = getSupabaseAdmin()

  let phone = typeof body.phone === 'string' ? body.phone.replace(/\D/g, '').slice(-10) : ''
  let name: string | null = null
  let userId: string | null = null
  if (session?.userId) {
    const { data: u } = await db.from('users').select('phone, name').eq('id', session.userId).single()
    phone = u?.phone || phone
    name = u?.name || null
    userId = session.userId
  }
  if (!phone) {
    return NextResponse.json({ error: 'Phone is required to contact you back' }, { status: 400 })
  }

  let bookingId: string | null = null
  if (body.bookingId && typeof body.bookingId === 'string') {
    const { data: booking } = await db.from('bookings').select('id, user_id').eq('id', body.bookingId).single()
    if (booking && (!userId || booking.user_id === userId)) {
      bookingId = booking.id
    }
  }

  const { error } = await db.from('support_tickets').insert({
    user_id: userId,
    booking_id: bookingId,
    source: 'customer',
    category,
    phone,
    name,
    subject,
    message,
    rating,
    status: 'open',
  })
  if (error) {
    console.error('[support]', error.message)
    return NextResponse.json({ error: 'Could not submit. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
