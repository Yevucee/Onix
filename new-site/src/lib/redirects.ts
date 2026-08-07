import fs from 'fs'
import path from 'path'

export type RedirectRule = {
  sourcePath: string
  destination: string
  statusCode: '301' | '302'
  active: boolean
  notes?: string
}

let cached: RedirectRule[] | null = null

export function getRedirectRules(): RedirectRule[] {
  if (cached) return cached.filter((r) => r.active)
  const filePath = path.join(process.cwd(), 'data/redirects.json')
  if (!fs.existsSync(filePath)) return []
  cached = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RedirectRule[]
  return cached.filter((r) => r.active)
}

export function matchRedirect(pathname: string): RedirectRule | undefined {
  const rules = getRedirectRules()
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`
  const withoutSlash = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return rules.find(
    (r) => r.sourcePath === pathname || r.sourcePath === normalized || r.sourcePath === withoutSlash,
  )
}
