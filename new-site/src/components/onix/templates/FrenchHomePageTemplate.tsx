import { OnixPageCTA } from '@/components/onix/templates/OnixPageCTA'
import { OnixBreadcrumbs } from '@/components/onix/templates/OnixBreadcrumbs'
import { FRENCH_BREADCRUMB_HOME, FRENCH_HOMEPAGE } from '@/data/french-site'

/** Minimal French homepage — live WP page has title only, no body content. */
export function FrenchHomePageTemplate() {
  const { title, contactCta } = FRENCH_HOMEPAGE

  return (
    <>
      <div className="border-b border-[var(--onix-border,#e5e5e5)] bg-white">
        <div className="onix-container">
          <OnixBreadcrumbs items={[FRENCH_BREADCRUMB_HOME]} />
        </div>
      </div>

      <section className="bg-white py-16 md:py-24">
        <div className="onix-container text-center">
          <h1 className="onix-heading-dark text-[40px] font-semibold leading-[48px]">{title}</h1>
        </div>
      </section>

      <OnixPageCTA
        heading={contactCta.heading}
        body={contactCta.body}
        buttonLabel={contactCta.buttonLabel}
        buttonUrl={contactCta.buttonUrl}
      />
    </>
  )
}
