import Link from 'next/link'
import { Container } from './Container'

type FooterColumn = { heading?: string; links?: { label: string; url: string }[] }

type FooterProps = {
  columns?: FooterColumn[]
  copyright?: string
  legalLinks?: { label: string; url: string }[]
}

export function Footer({ columns = [], copyright, legalLinks = [] }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-[var(--color-border)] bg-[var(--color-background-alt)]">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((column, index) => (
          <div key={column.heading || index}>
            {column.heading && <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">{column.heading}</h2>}
            <ul className="space-y-2 text-sm">
              {column.links?.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className="hover:text-[var(--color-brand)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="flex flex-col gap-4 border-t border-[var(--color-border)] py-6 text-sm text-[var(--color-muted)] md:flex-row md:items-center md:justify-between">
        <p>{copyright || `© ${new Date().getFullYear()} Onix Data Centre`}</p>
        <div className="flex flex-wrap gap-4">
          {legalLinks.map((link) => (
            <Link key={link.url} href={link.url} className="hover:text-[var(--color-brand)]">
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  )
}
