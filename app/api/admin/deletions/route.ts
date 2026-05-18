import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { isAdminRequest, adminAuthFail } from '@/lib/adminAuth'

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return adminAuthFail()
  const db = getSupabaseAdmin()
  const { data } = await db.from('deletion_requests')
    .select('*, professionals(name, phone, service_type)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  return NextResponse.json({ requests: data || [] })
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) return adminAuthFail()
  const body = await req.json().catch(() => null) as { id?: string; professionalId?: string; action?: string } | null
  if (!body?.id || !body?.professionalId || !body?.action) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  const db = getSupabaseAdmin()
  if (body.action === 'approve') {
    await db.from('pro_wallets').delete().eq('professional_id', body.professionalId)
    await db.from('professionals').delete().eq('id', body.professionalId)
    await db.from('deletion_requests').update({ status: 'approved' }).eq('id', body.id)
  } else if (body.action === 'reject') {
    await db.from('deletion_requests').update({ status: 'rejected' }).eq('id', body.id)
  } else {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
