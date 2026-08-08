'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const LABELS = {
  en: {
    success: 'Thank you — your message has been sent.',
    error: 'Something went wrong. Please try again.',
    firstName: 'First name',
    lastName: 'Last name',
    company: 'Company',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    required: '*',
    send: 'Send message',
    sending: 'Sending…',
  },
  fr: {
    success: 'Merci — votre message a bien été envoyé.',
    error: 'Une erreur est survenue. Veuillez réessayer.',
    firstName: 'Prénom',
    lastName: 'Nom',
    company: 'Entreprise',
    email: 'E-mail',
    phone: 'Téléphone',
    message: 'Message',
    required: '*',
    send: 'Envoyer',
    sending: 'Envoi en cours…',
  },
} as const

export function ContactForm({ locale = 'en' }: { locale?: 'en' | 'fr' }) {
  const t = LABELS[locale]
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setError(t.error)
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-[var(--radius-card)] border border-green-200 bg-green-50 p-6 text-green-900" role="status">
        {t.success}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
            {t.firstName} <span className="text-[var(--color-brand)]">{t.required}</span>
          </label>
          <input id="firstName" name="firstName" required className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
            {t.lastName} <span className="text-[var(--color-brand)]">{t.required}</span>
          </label>
          <input id="lastName" name="lastName" required className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-2 block text-sm font-medium">
          {t.company} <span className="text-[var(--color-brand)]">{t.required}</span>
        </label>
        <input id="company" name="company" required className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            {t.email} <span className="text-[var(--color-brand)]">{t.required}</span>
          </label>
          <input id="email" name="email" type="email" required className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            {t.phone}
          </label>
          <input id="phone" name="phone" type="tel" className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          {t.message} <span className="text-[var(--color-brand)]">{t.required}</span>
        </label>
        <textarea id="message" name="message" required rows={6} className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
      </div>

      {error && (
        <p className="text-sm text-[var(--color-brand)]" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? t.sending : t.send}
      </Button>
    </form>
  )
}
