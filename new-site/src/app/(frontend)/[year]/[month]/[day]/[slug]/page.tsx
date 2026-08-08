import { notFound } from 'next/navigation'
import { ArticlePageTemplate } from '@/components/onix/templates/ArticlePageTemplate'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media-url'
import { productionCanonical } from '@/lib/canonical'
import { buildMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ year: string; month: string; day: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { year, month, day, slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 1,
  })
  const article = result.docs[0]
  if (!article) return buildMetadata({}, 'Article')

  const featuredUrl = getMediaUrl(article.featuredImage, 'article')
  const ogFromSeo =
    typeof article.seo?.ogImage === 'object' && article.seo?.ogImage?.url ? article.seo.ogImage.url : undefined

  return buildMetadata(
    {
      title: article.seo?.title,
      description: article.seo?.description,
      canonicalUrl: article.seo?.canonicalUrl || productionCanonical(`/${year}/${month}/${day}/${slug}`),
      ogImageUrl: ogFromSeo || featuredUrl,
    },
    article.title,
  )
}

export default async function ArticlePage({ params }: Props) {
  const { year, month, day, slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  const article = result.docs[0]
  if (!article) notFound()

  const published = new Date(article.publishedAt)
  const expectedPath = `/${published.getFullYear()}/${String(published.getMonth() + 1).padStart(2, '0')}/${String(published.getDate()).padStart(2, '0')}/${slug}/`
  const requestedPath = `/${year}/${month}/${day}/${slug}/`
  if (expectedPath !== requestedPath && article.legacy?.legacyPath !== requestedPath) {
    notFound()
  }

  const categoryIds = Array.isArray(article.categories)
    ? article.categories.map((c) => (typeof c === 'object' ? c.id : c)).filter(Boolean)
    : []

  let relatedArticles: typeof result.docs = []
  if (categoryIds.length > 0) {
    const related = await payload.find({
      collection: 'articles',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { id: { not_equals: article.id } },
          { categories: { in: categoryIds } },
        ],
      },
      sort: '-publishedAt',
      limit: 3,
    })
    relatedArticles = related.docs
  }

  return (
    <ArticlePageTemplate
      article={article}
      articlePath={expectedPath}
      relatedArticles={relatedArticles}
    />
  )
}
