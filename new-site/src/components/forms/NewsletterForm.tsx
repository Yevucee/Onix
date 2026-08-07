'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function NewsletterForm({ labels }: { labels?: { placeholder?: string; submit?: string; success?: string } }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setMessage(labels?.success || 'Thank you for subscribing.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder={labels?.placeholder || 'Your email address'}
          className="min-w-0 flex-1 rounded border px-3 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" disabled={status === 'loading'}>
          {labels?.submit || 'Subscribe'}
        </Button>
      </div>
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      {message && (
        <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-green-700'}`} role="status">
          {message}
        </p>
      )}
    </form>
  )
}
