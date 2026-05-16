import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  if (host.includes('getzilpo.com') && !host.includes('pro.')) {
    const url = req.nextUrl.clone()
    url.host = 'thezilpo.com'
    return NextResponse.redirect(url, 301)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next|api|favicon).*)'] }
