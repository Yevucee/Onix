import { Container, Section } from '../layout/Container'
import { Button } from '../ui/Button'

export type HeroProps = {
  eyebrow?: string
  heading: string
  subheading?: string
  imageUrl?: string
  ctaLabel?: string
  ctaUrl?: string
}

export function Hero({ eyebrow, heading, subheading, imageUrl, ctaLabel, ctaUrl }: HeroProps) {
  return (
    <Section className="bg-[var(--color-background-alt)]">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-brand)]">{eyebrow}</p>}
          <h1 className="text-4xl font-semibold md:text-5xl">{heading}</h1>
          {subheading && <p className="mt-4 max-w-xl text-lg text-[var(--color-muted)]">{subheading}</p>}
          {ctaLabel && ctaUrl && (
            <div className="mt-8">
              <Button href={ctaUrl}>{ctaLabel}</Button>
            </div>
          )}
        </div>
        {imageUrl && (
          <div className="overflow-hidden rounded-[var(--radius-card)] shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </Container>
    </Section>
  )
}

export function PageHero({ title, intro }: { title: string; intro?: string }) {
  return (
    <Section className="border-b border-[var(--color-border)] bg-white">
      <Container>
        <h1 className="text-4xl font-semibold">{title}</h1>
        {intro && <p className="mt-4 max-w-3xl text-lg text-[var(--color-muted)]">{intro}</p>}
      </Container>
    </Section>
  )
}

export function ArticleHero({ title, date, category }: { title: string; date?: string; category?: string }) {
  return (
    <Section className="border-b border-[var(--color-border)]">
      <Container>
        <div className="max-w-3xl">
          {category && <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-brand)]">{category}</p>}
          <h1 className="mt-2 text-4xl font-semibold">{title}</h1>
          {date && (
            <time className="mt-4 block text-sm text-[var(--color-muted)]" dateTime={date}>
              {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          )}
        </div>
      </Container>
    </Section>
  )
}

export function CTASection({ heading, body, buttonLabel, buttonUrl }: { heading?: string; body?: string; buttonLabel: string; buttonUrl: string }) {
  return (
    <Section className="bg-[var(--color-heading)] text-white">
      <Container className="text-center">
        {heading && <h2 className="text-3xl font-semibold text-white">{heading}</h2>}
        {body && <p className="mx-auto mt-4 max-w-2xl text-white/80">{body}</p>}
        <div className="mt-8">
          <Button href={buttonUrl} className="bg-white text-[var(--color-heading)] hover:bg-white/90">
            {buttonLabel}
          </Button>
        </div>
      </Container>
    </Section>
  )
}
