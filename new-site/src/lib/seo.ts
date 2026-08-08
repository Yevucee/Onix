import type { Metadata } from 'next'
import { getSiteUrl, isStaging } from './env'
import { productionCanonical } from './canonical'
import { HREFLANG_PAIRS } from './schema'

type SEOInput = {
  title?: string | null
  description?: string | null
  canonicalUrl?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImageUrl?: string | null
  robots?: string | null
  /** Path for hreflang alternates, e.g. `/contact-us/` */
  hreflangPath?: string | null
}

const TITLE_SUFFIX = ' – Onix Data Centre'
const DEFAULT_OG_IMAGE = 'https://onixdatacentres.com/images/onix/logo.png'

function normalizeTitle(title: string): string {
  return title.replace(new RegExp(`${TITLE_SUFFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '').trim()
}

function buildHreflang(path: string): Metadata['alternates'] {
  const pair = HREFLANG_PAIRS.find((p) => p.en === path || p.fr === path)
  if (!pair) return undefined
  return {
    canonical: productionCanonical(path),
    languages: {
      en: productionCanonical(pair.en),
      fr: productionCanonical(pair.fr),
      'x-default': productionCanonical(pair.en),
    },
  }
}

export function buildMetadata(input: SEOInput, fallbackTitle: string): Metadata {
  const siteUrl = getSiteUrl()
  const rawTitle = input.title || fallbackTitle
  const title = normalizeTitle(rawTitle)
  const description = input.description || undefined
  const canonical = input.canonicalUrl || undefined
  const ogImage = input.ogImageUrl || DEFAULT_OG_IMAGE
  const hreflang = input.hreflangPath ? buildHreflang(input.hreflangPath) : undefined

  const metadata: Metadata = {
    title,
    description,
    alternates: hreflang || (canonical ? { canonical } : undefined),
    openGraph: {
      title: input.ogTitle || title,
      description: input.ogDescription || description,
      url: canonical || siteUrl,
      images: [{ url: ogImage }],
      siteName: 'Onix Data Centre',
      locale: input.hreflangPath?.startsWith('/fr') ? 'fr_FR' : 'en_GB',
    },
  }

  if (isStaging()) {
    metadata.robots = { index: false, follow: false, nocache: true }
  } else if (input.robots && input.robots !== 'default') {
    metadata.robots = input.robots.includes('noindex')
      ? { index: false, follow: !input.robots.includes('nofollow') }
      : undefined
  }

  return metadata
}
