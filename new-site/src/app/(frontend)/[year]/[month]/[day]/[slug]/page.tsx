import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container, Section } from '@/components/layout/Container'
import { ArticleHero } from '@/components/sections/Hero'
import { getPayloadClient } from '@/lib/payload'
import { LexicalContent } from '@/components/articles/LexicalContent'
import { buildMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ year: string; month: string; day: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { year, month, day, slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'articles', where: { slug: { equals: slug } }, limit: 1 })
  const article = result.docs[0]
  if (!article) return buildMetadata({}, 'Article')
  return buildMetadata(
    {
      title: article.seo?.title,
      description: article.seo?.description,
      canonicalUrl:
        article.seo?.canonicalUrl ||
        `${process.env.NEXT_PUBLIC_SITE_URL}/${year}/${month}/${day}/${slug}/`,
    },
    article.title,
  )
}

export default async function ArticlePage({ params }: Props) {
  const { year, month, day, slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'articles', where: { slug: { equals: slug } }, limit: 1 })
  const article = result.docs[0]
  if (!article) notFound()

  const published = new Date(article.publishedAt)
  const expectedPath = `/${published.getFullYear()}/${String(published.getMonth() + 1).padStart(2, '0')}/${String(published.getDate()).padStart(2, '0')}/${slug}/`
  const requestedPath = `/${year}/${month}/${day}/${slug}/`
  if (expectedPath !== requestedPath && article.legacy?.legacyPath !== requestedPath) {
    notFound()
  }

  return (
    <>
      <Section>
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'News', href: '/' }, { label: article.title }]} />
          <ArticleHero title={article.title} date={article.publishedAt} />
        </Container>
      </Section>
      <Section>
        <Container className="prose max-w-3xl">
          {article.excerpt && <p className="lead text-lg text-[var(--color-muted)]">{article.excerpt}</p>}
          <div><LexicalContent content={article.content} /></div>
        </Container>
      </Section>
    </>
  )
}
