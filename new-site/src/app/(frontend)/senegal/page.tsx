import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container, Section } from '@/components/layout/Container'
import { CTASection, PageHero } from '@/components/sections/Hero'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'data-centres', where: { slug: { equals: 'senegal' } }, limit: 1 })
  const doc = result.docs[0]
  if (!doc) return buildMetadata({}, 'Senegal')
  return buildMetadata(
    {
      title: doc.seo?.title,
      description: doc.seo?.description,
      canonicalUrl: doc.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/senegal`,
    },
    doc.name,
  )
}

export default async function SenegalDataCentrePage() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'data-centres', where: { slug: { equals: 'senegal' } }, limit: 1 })
  const dc = result.docs[0]
  if (!dc) notFound()

  return (
    <>
      <Section className="border-b border-[var(--color-border)]">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Data Centres', href: '/senegal' }, { label: dc.name }]} />
          <PageHero title={dc.name} intro={dc.summary || undefined} />
        </Container>
      </Section>

      {dc.stats && dc.stats.length > 0 && (
        <Section className="bg-[var(--color-background-alt)]">
          <Container>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {dc.stats.map((stat) => (
                <div key={stat.label} className="rounded-[var(--radius-card)] border bg-white p-6 text-center">
                  <p className="text-3xl font-semibold text-[var(--color-brand)]">{stat.value}</p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container className="max-w-3xl space-y-6 text-[var(--color-muted)]">
          {dc.certifications && dc.certifications.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-heading)]">Certifications</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                {dc.certifications.map((cert) => (
                  <li key={cert.title}>{cert.title}</li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </Section>

      <CTASection
        heading={dc.cta?.heading || 'Discuss Senegal facility requirements'}
        body={dc.cta?.body || 'Contact our team to learn more about Onix in Senegal.'}
        buttonLabel={dc.cta?.buttonLabel || 'Contact us'}
        buttonUrl={dc.cta?.buttonUrl || '/about-us'}
      />
    </>
  )
}
