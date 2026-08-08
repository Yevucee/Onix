import sanitizeHtml from 'sanitize-html'
import { load } from 'cheerio'
import type { LexicalRoot } from '../lib/lexical'

type LexicalChild = Record<string, unknown>

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'a', 'ul', 'ol', 'li',
  'h2', 'h3', 'h4', 'h5', 'blockquote', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'div', 'span',
]

export type HtmlConversionWarning = {
  type: string
  message: string
}

export type HtmlConversionResult = {
  content: LexicalRoot
  warnings: HtmlConversionWarning[]
  legacyMediaUrls: string[]
  blocks: Array<{ blockType: string; [key: string]: unknown }>
}

function textNode(text: string, format = 0): LexicalChild {
  return { type: 'text', text, format, version: 1, mode: 'normal', style: '', detail: 0 }
}

function elementNode(type: string, children: LexicalChild[], extra: Record<string, unknown> = {}): LexicalChild {
  return {
    type,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children,
    ...extra,
  }
}

function paragraph(children: LexicalChild[]): LexicalChild {
  if (!children.length) children = [textNode('')]
  return elementNode('paragraph', children)
}

function sanitize(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      b: 'strong',
      i: 'em',
    },
  })
}

export function convertHtmlToLexical(html: string): HtmlConversionResult {
  const warnings: HtmlConversionWarning[] = []
  const legacyMediaUrls: string[] = []
  const customBlocks: HtmlConversionResult['blocks'] = []
  const clean = sanitize(html)

  if (/\[caption|\[gallery|elementor-widget|_elementor/i.test(html)) {
    warnings.push({ type: 'shortcode_or_elementor_markup', message: 'Legacy shortcode/Elementor markup present in source' })
  }
  if (/<script|on\w+=/i.test(html)) {
    warnings.push({ type: 'removed_script', message: 'Script or event handlers removed during sanitization' })
  }

  const $ = load(`<div id="root">${clean}</div>`, { xml: false })
  const children: LexicalChild[] = []

  function walkInline(el: ReturnType<typeof $>): LexicalChild[] {
    const out: LexicalChild[] = []
    el.contents().each((_, node) => {
      if (node.type === 'text') {
        const t = 'data' in node ? String(node.data || '') : ''
        if (t) out.push(textNode(t))
        return
      }
      if (node.type !== 'tag') return
      const tag = node.tagName?.toLowerCase()
      const $node = $(node)
      if (tag === 'strong' || tag === 'b') {
        out.push({ ...textNode($node.text(), 1) })
      } else if (tag === 'em' || tag === 'i') {
        out.push({ ...textNode($node.text(), 2) })
      } else if (tag === 'a') {
        out.push(
          elementNode('link', walkInline($node), {
            fields: { url: $node.attr('href') || '#', newTab: $node.attr('target') === '_blank' },
          }),
        )
      } else if (tag === 'br') {
        out.push(elementNode('linebreak', []))
      } else {
        out.push(...walkInline($node))
      }
    })
    return out
  }

  function walkBlock(el: ReturnType<typeof $>) {
    const tag = el.prop('tagName')?.toLowerCase()
    if (!tag) return

    if (tag === 'img') {
      const src = el.attr('src') || ''
      if (src.includes('wp-content/uploads')) legacyMediaUrls.push(src)
      customBlocks.push({ blockType: 'image', legacyUrl: src, alt: el.attr('alt') || '', caption: el.attr('title') || '' })
      return
    }

    if (tag === 'figure') {
      const img = el.find('img').first()
      const src = img.attr('src') || ''
      if (src) {
        if (src.includes('wp-content/uploads')) legacyMediaUrls.push(src)
        customBlocks.push({
          blockType: 'imageWithCaption',
          legacyUrl: src,
          alt: img.attr('alt') || '',
          caption: el.find('figcaption').text().trim() || img.attr('title') || '',
        })
      }
      return
    }

    if (/^h[2-5]$/.test(tag)) {
      children.push(elementNode('heading', walkInline(el), { tag }))
      return
    }

    if (tag === 'p' || tag === 'div') {
      const inner = walkInline(el)
      if (inner.length) children.push(paragraph(inner))
      return
    }

    if (tag === 'blockquote') {
      children.push(elementNode('quote', [paragraph(walkInline(el))]))
      return
    }

    if (tag === 'ul' || tag === 'ol') {
      const items: LexicalChild[] = []
      el.children('li').each((_, li) => {
        items.push(elementNode('listitem', [paragraph(walkInline($(li)))]))
      })
      children.push(elementNode('list', items, { listType: tag === 'ol' ? 'number' : 'bullet' }))
      return
    }

    if (tag === 'table') {
      const rows: string[][] = []
      el.find('tr').each((_, tr) => {
        const cells: string[] = []
        $(tr)
          .find('th,td')
          .each((__, cell) => {
            cells.push($(cell).text().trim())
          })
        if (cells.length) rows.push(cells)
      })
      customBlocks.push({ blockType: 'table', rows })
      return
    }

    if (tag === 'hr') {
      customBlocks.push({ blockType: 'divider' })
      return
    }

    if (/iframe|video/i.test(el.html() || '')) {
      const src = el.find('iframe').attr('src') || el.attr('src') || ''
      if (src) customBlocks.push({ blockType: 'externalVideo', url: src })
      else warnings.push({ type: 'video_unparsed', message: 'Could not extract video URL' })
    }
  }

  $('#root')
    .children()
    .each((_, el) => walkBlock($(el)))

  if (!children.length && !customBlocks.length) {
    const text = $.text().trim()
    if (text) children.push(paragraph([textNode(text)]))
  }

  const root = {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: (children.length ? children : [paragraph([textNode(' ')])]) as LexicalRoot['root']['children'],
    },
  }

  return { content: root as LexicalRoot, warnings, legacyMediaUrls: [...new Set(legacyMediaUrls)], blocks: customBlocks }
}

export function normalizeInternalLinks(html: string, siteHost = 'onixdatacentres.com'): { html: string; broken: string[] } {
  const broken: string[] = []
  const $ = load(html)
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (href.includes(siteHost)) {
      try {
        const u = new URL(href)
        $(el).attr('href', `${u.pathname}${u.search}${u.hash}`)
      } catch {
        broken.push(href)
      }
    }
  })
  return { html: $.html(), broken }
}
