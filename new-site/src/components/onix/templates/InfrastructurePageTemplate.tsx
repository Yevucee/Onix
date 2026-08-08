import type { Page } from '@/payload-types'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixPageBlocksRenderer } from '@/components/onix/blocks/OnixPageBlocksRenderer'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { OnixPageHero } from '@/components/onix/templates/OnixPageHero'

type Crumb = { label: string; href?: string }

export function InfrastructurePageTemplate({ page, breadcrumbs }: { page: Page; breadcrumbs: Crumb[] }) {
  const hasHero = page.blocks?.some((b) => b.blockType === 'hero')
  const hasCta = page.blocks?.some((b) => b.blockType === 'cta')

  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {!hasHero && <OnixPageHero title={page.title} />}

      <OnixPageBlocksRenderer blocks={page.blocks} featureCardVariant="light" />

      {!hasCta && (
        <OnixPageCTA
          heading="Explore our infrastructure"
          body="Discover how Onix delivers reliability, security and sustainability."
          buttonLabel="Contact us"
          buttonUrl="/contact-us"
        />
      )}
    </>
  )
}
