'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LIVE_HEADER_NAV, LIVE_CLIENT_SUPPORT_CTA } from '@/data/live-site'
import { OnixButton } from '@/components/onix/OnixButton'

export function OnixHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_#e5e5e5] transition-all duration-300">
      <div className="onix-container flex h-[var(--onix-header-h)] items-center justify-between">
        <Link href="/" className="shrink-0">
          <Image src="/images/onix/logo.png" alt="ONIX" width={98} height={64} className="h-12 w-auto" priority />
        </Link>

        <nav className="hidden items-center lg:flex" aria-label="Main">
          {LIVE_HEADER_NAV.map((item) => {
            const key = `${item.label}-${item.url}`
            const hasChildren = item.children && item.children.length > 0
            if (!hasChildren) {
              return (
                <Link
                  key={key}
                  href={item.url}
                  className="px-5 py-[13px] text-base font-medium leading-5 text-[var(--onix-red)] transition-colors hover:text-[var(--onix-navy)]"
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <div key={key} className="group relative">
                <Link
                  href={item.url}
                  className="flex items-center gap-1 px-5 py-[13px] text-base font-medium leading-5 text-[var(--onix-red)] transition-colors hover:text-[var(--onix-navy)]"
                >
                  {item.label}
                  <ChevronDown />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 min-w-[220px] border border-[#e5e5e5] bg-white py-1 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  {item.children!.map((child) => (
                    <Link
                      key={child.url}
                      href={child.url}
                      className="block px-5 py-2.5 text-sm text-[var(--onix-body)] hover:bg-[var(--onix-bg-alt)] hover:text-[var(--onix-red)]"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>

        <OnixButton
          variant="header-support"
          href={LIVE_CLIENT_SUPPORT_CTA.url}
          external
          className="hidden lg:inline-flex"
        >
          {LIVE_CLIENT_SUPPORT_CTA.label}
        </OnixButton>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="border border-[#e5e5e5] p-2 lg:hidden"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="fixed right-0 top-0 z-50 flex h-full w-[min(20rem,85vw)] flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <span className="onix-heading-dark font-semibold">Menu</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="text-2xl leading-none" aria-label="Close">
                ×
              </button>
            </div>
            <nav className="flex flex-col p-4" aria-label="Mobile">
              {LIVE_HEADER_NAV.map((item) => {
                const key = `${item.label}-${item.url}`
                const hasChildren = item.children && item.children.length > 0
                if (!hasChildren) {
                  return (
                    <Link key={key} href={item.url} onClick={() => setMobileOpen(false)} className="border-b py-3 text-sm font-medium text-[var(--onix-red)]">
                      {item.label}
                    </Link>
                  )
                }
                const isExp = expanded === key
                return (
                  <div key={key} className="border-b">
                    <button
                      type="button"
                      onClick={() => setExpanded(isExp ? null : key)}
                      className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-[var(--onix-red)]"
                    >
                      {item.label}
                      <ChevronDown className={isExp ? 'rotate-180' : ''} />
                    </button>
                    {isExp && (
                      <div className="pb-2 pl-4">
                        {item.children!.map((c) => (
                          <Link key={c.url} href={c.url} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-[var(--onix-body)]">
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              <OnixButton
                variant="header-support"
                href={LIVE_CLIENT_SUPPORT_CTA.url}
                external
                onClick={() => setMobileOpen(false)}
                className="mt-4 w-full text-center"
              >
                {LIVE_CLIENT_SUPPORT_CTA.label}
              </OnixButton>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}

function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg className={`h-3 w-3 transition-transform ${className}`} viewBox="0 0 12 12" fill="currentColor">
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <span className="flex flex-col gap-[5px]">
      <span className="block h-[2px] w-5 bg-[var(--onix-navy)]" />
      <span className="block h-[2px] w-5 bg-[var(--onix-navy)]" />
      <span className="block h-[2px] w-5 bg-[var(--onix-navy)]" />
    </span>
  )
}
