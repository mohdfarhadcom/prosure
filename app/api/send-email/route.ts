import { NextResponse } from 'next/server'

// Public endpoint removed for security. Email sending is now an internal-only
// helper at lib/email.ts that other server routes import directly.
export async function POST() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
