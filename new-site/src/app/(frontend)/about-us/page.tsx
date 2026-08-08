import { notFound } from 'next/navigation'
import { CorporatePageTemplate } from '@/components/onix/templates/CorporatePageTemplate'
import { getPayloadClient } from '@/lib/payload'
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
      canonicalUrl: doc.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/about-us`,
    },
    doc.title,
  )
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'pages', where: { slug: { equals: 'about-us' } }, limit: 1 })
  const page = result.docs[0]
  if (!page) notFound()

  return (
    <CorporatePageTemplate
      page={page}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: page.title }]}
      showDefaultLeadership
    />
  )
}
