import Link from 'next/link'
import Image from 'next/image'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { getMediaUrl } from '@/lib/media-url'
import type { Article, Category, Media } from '@/payload-types'

type ArticleDoc = Pick<Article, 'id' | 'title' | 'slug' | 'excerpt' | 'publishedAt'> & {
  featuredImage?: number | Media | null
  categories?: (number | Category)[] | null
}

function articlePath(article: Pick<Article, 'slug' | 'publishedAt'>): string {
  const d = new Date(article.publishedAt)
  return `/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${article.slug}/`
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function NewsListingTemplate({
  articles,
  categories,
  activeCategory,
  page,
  totalPages,
}: {
  articles: ArticleDoc[]
  categories: Category[]
  activeCategory?: string
  page: number
  totalPages: number
}) {
  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'News' }]} />
        </div>
      </div>

      <section className="bg-white py-12 md:py-16">
        <div className="onix-container">
          <h1 className="onix-heading-dark text-[40px] font-semibold leading-[48px]">News &amp; Insights</h1>
          <p className="mt-4 max-w-2xl text-base leading-[22.4px] text-[var(--onix-body)]">
            Updates on data centre infrastructure, connectivity and digital transformation across Africa.
          </p>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="border-b border-[var(--onix-border,#e5e5e5)] bg-white py-4">
          <div className="onix-container">
            <div className="flex flex-wrap gap-2">
              <CategoryPill href="/news" active={!activeCategory} label="All" />
              {categories.map((cat) => (
                <CategoryPill
                  key={cat.id}
                  href={`/news?category=${cat.slug}`}
                  active={activeCategory === cat.slug}
                  label={cat.name}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {featured && page === 1 && !activeCategory && (
        <section className="bg-white py-8">
          <div className="onix-container">
            <FeaturedArticleCard article={featured} />
          </div>
        </section>
      )}

      <section className="bg-white py-8 md:py-12">
        <div className="onix-container">
          <div className="grid gap-[5px] md:grid-cols-2 lg:grid-cols-3">
            {(page === 1 && !activeCategory ? rest : articles).map((article) => (
              <NewsArticleCard key={article.id} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-6" aria-label="Pagination">
              {page > 1 && (
                <Link
                  href={`/news?page=${page - 1}${activeCategory ? `&category=${activeCategory}` : ''}`}
                  className="inline-flex items-center justify-center border-2 border-[var(--onix-red)] px-6 py-2 text-sm font-medium text-[var(--onix-red)] transition-colors hover:bg-[var(--onix-red)] hover:text-white"
                >
                  Previous
                </Link>
              )}
              <span className="text-sm text-[var(--onix-muted)]">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/news?page=${page + 1}${activeCategory ? `&category=${activeCategory}` : ''}`}
                  className="inline-flex items-center justify-center border-2 border-[var(--onix-red)] px-6 py-2 text-sm font-medium text-[var(--onix-red)] transition-colors hover:bg-[var(--onix-red)] hover:text-white"
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  )
}

function CategoryPill({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-[var(--onix-red)] text-white'
          : 'border border-[var(--onix-border,#e5e5e5)] text-[var(--onix-body)] hover:border-[var(--onix-red)] hover:text-[var(--onix-red)]'
      }`}
    >
      {label}
    </Link>
  )
}

function FeaturedArticleCard({ article }: { article: ArticleDoc }) {
  const path = articlePath(article)
  const imgUrl = getMediaUrl(article.featuredImage, 'article')

  return (
    <Link href={path} className="group relative block overflow-hidden">
      <div className="relative min-h-[320px] w-full bg-[var(--onix-navy)] md:min-h-[420px]">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--onix-navy)] to-[#2a3460]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <time className="text-sm text-white/70">{formatDate(article.publishedAt)}</time>
          <h2 className="mt-2 text-2xl font-semibold leading-[1.2] text-white md:text-4xl">{article.title}</h2>
          {article.excerpt && (
            <p className="mt-3 line-clamp-2 max-w-3xl text-base text-white/80">{article.excerpt}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

function NewsArticleCard({ article }: { article: ArticleDoc }) {
  const path = articlePath(article)
  const imgUrl = getMediaUrl(article.featuredImage, 'card') || getMediaUrl(article.featuredImage, 'article')
  const cats = (article.categories || []).filter((c): c is Category => typeof c === 'object' && c !== null)

  return (
    <Link href={path} className="group block overflow-hidden bg-[var(--onix-navy)]">
      <div className="relative min-h-[220px] w-full">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--onix-navy)] to-[#2a3460]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <time className="text-xs text-white/70">{formatDate(article.publishedAt)}</time>
          <h3 className="mt-1 text-lg font-medium leading-[1.2] text-white">{article.title}</h3>
          {cats.length > 0 && (
            <p className="mt-2 text-xs text-white/60">{cats.map((c) => c.name).join(', ')}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
