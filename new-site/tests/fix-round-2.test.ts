import { describe, expect, it } from 'vitest'
import { getRedirectRules } from '@/lib/redirects'
import { LIVE_CLIENT_SUPPORT_CTA, LIVE_FOOTER } from '@/data/live-site'

describe('fix round 2 contracts', () => {
  it('IMS Policy footer link points to hosted PDF', () => {
    const ims = LIVE_FOOTER.navigate.links.find((l) => l.label === 'IMS Policy')
    expect(ims?.url).toBe('/documents/IMS-SIMPLIFIED-12-May-2025.pdf')
    expect(ims?.external).toBe(true)
  })

  it('IMS Policy redirect exists', () => {
    const rules = getRedirectRules()
    expect(rules.some((r) => r.sourcePath === '/ims-policy/' && r.destination.includes('IMS-SIMPLIFIED'))).toBe(true)
  })

  it('Client support points to external portal', () => {
    expect(LIVE_CLIENT_SUPPORT_CTA.url).toBe('https://service.onixdatacentres.com/')
    expect(LIVE_CLIENT_SUPPORT_CTA.external).toBe(true)
  })

  it('Our Solutions legacy redirect still present', () => {
    const rules = getRedirectRules()
    expect(rules.some((r) => r.sourcePath === '/o-home/o-ghana/our-solutions/')).toBe(true)
  })
})
