import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container, Section } from '@/components/layout/Container'
import { LeadershipProfileView } from '@/components/leadership/LeadershipGrid'
import { PageBlocksRenderer } from '@/components/pages/PageBlocksRenderer'
import { DataCentreTemplate } from '@/components/pages/DataCentreTemplate'
import { getPayloadClient } from '@/lib/payload'
import { pathFromSlugSegments, resolvePublicPath } from '@/lib/page-resolver'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const pathname = pathFromSlugSegments(slug)
  const payload = await getPayloadClient()
  const resolved = await resolvePublicPath(payload, pathname)

  if (!resolved) return { title: 'Page not found' }

  if (resolved.type === 'leadership') {
    return buildMetadata(
      { title: resolved.doc.name, description: resolved.doc.title || undefined },
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
  const payload = await getPayloadClient()
  const resolved = await resolvePublicPath(payload, pathname)

  if (!resolved) notFound()

  if (resolved.type === 'leadership') {
    return (
      <>
        <Section className="border-b border-[var(--color-border)]">
          <Container>
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about-us' },
                { label: resolved.doc.name },
              ]}
            />
          </Container>
        </Section>
        <Section>
          <Container>
            <LeadershipProfileView person={resolved.doc} />
          </Container>
        </Section>
      </>
    )
  }

  if (resolved.type === 'data-centre') {
    return <DataCentreTemplate centre={resolved.doc} breadcrumbs={[{ label: 'Home', href: '/' }, { label: resolved.doc.name }]} />
  }

  const page = resolved.doc
  const isHomepage = page.pageType === 'homepage' || pathname === '/home/'

  return (
    <>
      {!isHomepage && (
        <Section className="border-b border-[var(--color-border)]">
          <Container>
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: page.title }]} />
          </Container>
        </Section>
      )}
      <PageBlocksRenderer blocks={page.blocks} />
    </>
  )
}
