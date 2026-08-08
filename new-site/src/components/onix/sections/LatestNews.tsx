import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/media-url'
import type { Article, Media } from '@/payload-types'

type ArticleDoc = Pick<Article, 'id' | 'title' | 'slug' | 'excerpt' | 'publishedAt'> & {
  featuredImage?: number | Media | null
}

export function LatestNews({ articles }: { articles: ArticleDoc[] }) {
  if (!articles.length) return null

  return (
    <section className="bg-white py-0">
      <div className="onix-container py-8">
        <div className="mb-6 text-center">
          <Link
            href="/news"
            className="inline-block bg-[var(--onix-navy)] px-8 py-3 text-sm text-white transition-colors hover:bg-[var(--onix-red)]"
          >
            Latest News
          </Link>
        </div>

        {/* Magazine grid — live uses asymmetric layout */}
        <div className="grid min-h-[586px] grid-cols-1 gap-[5px] md:grid-cols-4 md:grid-rows-2">
          {articles.slice(0, 5).map((article, i) => {
            const d = new Date(article.publishedAt)
            const path = `/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${article.slug}/`
            const imgUrl = getMediaUrl(article.featuredImage, 'article')
            const isFeatured = i === 0

            return (
              <Link
                key={article.id}
                href={path}
                className={`group relative overflow-hidden ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <div className="relative h-full min-h-[200px] w-full bg-[var(--onix-navy)]">
                  {imgUrl ? (
                    <Image src={imgUrl} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes={isFeatured ? '50vw' : '25vw'} />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--onix-navy)] to-[#2a3460]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-lg font-medium leading-[1.2] text-white md:text-xl">{article.title}</h3>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
