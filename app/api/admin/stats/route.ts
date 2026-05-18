import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { isAdminRequest, adminAuthFail } from '@/lib/adminAuth'

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return adminAuthFail()

  const db = getSupabaseAdmin()
  const [users, pros, bookings, pending, openTickets, abandonedCarts] = await Promise.all([
    db.from('users').select('id', { count: 'exact', head: true }),
    db.from('professionals').select('id', { count: 'exact', head: true }),
    db.from('bookings').select('amount, status'),
    db.from('professionals').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
    db.from('abandoned_carts').select('id', { count: 'exact', head: true }).is('recovered_booking_id', null),
  ])

  const paid = (bookings.data || []).filter(b => b.status !== 'cancelled' && b.status !== 'refund_pending' && b.status !== 'refunded')
  const totalRevenue = paid.reduce((s, b) => s + (b.amount || 0), 0)
  const ourEarnings = Math.round(totalRevenue * 0.2)

  return NextResponse.json({
    users: users.count || 0,
    professionals: pros.count || 0,
    pendingPros: pending.count || 0,
    totalRevenue,
    ourEarnings,
    totalBookings: bookings.data?.length || 0,
    openTickets: openTickets.count || 0,
    abandonedCarts: abandonedCarts.count || 0,
  })
}
