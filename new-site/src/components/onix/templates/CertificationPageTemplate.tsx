import type { Page } from '@/payload-types'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixPageBlocksRenderer } from '@/components/onix/blocks/OnixPageBlocksRenderer'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { resolveCertificationBlocks } from '@/data/certification-content'

type Crumb = { label: string; href?: string }

export function CertificationPageTemplate({ page, breadcrumbs }: { page: Page; breadcrumbs: Crumb[] }) {
  const blocks = resolveCertificationBlocks(page.blocks as Parameters<typeof resolveCertificationBlocks>[0])
  const hasCta = blocks.some((b) => b.blockType === 'cta')

  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <OnixPageBlocksRenderer blocks={blocks} featureCardVariant="light" />

      {!hasCta && (
        <OnixPageCTA
          heading="Let's build this together!"
          body="Contact our team to learn more about Onix certifications and compliance."
          buttonLabel="Contact us"
          buttonUrl="/contact-us"
        />
      )}
    </>
  )
}
