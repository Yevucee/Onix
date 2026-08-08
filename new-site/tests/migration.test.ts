import { describe, expect, it } from 'vitest'
import { convertHtmlToLexical } from '../src/migration/html-to-lexical'
import { getMasterKey, isDerivativeFilename } from '../src/migration/media-utils'
import { matchRedirect } from '../src/lib/redirects'
import { getLegacyPostPath } from '../src/migration/wp-export'

describe('HTML to Lexical', () => {
  it('converts paragraphs and headings', () => {
    const { content } = convertHtmlToLexical('<h2>Title</h2><p>Hello <strong>world</strong></p>')
    expect(content.root.children.length).toBeGreaterThan(0)
  })

  it('converts lists', () => {
    const { content } = convertHtmlToLexical('<ul><li>One</li><li>Two</li></ul>')
    const list = content.root.children.find((c) => (c as { type?: string }).type === 'list')
    expect(list).toBeDefined()
  })

  it('extracts legacy media URLs from images', () => {
    const { legacyMediaUrls } = convertHtmlToLexical(
      '<img src="https://onixdatacentres.com/wp-content/uploads/2025/01/test.jpg" alt="test" />',
    )
    expect(legacyMediaUrls.length).toBe(1)
  })
})

describe('media derivatives', () => {
  it('detects WordPress dimension suffixes', () => {
    expect(isDerivativeFilename('photo-150x150.jpg')).toBe(true)
    expect(isDerivativeFilename('photo-scaled.jpg')).toBe(true)
    expect(isDerivativeFilename('photo.jpg')).toBe(false)
  })

  it('groups masters by base name', () => {
    expect(getMasterKey('photo-1024x683.jpg')).toBe('photo.jpg')
  })
})

describe('redirects', () => {
  it('matches source paths', () => {
    expect(matchRedirect('/mamadoukebe/')).toBeDefined()
  })
})

describe('article URL preservation', () => {
  it('builds WordPress date paths', () => {
    const path = getLegacyPostPath({
      'wp:post_name': 'what-is-peering',
      'wp:post_type': 'post',
      'wp:post_date': '2025-11-13 10:00:00',
    })
    expect(path).toBe('/2025/11/13/what-is-peering/')
  })
})
