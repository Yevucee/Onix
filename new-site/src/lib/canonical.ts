/**
 * Production canonical URLs — always use live domain for SEO regardless of staging env.
 */
const PRODUCTION_ORIGIN = 'https://onixdatacentres.com'

export function productionCanonical(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const withSlash = normalized.endsWith('/') ? normalized : `${normalized}/`
  return `${PRODUCTION_ORIGIN}${withSlash}`
}
