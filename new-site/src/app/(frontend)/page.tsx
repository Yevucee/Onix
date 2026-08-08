import { OnixHomePage } from '@/components/onix/OnixHomePage'
import { getPayloadClient } from '@/lib/payload'
import { productionCanonical } from '@/lib/canonical'
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
      canonicalUrl: doc?.seo?.canonicalUrl || productionCanonical('/'),
      hreflangPath: '/',
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
    limit: 5,
    depth: 1,
  })

  return <OnixHomePage articles={articles.docs} />
}
