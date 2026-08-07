import type { Metadata } from 'next'
import { getSiteEnv, isStaging } from './env'

export const STAGING_ROBOTS = 'noindex, nofollow, noarchive'

export function getStagingRobotsMeta(): Metadata['robots'] | undefined {
  if (!isStaging()) return undefined
  return {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  }
}

export function getStagingHeaders(): Record<string, string> {
  if (!isStaging()) return {}
  return {
    'X-Robots-Tag': STAGING_ROBOTS,
  }
}

export function getRobotsTxtBody(): string {
  if (isStaging()) {
    return `User-agent: *\nDisallow: /\n`
  }
  return `User-agent: *\nAllow: /\nSitemap: ${process.env.NEXT_PUBLIC_SITE_URL || ''}/sitemap.xml\n`
}

/** Returns true if a global noindex directive is present (used in production safety tests). */
export function hasGlobalNoindex(metaRobots: Metadata['robots']): boolean {
  if (!metaRobots) return false
  if (metaRobots === 'noindex' || metaRobots === 'noindex, nofollow') return true
  if (typeof metaRobots === 'object' && metaRobots.index === false) return true
  return false
}

export function assertProductionSafe(): void {
  if (getSiteEnv() === 'production' && isStaging()) {
    throw new Error('Invalid SITE_ENV configuration')
  }
}
