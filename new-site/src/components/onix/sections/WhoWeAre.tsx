import { LIVE_HOMEPAGE } from '@/data/live-site'
import { OnixButton } from '@/components/onix/OnixButton'

export function WhoWeAre() {
  const { heading, body } = LIVE_HOMEPAGE.whoWeAre

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="onix-container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="onix-heading-dark text-[40px] font-semibold leading-[48px]">{heading}</h2>
            {body.split('\n\n').map((para, i) => (
              <p key={i} className="mt-4 text-base leading-[22.4px] text-[var(--onix-body)]">
                {para}
              </p>
            ))}
            <OnixButton variant="primary-red" href="/o-home/about-us" className="mt-8" icon={<span aria-hidden>→</span>}>
              Learn more
            </OnixButton>
          </div>
          <div className="relative aspect-[4/3] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/onix/collage.png" alt="Onix data centre facility collage" className="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  )
}
