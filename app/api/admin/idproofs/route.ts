import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

const ADMIN_KEY = process.env.ADMIN_KEY || 'zilpo@admin2024'

export async function GET(req: Request) {
  if (req.headers.get('x-admin-key') !== ADMIN_KEY)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getSupabaseAdmin()
  const { data } = await db
    .from('professionals')
    .select('id, name, phone, service_type, id_proof_type, id_proof_url, id_proof_verified, created_at')
    .not('id_proof_url', 'is', null)
    .order('created_at', { ascending: false })
  return NextResponse.json({ professionals: data || [] })
}

export async function POST(req: Request) {
  if (req.headers.get('x-admin-key') !== ADMIN_KEY)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, verified } = await req.json()
  const db = getSupabaseAdmin()
  await db.from('professionals').update({ id_proof_verified: verified }).eq('id', id)
  return NextResponse.json({ ok: true })
}
