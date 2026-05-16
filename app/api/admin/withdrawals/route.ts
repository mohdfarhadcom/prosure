import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

const ADMIN_KEY = process.env.ADMIN_KEY || 'zilpo@admin2024'

function auth(req: Request) {
  return req.headers.get('x-admin-key') === ADMIN_KEY
}

export async function GET(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getSupabaseAdmin()
  const { data } = await db
    .from('withdrawal_requests')
    .select('*, professionals(name, phone)')
    .order('created_at', { ascending: false })
    .limit(100)
  return NextResponse.json({ requests: data || [] })
}

export async function POST(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, action, adminNote } = await req.json()
  if (!id || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const db = getSupabaseAdmin()
  await db.from('withdrawal_requests').update({
    status: action === 'approve' ? 'approved' : 'rejected',
    admin_note: adminNote || null,
    processed_at: new Date().toISOString(),
  }).eq('id', id)

  return NextResponse.json({ ok: true })
}
