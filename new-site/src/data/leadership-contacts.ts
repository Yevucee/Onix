/**
 * Leadership contact details from production WordPress content.
 * Keyed by legacy path slug (last segment of legacy.legacyPath).
 */
export const LEADERSHIP_CONTACTS: Record<string, { phone?: string; email?: string }> = {
  leonardmckinlay: { phone: '+44 774 091 4268', email: 'lenny@onixdatacentres.com' },
  bretttucker: { phone: '+27 828 678 117', email: 'brett@onixdatacentres.com' },
  michaelthompson: { phone: '+233 55 947 0607', email: 'michael.thompson@onixdatacentres.com' },
  serwaakankam: { phone: '+233 54 440 0490', email: 'serwaa@onixdatacentres.com' },
  edemscott: { phone: '+233 55 595 0176', email: 'edem@onixdatacentres.com' },
  kevinopata: { phone: '+233 59 874 6584', email: 'kevin@onixdatacentres.com' },
  stephenappiah: { phone: '+233 24 258 0997', email: 'stephen@onixdatacentres.com' },
  samuelpolley: { phone: '+233 55 368 5102', email: 'samuel@onixdatacentres.com' },
  mamadoukebe: { phone: '+221 706 737 070', email: 'mamadou@onixdatacentres.com' },
  baraawafall: { phone: '+221 706 737 070', email: 'awa@onixdatacentres.com' },
  paulrichards: { phone: '+44 773 469 0272', email: 'paul@onixdatacentres.com' },
  'eric-tenkorang': { phone: '+233 24 203 2709', email: 'eric@onixdatacentres.com' },
  'razak-awudulai1': { phone: '+233 24 644 6752', email: 'razak@onixdatacentres.com' },
  'razak-awudulai': { phone: '+233 24 644 6752', email: 'razak@onixdatacentres.com' },
  'samuel-osew-kwatia': { phone: '+233 24 465 4579' },
}

export function leadershipContactFromLegacyPath(legacyPath?: string | null) {
  if (!legacyPath) return null
  const slug = legacyPath.replace(/^\/|\/$/g, '').split('/').pop() || ''
  return LEADERSHIP_CONTACTS[slug] || null
}
