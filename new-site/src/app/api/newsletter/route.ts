import { NextResponse } from 'next/server'
import { getSiteEnv } from '@/lib/env'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>
    const email = String(body.email || '').trim()
    const website = String(body.website || '').trim()

    if (website) return NextResponse.json({ ok: true })
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const provider = process.env.NEWSLETTER_PROVIDER || 'log'
    if (getSiteEnv() === 'staging') {
      console.log('[staging] Newsletter signup', { email })
      return NextResponse.json({ ok: true })
    }

    if (provider === 'log' || !process.env.NEWSLETTER_API_KEY) {
      console.log('[newsletter] Signup (provider not configured)', { email, provider })
      return NextResponse.json({ ok: true, configured: false })
    }

    // Provider-specific integration placeholder — configure credentials in production
    console.log('[newsletter] Signup', { email, provider })
    return NextResponse.json({ ok: true, configured: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
