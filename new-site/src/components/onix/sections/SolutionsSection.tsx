import Link from 'next/link'
import { LIVE_HOMEPAGE } from '@/data/live-site'
import { OnixCardIcon, type CardIconName } from '@/components/onix/OnixIcons'
import { OnixButton } from '@/components/onix/OnixButton'

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
    <div className="group flex flex-col items-center bg-[var(--onix-navy)] px-[30px] py-[50px] text-center transition-colors duration-300 hover:bg-[#151b38]">
      <span className="mb-6 text-[var(--onix-red)]">
        <OnixCardIcon name={item.icon} />
      </span>
      <h3 className="onix-heading-light text-[40px] font-semibold leading-[48px]">{item.title}</h3>
      <p className="mt-4 text-base leading-[22.4px] text-white/80">{item.body}</p>
      <OnixButton variant="solid-white" href={item.url} className="mt-7">
        Learn More
      </OnixButton>
    </div>
  )
}

function CardSection({ heading, intro, items, bgImage, variant = 'dark-header' }: CardSectionProps) {
  if (variant === 'light-header') {
    return (
      <>
        <section className="bg-white py-10 text-center">
          <div className="onix-content px-6">
            <h2 className="onix-heading-dark text-[40px] font-semibold leading-[1.2] md:text-[45px] md:leading-[48px]">
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
          <h2 className="onix-heading-light text-[40px] font-semibold leading-[1.2] md:text-[45px] md:leading-[48px]">{heading}</h2>
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
