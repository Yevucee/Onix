import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container, Section } from '@/components/layout/Container'
import { CTASection, PageHero } from '@/components/sections/Hero'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'pages', where: { slug: { equals: 'about-us' } }, limit: 1 })
  const doc = result.docs[0]
  if (!doc) return buildMetadata({}, 'About Us')
  return buildMetadata(
    {
      title: doc.seo?.title,
      description: doc.seo?.description,
      canonicalUrl: doc.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/about-us`,
    },
    doc.title,
  )
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'pages', where: { slug: { equals: 'about-us' } }, limit: 1 })
  const page = result.docs[0]
  if (!page) notFound()

  return (
    <>
      <Section className="border-b border-[var(--color-border)]">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: page.title }]} />
          <PageHero title={page.title} intro={page.blocks?.find((b) => b.blockType === 'richText') ? undefined : 'About Onix Data Centre'} />
        </Container>
      </Section>

      <Section>
        <Container className="prose max-w-3xl">
          {page.blocks?.map((block, index) => {
            if (block.blockType === 'richText' && block.body) {
              return <div key={index} dangerouslySetInnerHTML={{ __html: String(block.body) }} />
            }
            if (block.blockType === 'imageText') {
              return (
                <div key={index} className="my-10 grid gap-8 md:grid-cols-2">
                  <div>
                    <h2 className="text-2xl font-semibold">{block.heading}</h2>
                    <p className="mt-4 text-[var(--color-muted)]">{block.body}</p>
                  </div>
                </div>
              )
            }
            return null
          })}
        </Container>
      </Section>

      <CTASection heading="Partner with Onix" body="Learn how our infrastructure supports your organisation." buttonLabel="Contact us" buttonUrl="/about-us" />
    </>
  )
}
