import { HomePageView } from '@/components/home/HomePageView'
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
      title: doc?.seo?.title || 'Onix Data Centre – Connecting Africa to the Globe',
      description: doc?.seo?.description || 'Onix is the leading provider of Tier IV Colocation data centre services in Ghana.',
      canonicalUrl: doc?.seo?.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL,
    },
    'Onix Data Centre',
  )
}

export default async function HomePage() {
  const payload = await getPayloadClient()
  const articles = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 4,
  })

  // Homepage uses dedicated live-site reconstruction (HomePageView).
  // Do NOT render migrated CMS blocks — they contain flattened Elementor
  // template/footer content (see visual-rebuild/global-template-migration-bug.md).
  return <HomePageView articles={articles.docs} />
}
