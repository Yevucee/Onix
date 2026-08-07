import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { matchRedirect } from '@/lib/redirects'
import { getStagingHeaders } from '@/lib/staging'
import { isStaging } from '@/lib/env'

function checkStagingAuth(request: NextRequest): NextResponse | null {
  if (!isStaging()) return null
  const user = process.env.STAGING_AUTH_USER
  const pass = process.env.STAGING_AUTH_PASSWORD
  if (!user || !pass) return null

  const auth = request.headers.get('authorization')
  if (auth) {
    const [scheme, encoded] = auth.split(' ')
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
      const [u, p] = decoded.split(':')
      if (u === user && p === pass) return null
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Onix Staging"' },
  })
}

export function middleware(request: NextRequest) {
  const authResponse = checkStagingAuth(request)
  if (authResponse) return authResponse

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
