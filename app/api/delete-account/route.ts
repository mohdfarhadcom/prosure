import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const db = getSupabaseAdmin()
    await db.from('addresses').delete().eq('user_id', userId)
    await db.from('bookings').update({ user_id: null }).eq('user_id', userId)
    await db.from('users').delete().eq('id', userId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
