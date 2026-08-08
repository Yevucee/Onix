import type { Page } from '@/payload-types'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixPageBlocksRenderer } from '@/components/onix/blocks/OnixPageBlocksRenderer'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { OnixPageHero } from '@/components/onix/templates/OnixPageHero'

type Crumb = { label: string; href?: string }

export function SolutionPageTemplate({ page, breadcrumbs }: { page: Page; breadcrumbs: Crumb[] }) {
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

      <OnixPageBlocksRenderer blocks={page.blocks} featureCardVariant="navy" />

      {!hasCta && (
        <OnixPageCTA
          heading="Ready to get started?"
          body="Speak with our team about colocation, connectivity and managed services."
          buttonLabel="Contact us"
          buttonUrl="/contact-us"
        />
      )}
    </>
  )
}
