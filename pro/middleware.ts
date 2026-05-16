import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  if (host === 'pro.getzilpo.com') {
    const url = req.nextUrl.clone()
    url.host = 'pro.thezilpo.com'
    return NextResponse.redirect(url, 301)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next|api|favicon).*)'] }
