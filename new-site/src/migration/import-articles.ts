import type { Payload } from 'payload'
import { MIGRATION_CONFIG } from './config'
import { convertHtmlToLexical, normalizeInternalLinks } from './html-to-lexical'
import { classifyWidgetSupport, parseElementorData } from './elementor-parser'
import { importRequiredMedia, loadMediaMap, resolveLegacyMediaUrl } from './import-media'
import {
  getLegacyPostPath,
  getMeta,
  getPublishedPosts,
  hasElementorData,
  loadWpItems,
  buildAttachmentIndex,
  getAttachmentFile,
} from './wp-export'
import { readFileSync } from 'fs'

export type ArticleImportResult = {
  wordpressId: number
  slug: string
  oldUrl: string
  payloadId?: string | number
  articleType: 'STANDARD_HTML' | 'ELEMENTOR' | 'OTHER'
  contentImportStatus: 'success' | 'partial' | 'failed'
  featuredImageStatus: 'mapped' | 'missing' | 'skipped'
  inlineMediaStatus: 'mapped' | 'partial' | 'missing'
  seoStatus: 'mapped' | 'partial' | 'missing'
  urlStatus: 'preserved'
  warnings: string[]
  manualReview: boolean
}

function loadSeoByPath(legacyPath: string) {
  const data = JSON.parse(readFileSync(MIGRATION_CONFIG.seoMetadataJson, 'utf-8')) as {
    live_crawl_supplement?: Array<{
      path?: string
      live_title?: string
      live_meta_description?: string
      live_canonical?: string
    }>
  }
  return data.live_crawl_supplement?.find((e) => e.path === legacyPath)
}

function loadSeoFromYoast(wpId: number) {
  const data = JSON.parse(readFileSync(MIGRATION_CONFIG.seoMetadataJson, 'utf-8')) as {
    yoast_postmeta?: Array<{ post_id: number; seo_title?: string; meta_description?: string }>
  }
  return data.yoast_postmeta?.find((e) => e.post_id === wpId)
}

function enrichBlocksWithMedia(
  blocks: Array<{ blockType: string; [key: string]: unknown }>,
  mediaMap: ReturnType<typeof loadMediaMap>,
) {
  return blocks.map((block) => {
    if (block.blockType === 'image' && block.legacyUrl) {
      const mediaId = resolveLegacyMediaUrl(String(block.legacyUrl), mediaMap)
      return { ...block, image: mediaId || undefined }
    }
    if (block.blockType === 'gallery' && Array.isArray(block.legacyUrls)) {
      return {
        ...block,
        images: (block.legacyUrls as string[]).map((url) => ({
          legacyUrl: url,
          image: resolveLegacyMediaUrl(url, mediaMap) || undefined,
        })),
      }
    }
    if (block.blockType === 'download' && block.legacyUrl) {
      const mediaId = resolveLegacyMediaUrl(String(block.legacyUrl), mediaMap)
      return { ...block, file: mediaId || undefined }
    }
    return block
  })
}

export async function importArticle(
  payload: Payload,
  slug: string,
  options: { skipMedia?: boolean } = {},
): Promise<ArticleImportResult> {
  const items = loadWpItems()
  const item = items.find((i) => i['wp:post_name'] === slug && i['wp:post_type'] === 'post')
  const result: ArticleImportResult = {
    wordpressId: 0,
    slug,
    oldUrl: '',
    articleType: 'OTHER',
    contentImportStatus: 'failed',
    featuredImageStatus: 'missing',
    inlineMediaStatus: 'missing',
    seoStatus: 'missing',
    urlStatus: 'preserved',
    warnings: [],
    manualReview: false,
  }

  if (!item || item['wp:status'] !== 'publish') {
    result.warnings.push('Post not found or not published')
    return result
  }

  const wpId = Number(item['wp:post_id'])
  result.wordpressId = wpId
  const legacyPath = getLegacyPostPath(item)
  result.oldUrl = legacyPath

  const elementor = hasElementorData(item)
  result.articleType = elementor ? 'ELEMENTOR' : 'STANDARD_HTML'

  let conversion
  if (elementor) {
    const json = getMeta(item, '_elementor_data')
    conversion = parseElementorData(json)
    if (conversion.unsupportedWidgets.length) {
      result.manualReview = true
      result.warnings.push(`Unsupported Elementor widgets: ${conversion.unsupportedWidgets.join(', ')}`)
    }
    result.contentImportStatus = conversion.unsupportedWidgets.length ? 'partial' : 'success'
  } else {
    const rawHtml = String(item['content:encoded'] || '')
    const { html: normalized, broken } = normalizeInternalLinks(rawHtml)
    if (broken.length) result.warnings.push(`Broken internal links: ${broken.length}`)
    conversion = convertHtmlToLexical(normalized)
    result.contentImportStatus = conversion.warnings.length ? 'partial' : 'success'
    result.warnings.push(...conversion.warnings.map((w) => w.message))
  }

  const mediaMap = loadMediaMap()
  const enrichedBlocks = enrichBlocksWithMedia(conversion.blocks, mediaMap)
  let mappedInline = 0
  let missingInline = 0
  for (const url of conversion.legacyMediaUrls) {
    if (resolveLegacyMediaUrl(url, mediaMap)) mappedInline++
    else missingInline++
  }
  result.inlineMediaStatus = missingInline === 0 ? 'mapped' : mappedInline > 0 ? 'partial' : 'missing'
  if (missingInline) {
    result.manualReview = true
    result.warnings.push(`${missingInline} inline media URLs not mapped`)
  }

  const thumbId = Number(getMeta(item, '_thumbnail_id'))
  let featuredImageId: number | undefined
  if (thumbId) {
    const mapped = mediaMap[String(thumbId)]?.payloadMediaId
    if (mapped) {
      featuredImageId = Number(mapped)
      result.featuredImageStatus = 'mapped'
    } else {
      result.featuredImageStatus = 'missing'
      result.manualReview = true
      result.warnings.push(`Featured image attachment ${thumbId} not mapped`)
    }
  } else {
    result.featuredImageStatus = 'skipped'
  }

  const yoast = loadSeoFromYoast(wpId)
  const crawl = loadSeoByPath(legacyPath)
  const seoTitle = getMeta(item, '_yoast_wpseo_title') || yoast?.seo_title || crawl?.live_title
  const seoDesc = getMeta(item, '_yoast_wpseo_metadesc') || yoast?.meta_description || crawl?.live_meta_description
  result.seoStatus = seoTitle || seoDesc ? 'mapped' : crawl ? 'partial' : 'missing'

  const categories = await payload.find({ collection: 'categories', limit: 100 })
  const catNames = (item.category as Array<{ '#text'?: string; nicename?: string }> | undefined) || []
  const categoryIds = catNames
    .map((c) => categories.docs.find((doc) => doc.slug === c.nicename)?.id)
    .filter((id): id is number => typeof id === 'number')

  const articleData = {
    title: String(item.title || slug),
    slug,
    publishedAt: String(item['wp:post_date'] || new Date().toISOString()),
    excerpt: String(item['excerpt:encoded'] || '').replace(/<[^>]+>/g, '').trim(),
    _status: 'published' as const,
    content: conversion.content,
    categories: categoryIds,
    featuredImage: featuredImageId,
    legacy: {
      wordpressId: wpId,
      legacyPath,
      legacyUrl: `https://onixdatacentres.com${legacyPath}`,
      migrationBlocks: enrichedBlocks.length ? enrichedBlocks : undefined,
    },
    seo: {
      title: seoTitle || undefined,
      description: seoDesc || undefined,
      canonicalUrl: crawl?.live_canonical || `https://onixdatacentres.com${legacyPath}`,
    },
  }

  const existing = await payload.find({
    collection: 'articles',
    where: { 'legacy.wordpressId': { equals: wpId } },
    limit: 1,
  })

  let doc
  if (existing.docs[0]) {
    doc = await payload.update({ collection: 'articles', id: existing.docs[0].id, data: articleData })
    result.warnings.push('Updated existing (idempotent)')
  } else {
    doc = await payload.create({ collection: 'articles', data: articleData })
  }

  result.payloadId = 'id' in doc ? doc.id : undefined
  return result
}

export async function importAllArticles(payload: Payload, slugs?: string[]) {
  const posts = getPublishedPosts(loadWpItems())
  const targetSlugs = slugs || posts.map((p) => String(p['wp:post_name']))
  const results: ArticleImportResult[] = []
  for (const slug of targetSlugs) {
    if (!slug) continue
    results.push(await importArticle(payload, slug))
  }
  return results
}

export function buildElementorWidgetReport(widgetCounts: Record<string, number>) {
  const { supported, partial, unsupported } = classifyWidgetSupport(widgetCounts)
  return { supported, partial, unsupported }
}
