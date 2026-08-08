import { notFound } from 'next/navigation'
import type { Page } from '@/payload-types'
import { CorporatePageTemplate } from '@/components/onix/templates/CorporatePageTemplate'
import { resolveAboutUsBlocks } from '@/data/group1-about-us'
import { getPayloadClient } from '@/lib/payload'
import { productionCanonical } from '@/lib/canonical'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'pages', where: { slug: { equals: 'about-us' } }, limit: 1 })
  const doc = result.docs[0]
  if (!doc) return buildMetadata({}, 'About Us')
  return buildMetadata(
    {
      title: doc.seo?.title,
      description: doc.seo?.description,
      canonicalUrl: doc.seo?.canonicalUrl || productionCanonical('/about-us'),
    },
    doc.title,
  )
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'pages', where: { slug: { equals: 'about-us' } }, limit: 1 })
  const page = result.docs[0]
  if (!page) notFound()

  const enrichedPage: Page = {
    ...page,
    blocks: resolveAboutUsBlocks(page.blocks as Page['blocks']) as Page['blocks'],
  }

  return (
    <CorporatePageTemplate
      page={enrichedPage}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: page.title }]}
      showDefaultLeadership
    />
  )
}
