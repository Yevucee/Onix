import { NewsListingTemplate } from '@/components/onix/templates/NewsListingTemplate'
import { getPayloadClient } from '@/lib/payload'
import { productionCanonical } from '@/lib/canonical'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildMetadata(
    {
      title: 'News & Insights',
      description: 'Latest news and insights from Onix Data Centre',
      canonicalUrl: productionCanonical('/news'),
    },
    'News',
  )
}

type Props = { searchParams: Promise<{ page?: string; category?: string }> }

export default async function NewsPage({ searchParams }: Props) {
  const { page: pageParam, category: categorySlug } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const limit = 12

  const payload = await getPayloadClient()
  const categoryFilter = categorySlug
    ? await payload.find({ collection: 'categories', where: { slug: { equals: categorySlug } }, limit: 1 })
    : null
  const categoryId = categoryFilter?.docs[0]?.id

  const result = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { _status: { equals: 'published' } },
        ...(categoryId ? [{ categories: { contains: categoryId } }] : []),
      ],
    },
    sort: '-publishedAt',
    page,
    limit,
    depth: 1,
  })

  const categories = await payload.find({ collection: 'categories', limit: 20, sort: 'name' })

  return (
    <NewsListingTemplate
      articles={result.docs}
      categories={categories.docs}
      activeCategory={categorySlug}
      page={page}
      totalPages={result.totalPages}
    />
  )
}
