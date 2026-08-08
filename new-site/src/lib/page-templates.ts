/**
 * Maps page paths to Onix template families for corporate migration.
 * Source: phase4/page-build-plan.csv + live-page-tree.md
 */

export type PageTemplate =
  | 'homepage'
  | 'corporate'
  | 'solution'
  | 'infrastructure'
  | 'data-centre'
  | 'leadership'
  | 'contact'
  | 'specialist'
  | 'news'
  | 'french'
  | 'redirect'

const SOLUTION_PATHS = new Set([
  '/home/our-solutions/',
  '/home/finance/',
  '/home/virtual-machine/',
  '/home/o-services/',
  '/services/',
  '/o-home/o-ghana/our-solutions/',
])

const INFRASTRUCTURE_PATHS = new Set(['/home/infrastructure/', '/infrastructure-innovation/'])

const CORPORATE_PATHS = new Set([
  '/about-us/',
  '/o-home/about-us/',
  '/home/sustainability/',
  '/o-home/certification/',
  '/o-home/privacy-policy/',
  '/home/cfo/',
  '/home/feedback/',
  '/o-home/partners/',
  '/partners/',
  '/o-home/',
  '/o-home/home-v2/',
  '/home-english/',
  '/elementor-9089/',
])

const CONTACT_PATHS = new Set(['/contact-us/', '/home/contact-us/', '/home/onix-team-contact/'])

const DATA_CENTRE_PATHS = new Set(['/o-home/senegal/', '/senegal/'])

const SPECIALIST_PATHS = new Set(['/home/cfo-roi/', '/linxaccra/'])

function isLeadershipPath(path: string): boolean {
  const leadershipSlugs = [
    'bretttucker',
    'edemscott',
    'kevinopata',
    'leonardmckinlay',
    'mamadoukebe',
    'michaelthompson',
    'paulrichards',
    'razak-awudulai',
    'razak-awudulai1',
    'samuel-osew-kwatia',
    'samuelpolley',
    'serwaakankam',
    'stephenappiah',
    'eric-tenkorang',
    'baraawafall',
  ]
  const slug = path.replace(/^\/|\/$/g, '').split('/').pop() || ''
  return leadershipSlugs.includes(slug)
}

export function resolvePageTemplate(pathname: string): PageTemplate {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`

  if (normalized === '/') return 'homepage'
  if (normalized.startsWith('/fr/')) return 'french'
  if (normalized === '/news/' || normalized === '/blog/') return 'news'
  if (CONTACT_PATHS.has(normalized)) return 'contact'
  if (DATA_CENTRE_PATHS.has(normalized)) return 'data-centre'
  if (SOLUTION_PATHS.has(normalized)) return 'solution'
  if (INFRASTRUCTURE_PATHS.has(normalized)) return 'infrastructure'
  if (CORPORATE_PATHS.has(normalized)) return 'corporate'
  if (SPECIALIST_PATHS.has(normalized)) return 'specialist'
  if (isLeadershipPath(normalized)) return 'leadership'

  return 'corporate'
}
