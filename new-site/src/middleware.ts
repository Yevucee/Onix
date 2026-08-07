import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { matchRedirect } from '@/lib/redirects'
import { getStagingHeaders } from '@/lib/staging'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const redirect = matchRedirect(pathname)
  if (redirect) {
    const url = request.nextUrl.clone()
    url.pathname = redirect.destination
    return NextResponse.redirect(url, Number(redirect.statusCode))
  }

  const response = NextResponse.next()
  const stagingHeaders = getStagingHeaders()
  for (const [key, value] of Object.entries(stagingHeaders)) {
    response.headers.set(key, value)
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
