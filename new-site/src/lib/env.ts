export type SiteEnv = 'development' | 'staging' | 'production'

export function getSiteEnv(): SiteEnv {
  const value = process.env.SITE_ENV || 'development'
  if (value === 'staging' || value === 'production') return value
  return 'development'
}

export function isStaging(): boolean {
  return getSiteEnv() === 'staging'
}

export function isProduction(): boolean {
  return getSiteEnv() === 'production'
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}
