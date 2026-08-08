import Link from 'next/link'
import Image from 'next/image'
import { Container, Section } from '@/components/layout/Container'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { Button } from '@/components/ui/Button'
import { LIVE_HOMEPAGE } from '@/data/live-site'

type Article = {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  publishedAt: string
}

export function HomePageView({ articles }: { articles: Article[] }) {
  const { hero, serviceShowcase, whoWeAre, solutions, infrastructure, contactCta } = LIVE_HOMEPAGE

  return (
    <>
      {/* SECTION 1 — HERO */}
      <section className="relative min-h-[28rem] overflow-hidden bg-[var(--color-heading)] text-white md:min-h-[32rem]">
        <Image
          src={hero.backgroundImage}
          alt=""
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-heading)]/90 via-[var(--color-heading)]/70 to-transparent" />
        <Container className="relative z-10 flex min-h-[28rem] items-center py-16 md:min-h-[32rem]">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold text-white md:text-5xl lg:text-6xl">{hero.heading}</h1>
            <p className="mt-6 text-lg text-white/85">{hero.body}</p>
            <div className="mt-8">
              <Button href={hero.ctaUrl} className="bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]">
                {hero.ctaLabel}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 2 — SERVICE SHOWCASE */}
      <Section>
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceShowcase.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="group rounded-[var(--radius-card)] border bg-white p-6 shadow-sm transition hover:border-[var(--color-brand)] hover:shadow-md"
              >
                <h3 className="text-lg font-semibold group-hover:text-[var(--color-brand)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{item.body}</p>
                <span className="mt-4 inline-block text-sm font-medium text-[var(--color-brand)]">Learn More →</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* SECTION 3 — WHO WE ARE */}
      <Section className="bg-[var(--color-background-alt)]">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold">{whoWeAre.heading}</h2>
              {whoWeAre.body.split('\n\n').map((para, i) => (
                <p key={i} className="mt-4 text-[var(--color-muted)]">
                  {para}
                </p>
              ))}
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
              <Image src={whoWeAre.image} alt="Onix data centre facility" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {whoWeAre.stats.map((stat) => (
              <div key={stat.label} className="rounded-[var(--radius-card)] border bg-white p-8 text-center shadow-sm">
                <p className="text-4xl font-semibold text-[var(--color-brand)]">{stat.value}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* SECTION 4 — OUR SOLUTIONS */}
      <Section>
        <Container>
          <h2 className="text-3xl font-semibold">{solutions.heading}</h2>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">{solutions.intro}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {solutions.items.map((item) => (
              <Link key={item.title} href={item.url} className="group rounded-[var(--radius-card)] border bg-white p-8 shadow-sm transition hover:shadow-md">
                <h3 className="text-xl font-semibold group-hover:text-[var(--color-brand)]">{item.title}</h3>
                <p className="mt-3 text-sm text-[var(--color-muted)]">{item.body}</p>
                <span className="mt-6 inline-block text-sm font-medium text-[var(--color-brand)]">Learn More</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* SECTION 5 — INFRASTRUCTURE */}
      <Section className="bg-[var(--color-background-alt)]">
        <Container>
          <h2 className="text-3xl font-semibold">{infrastructure.heading}</h2>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">{infrastructure.intro}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {infrastructure.items.map((item) => (
              <Link key={item.title} href={item.url} className="group rounded-[var(--radius-card)] border bg-white p-8 shadow-sm transition hover:shadow-md">
                <h3 className="text-xl font-semibold group-hover:text-[var(--color-brand)]">{item.title}</h3>
                <p className="mt-3 text-sm text-[var(--color-muted)]">{item.body}</p>
                <span className="mt-6 inline-block text-sm font-medium text-[var(--color-brand)]">Learn More</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* SECTION 6 — NEWS / ARTICLES */}
      {articles.length > 0 && (
        <Section>
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-3xl font-semibold">Latest from Onix</h2>
              <Link href="/news" className="text-sm font-medium text-[var(--color-brand)] hover:underline">
                View all
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {articles.map((article) => {
                const d = new Date(article.publishedAt)
                const path = `/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${article.slug}/`
                return (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    href={path}
                    excerpt={article.excerpt || undefined}
                    date={article.publishedAt}
                  />
                )
              })}
            </div>
          </Container>
        </Section>
      )}

      {/* SECTION 7 — CONTACT CTA */}
      <section className="bg-[var(--color-heading)] py-16 text-white">
        <Container className="text-center">
          <h2 className="text-3xl font-semibold text-white">{contactCta.heading}</h2>
          <p className="mt-3 text-lg text-white/80">{contactCta.tagline}</p>
          <div className="mt-8">
            <Button href={contactCta.url} className="bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]">
              Contact Us
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
