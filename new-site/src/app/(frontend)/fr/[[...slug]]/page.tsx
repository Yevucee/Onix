import type { ComponentType } from 'react'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import AboutPage from '../../about-us/page'
import SenegalPage from '../../senegal/page'
import HomePage from '../../page'

const frenchSlugMap: Record<string, ComponentType> = {
  '': HomePage,
  'about-us': AboutPage,
  senegal: SenegalPage,
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const path = slug.join('/')
  const payload = await getPayloadClient()

  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: path || 'home' } },
    locale: 'fr',
    limit: 1,
  })

  const doc = page.docs[0]
  return buildMetadata(
    {
      title: doc?.seo?.title,
      description: doc?.seo?.description,
      canonicalUrl: doc?.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/fr/${path}`,
    },
    doc?.title || 'Onix Data Centre',
  )
}

export default async function FrenchCatchAll({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const key = slug.join('/')
  const Page = frenchSlugMap[key]
  if (!Page) {
    notFound()
  }
  return <Page />
}
