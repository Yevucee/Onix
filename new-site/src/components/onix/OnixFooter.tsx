import Link from 'next/link'
import Image from 'next/image'
import { LIVE_FOOTER } from '@/data/live-site'

export function OnixFooter() {
  const { tagline, navigate, contact, social } = LIVE_FOOTER

  return (
    <footer className="bg-[var(--onix-footer-bg)] text-white">
      <div className="onix-container py-[30px] pb-[15px]">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Logo + tagline + social */}
          <div>
            <Link href="/">
              <Image src="/images/onix/logo-white.png" alt="ONIX" width={160} height={80} className="mb-4 h-auto w-[40%] min-w-[100px]" />
            </Link>
            <p className="mb-4 text-[15px] font-normal text-white">{tagline}</p>
            <div className="flex gap-[5px]">
              {social.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[17px] w-[17px] items-center justify-center text-white transition-colors hover:text-[var(--onix-red)]"
                  aria-label={s.platform}
                >
                  {s.platform === 'Twitter' ? <TwitterIcon /> : <LinkedInIcon />}
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="mb-4 text-[22px] font-semibold text-white">{navigate.heading}</h3>
            <ul className="space-y-[5px]">
              {navigate.links.map((link) => (
                <li key={link.url}>
                  {'external' in link && link.external ? (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-white transition-colors hover:text-[#ed0221]">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.url} className="text-sm text-white transition-colors hover:text-[#ed0221]">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h3 className="mb-4 text-[22px] font-semibold text-white">{contact.heading}</h3>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-white transition-colors hover:text-[#ed0221]">
                  <MailIcon />
                  {contact.email}
                </a>
              </li>
              {contact.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-white transition-colors hover:text-[#ed0221]">
                    <PhoneIcon />
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-3">
        <div className="onix-container text-center">
          <p className="text-base font-light text-white">{LIVE_FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  )
}

function TwitterIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  )
}
