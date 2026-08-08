import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { OnixAnimatedStat } from '@/components/onix/blocks/OnixAnimatedStat'
import { OnixButton } from '@/components/onix/OnixButton'
import { OnixLeadershipGrid } from '@/components/onix/templates/OnixLeadershipGrid'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { OnixPageHero } from '@/components/onix/templates/OnixPageHero'
import { getMediaAlt, getMediaUrl } from '@/lib/media-url'

type MediaRef = number | Media | null | undefined

function OnixStatsSection({ items }: { items: Array<{ value?: string | null; label?: string | null }> }) {
  if (!items?.length) return null
  return (
    <section className="bg-[var(--onix-stats-bg)] py-4">
      <div className="onix-container">
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <OnixAnimatedStat key={i} value={item.value || ''} label={item.label || ''} />
          ))}
        </div>
      </div>
    </section>
  )
}

function OnixRichTextSection({ html }: { html: string }) {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="onix-container">
        <div
          className="onix-prose max-w-3xl text-base leading-[22.4px] text-[var(--onix-body)] [&_h2]:onix-heading-dark [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-[28px] [&_h2]:font-semibold [&_h3]:onix-heading-dark [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-[22px] [&_h3]:font-semibold [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  )
}

function OnixSplitSection({
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
  const textBlock = (
    <div>
      {heading && <h2 className="onix-heading-dark text-[40px] font-semibold leading-[48px]">{heading}</h2>}
      {body && <p className="mt-4 text-base leading-[22.4px] text-[var(--onix-body)]">{body}</p>}
    </div>
  )
  const imageBlock = imageUrl ? (
    <Image
      src={imageUrl}
      alt={getMediaAlt(image, heading || '')}
      width={600}
      height={400}
      className="h-auto w-full object-cover"
    />
  ) : null

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="onix-container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {imagePosition === 'left' ? (
            <>
              {imageBlock}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {imageBlock}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function OnixFeatureCards({
  heading,
  items,
  variant = 'navy',
}: {
  heading?: string | null
  items?: Array<{ title?: string | null; body?: string | null; url?: string | null; icon?: MediaRef }>
  variant?: 'navy' | 'light'
}) {
  if (!items?.length) return null

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="onix-container">
        {heading && (
          <h2 className="onix-heading-dark mb-10 text-center text-[40px] font-semibold leading-[48px]">{heading}</h2>
        )}
        <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const card = (
              <div
                className={`flex h-full flex-col items-center px-[30px] py-[50px] text-center ${
                  variant === 'navy'
                    ? 'bg-[var(--onix-navy)] text-white hover:bg-[#151b38]'
                    : 'border border-[var(--onix-border,#e5e5e5)] bg-white'
                } transition-colors duration-300`}
              >
                {item.icon && typeof item.icon === 'object' && item.icon.url && (
                  <Image src={item.icon.url} alt={getMediaAlt(item.icon)} width={48} height={48} className="mb-6 h-12 w-12 object-contain" />
                )}
                <h3 className={`text-[28px] font-semibold leading-[1.2] ${variant === 'navy' ? 'onix-heading-light' : 'onix-heading-dark'}`}>
                  {item.title}
                </h3>
                {item.body && (
                  <p className={`mt-4 text-base leading-[22.4px] ${variant === 'navy' ? 'text-white/80' : 'text-[var(--onix-body)]'}`}>
                    {item.body}
                  </p>
                )}
                {item.url && (
                  <OnixButton
                    variant={variant === 'navy' ? 'solid-white' : 'primary-red'}
                    href={item.url}
                    className="mt-7"
                  >
                    Learn More
                  </OnixButton>
                )}
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
    </section>
  )
}

function OnixLogoGrid({
  heading,
  logos,
}: {
  heading?: string | null
  logos?: Array<{ image?: MediaRef; name?: string | null; url?: string | null }>
}) {
  if (!logos?.length) return null
  return (
    <section className="bg-[var(--onix-bg-alt)] py-12 md:py-16">
      <div className="onix-container">
        {heading && <h2 className="onix-heading-dark mb-10 text-center text-[32px] font-semibold">{heading}</h2>}
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
    </section>
  )
}

function OnixDownloadsSection({
  heading,
  files,
}: {
  heading?: string | null
  files?: Array<{ label?: string | null; file?: MediaRef }>
}) {
  if (!files?.length) return null
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="onix-container">
        {heading && <h2 className="onix-heading-dark mb-8 text-[32px] font-semibold">{heading}</h2>}
        <ul className="space-y-4">
          {files.map((f, i) => {
            const fileUrl = getMediaUrl(f.file)
            if (!fileUrl) return null
            return (
              <li key={i}>
                <OnixButton variant="navy-pill" href={fileUrl} external>
                  {f.label || 'Download'}
                </OnixButton>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function OnixGallerySection({
  heading,
  images,
}: {
  heading?: string | null
  images?: Array<{ image?: MediaRef; caption?: string | null }>
}) {
  if (!images?.length) return null
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="onix-container">
        {heading && <h2 className="onix-heading-dark mb-8 text-[32px] font-semibold">{heading}</h2>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((item, i) => {
            const url = getMediaUrl(item.image, 'card')
            if (!url) return null
            return (
              <figure key={i}>
                <Image src={url} alt={getMediaAlt(item.image, item.caption || '')} width={400} height={300} className="h-56 w-full object-cover" />
                {item.caption && <figcaption className="mt-2 text-sm text-[var(--onix-muted)]">{item.caption}</figcaption>}
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function OnixVideoSection({ url, heading, caption }: { url: string; heading?: string | null; caption?: string | null }) {
  const embedUrl = url.includes('youtube.com') || url.includes('youtu.be')
    ? url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
    : url

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="onix-container">
        {heading && <h2 className="onix-heading-dark mb-8 text-[32px] font-semibold">{heading}</h2>}
        <div className="aspect-video w-full max-w-4xl">
          <iframe src={embedUrl} title={heading || 'Video'} className="h-full w-full" allowFullScreen />
        </div>
        {caption && <p className="mt-4 text-sm text-[var(--onix-muted)]">{caption}</p>}
      </div>
    </section>
  )
}

export type OnixBlock = {
  blockType: string
  id?: string | null
  [key: string]: unknown
}

export function OnixPageBlocksRenderer({
  blocks,
  featureCardVariant = 'navy',
}: {
  blocks?: OnixBlock[] | null
  featureCardVariant?: 'navy' | 'light'
}) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.blockType}-${index}`

        switch (block.blockType) {
          case 'hero':
            return (
              <OnixPageHero
                key={key}
                eyebrow={(block.eyebrow as string) || undefined}
                title={(block.heading as string) || ''}
                intro={(block.subheading as string) || undefined}
                imageUrl={getMediaUrl(block.image as MediaRef, 'hero')}
                imageAlt={getMediaAlt(block.image as MediaRef)}
                ctaLabel={(block.ctaLabel as string) || undefined}
                ctaUrl={(block.ctaUrl as string) || undefined}
              />
            )
          case 'richText':
            return block.body ? <OnixRichTextSection key={key} html={String(block.body)} /> : null
          case 'imageText':
            return (
              <OnixSplitSection
                key={key}
                heading={block.heading as string}
                body={block.body as string}
                image={block.image as MediaRef}
                imagePosition={block.imagePosition as 'left' | 'right'}
              />
            )
          case 'stats':
            return <OnixStatsSection key={key} items={block.items as Array<{ value?: string; label?: string }>} />
          case 'featureCards':
            return (
              <OnixFeatureCards
                key={key}
                heading={block.heading as string}
                items={block.items as Array<{ title?: string; body?: string; url?: string; icon?: MediaRef }>}
                variant={featureCardVariant}
              />
            )
          case 'logoGrid':
            return <OnixLogoGrid key={key} heading={block.heading as string} logos={block.logos as Array<{ image?: MediaRef; name?: string; url?: string }>} />
          case 'downloads':
            return <OnixDownloadsSection key={key} heading={block.heading as string} files={block.files as Array<{ label?: string; file?: MediaRef }>} />
          case 'video':
            return block.url ? (
              <OnixVideoSection key={key} url={block.url as string} heading={block.heading as string} caption={block.caption as string} />
            ) : null
          case 'gallery':
            return (
              <OnixGallerySection
                key={key}
                heading={block.heading as string}
                images={block.images as Array<{ image?: MediaRef; caption?: string }>}
              />
            )
          case 'leadershipGrid':
            return (
              <section key={key} className="bg-[var(--onix-bg-alt)] py-12 md:py-16">
                <div className="onix-container">
                  <OnixLeadershipGrid heading={block.heading as string} intro={block.intro as string} />
                </div>
              </section>
            )
          case 'cta':
            return (
              <OnixPageCTA
                key={key}
                heading={(block.heading as string) || undefined}
                body={(block.body as string) || undefined}
                buttonLabel={(block.buttonLabel as string) || 'Contact us'}
                buttonUrl={(block.buttonUrl as string) || '/contact-us'}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
