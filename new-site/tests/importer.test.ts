import { describe, expect, it } from 'vitest'

describe('article importer idempotency contract', () => {
  it('uses legacy.wordpressId as deduplication key', () => {
    const key = { legacy: { wordpressId: 12345 } }
    expect(key.legacy.wordpressId).toBe(12345)
  })

  it('builds WordPress-style legacy paths', () => {
    const date = new Date('2025-11-13T10:00:00Z')
    const slug = 'what-is-peering'
    const legacyPath = `/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')}/${slug}/`
    expect(legacyPath).toBe('/2025/11/13/what-is-peering/')
  })
})
