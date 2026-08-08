import Link from 'next/link'
import Image from 'next/image'
import { LIVE_HOMEPAGE } from '@/data/live-site'

export function WhoWeAre() {
  const { heading, body, image } = LIVE_HOMEPAGE.whoWeAre

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="onix-container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[40px] font-semibold leading-[48px] text-[var(--onix-navy)]">{heading}</h2>
            {body.split('\n\n').map((para, i) => (
              <p key={i} className="mt-4 text-base leading-[22.4px] text-[var(--onix-body)]">
                {para}
              </p>
            ))}
            <Link
              href="/o-home/about-us"
              className="mt-8 inline-flex items-center gap-[17px] border-2 border-[var(--onix-red)] bg-[var(--onix-red)] px-[55px] py-4 text-base text-white transition-colors hover:bg-transparent hover:text-[var(--onix-red)]"
            >
              Learn more
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image src={image} alt="Onix data centre facility collage" fill className="object-contain" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </div>
    </section>
  )
}
