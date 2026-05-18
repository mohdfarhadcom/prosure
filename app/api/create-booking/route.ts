import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { requireUser } from '@/lib/userSession'
import { quote, MIN_AMOUNT } from '@/lib/pricing'

type Body = {
  items?: { slug?: string; quantity?: number }[]
  tip?: number
  promoCode?: string | null
  bookingMode?: 'instant' | 'schedule'
  date?: string
  slot?: string
  location?: { lat?: number; lng?: number; address?: string } | null
}

function isValidLatLng(lat: unknown, lng: unknown): { lat: number; lng: number } | null {
  const a = Number(lat)
  const b = Number(lng)
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null
  if (a < -90 || a > 90 || b < -180 || b > 180) return null
  return { lat: a, lng: b }
}

function isValidDate(s: string | undefined): boolean {
  if (!s) return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = new Date(s + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return false
  // No more than ~30 days in future, no more than 1 day in past
  const now = Date.now()
  return d.getTime() >= now - 24 * 60 * 60 * 1000 && d.getTime() <= now + 31 * 24 * 60 * 60 * 1000
}

function isValidSlot(s: string | undefined): boolean {
  if (!s) return false
  return /^(1[012]|[1-9]):[0-5]\d (AM|PM)$/i.test(s.trim()) && s.length <= 12
}

function generateOtp(): string {
  return String(crypto.randomInt(0, 10000)).padStart(4, '0')
}

export async function POST(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null) as Body | null
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const items = Array.isArray(body.items)
    ? body.items.map(i => ({ slug: String(i?.slug || ''), quantity: Number(i?.quantity || 1) }))
    : []

  const q = quote({
    items,
    tip: Number(body.tip || 0),
    promoCode: body.promoCode || null,
  })
  if (!q.ok) return NextResponse.json({ error: q.error }, { status: 400 })

  const mode = body.bookingMode === 'schedule' ? 'schedule' : 'instant'
  let date = body.date
  let slot = body.slot
  if (mode === 'instant') {
    const now = new Date()
    date = now.toISOString().split('T')[0]
    const mins = now.getMinutes() < 30 ? 30 : 0
    if (mins === 0) now.setHours(now.getHours() + 1)
    now.setMinutes(mins, 0, 0)
    const h = now.getHours()
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    slot = `${h12}:${String(now.getMinutes()).padStart(2, '0')} ${ampm}`
  } else {
    if (!isValidDate(date)) return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
    if (!isValidSlot(slot)) return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 })
  }

  const insertPayload: Record<string, unknown> = {
    user_id: auth.userId,
    date,
    slot,
    duration: q.durationMinutes,
    amount: q.total,
    booking_type: q.isHourly ? 'hourly' : 'services',
    booking_mode: mode,
    status: 'pending',
    otp: generateOtp(),
    promo_code: q.promoDiscount > 0 ? (body.promoCode || null) : null,
    discount: q.promoDiscount,
  }

  if (body.location) {
    const ll = isValidLatLng(body.location.lat, body.location.lng)
    if (ll) {
      insertPayload.lat = ll.lat
      insertPayload.lng = ll.lng
    }
    if (typeof body.location.address === 'string' && body.location.address.length <= 500) {
      insertPayload.address = body.location.address
    }
  }

  const db = getSupabaseAdmin()
  const { data: booking, error } = await db.from('bookings').insert(insertPayload).select('id, amount').single()
  if (error || !booking) {
    console.error('[create-booking]', error?.message)
    return NextResponse.json({ error: 'Could not create booking' }, { status: 500 })
  }

  // Free booking — mark confirmed straight away (no payment to verify).
  if (q.total === MIN_AMOUNT) {
    await db.from('bookings')
      .update({ status: 'confirmed', payment_id: 'test_free' })
      .eq('id', booking.id)
  }

  return NextResponse.json({
    bookingId: booking.id,
    amount: q.total,
    free: q.total === MIN_AMOUNT,
  })
}
