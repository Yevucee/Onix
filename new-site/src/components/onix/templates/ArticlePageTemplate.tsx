import Image from 'next/image'
import Link from 'next/link'
import { LexicalContent } from '@/components/articles/LexicalContent'
import type { ArticleBlock } from '@/components/articles/ArticleBlocksRenderer'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { getMediaUrl } from '@/lib/media-url'
import { articleSchema, breadcrumbSchema } from '@/lib/schema'
import type { Article, Category, Media } from '@/payload-types'

type ArticleDoc = Article & {
  featuredImage?: number | Media | null
  categories?: (number | Category)[] | null
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ArticlePageTemplate({
  article,
  articlePath,
  relatedArticles,
}: {
  article: ArticleDoc
  articlePath: string
  relatedArticles?: Array<Pick<Article, 'id' | 'title' | 'slug' | 'publishedAt'>>
}) {
  const featured =
    typeof article.featuredImage === 'object' && article.featuredImage?.url ? article.featuredImage : null
  const featuredUrl = getMediaUrl(article.featuredImage, 'article')

  const categories = Array.isArray(article.categories)
    ? article.categories.filter((c): c is Category => typeof c === 'object' && c !== null)
    : []

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news' },
    { label: article.title },
  ]

  const jsonLd = [
    articleSchema({
      title: article.title,
      description: article.excerpt || article.seo?.description || undefined,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      imageUrl: featuredUrl,
      url: articlePath,
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'News', url: '/news' },
      { name: article.title, url: articlePath },
    ]),
  ]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <article>
        <header className="bg-white py-10 md:py-14">
          <div className="onix-content px-6">
            <time className="text-sm text-[var(--onix-muted)]" dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            <h1 className="onix-heading-dark mt-3 text-[32px] font-semibold leading-[1.2] md:text-[40px] md:leading-[48px]">
              {article.title}
            </h1>
            {categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/news?category=${cat.slug}`}
                    className="rounded-full border border-[var(--onix-border,#e5e5e5)] px-3 py-1 text-xs text-[var(--onix-body)] hover:border-[var(--onix-red)] hover:text-[var(--onix-red)]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
            {article.excerpt && (
              <p className="mt-6 text-lg leading-[28px] text-[var(--onix-body)]">{article.excerpt}</p>
            )}
          </div>
        </header>

        {featuredUrl && (
          <div className="bg-white pb-8">
            <div className="onix-content px-6">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={featuredUrl}
                  alt={featured?.alt || article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1040px) 100vw, 1040px"
                  priority
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white py-10 md:py-14">
          <div className="onix-article-content onix-content px-6">
            <LexicalContent
              content={article.content}
              blocks={(article.legacy?.migrationBlocks as ArticleBlock[]) || undefined}
            />
          </div>
        </div>

        {relatedArticles && relatedArticles.length > 0 && (
          <aside className="border-t border-[var(--onix-border,#e5e5e5)] bg-[var(--onix-bg-alt)] py-12 md:py-16">
            <div className="onix-container">
              <h2 className="onix-heading-dark mb-8 text-[28px] font-semibold">Related articles</h2>
              <ul className="grid gap-6 md:grid-cols-3">
                {relatedArticles.map((related) => {
                  const d = new Date(related.publishedAt)
                  const path = `/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${related.slug}/`
                  return (
                    <li key={related.id}>
                      <Link href={path} className="text-base font-medium text-[var(--onix-red)] hover:underline">
                        {related.title}
                      </Link>
                      <time className="mt-1 block text-sm text-[var(--onix-muted)]">{formatDate(related.publishedAt)}</time>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>
        )}
      </article>

      <OnixPageCTA
        heading="Get in touch with us today"
        body="Speak with our team about colocation, connectivity and managed services."
        buttonLabel="Contact us"
        buttonUrl="/contact-us"
      />
    </>
  )
}
