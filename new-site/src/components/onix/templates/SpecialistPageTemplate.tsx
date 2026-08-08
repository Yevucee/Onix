import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { LinxAccraContent } from '@/components/onix/templates/LinxAccraContent'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'

type Crumb = { label: string; href?: string }

export function SpecialistPageTemplate({ breadcrumbs, variant }: { breadcrumbs: Crumb[]; variant: 'linx' }) {
  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {variant === 'linx' && <LinxAccraContent />}

      <OnixPageCTA
        heading="Get in touch with us today"
        body="Speak with our team about colocation, connectivity and peering."
        buttonLabel="Contact us"
        buttonUrl="/contact-us"
      />
    </>
  )
}
