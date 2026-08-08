/**
 * Deep section-level style extraction from live site.
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const OUT = join(process.cwd(), '..', 'visual-rebuild', 'audit', 'live-styles.json')

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('https://onixdatacentres.com', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)

  const data = await page.evaluate(() => {
    function snap(el: Element | null, label: string) {
      if (!el) return { label, found: false }
      const cs = getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      return {
        label,
        found: true,
        text: (el.textContent || '').trim().slice(0, 80),
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        styles: {
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          backgroundImage: cs.backgroundImage,
          padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
          margin: `${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`,
          borderRadius: cs.borderRadius,
          border: cs.border,
          boxShadow: cs.boxShadow,
          maxWidth: cs.maxWidth,
          width: cs.width,
          height: cs.height,
          minHeight: cs.minHeight,
          display: cs.display,
          gap: cs.gap,
          textAlign: cs.textAlign,
          textTransform: cs.textTransform,
          position: cs.position,
        },
      }
    }

    // Find elements by text content
    function findByText(tag: string, text: string): Element | null {
      for (const el of document.querySelectorAll(tag)) {
        if ((el.textContent || '').trim().includes(text)) return el
      }
      return null
    }

    // Header
    const header = document.querySelector('.site-header, header, .elementor-location-header') || document.querySelector('[data-elementor-type="header"]')
    const logo = document.querySelector('.custom-logo, header img')
    const ctaBtn = document.querySelector('.elementor-button, a.elementor-button')

    // Hero - find the welcome section
    const heroHeading = findByText('h2', 'Welcome to Onix')
    const heroSection = heroHeading?.closest('section, .elementor-section, .e-con') || heroHeading?.parentElement?.parentElement

    // Stats
    const statEls = [...document.querySelectorAll('.elementor-counter-number, .elementor-counter')].slice(0, 3)

    // Service cards in hero area
    const serviceCards = [...document.querySelectorAll('.elementor-image-box-wrapper, .wpr-flip-box, .elementor-flip-box')].slice(0, 5)

    // Who we are
    const whoHeading = findByText('h3', 'Who we are') || findByText('h2', 'Who we are')
    const whoSection = whoHeading?.closest('section, .elementor-section, .e-con')

    // Solutions band
    const solutionsHeading = findByText('h2', 'Our Solutions')
    const solutionsSection = solutionsHeading?.closest('section, .elementor-section, .e-con')

    // Infrastructure
    const infraHeading = findByText('h2', 'Infrastucture') || findByText('h2', 'Infrastructure')
    const infraSection = infraHeading?.closest('section, .elementor-section, .e-con')

    // Footer
    const footer = document.querySelector('footer') || findByText('h3', 'Navigate')?.closest('section, .elementor-section, .e-con')

    // All background images
    const bgImages: string[] = []
    document.querySelectorAll('*').forEach((el) => {
      const bg = getComputedStyle(el).backgroundImage
      if (bg && bg !== 'none' && bg.includes('url(')) {
        const rect = el.getBoundingClientRect()
        if (rect.height > 100 && rect.width > 200) {
          bgImages.push(`${bg} @ ${Math.round(rect.top)}px h=${Math.round(rect.height)}`)
        }
      }
    })

    // CTA button text in header
    const headerButtons = [...document.querySelectorAll('header .elementor-button, header a.elementor-button, .site-header .elementor-button')].map((b) => ({
      text: (b.textContent || '').trim(),
      href: b.getAttribute('href'),
      styles: snap(b, 'header-cta').styles,
    }))

    return {
      header: snap(header, 'header'),
      logo: logo ? { src: (logo as HTMLImageElement).src, ...snap(logo, 'logo') } : null,
      headerButtons,
      heroSection: snap(heroSection, 'hero-section'),
      heroHeading: snap(heroHeading, 'hero-heading'),
      heroButton: snap(heroHeading?.parentElement?.querySelector('.elementor-button, a') || null, 'hero-button'),
      whoSection: snap(whoSection, 'who-section'),
      whoHeading: snap(whoHeading, 'who-heading'),
      stats: statEls.map((el, i) => snap(el, `stat-${i}`)),
      solutionsSection: snap(solutionsSection, 'solutions-section'),
      solutionsHeading: snap(solutionsHeading, 'solutions-heading'),
      infraSection: snap(infraSection, 'infra-section'),
      infraHeading: snap(infraHeading, 'infra-heading'),
      footer: snap(footer, 'footer'),
      serviceCardCount: serviceCards.length,
      serviceCardSample: serviceCards[0] ? snap(serviceCards[0], 'service-card') : null,
      bgImages: [...new Set(bgImages)].slice(0, 15),
      // All unique colors used
      cssVars: {
        brandRed: 'rgb(236, 2, 35)',
        heading: 'rgb(28, 36, 75)',
        body: 'rgb(75, 79, 88)',
        bgAlt: 'rgb(245, 245, 245)',
        white: 'rgb(255, 255, 255)',
        footerBg: snap(footer, 'footer').styles?.backgroundColor,
      },
    }
  })

  writeFileSync(OUT, JSON.stringify(data, null, 2))
  console.log('Written:', OUT)
  await browser.close()
}

main().catch(console.error)
