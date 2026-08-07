import Image from 'next/image'
import type { DataCentre } from '@/payload-types'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container, Section } from '@/components/layout/Container'
import { CTASection } from '@/components/sections/Hero'
import { StatisticsGrid } from '@/components/sections/ContentSections'
import { getMediaAlt, getMediaUrl } from '@/lib/media-url'
import { LexicalContent } from '@/components/articles/LexicalContent'

type Crumb = { label: string; href?: string }

export function DataCentreTemplate({ centre, breadcrumbs }: { centre: DataCentre; breadcrumbs: Crumb[] }) {
  const heroImage = getMediaUrl(centre.heroImage, 'hero')

  return (
    <>
      <Section className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-brand)]">
                {[centre.city, centre.country].filter(Boolean).join(', ')}
              </p>
              <h1 className="mt-2 text-4xl font-semibold">{centre.name}</h1>
              {centre.summary && <p className="mt-4 text-lg text-[var(--color-muted)]">{centre.summary}</p>}
            </div>
            {heroImage && (
              <Image src={heroImage} alt={getMediaAlt(centre.heroImage, centre.name)} width={800} height={500} className="rounded-[var(--radius-card)] object-cover" />
            )}
          </div>
        </Container>
      </Section>

      {centre.stats?.length ? (
        <Section>
          <Container>
            <StatisticsGrid items={centre.stats} />
          </Container>
        </Section>
      ) : null}

      {centre.description && (
        <Section className="bg-[var(--color-background-alt)]">
          <Container className="prose max-w-3xl">
            <LexicalContent content={centre.description} />
          </Container>
        </Section>
      )}

      {centre.certifications?.length ? (
        <Section>
          <Container>
            <h2 className="mb-6 text-2xl font-semibold">Certifications</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {centre.certifications.map((cert, i) => (
                <li key={i} className="rounded-[var(--radius-card)] border bg-white p-4">
                  <p className="font-medium">{cert.title}</p>
                  {cert.description && <p className="mt-1 text-sm text-[var(--color-muted)]">{cert.description}</p>}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {centre.cta?.heading && (
        <CTASection
          heading={centre.cta.heading}
          body={centre.cta.body || undefined}
          buttonLabel={centre.cta.buttonLabel || 'Contact us'}
          buttonUrl={centre.cta.buttonUrl || '/contact-us'}
        />
      )}
    </>
  )
}
