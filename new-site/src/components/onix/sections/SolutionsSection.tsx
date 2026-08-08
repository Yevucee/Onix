import Link from 'next/link'
import { LIVE_HOMEPAGE } from '@/data/live-site'
import { OnixCardIcon, type CardIconName } from '@/components/onix/OnixIcons'

type CardItem = {
  title: string
  body: string
  url: string
  icon: CardIconName
}

type CardSectionProps = {
  heading: string
  intro: string
  items: CardItem[]
  bgImage?: string
  variant?: 'dark-header' | 'light-header'
}

function ServiceCard({ item }: { item: CardItem }) {
  return (
    <Link
      href={item.url}
      className="group flex flex-col items-center bg-[var(--onix-navy)] px-[30px] py-[50px] text-center transition-colors duration-300 hover:bg-[#151b38]"
    >
      <span className="mb-6 text-[var(--onix-red)]">
        <OnixCardIcon name={item.icon} />
      </span>
      <h3 className="text-[40px] font-semibold leading-[48px] text-white">{item.title}</h3>
      <p className="mt-4 text-base leading-[22.4px] text-white/80">{item.body}</p>
      <span className="mt-7 inline-block bg-white px-4 py-2 text-[15px] font-normal text-[var(--onix-navy)] transition-colors group-hover:bg-white/90">
        Learn More
      </span>
    </Link>
  )
}

function CardSection({ heading, intro, items, bgImage, variant = 'dark-header' }: CardSectionProps) {
  if (variant === 'light-header') {
    return (
      <>
        <section className="bg-white py-10 text-center">
          <div className="onix-content px-6">
            <h2 className="text-[40px] font-semibold leading-[1.2] text-[var(--onix-navy)] md:text-[45px] md:leading-[48px]">
              {heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-[22.4px] text-[var(--onix-body)]">{intro}</p>
          </div>
        </section>
        <section className="bg-white pb-20">
          <div className="onix-container">
            <div className="grid gap-0 md:grid-cols-3">{items.map((item) => <ServiceCard key={item.title} item={item} />)}</div>
          </div>
        </section>
      </>
    )
  }

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
          <h2 className="text-[40px] font-semibold leading-[1.2] text-white md:text-[45px] md:leading-[48px]">{heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-[22.4px] text-white/80">{intro}</p>
        </div>
      </section>

      <section className="bg-white pb-20 pt-10">
        <div className="onix-container">
          <div className="grid gap-0 md:grid-cols-3">{items.map((item) => <ServiceCard key={item.title} item={item} />)}</div>
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
  return <CardSection heading={heading} intro={intro} items={items} variant="light-header" />
}
