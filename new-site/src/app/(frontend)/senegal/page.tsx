import { notFound } from 'next/navigation'
import { DataCentrePageTemplate } from '@/components/onix/templates/DataCentrePageTemplate'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'data-centres', where: { slug: { equals: 'senegal' } }, limit: 1 })
  const doc = result.docs[0]
  if (!doc) return buildMetadata({}, 'Senegal')
  return buildMetadata(
    {
      title: doc.seo?.title,
      description: doc.seo?.description,
      canonicalUrl: doc.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/o-home/senegal`,
    },
    doc.name,
  )
}

export default async function SenegalDataCentrePage() {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'data-centres', where: { slug: { equals: 'senegal' } }, limit: 1 })
  const dc = result.docs[0]
  if (!dc) notFound()

  return (
    <DataCentrePageTemplate
      centre={dc}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: dc.name }]}
    />
  )
}
