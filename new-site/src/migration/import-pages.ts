import type { Payload } from 'payload'
import { readCsv } from './csv'
import { MIGRATION_CONFIG } from './config'
import { normalizeInternalLinks } from './html-to-lexical'
import { parseElementorData } from './elementor-parser'
import { resolveLegacyMediaUrl, loadMediaMap } from './import-media'
import { getMeta, getPageLegacyPath, getPages, hasElementorData, loadWpItems } from './wp-export'
import { readFileSync } from 'fs'

type PageBlock = Record<string, unknown> & { blockType: string }

function loadSeoByPath(legacyPath: string) {
  try {
    const data = JSON.parse(readFileSync(MIGRATION_CONFIG.seoMetadataJson, 'utf-8')) as {
      live_crawl_supplement?: Array<{
        path?: string
        live_title?: string
        live_meta_description?: string
        live_canonical?: string
      }>
    }
    return data.live_crawl_supplement?.find((e) => e.path === legacyPath)
  } catch {
    return undefined
  }
}

function htmlToPageBlocks(html: string): PageBlock[] {
  const blocks: PageBlock[] = []
  const { html: normalized } = normalizeInternalLinks(html)
  if (normalized.trim()) {
    blocks.push({ blockType: 'richText', body: normalized })
  }
  return blocks
}

function elementorToPageBlocks(json: string): PageBlock[] {
  const parsed = parseElementorData(json)
  const blocks: PageBlock[] = []
  const mediaMap = loadMediaMap()

  for (const block of parsed.blocks) {
    if (block.blockType === 'image' && block.legacyUrl) {
      const mediaId = resolveLegacyMediaUrl(String(block.legacyUrl), mediaMap)
      blocks.push({
        blockType: 'imageText',
        heading: '',
        body: String(block.alt || ''),
        image: mediaId || undefined,
        imagePosition: 'right',
      })
    } else if (block.blockType === 'gallery') {
      const urls = (block.legacyUrls as string[]) || []
      blocks.push({
        blockType: 'gallery',
        images: urls.map((url) => ({
          image: resolveLegacyMediaUrl(url, mediaMap) || undefined,
          caption: '',
        })),
      })
    } else if (block.blockType === 'video' || block.blockType === 'externalVideo') {
      blocks.push({ blockType: 'video', url: String(block.url || ''), caption: '' })
    } else if (block.blockType === 'cta') {
      blocks.push({
        blockType: 'cta',
        heading: String(block.heading || ''),
        body: '',
        buttonLabel: String(block.buttonLabel || 'Learn more'),
        buttonUrl: String(block.buttonUrl || '/contact-us'),
      })
    } else if (block.blockType === 'divider') {
      // skip standalone dividers in page blocks
    }
  }

  const textContent = (parsed.content.root.children as Array<{ type: string; children?: Array<{ text?: string }> }>)
    .map((child) => {
      if (child.type === 'heading') {
        const text = child.children?.map((c) => c.text || '').join('') || ''
        return `<h2>${text}</h2>`
      }
      if (child.type === 'paragraph') {
        const text = child.children?.map((c) => c.text || '').join('') || ''
        return text ? `<p>${text}</p>` : ''
      }
      return ''
    })
    .filter(Boolean)
    .join('\n')

  if (textContent) {
    blocks.unshift({ blockType: 'richText', body: textContent })
  }

  return blocks.length ? blocks : [{ blockType: 'richText', body: '<p>Content migrated — review in CMS.</p>' }]
}

function slugFromPath(legacyPath: string): string {
  const parts = legacyPath.replace(/^\/|\/$/g, '').split('/').filter(Boolean)
  return parts.join('-') || 'home'
}

export type PageImportResult = {
  legacyPath: string
  slug: string
  title: string
  status: 'imported' | 'updated' | 'skipped' | 'missing'
  notes: string
}

const SKIP_PATHS = new Set(['/blog/', '/news/', '/contact-us/', '/about-us/', '/senegal/', '/'])

export async function importCorporatePages(payload: Payload): Promise<PageImportResult[]> {
  const scope = readCsv(MIGRATION_CONFIG.pageScopeCsv)
  const migratePaths = scope.filter((r) => r.recommendation === 'MIGRATE').map((r) => r.path)
  const items = loadWpItems()
  const pages = getPages(items)
  const results: PageImportResult[] = []

  for (const legacyPath of migratePaths) {
    if (SKIP_PATHS.has(legacyPath)) {
      results.push({ legacyPath, slug: '', title: '', status: 'skipped', notes: 'Dedicated route exists' })
      continue
    }

    if (legacyPath.includes('/author/')) {
      results.push({ legacyPath, slug: '', title: '', status: 'skipped', notes: 'Author archive — redirect' })
      continue
    }

    const leadershipSlugs = [
      'bretttucker', 'edemscott', 'kevinopata', 'leonardmckinlay', 'mamadoukebe', 'michaelthompson',
      'paulrichards', 'razak-awudulai', 'razak-awudulai1', 'samuel-osew-kwatia', 'samuelpolley',
      'serwaakankam', 'stephenappiah', 'eric-tenkorang', 'baraawafall',
    ]
    const slugPart = legacyPath.replace(/^\/|\/$/g, '').split('/').pop() || ''
    if (leadershipSlugs.includes(slugPart) || legacyPath === '/baraawafall/') {
      results.push({ legacyPath, slug: slugPart, title: '', status: 'skipped', notes: 'Leadership collection' })
      continue
    }

    if (legacyPath === '/home/cfo-roi/') {
      results.push({ legacyPath, slug: 'home-cfo-roi', title: 'CFO ROI', status: 'skipped', notes: 'Dedicated ROI route' })
      continue
    }

    const page = pages.find((p) => getPageLegacyPath(p) === legacyPath) ||
      pages.find((p) => `/${String(p['wp:post_name'])}/` === legacyPath)

    if (!page) {
      results.push({ legacyPath, slug: slugFromPath(legacyPath), title: '', status: 'missing', notes: 'No WP page in export' })
      continue
    }

    const title = String(page.title || slugPart)
    const slug = slugFromPath(legacyPath)
    const wpId = Number(page['wp:post_id'])
    let blocks: PageBlock[]

    if (hasElementorData(page)) {
      blocks = elementorToPageBlocks(getMeta(page, '_elementor_data'))
    } else {
      blocks = htmlToPageBlocks(String(page['content:encoded'] || ''))
    }

    if (legacyPath === '/home/' || legacyPath === '/fr/home-francais/') {
      blocks.unshift({
        blockType: 'hero',
        eyebrow: 'Connecting Africa to the Globe',
        heading: title,
        subheading: String(page['excerpt:encoded'] || '').replace(/<[^>]+>/g, '').trim() || undefined,
        ctaLabel: 'Contact us',
        ctaUrl: legacyPath.startsWith('/fr') ? '/fr/contactez-nous' : '/contact-us',
      })
    }

    const crawl = loadSeoByPath(legacyPath)
    const data = {
      title,
      slug,
      pageType: legacyPath === '/home/' || legacyPath === '/fr/home-francais/' ? ('homepage' as const) : ('corporate' as const),
      _status: 'published' as const,
      blocks,
      legacy: { wordpressId: wpId, legacyPath, legacyUrl: `https://onixdatacentres.com${legacyPath}` },
      seo: {
        title: getMeta(page, '_yoast_wpseo_title') || crawl?.live_title || title,
        description: getMeta(page, '_yoast_wpseo_metadesc') || crawl?.live_meta_description || undefined,
        canonicalUrl: crawl?.live_canonical || `https://onixdatacentres.com${legacyPath}`,
      },
    }

    const existing = await payload.find({
      collection: 'pages',
      where: { 'legacy.legacyPath': { equals: legacyPath } },
      limit: 1,
    })

    if (existing.docs[0]) {
      await payload.update({ collection: 'pages', id: existing.docs[0].id, data: data as never })
      results.push({ legacyPath, slug, title, status: 'updated', notes: 'Idempotent update' })
    } else {
      await payload.create({ collection: 'pages', data: data as never })
      results.push({ legacyPath, slug, title, status: 'imported', notes: '' })
    }
  }

  return results
}
