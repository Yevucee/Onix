import { getSiteEnv } from './env'

export type EmailPayload = {
  to: string
  subject: string
  text: string
  replyTo?: string
}

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  const provider = process.env.EMAIL_PROVIDER || 'log'

  if (getSiteEnv() === 'staging' && process.env.STAGING_SEND_EMAIL !== 'true') {
    console.log('[staging] Email suppressed', { to: payload.to, subject: payload.subject })
    return { ok: true }
  }

  if (provider === 'log' || !process.env.EMAIL_API_KEY) {
    console.log('[email]', payload)
    return { ok: true }
  }

  // Resend-compatible HTTP API (configure via env)
  if (provider === 'resend') {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'noreply@onixdatacentres.com',
          to: payload.to,
          subject: payload.subject,
          text: payload.text,
          reply_to: payload.replyTo,
        }),
      })
      if (!res.ok) return { ok: false, error: await res.text() }
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) }
    }
  }

  console.log('[email-fallback]', payload)
  return { ok: true }
}

export function getContactRecipient(): string {
  return process.env.CONTACT_FORM_RECIPIENT || process.env.EMAIL_TO || 'contact@onixdatacentres.com'
}
