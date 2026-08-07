'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function ContactForm() {
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
      setError('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-[var(--radius-card)] border border-green-200 bg-green-50 p-6 text-green-900" role="status">
        Thank you — your message has been sent.
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
            First name <span className="text-[var(--color-brand)]">*</span>
          </label>
          <input id="firstName" name="firstName" required className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
            Last name <span className="text-[var(--color-brand)]">*</span>
          </label>
          <input id="lastName" name="lastName" required className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-2 block text-sm font-medium">
          Company <span className="text-[var(--color-brand)]">*</span>
        </label>
        <input id="company" name="company" required className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email <span className="text-[var(--color-brand)]">*</span>
          </label>
          <input id="email" name="email" type="email" required className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Message <span className="text-[var(--color-brand)]">*</span>
        </label>
        <textarea id="message" name="message" required rows={6} className="w-full rounded border border-[var(--color-border)] px-3 py-2" />
      </div>

      {error && (
        <p className="text-sm text-[var(--color-brand)]" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
