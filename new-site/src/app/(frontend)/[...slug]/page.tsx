import { notFound } from 'next/navigation'
import { DataCentrePageTemplate } from '@/components/onix/templates/DataCentrePageTemplate'
import { LeadershipPageTemplate } from '@/components/onix/templates/LeadershipPageTemplate'
import { OnixPageTemplate } from '@/components/onix/templates/OnixPageTemplate'
import { ContactPageTemplate } from '@/components/onix/templates/ContactPageTemplate'
import { getPayloadClient } from '@/lib/payload'
import { pathFromSlugSegments, resolvePublicPath } from '@/lib/page-resolver'
import { resolvePageTemplate } from '@/lib/page-templates'
import { productionCanonical } from '@/lib/canonical'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const pathname = pathFromSlugSegments(slug)
  const payload = await getPayloadClient()
  const resolved = await resolvePublicPath(payload, pathname)

  if (!resolved) return { title: 'Page not found' }

  if (resolved.type === 'leadership') {
    const legacyPath = resolved.doc.legacy?.legacyPath || pathname
    return buildMetadata(
      {
        title: resolved.doc.name,
        description: resolved.doc.title || undefined,
        canonicalUrl: productionCanonical(legacyPath),
      },
      resolved.doc.name,
    )
  }

  if (resolved.type === 'data-centre') {
    return buildMetadata(
      {
        title: resolved.doc.seo?.title,
        description: resolved.doc.seo?.description || resolved.doc.summary || undefined,
        canonicalUrl: resolved.doc.seo?.canonicalUrl,
      },
      resolved.doc.name,
    )
  }

  return buildMetadata(
    {
      title: resolved.doc.seo?.title,
      description: resolved.doc.seo?.description,
      canonicalUrl: resolved.doc.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`,
      ogImageUrl: typeof resolved.doc.seo?.ogImage === 'object' ? resolved.doc.seo.ogImage?.url || undefined : undefined,
    },
    resolved.doc.title,
  )
}

export default async function CorporateCatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const pathname = pathFromSlugSegments(slug)
  const template = resolvePageTemplate(pathname)

  if (template === 'contact') {
    return <ContactPageTemplate breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
  }

  const payload = await getPayloadClient()
  const resolved = await resolvePublicPath(payload, pathname)

  if (!resolved) notFound()

  if (resolved.type === 'leadership') {
    return (
      <LeadershipPageTemplate
        person={resolved.doc}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about-us' },
          { label: resolved.doc.name },
        ]}
      />
    )
  }

  if (resolved.type === 'data-centre') {
    return (
      <DataCentrePageTemplate
        centre={resolved.doc}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: resolved.doc.name }]}
      />
    )
  }

  const page = resolved.doc
  const isHomepage = page.pageType === 'homepage' || pathname === '/home/'

  if (isHomepage) {
    return <OnixPageTemplate page={page} pathname={pathname} breadcrumbs={[{ label: 'Home', href: '/' }, { label: page.title }]} />
  }

  return (
    <OnixPageTemplate
      page={page}
      pathname={pathname}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: page.title }]}
    />
  )
}
