import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container, Section } from '@/components/layout/Container'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(
    { title: 'News & Insights', description: 'Latest news and insights from Onix Data Centre' },
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
  })

  const categories = await payload.find({ collection: 'categories', limit: 20, sort: 'name' })

  return (
    <>
      <Section className="border-b border-[var(--color-border)]">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'News' }]} />
          <h1 className="text-4xl font-semibold text-[var(--color-heading)]">News &amp; Insights</h1>
          <p className="mt-4 max-w-2xl text-[var(--color-muted)]">
            Updates on data centre infrastructure, connectivity and digital transformation across Africa.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          {categories.docs.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <Link
                href="/news"
                className={`rounded-full px-4 py-1 text-sm ${!categorySlug ? 'bg-[var(--color-brand)] text-white' : 'border border-[var(--color-border)]'}`}
              >
                All
              </Link>
              {categories.docs.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/news?category=${cat.slug}`}
                  className={`rounded-full px-4 py-1 text-sm ${categorySlug === cat.slug ? 'bg-[var(--color-brand)] text-white' : 'border border-[var(--color-border)]'}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((article) => {
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

          {result.totalPages > 1 && (
            <nav className="mt-10 flex justify-center gap-4" aria-label="Pagination">
              {page > 1 && (
                <Link href={`/news?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}`} className="text-[var(--color-brand)]">
                  Previous
                </Link>
              )}
              <span className="text-sm text-[var(--color-muted)]">
                Page {page} of {result.totalPages}
              </span>
              {page < result.totalPages && (
                <Link href={`/news?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}`} className="text-[var(--color-brand)]">
                  Next
                </Link>
              )}
            </nav>
          )}
        </Container>
      </Section>
    </>
  )
}
