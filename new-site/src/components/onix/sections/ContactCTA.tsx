import Link from 'next/link'
import { LIVE_HOMEPAGE } from '@/data/live-site'

export function ContactCTA() {
  const { heading, tagline, url } = LIVE_HOMEPAGE.contactCta

  return (
    <section className="py-[100px] text-center">
      <div className="onix-content px-6">
        <h2 className="text-[40px] font-semibold text-[var(--onix-navy)]">{heading}</h2>
        <div className="mx-auto my-2 h-1 w-12 bg-[var(--onix-red)]" />
        <p className="mt-4 text-base text-[var(--onix-body)]">{tagline}</p>
        <Link
          href={url}
          className="mt-8 inline-flex items-center gap-[17px] border-2 border-[var(--onix-red)] bg-[var(--onix-red)] px-[55px] py-4 text-base capitalize text-white transition-colors hover:bg-transparent hover:text-[var(--onix-red)]"
        >
          Contact us
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
