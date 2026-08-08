import path from 'path'
import { fileURLToPath } from 'url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

export const MIGRATION_CONFIG = {
  repoRoot,
  wpExport:
    process.env.WP_EXPORT_PATH ||
    path.join(repoRoot, 'migration/source/wordpress/onixdatacentre.WordPress.2026-08-07.xml'),
  uploadsZip: path.join(repoRoot, 'migration/source/media/uploads.zip'),
  uploadsExtractDir:
    process.env.UPLOADS_EXTRACT_DIR || path.join(repoRoot, '.migration-work'),
  reportsDir: path.join(repoRoot, 'migration/reports'),
  extractedDir: path.join(repoRoot, 'migration/extracted'),
  mediaMapCsv: path.join(repoRoot, 'migration/reports/media-migration-map.csv'),
  pageScopeCsv: path.join(repoRoot, 'migration/reports/page-scope-review.csv'),
  urlMapCsv: path.join(repoRoot, 'migration/url-map.csv'),
  seoMetadataJson: path.join(repoRoot, 'migration/extracted/seo-metadata.json'),
  redirectsJson: path.join(repoRoot, 'migration/extracted/redirects.json'),
  redirectsDataJson: path.join(repoRoot, 'new-site/data/redirects.json'),
  uploadsUrlPrefix: 'https://onixdatacentres.com/wp-content/uploads/',
  uploadsPathPrefix: '/wp-content/uploads/',
} as const
