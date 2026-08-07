import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { Container, Section } from '../layout/Container'
import { Button } from '../ui/Button'
import { getMediaAlt, getMediaUrl } from '@/lib/media-url'

type MediaRef = number | Media | null | undefined

export function StatisticsGrid({ items }: { items?: Array<{ value?: string | null; label?: string | null }> }) {
  if (!items?.length) return null
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-[var(--radius-card)] border bg-white p-6 text-center shadow-sm">
          <p className="text-3xl font-semibold text-[var(--color-brand)]">{item.value}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

export function FeatureCards({
  heading,
  items,
}: {
  heading?: string | null
  items?: Array<{ title?: string | null; body?: string | null; url?: string | null; icon?: MediaRef }>
}) {
  if (!items?.length) return null
  return (
    <div>
      {heading && <h2 className="mb-8 text-3xl font-semibold">{heading}</h2>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const card = (
            <div className="h-full rounded-[var(--radius-card)] border bg-white p-6 shadow-sm transition hover:shadow-md">
              {item.icon && typeof item.icon === 'object' && item.icon.url && (
                <Image src={item.icon.url} alt={getMediaAlt(item.icon)} width={48} height={48} className="mb-4 h-12 w-12 object-contain" />
              )}
              <h3 className="text-xl font-semibold">{item.title}</h3>
              {item.body && <p className="mt-3 text-sm text-[var(--color-muted)]">{item.body}</p>}
            </div>
          )
          return item.url ? (
            <Link key={i} href={item.url} className="block">
              {card}
            </Link>
          ) : (
            <div key={i}>{card}</div>
          )
        })}
      </div>
    </div>
  )
}

export function LogoGrid({
  heading,
  logos,
}: {
  heading?: string | null
  logos?: Array<{ image?: MediaRef; name?: string | null; url?: string | null }>
}) {
  if (!logos?.length) return null
  return (
    <div>
      {heading && <h2 className="mb-8 text-2xl font-semibold">{heading}</h2>}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
        {logos.map((logo, i) => {
          const url = logo.image && typeof logo.image === 'object' ? logo.image.url : undefined
          if (!url) return null
          const img = (
            <Image
              src={url}
              alt={logo.name || getMediaAlt(logo.image)}
              width={160}
              height={80}
              className="mx-auto h-16 w-auto max-w-full object-contain grayscale transition hover:grayscale-0"
            />
          )
          return logo.url ? (
            <a key={i} href={logo.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              {img}
            </a>
          ) : (
            <div key={i} className="flex items-center justify-center">
              {img}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DownloadsSection({
  heading,
  files,
}: {
  heading?: string | null
  files?: Array<{ file?: MediaRef; label?: string | null }>
}) {
  if (!files?.length) return null
  return (
    <div>
      {heading && <h2 className="mb-6 text-2xl font-semibold">{heading}</h2>}
      <ul className="space-y-3">
        {files.map((item, i) => {
          const url = item.file && typeof item.file === 'object' ? item.file.url : undefined
          if (!url) return null
          return (
            <li key={i}>
              <a
                href={url}
                download
                className="inline-flex items-center gap-2 text-[var(--color-brand)] underline-offset-2 hover:underline"
                data-analytics-event="file_download"
              >
                {item.label || 'Download'}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function VideoSection({ url, heading, caption }: { url: string; heading?: string | null; caption?: string | null }) {
  const embed = toEmbedUrl(url)
  if (!embed) return null
  return (
    <div>
      {heading && <h2 className="mb-4 text-2xl font-semibold">{heading}</h2>}
      <div className="aspect-video overflow-hidden rounded-[var(--radius-card)] bg-black">
        <iframe src={embed} title={heading || 'Video'} className="h-full w-full" allowFullScreen loading="lazy" />
      </div>
      {caption && <p className="mt-2 text-sm text-[var(--color-muted)]">{caption}</p>}
    </div>
  )
}

export function GallerySection({
  heading,
  images,
}: {
  heading?: string | null
  images?: Array<{ image?: MediaRef; caption?: string | null }>
}) {
  if (!images?.length) return null
  return (
    <div>
      {heading && <h2 className="mb-6 text-2xl font-semibold">{heading}</h2>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((item, i) => {
          const src = getMediaUrl(item.image, 'article')
          if (!src) return null
          return (
            <figure key={i} className="overflow-hidden rounded-[var(--radius-card)] border bg-white">
              <Image src={src} alt={getMediaAlt(item.image, item.caption || '')} width={640} height={400} className="h-48 w-full object-cover" />
              {item.caption && <figcaption className="p-3 text-sm text-[var(--color-muted)]">{item.caption}</figcaption>}
            </figure>
          )
        })}
      </div>
    </div>
  )
}

export function SplitContentSection({
  heading,
  body,
  image,
  imagePosition = 'right',
}: {
  heading?: string | null
  body?: string | null
  image?: MediaRef
  imagePosition?: 'left' | 'right' | null
}) {
  const imageUrl = getMediaUrl(image, 'article')
  const text = (
    <div>
      {heading && <h2 className="text-2xl font-semibold">{heading}</h2>}
      {body && <p className="mt-4 whitespace-pre-line text-[var(--color-muted)]">{body}</p>}
    </div>
  )
  const visual = imageUrl ? (
    <Image src={imageUrl} alt={getMediaAlt(image, heading || '')} width={640} height={480} className="rounded-[var(--radius-card)] object-cover" />
  ) : null
  return (
    <div className={`grid items-center gap-10 ${visual ? 'lg:grid-cols-2' : ''}`}>
      {imagePosition === 'left' ? (
        <>
          {visual}
          {text}
        </>
      ) : (
        <>
          {text}
          {visual}
        </>
      )}
    </div>
  )
}

export function RichHtmlSection({ html }: { html: string }) {
  return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}

function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

export function PageSection({ children, alt = false }: { children: ReactNode; alt?: boolean }) {
  return (
    <Section className={alt ? 'bg-[var(--color-background-alt)]' : undefined}>
      <Container>{children}</Container>
    </Section>
  )
}

export { Button }
