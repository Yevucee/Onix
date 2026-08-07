import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container, Section } from '@/components/layout/Container'
import { ArticleHero } from '@/components/sections/Hero'
import { LexicalContent } from '@/components/articles/LexicalContent'
import { getPayloadClient } from '@/lib/payload'
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
  })
  const article = result.docs[0]
  if (!article) return buildMetadata({}, 'Article')

  const featured =
    typeof article.featuredImage === 'object' && article.featuredImage?.url ? article.featuredImage.url : undefined

  return buildMetadata(
    {
      title: article.seo?.title,
      description: article.seo?.description,
      canonicalUrl:
        article.seo?.canonicalUrl ||
        `${process.env.NEXT_PUBLIC_SITE_URL}/${year}/${month}/${day}/${slug}/`,
      ogImageUrl:
        (typeof article.seo?.ogImage === 'object' && article.seo?.ogImage?.url) ||
        featured ||
        undefined,
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
  })
  const article = result.docs[0]
  if (!article) notFound()

  const published = new Date(article.publishedAt)
  const expectedPath = `/${published.getFullYear()}/${String(published.getMonth() + 1).padStart(2, '0')}/${String(published.getDate()).padStart(2, '0')}/${slug}/`
  const requestedPath = `/${year}/${month}/${day}/${slug}/`
  if (expectedPath !== requestedPath && article.legacy?.legacyPath !== requestedPath) {
    notFound()
  }

  const featured =
    typeof article.featuredImage === 'object' && article.featuredImage?.url
      ? article.featuredImage
      : null

  const categories = Array.isArray(article.categories)
    ? article.categories.filter((c) => typeof c === 'object' && c !== null)
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    description: article.excerpt || article.seo?.description,
    image: featured?.url,
    mainEntityOfPage: `${process.env.NEXT_PUBLIC_SITE_URL}${expectedPath}`,
    publisher: {
      '@type': 'Organization',
      name: 'Onix Data Centre',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'News', href: '/news' },
              { label: article.title },
            ]}
          />
          <ArticleHero title={article.title} date={article.publishedAt} />
          {categories.length > 0 && (
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              {categories.map((cat) => (
                <span key={cat.id} className="mr-2 rounded-full border px-3 py-1">
                  {cat.name}
                </span>
              ))}
            </p>
          )}
        </Container>
      </Section>
      {featured?.url && (
        <Section className="pb-0">
          <Container className="max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)]">
              <Image
                src={featured.url}
                alt={featured.alt || article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>
          </Container>
        </Section>
      )}
      <Section>
        <Container className="prose max-w-3xl">
          {article.excerpt && <p className="lead text-lg text-[var(--color-muted)]">{article.excerpt}</p>}
          <LexicalContent
            content={article.content}
            blocks={(article.legacy?.migrationBlocks as Parameters<typeof LexicalContent>[0]['blocks']) || undefined}
          />
        </Container>
      </Section>
    </>
  )
}
