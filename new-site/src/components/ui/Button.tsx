import Link from 'next/link'
import type { ReactNode } from 'react'

type ButtonProps = {
  href?: string
  children: ReactNode
  variant?: 'primary' | 'outline'
  className?: string
  type?: 'button' | 'submit'
}

export function Button({ href, children, variant = 'primary', className = '', type = 'button' }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-[var(--radius-card)] px-6 py-3 text-sm font-medium transition-colors'
  const styles =
    variant === 'primary'
      ? 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]'
      : 'border border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white'

  if (href) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  )
}
