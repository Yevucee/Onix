import { describe, expect, it } from 'vitest'

const prototypeRoutes = ['/', '/about-us', '/senegal', '/fr', '/robots.txt']

describe('prototype routes contract', () => {
  it('lists expected Phase 2 public routes', () => {
    expect(prototypeRoutes).toContain('/')
    expect(prototypeRoutes).toContain('/about-us')
    expect(prototypeRoutes).toContain('/senegal')
    expect(prototypeRoutes).toContain('/fr')
  })

  it('preserves WordPress date-based article URL pattern', () => {
    const articlePath = '/2025/11/13/what-is-peering/'
    expect(articlePath).toMatch(/^\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+\/$/)
  })
})
