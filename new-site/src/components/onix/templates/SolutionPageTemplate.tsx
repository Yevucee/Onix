import type { Page } from '@/payload-types'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixPageBlocksRenderer } from '@/components/onix/blocks/OnixPageBlocksRenderer'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { OnixPageHero } from '@/components/onix/templates/OnixPageHero'
import { OurSolutionsPageTemplate } from '@/components/onix/templates/OurSolutionsPageTemplate'
import { resolveSolutionBlocks } from '@/data/solution-pages'

type Crumb = { label: string; href?: string }

export function SolutionPageTemplate({ page, breadcrumbs }: { page: Page; breadcrumbs: Crumb[] }) {
  const legacyPath = page.legacy?.legacyPath

  if (legacyPath === '/home/our-solutions/') {
    return <OurSolutionsPageTemplate breadcrumbs={breadcrumbs} />
  }

  const blocks = resolveSolutionBlocks(legacyPath)
  const hasHero = blocks.some((b) => b.blockType === 'hero')
  const hasCta = blocks.some((b) => b.blockType === 'cta')
  const featureVariant = legacyPath === '/home/virtual-machine/' ? 'light' : 'navy'

  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {!hasHero && <OnixPageHero title={page.title} />}

      <OnixPageBlocksRenderer blocks={blocks} featureCardVariant={featureVariant} />

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
