import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requirePro } from '@/lib/proSession'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(req: Request) {
  const auth = requirePro(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null) as { bookingId?: string } | null
  if (!body?.bookingId) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const db = getDb()

  // Verify the pro is approved before letting them accept anything
  const { data: pro } = await db.from('professionals').select('status, service_type').eq('id', auth.proId).single()
  if (!pro) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (pro.status !== 'approved') {
    return NextResponse.json({ error: 'Your account is awaiting verification' }, { status: 403 })
  }

  // Atomic claim — first writer wins. Reject if another pro already took it
  // or if the booking moved out of confirmed state.
  const { data: updated } = await db
    .from('bookings')
    .update({ professional_id: auth.proId, status: 'accepted' })
    .eq('id', body.bookingId)
    .eq('status', 'confirmed')
    .is('professional_id', null)
    .select('id, service_type')

  if (!updated || updated.length === 0) {
    return NextResponse.json({ error: 'This order was just taken by another pro' }, { status: 409 })
  }

  return NextResponse.json({ ok: true })
}
