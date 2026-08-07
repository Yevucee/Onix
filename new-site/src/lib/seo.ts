import type { Metadata } from 'next'
import { getSiteUrl, isStaging } from './env'

type SEOInput = {
  title?: string | null
  description?: string | null
  canonicalUrl?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImageUrl?: string | null
  robots?: string | null
}

export function buildMetadata(input: SEOInput, fallbackTitle: string): Metadata {
  const siteUrl = getSiteUrl()
  const title = input.title || fallbackTitle
  const description = input.description || undefined
  const canonical = input.canonicalUrl || undefined

  const metadata: Metadata = {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: input.ogTitle || title,
      description: input.ogDescription || description,
      url: canonical || siteUrl,
      images: input.ogImageUrl ? [{ url: input.ogImageUrl }] : undefined,
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
