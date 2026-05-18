import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { requireUser } from '@/lib/userSession'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth

  if (!params.id || !/^[0-9a-f-]{36}$/i.test(params.id)) {
    return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 })
  }

  const db = getSupabaseAdmin()
  const { data: booking } = await db.from('bookings')
    .select('*, workers(id, lat, lng, name)')
    .eq('id', params.id)
    .eq('user_id', auth.userId)
    .single()

  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ booking })
}
