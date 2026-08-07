import type { ReactNode } from 'react'
import Link from 'next/link'
import { Container } from './Container'

type NavItem = { label: string; url: string; children?: NavItem[] }

type HeaderProps = {
  logoUrl?: string
  siteName?: string
  items?: NavItem[]
  cta?: { label?: string; url?: string }
}

export function Header({ logoUrl, siteName = 'Onix Data Centre', items = [], cta }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 font-semibold text-[var(--color-heading)]">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-10 w-auto" />
          ) : (
            <span>{siteName}</span>
          )}
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {items.map((item) => (
            <div key={item.url} className="group relative">
              <Link href={item.url} className="text-sm font-medium hover:text-[var(--color-brand)]">
                {item.label}
              </Link>
              {item.children && item.children.length > 0 && (
                <div className="invisible absolute left-0 top-full z-50 min-w-[14rem] rounded-[var(--radius-card)] border bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.url}
                      href={child.url}
                      className="block rounded px-3 py-2 text-sm hover:bg-[var(--color-background-alt)]"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        {cta?.label && cta.url && (
          <Link
            href={cta.url}
            className="hidden rounded-[var(--radius-card)] bg-[var(--color-brand)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-brand-hover)] lg:inline-flex"
          >
            {cta.label}
          </Link>
        )}
        <MobileNav items={items} cta={cta} />
      </Container>
    </header>
  )
}

function MobileNav({ items, cta }: { items: NavItem[]; cta?: HeaderProps['cta'] }) {
  return (
    <details className="relative lg:hidden">
      <summary className="cursor-pointer list-none rounded border px-3 py-2 text-sm font-medium" aria-label="Open menu">
        Menu
      </summary>
      <div className="absolute right-0 top-full z-50 mt-2 min-w-[16rem] rounded-[var(--radius-card)] border bg-white p-3 shadow-lg">
        <nav className="flex flex-col gap-2" aria-label="Mobile">
          {items.map((item) => (
            <Link key={item.url} href={item.url} className="rounded px-2 py-2 text-sm hover:bg-[var(--color-background-alt)]">
              {item.label}
            </Link>
          ))}
          {cta?.label && cta.url && (
            <Link href={cta.url} className="mt-2 rounded bg-[var(--color-brand)] px-3 py-2 text-center text-sm text-white">
              {cta.label}
            </Link>
          )}
        </nav>
      </div>
    </details>
  )
}

export function MobileNavigation(props: { items: NavItem[] }) {
  return <MobileNav items={props.items} />
}
