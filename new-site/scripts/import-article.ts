/**
 * WordPress article importer (v1) — standard HTML posts only.
 * Usage: npm run import:article -- --slug what-is-peering
 *        npm run import:article -- --report
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { XMLParser } from 'fast-xml-parser'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { textToLexical } from '../src/lib/lexical'

const WP_EXPORT = process.env.WP_EXPORT_PATH || '../migration/source/wordpress/onixdatacentre.WordPress.2026-08-07.xml'

type Report = {
  slug: string
  status: 'success' | 'skipped' | 'error'
  warnings: string[]
  unsupported: string[]
  missingMedia: string[]
  seoMapped: boolean
  legacyPath?: string
}

function getMeta(item: Record<string, unknown>, key: string): string {
  const meta = (item as { 'wp:postmeta'?: unknown })['wp:postmeta']
  const list = Array.isArray(meta) ? meta : meta ? [meta] : []
  for (const entry of list) {
    const k = (entry as { 'wp:meta_key'?: string })['wp:meta_key']
    if (k === key) return String((entry as { 'wp:meta_value'?: string })['wp:meta_value'] || '')
  }
  return ''
}

function hasElementorData(item: Record<string, unknown>): boolean {
  return Boolean(getMeta(item, '_elementor_data'))
}

function parseExport(exportPath: string) {
  const xml = fs.readFileSync(exportPath, 'utf-8')
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', parseTagValue: false })
  const data = parser.parse(xml)
  const items = data?.rss?.channel?.item
  return Array.isArray(items) ? items : items ? [items] : []
}

function loadSeoFromExtracted(legacyPath: string) {
  const seoFile = path.resolve(process.cwd(), '../migration/extracted/seo-metadata.json')
  if (!fs.existsSync(seoFile)) return null
  const data = JSON.parse(fs.readFileSync(seoFile, 'utf-8')) as {
    live_crawl_supplement?: Array<{
      path?: string
      live_title?: string
      live_meta_description?: string
      live_canonical?: string
    }>
  }
  return data.live_crawl_supplement?.find((entry) => entry.path === legacyPath) || null
}

function extractImages(html: string): string[] {
  const matches = html.match(/wp-content\/uploads\/[^"'\s>]+/g) || []
  return [...new Set(matches)]
}

async function importArticle(slug: string): Promise<Report> {
  const report: Report = { slug, status: 'success', warnings: [], unsupported: [], missingMedia: [], seoMapped: false }
  const exportPath = path.resolve(process.cwd(), WP_EXPORT)
  if (!fs.existsSync(exportPath)) {
    report.status = 'error'
    report.warnings.push(`Export not found: ${exportPath}`)
    return report
  }

  const items = parseExport(exportPath)
  const item = items.find((i: Record<string, string>) => i['wp:post_name'] === slug && i['wp:post_type'] === 'post')
  if (!item) {
    report.status = 'error'
    report.warnings.push('Post not found in export')
    return report
  }

  if (hasElementorData(item)) {
    report.warnings.push('Post has Elementor _elementor_data — manual conversion recommended')
    report.unsupported.push('elementor_page_builder')
  }

  const content = String(item['content:encoded'] || '')
  if (content.includes('[caption')) report.unsupported.push('wp_caption_shortcode')
  if (content.includes('<!-- wp:')) report.unsupported.push('gutenberg_blocks')
  if (/youtube|vimeo|iframe/i.test(content)) report.unsupported.push('embedded_video')

  const images = extractImages(content)
  report.missingMedia = images

  const payload = await getPayload({ config })
  const wpId = Number(item['wp:post_id'])
  const existing = await payload.find({
    collection: 'articles',
    where: { 'legacy.wordpressId': { equals: wpId } },
    limit: 1,
  })

  const date = String(item['wp:post_date'] || new Date().toISOString())
  const d = new Date(date)
  const legacyPath = `/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}/${slug}/`
  report.legacyPath = legacyPath

  const seoTitle = getMeta(item, '_yoast_wpseo_title')
  const seoDesc = getMeta(item, '_yoast_wpseo_metadesc')
  const extractedSeo = loadSeoFromExtracted(legacyPath)
  report.seoMapped = Boolean(seoTitle || seoDesc || extractedSeo?.live_title)

  const articleData = {
    title: String(item.title || slug),
    slug,
    publishedAt: date,
    excerpt: String(item['excerpt:encoded'] || ''),
    _status: 'published' as const,
    legacy: {
      wordpressId: wpId,
      legacyPath,
      legacyUrl: `https://onixdatacentres.com${legacyPath}`,
    },
    seo: {
      title: seoTitle || extractedSeo?.live_title || undefined,
      description: seoDesc || extractedSeo?.live_meta_description || undefined,
      canonicalUrl: extractedSeo?.live_canonical || `https://onixdatacentres.com${legacyPath}`,
    },
    content: textToLexical(content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 5000)),
  }

  if (existing.docs.length) {
    await payload.update({ collection: 'articles', id: existing.docs[0].id, data: articleData })
    report.warnings.push('Updated existing article (idempotent)')
  } else {
    await payload.create({ collection: 'articles', data: articleData })
  }

  return report
}

async function main() {
  const args = process.argv.slice(2)
  const slugs = args.includes('--report')
    ? ['what-is-peering', 'africa-digital-cloud-resilience']
    : [args[args.indexOf('--slug') + 1] || 'what-is-peering']

  const reports: Report[] = []
  for (const slug of slugs) {
    reports.push(await importArticle(slug))
  }

  const outDir = path.resolve(process.cwd(), '../migration/reports')
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, 'article-import-report.json')
  fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), reports }, null, 2))
  console.log(JSON.stringify(reports, null, 2))
  console.log(`Report written to ${outPath}`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
