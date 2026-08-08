import Link from 'next/link'
import Image from 'next/image'
import { Container } from './Container'
import { LIVE_FOOTER, LIVE_LOGO } from '@/data/live-site'

type FooterColumn = { heading?: string; links?: { label: string; url: string; external?: boolean }[] }

type FooterProps = {
  columns?: FooterColumn[]
  copyright?: string
  legalLinks?: { label: string; url: string }[]
  showNewsletter?: boolean
  locale?: 'en' | 'fr'
}

export function Footer({ copyright }: FooterProps) {
  const { tagline, ctaHeading, navigate, contact, social } = LIVE_FOOTER

  return (
    <footer className="mt-0 bg-[var(--color-heading)] text-white">
      {/* CTA band */}
      <div className="border-b border-white/10 py-12">
        <Container className="text-center">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">{ctaHeading}</h2>
          <p className="mt-2 text-white/70">{tagline}</p>
        </Container>
      </div>

      {/* Footer columns */}
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/">
            <Image src={LIVE_LOGO.src} alt={LIVE_LOGO.alt} width={120} height={78} className="h-12 w-auto brightness-0 invert" />
          </Link>
          <div className="mt-6 flex gap-4">
            {social.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white"
                aria-label={s.platform}
              >
                {s.platform}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">{navigate.heading}</h2>
          <ul className="space-y-2 text-sm">
            {navigate.links.map((link) => (
              <li key={link.url}>
                {link.external ? (
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.url} className="text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">{contact.heading}</h2>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
            {contact.phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white">
                  {phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="border-t border-white/10 py-6 text-center text-sm text-white/60">
        <p>{copyright || LIVE_FOOTER.copyright}</p>
      </Container>
    </footer>
  )
}
