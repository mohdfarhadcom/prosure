import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

const KEY = process.env.ADMIN_KEY || '9058172570@JhojhaFarhad'

export async function GET(req: Request) {
  if (req.headers.get('x-admin-key') !== KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getSupabaseAdmin()
  const { data } = await db.from('professionals').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ pros: data || [] })
}

export async function POST(req: Request) {
  if (req.headers.get('x-admin-key') !== KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, action } = await req.json()
  const db = getSupabaseAdmin()
  if (action === 'approve') {
    await db.from('professionals').update({ status: 'approved' }).eq('id', id)
    return NextResponse.json({ ok: true })
  }
  if (action === 'delete') {
    await db.from('pro_wallets').delete().eq('professional_id', id)
    await db.from('professionals').delete().eq('id', id)
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
