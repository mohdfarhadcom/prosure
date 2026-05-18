import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { requireUser } from '@/lib/userSession'

export async function GET(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth

  const db = getSupabaseAdmin()
  const { data } = await db
    .from('bookings')
    .select('id, date, slot, amount, status, created_at, booking_items(services(name))')
    .eq('user_id', auth.userId)
    .order('created_at', { ascending: false })

  return NextResponse.json({ bookings: data || [] })
}
