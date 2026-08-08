import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ButtonVariant = 'primary-red' | 'solid-white' | 'navy-pill' | 'header-support'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  'primary-red':
    'inline-flex items-center justify-center gap-[17px] border-2 border-[var(--onix-red)] bg-[var(--onix-red)] px-[55px] py-4 text-base capitalize text-white transition-colors hover:bg-transparent hover:text-[var(--onix-red)]',
  'header-support':
    'inline-flex items-center justify-center bg-[var(--onix-red)] px-6 py-3 text-[15px] font-normal text-white transition-colors hover:bg-[var(--onix-red-hover)]',
  'solid-white':
    'inline-flex items-center justify-center bg-white px-[25px] py-3 text-base font-normal text-[var(--onix-navy)] transition-colors hover:bg-white/90',
  'navy-pill':
    'inline-flex items-center justify-center bg-[var(--onix-navy)] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--onix-red)]',
}

type OnixButtonProps = {
  variant?: ButtonVariant
  href: string
  external?: boolean
  children: ReactNode
  className?: string
  icon?: ReactNode
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children' | 'className'>

export function OnixButton({
  variant = 'primary-red',
  href,
  external,
  children,
  className = '',
  icon,
  ...rest
}: OnixButtonProps) {
  const classes = `${VARIANT_CLASSES[variant]} ${className}`.trim()

  if (external || href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
        {icon}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
      {icon}
    </Link>
  )
}
