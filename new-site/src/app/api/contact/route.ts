import { NextResponse } from 'next/server'
import { getSiteEnv } from '@/lib/env'
import { getContactRecipient, sendEmail } from '@/lib/email'

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

    const recipient = getContactRecipient()
    const result = await sendEmail({
      to: recipient,
      subject: `[Onix Contact] ${firstName} ${lastName} — ${company}`,
      replyTo: email,
      text: [
        `Name: ${firstName} ${lastName}`,
        `Company: ${company}`,
        `Email: ${email}`,
        `Phone: ${phone || '—'}`,
        '',
        message,
        '',
        `Environment: ${getSiteEnv()}`,
      ].join('\n'),
    })

    if (!result.ok) {
      console.error('[contact] Email failed', result.error)
      return NextResponse.json({ error: 'Unable to send message' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
