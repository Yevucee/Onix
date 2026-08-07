import { Container, Section } from '@/components/layout/Container'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { CTASection, Hero } from '@/components/sections/Hero'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const payload = await getPayloadClient()
  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })
  const doc = page.docs[0]
  return buildMetadata(
    {
      title: doc?.seo?.title,
      description: doc?.seo?.description,
      canonicalUrl: doc?.seo?.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL,
    },
    'Onix Data Centre',
  )
}

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [page, articles] = await Promise.all([
    payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 }),
    payload.find({ collection: 'articles', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 3 }),
  ])

  const home = page.docs[0]
  const heroBlock = home?.blocks?.find((b) => b.blockType === 'hero')

  return (
    <>
      <Hero
        eyebrow={heroBlock?.eyebrow || 'Connecting Africa to the Globe'}
        heading={heroBlock?.heading || home?.title || 'Carrier-neutral data centre infrastructure for Africa'}
        subheading={
          heroBlock?.subheading ||
          'Secure, resilient colocation, cloud connectivity and peering from Ghana — built for enterprises, carriers and public sector organisations across the continent.'
        }
        ctaLabel={heroBlock?.ctaLabel || 'Explore our solutions'}
        ctaUrl={heroBlock?.ctaUrl || '/about-us'}
      />

      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: 'Colocation', body: 'Tier IV-aligned facilities with resilient power, cooling and security.' },
              { title: 'Connectivity', body: 'Carrier-neutral access, internet exchange and cloud on-ramps.' },
              { title: 'Managed services', body: 'Expert support for mission-critical digital infrastructure.' },
            ].map((item) => (
              <div key={item.title} className="rounded-[var(--radius-card)] border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm text-[var(--color-muted)]">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {articles.docs.length > 0 && (
        <Section className="bg-[var(--color-background-alt)]">
          <Container>
            <h2 className="text-3xl font-semibold">Latest insights</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {articles.docs.map((article) => {
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

      <CTASection
        heading="Ready to discuss your infrastructure requirements?"
        body="Speak with our team about colocation, connectivity and managed services at Onix Data Centre."
        buttonLabel="Contact us"
        buttonUrl="/about-us"
      />
    </>
  )
}
