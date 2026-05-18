import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getProSession } from '@/lib/proSession'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

const ALLOWED_CATEGORIES = [
  'booking_issue', 'payment_issue', 'refund_issue', 'pro_behavior',
  'app_bug', 'account', 'low_rating', 'other'
]

type Body = {
  category?: string
  message?: string
  bookingId?: string | null
  subject?: string
  phone?: string
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

  const session = getProSession(req)
  const db = getDb()

  let phone = typeof body.phone === 'string' ? body.phone.replace(/\D/g, '').slice(-10) : ''
  let name: string | null = null
  let proId: string | null = null
  if (session?.proId) {
    const { data: p } = await db.from('professionals').select('phone, name').eq('id', session.proId).single()
    phone = p?.phone || phone
    name = p?.name || null
    proId = session.proId
  }
  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 })

  let bookingId: string | null = null
  if (body.bookingId && typeof body.bookingId === 'string') {
    const { data: booking } = await db.from('bookings').select('id, professional_id').eq('id', body.bookingId).single()
    if (booking && (!proId || booking.professional_id === proId)) {
      bookingId = booking.id
    }
  }

  const { error } = await db.from('support_tickets').insert({
    professional_id: proId,
    booking_id: bookingId,
    source: 'professional',
    category,
    phone,
    name,
    subject,
    message,
    status: 'open',
  })
  if (error) {
    console.error('[pro/support]', error.message)
    return NextResponse.json({ error: 'Could not submit' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
