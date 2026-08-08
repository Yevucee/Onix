import type { Page } from '@/payload-types'
import { CorporatePageTemplate } from '@/components/onix/templates/CorporatePageTemplate'
import { InfrastructurePageTemplate } from '@/components/onix/templates/InfrastructurePageTemplate'
import { SolutionPageTemplate } from '@/components/onix/templates/SolutionPageTemplate'
import { resolvePageTemplate } from '@/lib/page-templates'

type Crumb = { label: string; href?: string }

export function OnixPageTemplate({
  page,
  pathname,
  breadcrumbs,
}: {
  page: Page
  pathname: string
  breadcrumbs: Crumb[]
}) {
  const template = resolvePageTemplate(pathname)

  switch (template) {
    case 'solution':
      return <SolutionPageTemplate page={page} breadcrumbs={breadcrumbs} />
    case 'infrastructure':
      return <InfrastructurePageTemplate page={page} breadcrumbs={breadcrumbs} />
    case 'corporate':
      return (
        <CorporatePageTemplate
          page={page}
          breadcrumbs={breadcrumbs}
          showDefaultLeadership={pathname.includes('about-us')}
        />
      )
    default:
      return <CorporatePageTemplate page={page} breadcrumbs={breadcrumbs} />
  }
}
