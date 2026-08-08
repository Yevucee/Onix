import { LIVE_HOMEPAGE } from '@/data/live-site'
import { OnixButton } from '@/components/onix/OnixButton'

export function ContactCTA() {
  const { heading, tagline, url } = LIVE_HOMEPAGE.contactCta

  return (
    <section className="py-[100px] text-center">
      <div className="onix-content px-6">
        <h2 className="onix-heading-dark text-[40px] font-semibold">{heading}</h2>
        <div className="mx-auto my-2 h-1 w-12 bg-[var(--onix-red)]" />
        <p className="mt-4 text-base text-[var(--onix-body)]">{tagline}</p>
        <OnixButton variant="primary-red" href={url} className="mt-8" icon={<span aria-hidden>→</span>}>
          Contact us
        </OnixButton>
      </div>
    </section>
  )
}
