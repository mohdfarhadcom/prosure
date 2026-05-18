import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { requireUser } from '@/lib/userSession'

export async function GET(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth
  const db = getSupabaseAdmin()
  const { data } = await db.from('addresses').select('*').eq('user_id', auth.userId).order('created_at', { ascending: false })
  return NextResponse.json({ addresses: data || [] })
}

export async function POST(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth
  const body = await req.json().catch(() => null) as {
    label?: string; full_address?: string; lat?: number; lng?: number
  } | null
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const label = String(body.label || 'Home').slice(0, 30)
  const full_address = String(body.full_address || '').slice(0, 500)
  const lat = Number(body.lat)
  const lng = Number(body.lng)
  if (!full_address) return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
  }

  const db = getSupabaseAdmin()
  const { data, error } = await db.from('addresses').insert({
    user_id: auth.userId, label, full_address, lat, lng,
  }).select().single()
  if (error || !data) {
    console.error('[addresses]', error?.message)
    return NextResponse.json({ error: 'Could not save address' }, { status: 500 })
  }
  return NextResponse.json({ address: data })
}

export async function DELETE(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const db = getSupabaseAdmin()
  await db.from('addresses').delete().eq('id', id).eq('user_id', auth.userId)
  return NextResponse.json({ ok: true })
}
