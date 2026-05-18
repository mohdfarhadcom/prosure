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

  const body = await req.json().catch(() => null) as { lat?: number; lng?: number } | null
  const lat = Number(body?.lat)
  const lng = Number(body?.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
  }

  const db = getDb()
  const { data: pro } = await db.from('professionals').select('name').eq('id', auth.proId).single()
  await db.from('workers').upsert({
    id: auth.proId,
    lat, lng,
    name: pro?.name || '',
    status: 'available',
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const auth = requirePro(req)
  if (auth instanceof NextResponse) return auth
  const db = getDb()
  await db.from('workers').delete().eq('id', auth.proId)
  return NextResponse.json({ ok: true })
}
