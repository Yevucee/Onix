import Link from 'next/link'

export function ArticleCard({
  title,
  href,
  excerpt,
  date,
  imageUrl,
}: {
  title: string
  href: string
  excerpt?: string
  date?: string
  imageUrl?: string
}) {
  return (
    <article className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white shadow-sm">
      {imageUrl && (
        <Link href={href}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="aspect-[16/9] w-full object-cover" />
        </Link>
      )}
      <div className="p-5">
        {date && <time className="text-xs text-[var(--color-muted)]">{new Date(date).toLocaleDateString('en-GB')}</time>}
        <h3 className="mt-2 text-lg font-semibold">
          <Link href={href} className="hover:text-[var(--color-brand)]">
            {title}
          </Link>
        </h3>
        {excerpt && <p className="mt-2 text-sm text-[var(--color-muted)] line-clamp-3">{excerpt}</p>}
      </div>
    </article>
  )
}
