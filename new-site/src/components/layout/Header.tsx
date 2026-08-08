'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from './Container'
import { LIVE_HEADER_CTA, LIVE_LOGO, type NavItem } from '@/data/live-site'

type HeaderProps = {
  logoUrl?: string
  siteName?: string
  items?: NavItem[]
  cta?: { label?: string; url?: string }
}

export function Header({ logoUrl, siteName = LIVE_LOGO.alt, items = [], cta }: HeaderProps) {
  const resolvedCta = cta?.label && cta.url ? { label: cta.label, url: cta.url } : LIVE_HEADER_CTA
  const logo = logoUrl || LIVE_LOGO.src

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white shadow-sm">
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center">
          <Image src={logo} alt={siteName} width={LIVE_LOGO.width} height={LIVE_LOGO.height} className="h-10 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {items.map((item) => (
            <NavDropdown key={`${item.label}-${item.url}`} item={item} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href={resolvedCta.url}
            className="rounded-[var(--radius-card)] bg-[var(--color-brand)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-brand-hover)]"
          >
            {resolvedCta.label}
          </Link>
        </div>

        <MobileNav items={items} cta={resolvedCta} />
      </Container>
    </header>
  )
}

function NavDropdown({ item }: { item: NavItem }) {
  const hasChildren = item.children && item.children.length > 0

  if (!hasChildren) {
    return (
      <Link href={item.url} className="px-3 py-2 text-sm font-medium text-[var(--color-heading)] hover:text-[var(--color-brand)]">
        {item.label}
      </Link>
    )
  }

  return (
    <div className="group relative">
      <Link
        href={item.url}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--color-heading)] hover:text-[var(--color-brand)]"
      >
        {item.label}
        <ChevronIcon />
      </Link>
      <div className="invisible absolute left-0 top-full z-50 min-w-[15rem] rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white py-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
        {item.children!.map((child) => (
          <Link
            key={`${child.label}-${child.url}`}
            href={child.url}
            className="block px-4 py-2.5 text-sm text-[var(--color-body)] hover:bg-[var(--color-background-alt)] hover:text-[var(--color-brand)]"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function MobileNav({ items, cta }: { items: NavItem[]; cta: { label: string; url: string } }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded border border-[var(--color-border)] px-3 py-2 text-sm font-medium"
        aria-expanded={open}
        aria-label="Open menu"
      >
        <span className="flex flex-col gap-1">
          <span className="block h-0.5 w-5 bg-[var(--color-heading)]" />
          <span className="block h-0.5 w-5 bg-[var(--color-heading)]" />
          <span className="block h-0.5 w-5 bg-[var(--color-heading)]" />
        </span>
        Menu
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} aria-hidden />
          <div className="fixed right-0 top-0 z-50 flex h-full w-[min(20rem,85vw)] flex-col overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <span className="font-semibold">Menu</span>
              <button type="button" onClick={() => setOpen(false)} className="text-2xl leading-none" aria-label="Close menu">
                ×
              </button>
            </div>
            <nav className="flex flex-col p-4" aria-label="Mobile">
              {items.map((item) => {
                const hasChildren = item.children && item.children.length > 0
                const key = `${item.label}-${item.url}`
                if (!hasChildren) {
                  return (
                    <Link
                      key={key}
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className="border-b py-3 text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  )
                }
                const isExpanded = expanded === key
                return (
                  <div key={key} className="border-b">
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : key)}
                      className="flex w-full items-center justify-between py-3 text-left text-sm font-medium"
                    >
                      {item.label}
                      <ChevronIcon className={isExpanded ? 'rotate-180' : ''} />
                    </button>
                    {isExpanded && (
                      <div className="pb-2 pl-4">
                        {item.children!.map((child) => (
                          <Link
                            key={`${child.label}-${child.url}`}
                            href={child.url}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-brand)]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              <Link
                href={cta.url}
                onClick={() => setOpen(false)}
                className="mt-4 rounded-[var(--radius-card)] bg-[var(--color-brand)] px-4 py-3 text-center text-sm font-medium text-white"
              >
                {cta.label}
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}

function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 transition-transform ${className}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  )
}

export function MobileNavigation(props: { items: NavItem[] }) {
  return <MobileNav items={props.items} cta={LIVE_HEADER_CTA} />
}
