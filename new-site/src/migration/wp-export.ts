import fs from 'fs'
import { XMLParser } from 'fast-xml-parser'
import { MIGRATION_CONFIG } from './config'

export type WpItem = Record<string, unknown>

let cachedItems: WpItem[] | null = null

export function loadWpItems(exportPath = MIGRATION_CONFIG.wpExport): WpItem[] {
  if (cachedItems) return cachedItems
  const xml = fs.readFileSync(exportPath, 'utf-8')
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseTagValue: false,
    isArray: (name) => name === 'item' || name === 'wp:postmeta' || name === 'category',
  })
  const data = parser.parse(xml)
  const items = data?.rss?.channel?.item
  cachedItems = Array.isArray(items) ? items : items ? [items] : []
  return cachedItems
}

export function getMeta(item: WpItem, key: string): string {
  const meta = item['wp:postmeta'] as WpItem[] | WpItem | undefined
  const list = Array.isArray(meta) ? meta : meta ? [meta] : []
  for (const entry of list) {
    if (entry['wp:meta_key'] === key) return String(entry['wp:meta_value'] || '')
  }
  return ''
}

export function getAttachments(items = loadWpItems()) {
  return items.filter((i) => i['wp:post_type'] === 'attachment')
}

export function getPublishedPosts(items = loadWpItems()) {
  return items.filter((i) => i['wp:post_type'] === 'post' && i['wp:status'] === 'publish')
}

export function getPages(items = loadWpItems()) {
  return items.filter((i) => i['wp:post_type'] === 'page')
}

export function getAttachmentFile(item: WpItem): string {
  return getMeta(item, '_wp_attached_file')
}

export function getPageLegacyPath(item: WpItem): string {
  const link = String(item.link || '')
  try {
    const url = new URL(link)
    let path = url.pathname
    if (!path.endsWith('/')) path += '/'
    return path
  } catch {
    return `/${String(item['wp:post_name'] || '')}/`
  }
}

export function getLegacyPostPath(item: WpItem): string {
  const slug = String(item['wp:post_name'] || '')
  const type = String(item['wp:post_type'] || '')
  if (type === 'page') return `/${slug}/`
  const date = String(item['wp:post_date'] || '')
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return `/${slug}/`
  return `/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}/${slug}/`
}

export function hasElementorData(item: WpItem): boolean {
  return Boolean(getMeta(item, '_elementor_data'))
}

export function buildAttachmentIndex(items = loadWpItems()) {
  const byId = new Map<number, WpItem>()
  const byPath = new Map<string, WpItem>()
  const byUrl = new Map<string, WpItem>()

  for (const att of getAttachments(items)) {
    const id = Number(att['wp:post_id'])
    const file = getAttachmentFile(att)
    byId.set(id, att)
    if (file) {
      byPath.set(file, att)
      byPath.set(file.toLowerCase(), att)
    }
    const link = String(att.link || '')
    if (link) byUrl.set(link, att)
    const guid = String((att.guid as { '#text'?: string })?.['#text'] || att.guid || '')
    if (guid) byUrl.set(guid, att)
  }
  return { byId, byPath, byUrl }
}

export function extractUploadPathsFromHtml(html: string): string[] {
  const matches = html.match(/wp-content\/uploads\/[^"'\s>)]+/g) || []
  return [...new Set(matches.map((m) => m.replace(/^.*wp-content\/uploads\//, '')))]
}
