import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { isAdminRequest, adminAuthFail } from '@/lib/adminAuth'

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return adminAuthFail()
  const db = getSupabaseAdmin()
  const { data } = await db
    .from('withdrawal_requests')
    .select('*, professionals(name, phone)')
    .order('created_at', { ascending: false })
    .limit(100)
  return NextResponse.json({ requests: data || [] })
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) return adminAuthFail()
  const body = await req.json().catch(() => null) as { id?: string; action?: 'approve' | 'reject'; adminNote?: string } | null
  if (!body?.id || !body?.action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const db = getSupabaseAdmin()

  // Read the request first; abort if already processed (idempotency guard)
  const { data: existing } = await db.from('withdrawal_requests').select('*').eq('id', body.id).single()
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (existing.status !== 'pending') {
    return NextResponse.json({ error: `Already ${existing.status}` }, { status: 409 })
  }

  if (body.action === 'reject') {
    // Refund the held amount back to the pro's wallet
    const { data: wallet } = await db.from('pro_wallets').select('balance').eq('professional_id', existing.professional_id).single()
    await db.from('pro_wallets').update({
      balance: (wallet?.balance || 0) + Number(existing.amount || 0),
      updated_at: new Date().toISOString(),
    }).eq('professional_id', existing.professional_id)
  }

  await db.from('withdrawal_requests').update({
    status: body.action === 'approve' ? 'approved' : 'rejected',
    admin_note: body.adminNote || null,
    processed_at: new Date().toISOString(),
  }).eq('id', body.id).eq('status', 'pending') // optimistic lock

  return NextResponse.json({ ok: true })
}
