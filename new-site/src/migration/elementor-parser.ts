import type { HtmlConversionResult } from './html-to-lexical'

type ElementorNode = {
  id?: string
  elType?: string
  widgetType?: string
  settings?: Record<string, unknown>
  elements?: ElementorNode[]
}

export type ElementorParseResult = HtmlConversionResult & {
  unsupportedWidgets: string[]
  widgetCounts: Record<string, number>
}

const SUPPORTED_WIDGETS = new Set([
  'heading',
  'text-editor',
  'image',
  'image-gallery',
  'image-carousel',
  'video',
  'button',
  'divider',
  'spacer',
  'icon',
  'icon-list',
  'html',
])

const PARTIAL_WIDGETS = new Set(['nested-elements', 'container', 'section', 'column'])

export function parseElementorData(json: string): ElementorParseResult {
  const unsupportedWidgets: string[] = []
  const widgetCounts: Record<string, number> = {}
  const warnings: HtmlConversionResult['warnings'] = []
  const legacyMediaUrls: string[] = []
  const blocks: HtmlConversionResult['blocks'] = []
  const children: Record<string, unknown>[] = []

  let tree: ElementorNode[] = []
  try {
    tree = JSON.parse(json) as ElementorNode[]
  } catch {
    warnings.push({ type: 'elementor_json_invalid', message: 'Could not parse _elementor_data JSON' })
    return emptyResult(warnings)
  }

  function walk(nodes: ElementorNode[]) {
    for (const node of nodes) {
      if (node.elType === 'widget' && node.widgetType) {
        const wt = node.widgetType
        widgetCounts[wt] = (widgetCounts[wt] || 0) + 1
        const settings = node.settings || {}

        if (SUPPORTED_WIDGETS.has(wt)) {
          mapWidget(wt, settings, blocks, children, legacyMediaUrls)
        } else if (!PARTIAL_WIDGETS.has(wt)) {
          unsupportedWidgets.push(wt)
          warnings.push({ type: 'unsupported_elementor_widget', message: `Widget: ${wt}` })
        }
      }
      if (node.elements?.length) walk(node.elements)
    }
  }

  walk(tree)

  return {
    content: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: children.length
          ? (children as HtmlConversionResult['content']['root']['children'])
          : [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', children: [{ type: 'text', text: '[Elementor content requires review]', format: 0, version: 1, mode: 'normal', style: '', detail: 0 }] }],
      },
    },
    warnings,
    legacyMediaUrls: [...new Set(legacyMediaUrls)],
    blocks,
    unsupportedWidgets: [...new Set(unsupportedWidgets)],
    widgetCounts,
  }
}

function mapWidget(
  wt: string,
  settings: Record<string, unknown>,
  blocks: HtmlConversionResult['blocks'],
  children: Record<string, unknown>[],
  legacyMediaUrls: string[],
) {
  if (wt === 'heading') {
    const title = String(settings.title || '')
    const size = String(settings.header_size || 'h2')
    if (title) {
      children.push({
        type: 'heading',
        tag: size,
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [{ type: 'text', text: title, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }],
      })
    }
  } else if (wt === 'text-editor') {
    const html = String(settings.editor || '')
    if (html) {
      const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      if (text) {
        children.push({
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [{ type: 'text', text, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }],
        })
      }
      for (const m of html.match(/wp-content\/uploads\/[^"'\s>]+/g) || []) {
        legacyMediaUrls.push(`https://onixdatacentres.com/${m}`)
      }
    }
  } else if (wt === 'image') {
    const url = String((settings.image as { url?: string })?.url || settings.image || '')
    if (url) {
      legacyMediaUrls.push(url)
      blocks.push({ blockType: 'image', legacyUrl: url, alt: String(settings.caption || '') })
    }
  } else if (wt === 'image-gallery' || wt === 'image-carousel') {
    const gallery =
      (settings.gallery as Array<{ url?: string }>) ||
      (settings.carousel as Array<{ url?: string }>) ||
      (settings.slides as Array<{ image?: { url?: string } }>)?.map((s) => ({ url: s.image?.url })) ||
      []
    const images = gallery.map((g) => g.url).filter(Boolean) as string[]
    images.forEach((u) => legacyMediaUrls.push(u))
    if (images.length) blocks.push({ blockType: 'gallery', legacyUrls: images })
  } else if (wt === 'video') {
    const url = String(settings.youtube_url || settings.vimeo_url || settings.hosted_url || '')
    if (url) blocks.push({ blockType: 'video', url })
  } else if (wt === 'button') {
    blocks.push({
      blockType: 'cta',
      heading: String(settings.text || ''),
      buttonUrl: String((settings.link as { url?: string })?.url || settings.link || ''),
      buttonLabel: String(settings.text || 'Learn more'),
    })
  } else if (wt === 'divider') {
    blocks.push({ blockType: 'divider' })
  } else if (wt === 'icon-list') {
    const items = (settings.icon_list as Array<{ text?: string }>) || []
    const text = items.map((i) => i.text).filter(Boolean).join(' • ')
    if (text) {
      children.push({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [{ type: 'text', text, format: 0, version: 1, mode: 'normal', style: '', detail: 0 }],
      })
    }
  }
}

function emptyResult(warnings: HtmlConversionResult['warnings']): ElementorParseResult {
  return {
    content: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [],
      },
    },
    warnings,
    legacyMediaUrls: [],
    blocks: [],
    unsupportedWidgets: [],
    widgetCounts: {},
  }
}

export function classifyWidgetSupport(widgetCounts: Record<string, number>) {
  const supported: string[] = []
  const partial: string[] = []
  const unsupported: string[] = []
  for (const w of Object.keys(widgetCounts)) {
    if (SUPPORTED_WIDGETS.has(w)) supported.push(w)
    else if (PARTIAL_WIDGETS.has(w)) partial.push(w)
    else unsupported.push(w)
  }
  return { supported, partial, unsupported }
}
