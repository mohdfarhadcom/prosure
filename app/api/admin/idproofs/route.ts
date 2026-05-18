import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { isAdminRequest, adminAuthFail } from '@/lib/adminAuth'

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return adminAuthFail()

  const db = getSupabaseAdmin()
  const { data } = await db
    .from('professionals')
    .select('id, name, phone, service_type, id_proof_type, id_proof_url, id_proof_verified, created_at')
    .not('id_proof_url', 'is', null)
    .order('created_at', { ascending: false })

  const professionals = await Promise.all(
    (data || []).map(async (p: Record<string, unknown>) => {
      if (!p.id_proof_url || !p.id_proof_type || !p.id) return p
      const path = `${p.id}/${p.id_proof_type}`
      const extensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf']
      // Skip the public-URL fallback: only return a signed URL or nothing.
      let signedUrl: string | null = null
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
  if (!isAdminRequest(req)) return adminAuthFail()
  const body = await req.json().catch(() => null) as { id?: string; verified?: boolean } | null
  if (!body?.id || typeof body.verified !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  const db = getSupabaseAdmin()
  await db.from('professionals').update({ id_proof_verified: body.verified }).eq('id', body.id)
  return NextResponse.json({ ok: true })
}
