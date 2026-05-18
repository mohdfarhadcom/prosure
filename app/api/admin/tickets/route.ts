import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { isAdminRequest, adminAuthFail } from '@/lib/adminAuth'

const ALLOWED_STATUS = ['open', 'in_progress', 'resolved', 'closed']

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return adminAuthFail()
  const url = new URL(req.url)
  const status = url.searchParams.get('status')

  const db = getSupabaseAdmin()
  let q = db.from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (status && ALLOWED_STATUS.includes(status)) q = q.eq('status', status)

  const { data } = await q
  return NextResponse.json({ tickets: data || [] })
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) return adminAuthFail()
  const body = await req.json().catch(() => null) as { id?: string; status?: string; adminNote?: string } | null
  if (!body?.id) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const patch: Record<string, unknown> = {}
  if (body.status && ALLOWED_STATUS.includes(body.status)) {
    patch.status = body.status
    if (body.status === 'resolved' || body.status === 'closed') patch.resolved_at = new Date().toISOString()
  }
  if (typeof body.adminNote === 'string') patch.admin_note = body.adminNote.slice(0, 2000)

  if (Object.keys(patch).length === 0) return NextResponse.json({ ok: true })

  const db = getSupabaseAdmin()
  await db.from('support_tickets').update(patch).eq('id', body.id)
  return NextResponse.json({ ok: true })
}
