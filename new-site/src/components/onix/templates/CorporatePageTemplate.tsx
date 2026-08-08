import type { Page } from '@/payload-types'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixPageBlocksRenderer } from '@/components/onix/blocks/OnixPageBlocksRenderer'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { OnixLeadershipGrid } from '@/components/onix/templates/OnixLeadershipGrid'

type Crumb = { label: string; href?: string }

export function CorporatePageTemplate({
  page,
  breadcrumbs,
  showDefaultLeadership = false,
}: {
  page: Page
  breadcrumbs: Crumb[]
  showDefaultLeadership?: boolean
}) {
  const hasLeadership = page.blocks?.some((b) => b.blockType === 'leadershipGrid')
  const hasCta = page.blocks?.some((b) => b.blockType === 'cta')

  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <OnixPageBlocksRenderer blocks={page.blocks} featureCardVariant="light" />

      {showDefaultLeadership && !hasLeadership && (
        <section className="bg-[var(--onix-bg-alt)] py-12 md:py-16">
          <div className="onix-container">
            <OnixLeadershipGrid heading="Our Leadership Team" intro="Meet the people driving Onix Data Centres forward." />
          </div>
        </section>
      )}

      {!hasCta && (
        <OnixPageCTA
          heading="Partner with Onix"
          body="Learn how our infrastructure supports your organisation."
          buttonLabel="Contact us"
          buttonUrl="/contact-us"
        />
      )}
    </>
  )
}
