import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { isAdminRequest, adminAuthFail } from '@/lib/adminAuth'

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return adminAuthFail()
  const db = getSupabaseAdmin()
  const { data } = await db.from('professionals').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ pros: data || [] })
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) return adminAuthFail()
  const body = await req.json().catch(() => null) as { id?: string; action?: string } | null
  if (!body?.id || !body?.action) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const db = getSupabaseAdmin()
  if (body.action === 'approve') {
    await db.from('professionals').update({ status: 'approved' }).eq('id', body.id)
    return NextResponse.json({ ok: true })
  }
  if (body.action === 'delete') {
    await db.from('pro_wallets').delete().eq('professional_id', body.id)
    await db.from('professionals').delete().eq('id', body.id)
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
