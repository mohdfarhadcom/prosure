import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

const ADMIN_KEY = process.env.ADMIN_KEY || 'zilpo@admin2024'

export async function GET(req: Request) {
  if (req.headers.get('x-admin-key') !== ADMIN_KEY)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getSupabaseAdmin()
  const { data } = await db
    .from('professionals')
    .select('id, name, phone, service_type, id_proof_type, id_proof_url, id_proof_verified, created_at')
    .not('id_proof_url', 'is', null)
    .order('created_at', { ascending: false })

  // Generate signed URLs for each document (valid for 1 hour)
  const professionals = await Promise.all(
    (data || []).map(async (p: Record<string, unknown>) => {
      if (!p.id_proof_url || !p.id_proof_type || !p.id) return p
      const path = `${p.id}/${p.id_proof_type}`
      const extensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf']
      let signedUrl = p.id_proof_url as string

      for (const ext of extensions) {
        const { data: signed } = await db.storage
          .from('id-proofs')
          .createSignedUrl(`${path}.${ext}`, 3600)
        if (signed?.signedUrl) {
          signedUrl = signed.signedUrl
          break
        }
      }
      return { ...p, signed_url: signedUrl }
    })
  )

  return NextResponse.json({ professionals })
}

export async function POST(req: Request) {
  if (req.headers.get('x-admin-key') !== ADMIN_KEY)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, verified } = await req.json()
  const db = getSupabaseAdmin()
  await db.from('professionals').update({ id_proof_verified: verified }).eq('id', id)
  return NextResponse.json({ ok: true })
}
