import type { Leadership } from '@/payload-types'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { OnixLeadershipProfile } from '@/components/onix/templates/OnixLeadershipGrid'
import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'

type Crumb = { label: string; href?: string }

export function LeadershipPageTemplate({ person, breadcrumbs }: { person: Leadership; breadcrumbs: Crumb[] }) {
  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <section className="bg-white py-12 md:py-16">
        <div className="onix-container">
          <OnixLeadershipProfile person={person} />
        </div>
      </section>

      <OnixPageCTA
        heading="Work with our team"
        body="Get in touch to discuss how Onix can support your organisation."
        buttonLabel="Contact us"
        buttonUrl="/contact-us"
      />
    </>
  )
}
