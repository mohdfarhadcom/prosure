import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { professionalId, reason } = await req.json()
    if (!professionalId) return NextResponse.json({ error: 'Missing professionalId' }, { status: 400 })

    const { error } = await supabase.from('deletion_requests').insert({
      professional_id: professionalId,
      reason: reason || 'No reason provided',
      status: 'pending',
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
