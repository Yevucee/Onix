/**
 * Production design tokens extracted via Playwright audit of onixdatacentres.com
 * 2026-08-08 — computed styles from live rendered site
 */
export const ONIX_TOKENS = {
  colors: {
    brandRed: '#ec0223',
    brandRedHover: '#c9021e',
    heading: '#1c244b',
    body: '#4b4f58',
    muted: '#7a7a7a',
    white: '#ffffff',
    background: '#ffffff',
    backgroundAlt: '#f5f5f5',
    statsBg: '#f3f3f3',
    statsCardHover: '#ececec',
    footerBg: '#000000',
    footerLinkHover: '#ed0221',
    navy: '#1c244b',
    border: '#e5e5e5',
  },
  fonts: {
    primary: "'Poppins', sans-serif",
    stats: "'Montserrat', sans-serif",
  },
  typography: {
    body: { size: '16px', weight: 400, lineHeight: '22.4px' },
    nav: { size: '16px', weight: 500, lineHeight: '20px' },
    h1: { size: '40px', weight: 600, lineHeight: '48px' },
    h2: { size: '40px', weight: 600, lineHeight: '1.2em' },
    h3: { size: '22px', weight: 600, lineHeight: '1.3' },
    footerTagline: { size: '15px', weight: 400 },
    footerCopyright: { size: '16px', weight: 300, lineHeight: '1.5em' },
    ctaButton: { size: '15px', weight: 400 },
    cardTitle: { size: '40px', weight: 600, lineHeight: '48px', font: "'Poppins', sans-serif" },
    statNumber: { size: '48px', weight: 600, font: "'Montserrat', sans-serif" },
    statLabel: { size: '16px', weight: 400, lineHeight: '26px' },
  },
  layout: {
    containerMax: '1200px',
    contentMax: '1040px',
    headerHeight: '70px',
    sectionPaddingY: '80px',
    footerPadding: '30px 0 15px',
  },
  radii: {
    button: '0px',
    card: '0px',
  },
} as const

/** Map production wp-content URLs to local public paths */
export const PRODUCTION_ASSETS: Record<string, string> = {
  'https://onixdatacentres.com/wp-content/uploads/2021/10/ONIX-logo-png-300x196.png': '/images/onix/logo.png',
  'https://onixdatacentres.com/wp-content/uploads/2021/10/ONIX-logo-png.png': '/images/onix/logo.png',
  'https://onixdatacentres.com/wp-content/uploads/2022/11/Onix_white_logo.png': '/images/onix/logo-white.png',
  'https://onixdatacentres.com/wp-content/uploads/2024/04/Images-collage-3.png': '/images/onix/collage.png',
  'https://onixdatacentres.com/wp-content/uploads/2021/12/IMG_9788-scaled.jpg': '/images/onix/solutions-bg.jpg',
}

export function resolveAsset(url: string): string {
  return PRODUCTION_ASSETS[url] || url
}
