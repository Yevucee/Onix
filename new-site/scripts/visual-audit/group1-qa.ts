/**
 * Group 1 visual QA — compares live production vs staging for corporate pages.
 * Usage: npx tsx scripts/visual-audit/group1-qa.ts
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const OUT_DIR = join(process.cwd(), '..', 'visual-rebuild', 'audit', 'group1')
const LIVE = 'https://onixdatacentres.com'
const STAGING = process.env.STAGING_URL || 'https://onix-staging-web-production.up.railway.app'

const PAGES = [
  { name: 'about-us', live: '/about-us/', staging: '/about-us/' },
  { name: 'our-solutions', live: '/home/our-solutions/', staging: '/home/our-solutions/' },
  { name: 'infrastructure', live: '/home/infrastructure/', staging: '/home/infrastructure/' },
  { name: 'senegal', live: '/o-home/senegal/', staging: '/o-home/senegal/' },
  { name: 'leadership', live: '/o-home/bretttucker/', staging: '/o-home/bretttucker/' },
  { name: 'contact-us', live: '/contact-us/', staging: '/contact-us/' },
]

type PageAudit = {
  url: string
  title: string
  metaDescription: string
  canonical: string
  h1: string[]
  h2: string[]
  sections: string[]
  images: Array<{ src: string; alt: string; w: number; h: number }>
  ctas: Array<{ text: string; href: string }>
  hasForm: boolean
  stats: string[]
}

async function auditUrl(page: import('playwright').Page, base: string, path: string): Promise<PageAudit> {
  const url = new URL(path, base).href
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)

  return page.evaluate(() => {
    const title = document.title
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''
    const h1 = [...document.querySelectorAll('h1')].map((el) => (el.textContent || '').trim()).filter(Boolean)
    const h2 = [...document.querySelectorAll('h2')].map((el) => (el.textContent || '').trim()).filter(Boolean)
    const sections = [...document.querySelectorAll('h1,h2,h3')].map((el) => `${el.tagName}: ${(el.textContent || '').trim()}`).filter((t) => t.length > 5)
    const images = [...document.querySelectorAll('img')]
      .filter((img) => {
        const src = img.getAttribute('src') || ''
        return src && !src.includes('data:') && !src.includes('logo')
      })
      .map((img) => ({
        src: (img.getAttribute('src') || '').slice(0, 120),
        alt: img.getAttribute('alt') || '',
        w: Math.round(img.getBoundingClientRect().width),
        h: Math.round(img.getBoundingClientRect().height),
      }))
    const ctas = [...document.querySelectorAll('a')]
      .filter((a) => /contact|learn more|get in touch|send/i.test(a.textContent || ''))
      .map((a) => ({ text: (a.textContent || '').trim().slice(0, 60), href: a.getAttribute('href') || '' }))
      .slice(0, 10)
    const hasForm = !!document.querySelector('form')
    const stats = [...document.querySelectorAll('[class*="stat"], .elementor-counter-number, p')]
      .map((el) => (el.textContent || '').trim())
      .filter((t) => /^\d|99\.|Tier|MW|kW|rack/i.test(t))
      .slice(0, 12)
    return { url: location.href, title, metaDescription, canonical, h1, h2, sections, images, ctas, hasForm, stats }
  })
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  mkdirSync(join(OUT_DIR, 'screenshots'), { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const auth = process.env.STAGING_AUTH_USER && process.env.STAGING_AUTH_PASSWORD
    ? { username: process.env.STAGING_AUTH_USER, password: process.env.STAGING_AUTH_PASSWORD }
    : undefined

  const results: Record<string, { live: PageAudit; staging: PageAudit }> = {}

  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    for (const p of PAGES) {
      const livePage = await browser.newPage()
      await livePage.setViewportSize(vp)
      const live = await auditUrl(livePage, LIVE, p.live)
      await livePage.screenshot({ path: join(OUT_DIR, 'screenshots', `live-${p.name}-${vp.width}.png`), fullPage: true })
      await livePage.close()

      const stagingPage = await browser.newPage()
      await stagingPage.setViewportSize(vp)
      if (auth) await stagingPage.setExtraHTTPHeaders({ Authorization: 'Basic ' + Buffer.from(`${auth.username}:${auth.password}`).toString('base64') })
      const staging = await auditUrl(stagingPage, STAGING, p.staging)
      await stagingPage.screenshot({ path: join(OUT_DIR, 'screenshots', `staging-${p.name}-${vp.width}.png`), fullPage: true })
      await stagingPage.close()

      if (vp.width === 1440) results[p.name] = { live, staging }
    }
  }

  await browser.close()
  writeFileSync(join(OUT_DIR, 'group1-audit.json'), JSON.stringify(results, null, 2))
  console.log('Wrote', join(OUT_DIR, 'group1-audit.json'))
}

main().catch((e) => { console.error(e); process.exit(1) })
