import { NextResponse } from 'next/server'
import { clearProCookie } from '@/lib/proSession'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  clearProCookie(res)
  return res
}
