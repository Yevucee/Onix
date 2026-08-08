import Link from 'next/link'
import { LIVE_HOMEPAGE } from '@/data/live-site'

type CardSectionProps = {
  heading: string
  intro: string
  items: Array<{ title: string; body: string; url: string }>
  bgImage?: string
}

function CardSection({ heading, intro, items, bgImage }: CardSectionProps) {
  return (
    <>
      <section
        className="relative py-20 text-center"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[var(--onix-navy)]/91" />
        <div className="onix-content relative z-10 px-6">
          <h2 className="text-[40px] font-semibold leading-[1.2] text-white">{heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-[22.4px] text-white/80">{intro}</p>
        </div>
      </section>

      <section className="bg-white pb-20 pt-10">
        <div className="onix-container">
          <div className="grid gap-0 md:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="group flex flex-col items-center border border-[#e8e8e8] bg-white px-[30px] py-[50px] text-center shadow-[-1px_0_20px_rgba(0,0,0,0.11)] transition-all duration-500 hover:bg-[var(--onix-navy)]"
              >
                <h3
                  className="text-[1.4em] font-semibold leading-7 tracking-[1.3px] text-[var(--onix-navy)] transition-colors group-hover:text-[var(--onix-red)]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-[1.4] text-[var(--onix-body)] transition-colors group-hover:text-white/80">
                  {item.body}
                </p>
                <span className="mt-7 inline-block bg-[var(--onix-navy)] px-4 py-2 text-[0.8em] font-medium tracking-[1px] text-[var(--onix-red)] transition-colors group-hover:bg-[var(--onix-red)] group-hover:text-white">
                  Learn More
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export function SolutionsSection() {
  const { heading, intro, items } = LIVE_HOMEPAGE.solutions
  return <CardSection heading={heading} intro={intro} items={items} bgImage="/images/onix/solutions-bg.jpg" />
}

export function InfrastructureSection() {
  const { heading, intro, items } = LIVE_HOMEPAGE.infrastructure
  return (
    <>
      <section className="bg-white py-10 text-center">
        <div className="onix-content px-6">
          <h2 className="text-[40px] font-semibold leading-[1.2] text-[var(--onix-navy)]">{heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-[22.4px] text-[var(--onix-body)]">{intro}</p>
        </div>
      </section>
      <section className="bg-white pb-20">
        <div className="onix-container">
          <div className="grid gap-0 md:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="group flex flex-col items-center border border-[#e8e8e8] bg-white px-[30px] py-[50px] text-center shadow-[-1px_0_20px_rgba(0,0,0,0.11)] transition-all duration-500 hover:bg-[var(--onix-navy)]"
              >
                <h3
                  className="text-[1.4em] font-semibold leading-7 tracking-[1.3px] text-[var(--onix-navy)] transition-colors group-hover:text-[var(--onix-red)]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-[1.4] text-[var(--onix-body)] transition-colors group-hover:text-white/80">
                  {item.body}
                </p>
                <span className="mt-7 inline-block bg-[var(--onix-navy)] px-4 py-2 text-[0.8em] font-medium tracking-[1px] text-[var(--onix-red)] transition-colors group-hover:bg-[var(--onix-red)] group-hover:text-white">
                  Learn More
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
