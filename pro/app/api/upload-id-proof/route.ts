import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requirePro } from '@/lib/proSession'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

const ALLOWED_TYPES = ['aadhaar', 'pan', 'voter', 'ration']
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
}

export async function POST(req: Request) {
  const auth = requirePro(req)
  if (auth instanceof NextResponse) return auth

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid upload' }, { status: 400 })
  }

  const idType = String(formData.get('idType') || '')
  const file = formData.get('file')
  if (!ALLOWED_TYPES.includes(idType)) {
    return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File must be under 10 MB' }, { status: 400 })
  }
  if (!ALLOWED_MIMES.has(file.type)) {
    return NextResponse.json({ error: 'Only JPG, PNG, WebP, or PDF allowed' }, { status: 400 })
  }

  const ext = MIME_EXT[file.type] || 'bin'
  const path = `${auth.proId}/${idType}.${ext}`

  const db = getDb()
  const buf = Buffer.from(await file.arrayBuffer())
  const { error: upErr } = await db.storage.from('id-proofs').upload(path, buf, {
    contentType: file.type,
    upsert: true,
  })
  if (upErr) {
    console.error('[upload-id-proof]', upErr.message)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  await db.from('professionals').update({
    id_proof_type: idType,
    id_proof_url: path, // store path only; admin generates signed URLs
    id_proof_verified: false,
  }).eq('id', auth.proId)

  return NextResponse.json({ ok: true })
}

export const runtime = 'nodejs'
