import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export async function GET(req: Request) {
  const auth = req.headers.get('x-admin-key')
  if (auth !== (process.env.ADMIN_KEY || '9058172570@JhojhaFarhad')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = getSupabaseAdmin()
  const [users, pros, bookings, pending] = await Promise.all([
    db.from('users').select('id', { count: 'exact', head: true }),
    db.from('professionals').select('id', { count: 'exact', head: true }),
    db.from('bookings').select('amount, status'),
    db.from('professionals').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const completed = (bookings.data || []).filter(b => b.status === 'confirmed' || b.status === 'completed')
  const totalRevenue = completed.reduce((s, b) => s + (b.amount || 0), 0)
  const ourEarnings = Math.round(totalRevenue * 0.2)

  return NextResponse.json({
    users: users.count || 0,
    professionals: pros.count || 0,
    pendingPros: pending.count || 0,
    totalRevenue,
    ourEarnings,
    totalBookings: bookings.data?.length || 0,
  })
}
