import { describe, expect, it, vi } from 'vitest'
import { STAGING_ROBOTS, getRobotsTxtBody, getStagingHeaders, getStagingRobotsMeta, hasGlobalNoindex } from '../src/lib/staging'

describe('staging protection', () => {
  it('adds noindex metadata when SITE_ENV=staging', () => {
    vi.stubEnv('SITE_ENV', 'staging')
    const robots = getStagingRobotsMeta()
    expect(robots).toBeDefined()
    expect(robots && typeof robots === 'object' && robots.index).toBe(false)
  })

  it('adds X-Robots-Tag header when SITE_ENV=staging', () => {
    vi.stubEnv('SITE_ENV', 'staging')
    expect(getStagingHeaders()['X-Robots-Tag']).toBe(STAGING_ROBOTS)
  })

  it('disallows all crawlers in staging robots.txt', () => {
    vi.stubEnv('SITE_ENV', 'staging')
    expect(getRobotsTxtBody()).toContain('Disallow: /')
  })
})

describe('production safety', () => {
  it('does not add global noindex when SITE_ENV=production', () => {
    vi.stubEnv('SITE_ENV', 'production')
    expect(getStagingRobotsMeta()).toBeUndefined()
    expect(hasGlobalNoindex(getStagingRobotsMeta())).toBe(false)
  })

  it('allows crawling in production robots.txt', () => {
    vi.stubEnv('SITE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://onixdatacentres.com')
    const body = getRobotsTxtBody()
    expect(body).toContain('Allow: /')
    expect(body).not.toContain('Disallow: /')
  })
})
