import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { requireUser, clearUserCookie } from '@/lib/userSession'

export async function POST(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth

  const db = getSupabaseAdmin()

  // Refuse if there are any in-flight bookings — protect against financial loss.
  const { data: inFlight } = await db.from('bookings')
    .select('id, status')
    .eq('user_id', auth.userId)
    .in('status', ['pending', 'confirmed', 'accepted', 'en route', 'in progress', 'refund_pending'])
    .limit(1)
  if (inFlight && inFlight.length > 0) {
    return NextResponse.json({
      error: 'You have active bookings. Please complete or cancel them before deleting your account.'
    }, { status: 409 })
  }

  // Anonymize, do not orphan: this keeps Razorpay reconciliation intact.
  const anonPhone = `deleted_${auth.userId.slice(0, 8)}_${Date.now()}`
  await db.from('addresses').delete().eq('user_id', auth.userId)
  await db.from('users')
    .update({ phone: anonPhone, name: null, email: null })
    .eq('id', auth.userId)

  const res = NextResponse.json({ ok: true })
  clearUserCookie(res)
  return res
}
