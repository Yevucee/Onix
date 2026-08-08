import { notFound } from 'next/navigation'
import { FrenchContactPageTemplate, frenchContactPageMetadata } from '@/components/onix/templates/FrenchContactPageTemplate'
import { FrenchHomePageTemplate } from '@/components/onix/templates/FrenchHomePageTemplate'
import { getPayloadClient } from '@/lib/payload'
import { pathFromSlugSegments, resolvePublicPath } from '@/lib/page-resolver'
import { productionCanonical } from '@/lib/canonical'
import { buildMetadata } from '@/lib/seo'

const FRENCH_PATH_MAP: Record<string, string> = {
  '': '/fr/home-francais/',
  'home-francais': '/fr/home-francais/',
  'contactez-nous': '/fr/contactez-nous/',
  'a-propos': '/fr/a-propos/',
  'about-us': '/fr/a-propos/',
}

const FRENCH_HOME_KEYS = new Set(['', 'home-francais'])

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const key = slug.join('/')

  if (key === 'contactez-nous') {
    return frenchContactPageMetadata()
  }

  if (FRENCH_HOME_KEYS.has(key)) {
    return buildMetadata(
      {
        title: 'Home – Français',
        description: 'Onix Data Centre — Connecting Africa to the Globe',
        canonicalUrl: productionCanonical(key === '' ? '/fr/' : '/fr/home-francais'),
        hreflangPath: '/fr/',
      },
      'Home – Français',
    )
  }

  const legacyPath = FRENCH_PATH_MAP[key] || pathFromSlugSegments(slug.map((s) => `fr/${s}`))
  const payload = await getPayloadClient()

  const page = await payload.find({
    collection: 'pages',
    where: { 'legacy.legacyPath': { equals: legacyPath } },
    locale: 'fr',
    limit: 1,
  })

  const doc = page.docs[0]
  const canonicalPath = key ? `/fr/${key}/` : '/fr/'
  return buildMetadata(
    {
      title: doc?.seo?.title,
      description: doc?.seo?.description,
      canonicalUrl: doc?.seo?.canonicalUrl || productionCanonical(canonicalPath),
    },
    doc?.title || 'Onix Data Centre',
  )
}

export default async function FrenchCatchAll({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const key = slug.join('/')

  if (key === 'contactez-nous') {
    return <FrenchContactPageTemplate />
  }

  if (FRENCH_HOME_KEYS.has(key)) {
    return <FrenchHomePageTemplate />
  }

  if (key === 'a-propos' || key === 'about-us') {
    // No French about content in WordPress export — documented in FRENCH-MIGRATION-STATUS.md
    notFound()
  }

  const legacyPath = FRENCH_PATH_MAP[key] || `/fr/${key ? `${key}/` : ''}`
  const payload = await getPayloadClient()
  const resolved = await resolvePublicPath(payload, legacyPath, 'fr')

  if (!resolved || resolved.type !== 'page') {
    notFound()
  }

  // Future French corporate pages with CMS content
  notFound()
}
