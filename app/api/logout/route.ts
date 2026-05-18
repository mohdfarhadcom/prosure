import { NextResponse } from 'next/server'
import { clearUserCookie } from '@/lib/userSession'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  clearUserCookie(res)
  return res
}
