import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { isStaging } from '@/lib/env'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isStaging()) return []

  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const entries: MetadataRoute.Sitemap = [{ url: `${base}/`, changeFrequency: 'weekly', priority: 1 }]

  const staticPaths = ['/about-us/', '/contact-us/', '/news/', '/senegal/', '/home/cfo-roi/']
  for (const path of staticPaths) {
    entries.push({ url: `${base}${path}`, changeFrequency: 'monthly', priority: 0.8 })
  }

  try {
    const payload = await getPayloadClient()
    const [pages, articles, leadership, dataCentres] = await Promise.all([
      payload.find({ collection: 'pages', where: { _status: { equals: 'published' } }, limit: 200 }),
      payload.find({ collection: 'articles', where: { _status: { equals: 'published' } }, limit: 200, sort: '-publishedAt' }),
      payload.find({ collection: 'leadership', where: { visible: { equals: true } }, limit: 50 }),
      payload.find({ collection: 'data-centres', where: { _status: { equals: 'published' } }, limit: 20 }),
    ])

    for (const page of pages.docs) {
      const path = page.legacy?.legacyPath || (page.slug === 'home' ? '/' : `/${page.slug}/`)
      if (path === '/' || staticPaths.includes(path)) continue
      entries.push({ url: `${base}${path}`, lastModified: page.updatedAt, changeFrequency: 'monthly', priority: 0.7 })
    }

    for (const article of articles.docs) {
      const d = new Date(article.publishedAt)
      const path = `/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${article.slug}/`
      entries.push({ url: `${base}${path}`, lastModified: article.updatedAt, changeFrequency: 'yearly', priority: 0.6 })
    }

    for (const person of leadership.docs) {
      if (person.legacy?.legacyPath) {
        entries.push({ url: `${base}${person.legacy.legacyPath}`, changeFrequency: 'yearly', priority: 0.4 })
      }
    }

    for (const dc of dataCentres.docs) {
      entries.push({ url: `${base}/${dc.slug}/`, changeFrequency: 'monthly', priority: 0.7 })
    }
  } catch {
    // Build/CI without database — static entries only
  }

  return entries
}
