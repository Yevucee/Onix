/**
 * Static leadership photo paths (production assets) keyed by legacy path slug.
 * Used as fallback when Payload media is not yet linked (e.g. fresh staging deploy).
 */
export const LEADERSHIP_PHOTO_PATHS: Record<string, string> = {
  leonardmckinlay: '/images/leadership/leonardmckinlay.jpg',
  bretttucker: '/images/leadership/bretttucker.jpeg',
  michaelthompson: '/images/leadership/michaelthompson.jpg',
  serwaakankam: '/images/leadership/serwaakankam.jpg',
  edemscott: '/images/leadership/edemscott.jpg',
  kevinopata: '/images/leadership/kevinopata.jpg',
  stephenappiah: '/images/leadership/stephenappiah.jpg',
  samuelpolley: '/images/leadership/samuelpolley.jpeg',
  mamadoukebe: '/images/leadership/mamadoukebe.jpeg',
  baraawafall: '/images/leadership/baraawafall.jpeg',
  paulrichards: '/images/leadership/paulrichards.jpeg',
  'eric-tenkorang': '/images/leadership/eric-tenkorang.jpeg',
  'razak-awudulai1': '/images/leadership/razak-awudulai.jpg',
  'razak-awudulai': '/images/leadership/razak-awudulai.jpg',
  'samuel-osew-kwatia': '/images/leadership/samuel-osew-kwatia.png',
}

export function leadershipSlugFromLegacyPath(legacyPath?: string | null): string {
  if (!legacyPath) return ''
  return legacyPath.replace(/^\/|\/$/g, '').split('/').pop() || ''
}

export function leadershipPhotoFromLegacyPath(legacyPath?: string | null): string | null {
  const slug = leadershipSlugFromLegacyPath(legacyPath)
  return slug ? LEADERSHIP_PHOTO_PATHS[slug] || null : null
}
