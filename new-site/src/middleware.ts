import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getStagingHeaders } from '@/lib/staging'

export function middleware(_request: NextRequest) {
  const response = NextResponse.next()
  const stagingHeaders = getStagingHeaders()
  for (const [key, value] of Object.entries(stagingHeaders)) {
    response.headers.set(key, value)
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
