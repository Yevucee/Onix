import type { Page } from '@/payload-types'
import { Hero, CTASection } from '@/components/sections/Hero'
import {
  DownloadsSection,
  FeatureCards,
  GallerySection,
  LogoGrid,
  PageSection,
  RichHtmlSection,
  SplitContentSection,
  StatisticsGrid,
  VideoSection,
} from '@/components/sections/ContentSections'
import { LeadershipGrid } from '@/components/leadership/LeadershipGrid'
import { getMediaUrl } from '@/lib/media-url'

type Block = NonNullable<Page['blocks']>[number]

export function PageBlocksRenderer({ blocks }: { blocks?: Block[] | null }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.blockType}-${index}`

        switch (block.blockType) {
          case 'hero':
            return (
              <Hero
                key={key}
                eyebrow={block.eyebrow || undefined}
                heading={block.heading || ''}
                subheading={block.subheading || undefined}
                imageUrl={getMediaUrl(block.image, 'hero')}
                ctaLabel={block.ctaLabel || undefined}
                ctaUrl={block.ctaUrl || undefined}
              />
            )
          case 'richText':
            return block.body ? (
              <PageSection key={key}>
                <RichHtmlSection html={String(block.body)} />
              </PageSection>
            ) : null
          case 'imageText':
            return (
              <PageSection key={key} alt={index % 2 === 1}>
                <SplitContentSection
                  heading={block.heading}
                  body={block.body}
                  image={block.image}
                  imagePosition={block.imagePosition}
                />
              </PageSection>
            )
          case 'stats':
            return (
              <PageSection key={key} alt>
                <StatisticsGrid items={block.items || []} />
              </PageSection>
            )
          case 'featureCards':
            return (
              <PageSection key={key}>
                <FeatureCards heading={block.heading} items={block.items || []} />
              </PageSection>
            )
          case 'logoGrid':
            return (
              <PageSection key={key} alt>
                <LogoGrid heading={block.heading} logos={block.logos || []} />
              </PageSection>
            )
          case 'downloads':
            return (
              <PageSection key={key}>
                <DownloadsSection heading={block.heading} files={block.files || []} />
              </PageSection>
            )
          case 'video':
            return block.url ? (
              <PageSection key={key}>
                <VideoSection url={block.url} heading={block.heading} caption={block.caption} />
              </PageSection>
            ) : null
          case 'gallery':
            return (
              <PageSection key={key}>
                <GallerySection heading={block.heading} images={block.images || []} />
              </PageSection>
            )
          case 'leadershipGrid':
            return (
              <PageSection key={key} alt>
                <LeadershipGrid heading={block.heading} intro={block.intro} />
              </PageSection>
            )
          case 'cta':
            return (
              <CTASection
                key={key}
                heading={block.heading || undefined}
                body={block.body || undefined}
                buttonLabel={block.buttonLabel || 'Contact us'}
                buttonUrl={block.buttonUrl || '/contact-us'}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
