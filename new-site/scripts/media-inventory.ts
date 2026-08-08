/**
 * Builds media migration inventory from WordPress XML export.
 * Run: npm run media:inventory
 */
import fs from 'fs'
import path from 'path'
import { XMLParser } from 'fast-xml-parser'

const WP_EXPORT = process.env.WP_EXPORT_PATH || '../migration/source/wordpress/onixdatacentre.WordPress.2026-08-07.xml'

function main() {
  const exportPath = path.resolve(process.cwd(), WP_EXPORT)
  const xml = fs.readFileSync(exportPath, 'utf-8')
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', parseTagValue: false })
  const data = parser.parse(xml)
  const items = data?.rss?.channel?.item
  const list = Array.isArray(items) ? items : items ? [items] : []

  const rows: Record<string, string>[] = []

  for (const item of list) {
    if (item['wp:post_type'] !== 'attachment') continue
    const meta = Array.isArray(item['wp:postmeta']) ? item['wp:postmeta'] : item['wp:postmeta'] ? [item['wp:postmeta']] : []
    let file = ''
    let alt = ''
    for (const m of meta) {
      if (m['wp:meta_key'] === '_wp_attached_file') file = m['wp:meta_value']
      if (m['wp:meta_key'] === '_wp_attachment_image_alt') alt = m['wp:meta_value']
    }
    const url = item.link || `https://onixdatacentres.com/wp-content/uploads/${file}`
    rows.push({
      legacy_attachment_id: String(item['wp:post_id'] || ''),
      filename: file.split('/').pop() || '',
      upload_path: file,
      original_url: url,
      mime_type: item['wp:post_mime_type'] || '',
      alt_text: alt,
      title: item.title || '',
      uploads_archive_status: 'pending',
    })
  }

  const header = Object.keys(rows[0] || {})
  const csv = [header.join(','), ...rows.map((r) => header.map((h) => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))].join('\n')

  const outPath = path.resolve(process.cwd(), '../migration/reports/media-migration-map.csv')
  fs.writeFileSync(outPath, csv)
  console.log(`Wrote ${rows.length} rows to ${outPath}`)
}

main()
