import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { isAdminRequest, adminAuthFail } from '@/lib/adminAuth'

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return adminAuthFail()

  const url = new URL(req.url)
  const filter = url.searchParams.get('filter') || 'open'

  const db = getSupabaseAdmin()
  let q = db.from('abandoned_carts')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(100)

  if (filter === 'open') q = q.is('recovered_booking_id', null)
  if (filter === 'recovered') q = q.not('recovered_booking_id', 'is', null)

  const { data } = await q
  return NextResponse.json({ carts: data || [] })
}
