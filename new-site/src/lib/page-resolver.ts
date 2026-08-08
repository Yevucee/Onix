import type { DataCentre, Leadership, Page } from '@/payload-types'
import type { Payload } from 'payload'

export type ResolvedRoute =
  | { type: 'page'; doc: Page; locale?: 'en' | 'fr' }
  | { type: 'leadership'; doc: Leadership }
  | { type: 'data-centre'; doc: DataCentre }

export function pathFromSlugSegments(slug?: string[]): string {
  if (!slug?.length) return '/'
  return `/${slug.join('/')}/`
}

export async function resolvePublicPath(
  payload: Payload,
  pathname: string,
  locale: 'en' | 'fr' = 'en',
): Promise<ResolvedRoute | null> {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`

  const leadership = await payload.find({
    collection: 'leadership',
    where: { 'legacy.legacyPath': { equals: normalized } },
    limit: 1,
  })
  if (leadership.docs[0]?.visible) {
    return { type: 'leadership', doc: leadership.docs[0] }
  }

  const pageByLegacy = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { 'legacy.legacyPath': { equals: normalized } },
        { _status: { equals: 'published' } },
      ],
    },
    locale,
    limit: 1,
  })
  if (pageByLegacy.docs[0]) {
    return { type: 'page', doc: pageByLegacy.docs[0], locale }
  }

  const slug = normalized.replace(/^\/|\/$/g, '')
  if (slug) {
    const pageBySlug = await payload.find({
      collection: 'pages',
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
      },
      locale,
      limit: 1,
    })
    if (pageBySlug.docs[0]) {
      return { type: 'page', doc: pageBySlug.docs[0], locale }
    }
  }

  const dcSlug = slug.split('/').pop() || slug
  const dataCentre = await payload.find({
    collection: 'data-centres',
    where: {
      and: [{ slug: { equals: dcSlug } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
  })
  if (dataCentre.docs[0] && (normalized.includes('/senegal') || normalized === '/senegal/')) {
    return { type: 'data-centre', doc: dataCentre.docs[0] }
  }

  return null
}
