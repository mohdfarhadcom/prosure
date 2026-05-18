import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { getUserSession } from '@/lib/userSession'

type Body = {
  step?: 'cart_viewed' | 'checkout_started' | 'payment_initiated' | 'payment_failed'
  items?: { slug?: string; name?: string }[]
  subtotal?: number
  total?: number
  promoCode?: string | null
  bookingMode?: 'instant' | 'schedule'
  location?: { lat?: number; lng?: number; address?: string } | null
}

const ALLOWED_STEPS = new Set(['cart_viewed', 'checkout_started', 'payment_initiated', 'payment_failed'])

export async function POST(req: Request) {
  const session = getUserSession(req)
  // Anonymous tracking is allowed, but only when a session cookie is set we link to user.
  let body: Body | null = null
  try {
    body = await req.json() as Body
  } catch {
    return NextResponse.json({ ok: false })
  }
  if (!body || !body.step || !ALLOWED_STEPS.has(body.step)) {
    return NextResponse.json({ ok: false })
  }

  const items = Array.isArray(body.items)
    ? body.items.slice(0, 50).map(i => ({
        slug: String(i?.slug || '').slice(0, 80),
        name: String(i?.name || '').slice(0, 80),
      }))
    : []

  // Skip if no items and step is just cart_viewed (avoid noise from page views)
  if (items.length === 0 && body.step === 'cart_viewed') {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const db = getSupabaseAdmin()

  // Resolve phone for non-authenticated tracking (optional)
  let phone: string | null = null
  let name: string | null = null
  if (session?.userId) {
    const { data: user } = await db.from('users').select('phone, name').eq('id', session.userId).single()
    phone = user?.phone || null
    name = user?.name || null
  }

  // Find the most recent open (unrecovered) cart for this user/phone in last 6 hours
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  let existingId: string | null = null
  if (session?.userId) {
    const { data } = await db.from('abandoned_carts')
      .select('id')
      .eq('user_id', session.userId)
      .is('recovered_booking_id', null)
      .gte('updated_at', sixHoursAgo)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    existingId = data?.id || null
  }

  const payload: Record<string, unknown> = {
    items,
    subtotal: Number.isFinite(Number(body.subtotal)) ? Math.round(Number(body.subtotal)) : 0,
    total: Number.isFinite(Number(body.total)) ? Math.round(Number(body.total)) : 0,
    promo_code: body.promoCode || null,
    booking_mode: body.bookingMode || null,
    location: body.location && Number.isFinite(Number(body.location.lat)) ? {
      lat: Number(body.location.lat),
      lng: Number(body.location.lng),
      address: String(body.location.address || '').slice(0, 500),
    } : null,
    last_step: body.step,
    user_id: session?.userId || null,
    phone,
    name,
  }

  if (existingId) {
    await db.from('abandoned_carts').update(payload).eq('id', existingId)
  } else {
    await db.from('abandoned_carts').insert(payload)
  }

  return NextResponse.json({ ok: true })
}
