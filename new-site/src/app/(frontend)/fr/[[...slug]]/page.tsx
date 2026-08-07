import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container, Section } from '@/components/layout/Container'
import { ContactForm } from '@/components/forms/ContactForm'
import { PageBlocksRenderer } from '@/components/pages/PageBlocksRenderer'
import { getPayloadClient } from '@/lib/payload'
import { pathFromSlugSegments, resolvePublicPath } from '@/lib/page-resolver'
import { buildMetadata } from '@/lib/seo'

const FRENCH_PATH_MAP: Record<string, string> = {
  '': '/',
  'home-francais': '/fr/home-francais/',
  'contactez-nous': '/fr/contactez-nous/',
  'a-propos': '/fr/a-propos/',
  'about-us': '/fr/a-propos/',
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const key = slug.join('/')
  const legacyPath = FRENCH_PATH_MAP[key] || pathFromSlugSegments(slug.map((s) => `fr/${s}`))
  const payload = await getPayloadClient()

  const page = await payload.find({
    collection: 'pages',
    where: { 'legacy.legacyPath': { equals: legacyPath } },
    locale: 'fr',
    limit: 1,
  })

  const doc = page.docs[0]
  return buildMetadata(
    {
      title: doc?.seo?.title,
      description: doc?.seo?.description,
      canonicalUrl: doc?.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/fr/${key}`,
    },
    doc?.title || 'Onix Data Centre',
  )
}

export default async function FrenchCatchAll({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const key = slug.join('/')

  if (key === 'contactez-nous') {
    return (
      <>
        <Section className="border-b">
          <Container>
            <Breadcrumbs items={[{ label: 'Accueil', href: '/fr/' }, { label: 'Contactez-nous' }]} />
            <h1 className="mt-6 text-4xl font-semibold">Contactez-nous</h1>
          </Container>
        </Section>
        <Section>
          <Container className="max-w-xl">
            <ContactForm />
          </Container>
        </Section>
      </>
    )
  }

  const legacyPath = FRENCH_PATH_MAP[key] || `/fr/${key ? `${key}/` : ''}`
  const payload = await getPayloadClient()
  const resolved = await resolvePublicPath(payload, legacyPath, 'fr')

  if (!resolved || resolved.type !== 'page') {
    if (key === '' || key === 'home-francais') {
      const home = await payload.find({
        collection: 'pages',
        where: { 'legacy.legacyPath': { equals: '/fr/home-francais/' } },
        locale: 'fr',
        limit: 1,
      })
      if (home.docs[0]) {
        return (
          <>
            <PageBlocksRenderer blocks={home.docs[0].blocks} />
          </>
        )
      }
    }
    notFound()
  }

  return (
    <>
      <Section className="border-b">
        <Container>
          <Breadcrumbs items={[{ label: 'Accueil', href: '/fr/' }, { label: resolved.doc.title }]} />
        </Container>
      </Section>
      <PageBlocksRenderer blocks={resolved.doc.blocks} />
    </>
  )
}
