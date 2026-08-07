import { NextResponse } from 'next/server'
import { getSiteEnv } from '@/lib/env'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>
    const firstName = String(body.firstName || '').trim()
    const lastName = String(body.lastName || '').trim()
    const company = String(body.company || '').trim()
    const email = String(body.email || '').trim()
    const phone = String(body.phone || '').trim()
    const message = String(body.message || '').trim()
    const website = String(body.website || '').trim()

    if (website) return NextResponse.json({ ok: true })
    if (!firstName || !lastName || !company || !email || !message || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    if (getSiteEnv() === 'staging') {
      console.log('[staging] Contact form (not emailed)', { firstName, lastName, company })
      return NextResponse.json({ ok: true })
    }

    console.log('[contact] Submission', { firstName, lastName, company, email, phone })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
