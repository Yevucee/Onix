/**
 * Read-only Playwright audit of live production site.
 * Extracts screenshots, computed styles, DOM structure, and image assets.
 *
 * Usage: npx tsx scripts/visual-audit/live-site-audit.ts [live|staging|both]
 */
import { chromium, type Page } from 'playwright'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { join } from 'path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const OUT_DIR = join(process.cwd(), '..', 'visual-rebuild', 'audit')
const LIVE_URL = 'https://onixdatacentres.com'
const STAGING_URL = process.env.STAGING_URL || 'https://onix-staging-web-production.up.railway.app'

type StyleSnapshot = Record<string, string | number | null>

async function extractStyles(page: Page, selector: string, label: string): Promise<StyleSnapshot | null> {
  return page.evaluate(
    ({ sel, lbl }) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const cs = getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      const props = [
        'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
        'color', 'backgroundColor', 'backgroundImage', 'paddingTop', 'paddingBottom',
        'paddingLeft', 'paddingRight', 'marginTop', 'marginBottom',
        'maxWidth', 'width', 'height', 'minHeight', 'borderRadius',
        'borderColor', 'borderWidth', 'boxShadow', 'textAlign', 'textTransform',
        'display', 'flexDirection', 'gap', 'justifyContent', 'alignItems',
        'position', 'top', 'zIndex',
      ]
      const out: Record<string, string | number | null> = { _label: lbl, _selector: sel }
      for (const p of props) {
        out[p] = (cs as unknown as Record<string, string>)[p] || null
      }
      out._rect = JSON.stringify({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
      return out
    },
    { sel: selector, lbl: label },
  )
}

async function auditPage(page: Page, url: string, name: string, viewport: { width: number; height: number }, auth?: { user: string; pass: string }) {
  await page.setViewportSize(viewport)
  if (auth) {
    await page.setExtraHTTPHeaders({
      Authorization: 'Basic ' + Buffer.from(`${auth.user}:${auth.pass}`).toString('base64'),
    })
  }
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2000)

  const suffix = `${name}-${viewport.width}`
  const screenshotPath = join(OUT_DIR, 'screenshots', `${suffix}.png`)
  await page.screenshot({ path: screenshotPath, fullPage: true })

  // Discover sections by headings
  const sections = await page.evaluate(() => {
    const results: Array<{
      tag: string
      text: string
      top: number
      images: string[]
      bgImage: string | null
    }> = []

    const headings = document.querySelectorAll('h1, h2, h3, .elementor-heading-title')
    const seen = new Set<string>()
    for (const h of headings) {
      const text = (h.textContent || '').trim().replace(/\s+/g, ' ')
      if (!text || text.length < 3 || seen.has(text)) continue
      seen.add(text)
      const section = h.closest('section, .elementor-section, .e-con, header, footer') || h.parentElement
      const imgs: string[] = []
      let bgImage: string | null = null
      if (section) {
        section.querySelectorAll('img').forEach((img) => {
          const src = img.getAttribute('src') || ''
          if (src && !src.includes('data:')) imgs.push(src)
        })
        const cs = getComputedStyle(section as Element)
        const bg = cs.backgroundImage
        if (bg && bg !== 'none') bgImage = bg
      }
      const rect = h.getBoundingClientRect()
      results.push({ tag: h.tagName, text, top: Math.round(rect.top), images: imgs, bgImage })
    }
    return results
  })

  // All images on page
  const images = await page.evaluate(() => {
    const imgs: Array<{ src: string; alt: string; width: number; height: number; top: number }> = []
    document.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || ''
      if (!src || src.includes('data:') || src.includes('gravatar')) return
      const rect = img.getBoundingClientRect()
      imgs.push({
        src,
        alt: img.getAttribute('alt') || '',
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
      })
    })
    return imgs
  })

  // Style snapshots for key elements
  const styleSelectors = [
    ['header, .site-header, .elementor-location-header', 'header'],
    ['header img, .custom-logo', 'header-logo'],
    ['nav a, .elementor-nav-menu > li > a', 'nav-link'],
    ['.elementor-button, a.elementor-button, header .elementor-button', 'cta-button'],
    ['h1, .elementor-heading-title', 'h1'],
    ['h2.elementor-heading-title, main h2', 'h2'],
    ['footer, .elementor-location-footer', 'footer'],
    ['body', 'body'],
  ]

  const styles: Record<string, StyleSnapshot | null> = {}
  for (const [sel, label] of styleSelectors) {
    styles[label] = await extractStyles(page, sel, label)
  }

  // Header nav items
  const navItems = await page.evaluate(() => {
    const items: Array<{ text: string; href: string; hasDropdown: boolean }> = []
    document.querySelectorAll('.menu-item, .elementor-nav-menu > li').forEach((li) => {
      const link = li.querySelector(':scope > a')
      if (!link) return
      const text = (link.textContent || '').trim()
      const href = link.getAttribute('href') || ''
      if (!text) return
      const hasDropdown = li.classList.contains('menu-item-has-children') || !!li.querySelector('.sub-menu')
      if (!items.some((i) => i.text === text && i.href === href)) {
        items.push({ text, href, hasDropdown })
      }
    })
    return items.slice(0, 20)
  })

  // Footer links
  const footerLinks = await page.evaluate(() => {
    const footer = document.querySelector('footer') || document.body
    const links: Array<{ text: string; href: string }> = []
    footer.querySelectorAll('a').forEach((a) => {
      const text = (a.textContent || '').trim()
      const href = a.getAttribute('href') || ''
      if (text && href) links.push({ text, href })
    })
    return links.slice(0, 30)
  })

  const report = {
    url,
    name,
    viewport,
    timestamp: new Date().toISOString(),
    screenshot: screenshotPath,
    sections,
    images,
    styles,
    navItems,
    footerLinks,
  }

  writeFileSync(join(OUT_DIR, `${suffix}.json`), JSON.stringify(report, null, 2))
  return { report, screenshotPath }
}

function diffScreenshots(pathA: string, pathB: string, outPath: string): number {
  const imgA = PNG.sync.read(readFileSync(pathA))
  const imgB = PNG.sync.read(readFileSync(pathB))
  const width = Math.min(imgA.width, imgB.width)
  const height = Math.min(imgA.height, imgB.height)
  const diff = new PNG({ width, height })
  const mismatched = pixelmatch(imgA.data, imgB.data, diff.data, width, height, { threshold: 0.1 })
  writeFileSync(outPath, PNG.sync.write(diff))
  return mismatched / (width * height)
}

async function main() {
  const mode = process.argv[2] || 'both'
  mkdirSync(join(OUT_DIR, 'screenshots'), { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const results: string[] = []

  const auth = process.env.STAGING_AUTH_USER && process.env.STAGING_AUTH_PASSWORD
    ? { user: process.env.STAGING_AUTH_USER, pass: process.env.STAGING_AUTH_PASSWORD }
    : undefined

  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    if (mode === 'live' || mode === 'both') {
      const page = await browser.newPage()
      const { screenshotPath } = await auditPage(page, LIVE_URL, 'live', vp)
      results.push(`Live ${vp.width}px: ${screenshotPath}`)
      await page.close()
    }
    if (mode === 'staging' || mode === 'both') {
      const page = await browser.newPage()
      const { screenshotPath } = await auditPage(page, STAGING_URL, 'staging', vp, auth)
      results.push(`Staging ${vp.width}px: ${screenshotPath}`)
      await page.close()
    }
    if (mode === 'both') {
      const livePath = join(OUT_DIR, 'screenshots', `live-${vp.width}.png`)
      const stagingPath = join(OUT_DIR, 'screenshots', `staging-${vp.width}.png`)
      try {
        const diffRatio = diffScreenshots(livePath, stagingPath, join(OUT_DIR, 'screenshots', `diff-${vp.width}.png`))
        results.push(`Diff ${vp.width}px: ${(diffRatio * 100).toFixed(1)}% pixels differ`)
      } catch (e) {
        results.push(`Diff ${vp.width}px: skipped (${e})`)
      }
    }
  }

  await browser.close()
  console.log(results.join('\n'))
  console.log(`\nAudit output: ${OUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
