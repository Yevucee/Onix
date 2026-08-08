import { productionCanonical } from './canonical'

const ORG_NAME = 'Onix Data Centre'
const ORG_LOGO = 'https://onixdatacentres.com/images/onix/logo.png'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    url: productionCanonical('/'),
    logo: ORG_LOGO,
    sameAs: ['https://twitter.com/ONIXDCdata', 'https://www.linkedin.com/company/onixdc'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@onixdatacentres.com',
      telephone: '+233500865266',
      contactType: 'customer service',
    },
  }
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : productionCanonical(item.url),
    })),
  }
}

export function articleSchema(input: {
  title: string
  description?: string
  publishedAt: string
  updatedAt?: string
  imageUrl?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt || input.publishedAt,
    description: input.description,
    image: input.imageUrl,
    mainEntityOfPage: productionCanonical(input.url),
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      logo: { '@type': 'ImageObject', url: ORG_LOGO },
    },
  }
}

/** hreflang pairs for EN/FR pages that exist on both locales */
export const HREFLANG_PAIRS: Array<{ en: string; fr: string }> = [
  { en: '/', fr: '/fr/' },
  { en: '/contact-us/', fr: '/fr/contactez-nous/' },
]
