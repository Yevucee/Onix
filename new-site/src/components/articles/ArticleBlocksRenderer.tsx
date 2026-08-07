import type { Media } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { getMediaAlt, getMediaUrl } from '@/lib/media-url'
import { Button } from '@/components/ui/Button'

type MediaRef = number | Media | null | undefined

export type ArticleBlock =
  | { blockType: 'image'; image?: MediaRef; legacyUrl?: string; alt?: string; caption?: string }
  | { blockType: 'gallery'; images?: Array<{ image?: MediaRef; legacyUrl?: string }> }
  | { blockType: 'video'; url?: string; caption?: string }
  | { blockType: 'quote'; quote?: string; attribution?: string }
  | { blockType: 'cta'; heading?: string; body?: string; buttonLabel?: string; buttonUrl?: string }
  | { blockType: 'download'; file?: MediaRef; label?: string; legacyUrl?: string }
  | { blockType: 'table'; rows?: Array<{ cells?: Array<{ value?: string | null }> }> }
  | { blockType: 'divider' }
  | { blockType: 'relatedArticle'; article?: { title?: string; slug?: string; publishedAt?: string } }

export function ArticleBlocksRenderer({ blocks }: { blocks?: ArticleBlock[] | null }) {
  if (!blocks?.length) return null

  return (
    <div className="article-blocks my-8 space-y-8">
      {blocks.map((block, index) => {
        const key = `${block.blockType}-${index}`
        switch (block.blockType) {
          case 'image': {
            const src = getMediaUrl(block.image, 'article') || block.legacyUrl
            if (!src) return <MigrationPlaceholder key={key} label="Image could not be resolved" url={block.legacyUrl} />
            return (
              <figure key={key} className="overflow-hidden rounded-[var(--radius-card)]">
                <Image src={src} alt={block.alt || getMediaAlt(block.image, '')} width={960} height={540} className="w-full object-cover" />
                {block.caption && <figcaption className="mt-2 text-sm text-[var(--color-muted)]">{block.caption}</figcaption>}
              </figure>
            )
          }
          case 'gallery': {
            const legacyUrls = (block as { legacyUrls?: string[] }).legacyUrls
            const images =
              block.images ||
              (Array.isArray(legacyUrls) ? legacyUrls.map((url) => ({ legacyUrl: url })) : [])
            return (
              <div key={key} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((item, i) => {
                  const mediaRef = 'image' in item ? item.image : undefined
                  const src = getMediaUrl(mediaRef, 'article') || item.legacyUrl
                  if (!src) return null
                  return (
                    <Image key={i} src={src} alt="" width={480} height={320} className="h-48 w-full rounded-[var(--radius-card)] object-cover" />
                  )
                })}
              </div>
            )
          }
          case 'video':
            return block.url ? <VideoEmbed key={key} url={block.url} caption={block.caption} /> : null
          case 'quote':
            return (
              <blockquote key={key} className="border-l-4 border-[var(--color-brand)] pl-6 italic text-[var(--color-muted)]">
                <p>{block.quote}</p>
                {block.attribution && <cite className="mt-2 block text-sm not-italic">— {block.attribution}</cite>}
              </blockquote>
            )
          case 'cta':
            return (
              <div key={key} className="rounded-[var(--radius-card)] bg-[var(--color-background-alt)] p-8 text-center">
                {block.heading && <h3 className="text-2xl font-semibold">{block.heading}</h3>}
                {block.body && <p className="mt-3 text-[var(--color-muted)]">{block.body}</p>}
                {block.buttonLabel && block.buttonUrl && (
                  <div className="mt-6">
                    <Button href={block.buttonUrl}>{block.buttonLabel}</Button>
                  </div>
                )}
              </div>
            )
          case 'download': {
            const url = (block.file && typeof block.file === 'object' ? block.file.url : undefined) || block.legacyUrl
            if (!url) return null
            return (
              <p key={key}>
                <a href={url} download className="text-[var(--color-brand)] underline" data-analytics-event="file_download">
                  {block.label || 'Download file'}
                </a>
              </p>
            )
          }
          case 'table':
            return (
              <div key={key} className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <tbody>
                    {(block.rows || []).map((row, ri) => (
                      <tr key={ri} className="border-b">
                        {(row.cells || []).map((cell, ci) => (
                          <td key={ci} className="px-4 py-3">
                            {cell.value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case 'divider':
            return <hr key={key} className="border-[var(--color-border)]" />
          case 'relatedArticle':
            if (!block.article?.slug) return null
            return (
              <p key={key}>
                <Link href={`/news/`} className="text-[var(--color-brand)] hover:underline">
                  Related: {block.article.title}
                </Link>
              </p>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

function VideoEmbed({ url, caption }: { url: string; caption?: string }) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  const embed = yt ? `https://www.youtube.com/embed/${yt[1]}` : vimeo ? `https://player.vimeo.com/video/${vimeo[1]}` : null
  if (!embed) return <a href={url}>{url}</a>
  return (
    <figure>
      <div className="aspect-video overflow-hidden rounded-[var(--radius-card)]">
        <iframe src={embed} title="Embedded video" className="h-full w-full" allowFullScreen loading="lazy" />
      </div>
      {caption && <figcaption className="mt-2 text-sm text-[var(--color-muted)]">{caption}</figcaption>}
    </figure>
  )
}

function MigrationPlaceholder({ label, url }: { label: string; url?: string }) {
  return (
    <div className="rounded border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p>{label}</p>
      {url && <p className="mt-1 break-all text-xs opacity-70">Legacy: {url}</p>}
    </div>
  )
}
