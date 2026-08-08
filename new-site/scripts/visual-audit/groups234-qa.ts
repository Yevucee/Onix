#!/usr/bin/env tsx
/**
 * Groups 2–4 visual QA — compares live production vs staging.
 * Usage: npx tsx scripts/visual-audit/groups234-qa.ts
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const OUT_DIR = join(process.cwd(), '..', 'visual-rebuild', 'audit', 'groups234')
const LIVE = 'https://onixdatacentres.com'
const STAGING = process.env.STAGING_URL || 'https://onix-staging-web-production.up.railway.app'

const GROUP2 = [
  { name: 'finance', live: '/home/finance/', staging: '/home/finance/' },
  { name: 'virtual-machine', live: '/home/virtual-machine/', staging: '/home/virtual-machine/' },
  { name: 'services', live: '/services/', staging: '/services/' },
]

const GROUP3 = [
  { name: 'infrastructure-landing', live: '/home/infrastructure/', staging: '/home/infrastructure/' },
  { name: 'infrastructure-innovation', live: '/infrastructure-innovation/', staging: '/infrastructure-innovation/' },
]

const GROUP4 = [
  { name: 'certification', live: '/o-home/certification/', staging: '/o-home/certification/' },
  { name: 'linxaccra', live: '/linxaccra/', staging: '/linxaccra/' },
  { name: 'cfo-roi', live: '/home/cfo-roi/', staging: '/home/cfo-roi/' },
]

type PageAudit = {
  url: string
  title: string
  h1: string[]
  h2: string[]
  images: number
  ctas: Array<{ text: string; href: string }>
  hasForm: boolean
  status: number
}

async function auditUrl(page: import('playwright').Page, base: string, path: string): Promise<PageAudit> {
  const url = new URL(path, base).href
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1200)
  const data = await page.evaluate(() => ({
    title: document.title,
    h1: [...document.querySelectorAll('h1')].map((el) => (el.textContent || '').trim()).filter(Boolean),
    h2: [...document.querySelectorAll('h2')].map((el) => (el.textContent || '').trim()).filter(Boolean).slice(0, 15),
    images: [...document.querySelectorAll('img')].filter((img) => {
      const src = img.getAttribute('src') || ''
      return src && !src.includes('logo') && !src.includes('data:')
    }).length,
    ctas: [...document.querySelectorAll('a')]
      .filter((a) => /contact|talk to us|learn more|claim/i.test(a.textContent || ''))
      .map((a) => ({ text: (a.textContent || '').trim().slice(0, 50), href: a.getAttribute('href') || '' }))
      .slice(0, 8),
    hasForm: !!document.querySelector('form, input[type="number"]'),
  }))
  return { url, ...data, status: response?.status() || 0 }
}

async function screenshot(page: import('playwright').Page, base: string, path: string, name: string, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport)
  await page.goto(new URL(path, base).href, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1000)
  const file = join(OUT_DIR, 'screenshots', `${name}-${viewport.width}.png`)
  await page.screenshot({ path: file, fullPage: true })
}

async function auditGroup(pages: typeof GROUP2, label: string, browser: import('playwright').Browser) {
  const page = await browser.newPage()
  const results: Record<string, { live: PageAudit; staging: PageAudit }> = {}
  for (const p of pages) {
    const live = await auditUrl(page, LIVE, p.live)
    const staging = await auditUrl(page, STAGING, p.staging)
    results[p.name] = { live, staging }
    await screenshot(page, LIVE, p.live, `live-${p.name}`, { width: 1440, height: 900 })
    await screenshot(page, STAGING, p.staging, `staging-${p.name}`, { width: 1440, height: 900 })
    await screenshot(page, LIVE, p.live, `live-${p.name}`, { width: 390, height: 844 })
    await screenshot(page, STAGING, p.staging, `staging-${p.name}`, { width: 390, height: 844 })
    console.log(`${label}/${p.name}: live H1=${live.h1.length} staging H1=${staging.h1.length} images ${live.images}/${staging.images}`)
  }
  await page.close()
  return results
}

async function main() {
  mkdirSync(join(OUT_DIR, 'screenshots'), { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const group2 = await auditGroup(GROUP2, 'group2', browser)
  const group3 = await auditGroup(GROUP3, 'group3', browser)
  const group4 = await auditGroup(GROUP4, 'group4', browser)
  await browser.close()
  writeFileSync(join(OUT_DIR, 'audit.json'), JSON.stringify({ group2, group3, group4 }, null, 2))
  console.log(`Audit written to ${OUT_DIR}/audit.json`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
