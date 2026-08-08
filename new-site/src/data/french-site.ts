/**
 * French site navigation and footer — extracted from live https://onixdatacentres.com/fr/
 * Only existing French URLs are used; English equivalents linked where no FR page exists.
 */
import type { NavItem } from './live-site'

export const FRENCH_CLIENT_SUPPORT_CTA = {
  label: 'Client support',
  url: 'https://service.onixdatacentres.com/',
  external: true,
}

/** French header — mirrors live structure; EN destinations where no FR page exists */
export const FRENCH_HEADER_NAV: NavItem[] = [
  {
    label: '🇬🇭 Ghana',
    url: '/fr/',
    children: [
      { label: '🇬🇭 Ghana', url: '/fr/' },
      { label: '🇸🇳 Senegal', url: '/senegal' },
    ],
  },
  {
    label: 'Nos solutions',
    url: '/home/our-solutions',
    children: [
      { label: 'Colocation', url: '/home/our-solutions#tangor' },
      { label: 'Machines virtuelles', url: '/home/virtual-machine' },
      { label: 'Services gérés', url: '/home/our-solutions#managedservices' },
      { label: 'Cybersécurité', url: '/home/our-solutions#cybersecurity' },
      { label: 'Internet Exchange', url: '/home/our-solutions#internetexchange' },
      { label: 'Neutralité opérateur', url: '/home/our-solutions#carriern' },
      { label: 'Cloud and Connect', url: '/home/our-solutions#candc' },
      { label: 'Peering', url: '/home/our-solutions#peering' },
      { label: 'Finance', url: '/home/finance' },
    ],
  },
  {
    label: 'Infrastructure',
    url: '/home/infrastructure',
  },
  {
    label: 'Blog',
    url: '/news',
  },
  {
    label: 'Contactez-nous',
    url: '/fr/contactez-nous',
  },
]

export const FRENCH_FOOTER = {
  tagline: 'Connecting Africa to the Globe',
  navigate: {
    heading: 'Navigate',
    links: [
      { label: 'About Us', url: '/about-us' },
      { label: 'Certification', url: '/home/certification' },
      { label: 'Sustainability', url: '/home/sustainability' },
      { label: 'Privacy Policy', url: '/home/privacy-policy' },
      {
        label: 'IMS Policy',
        url: '/documents/IMS-SIMPLIFIED-12-May-2025.pdf',
        external: true,
      },
    ],
  },
  contact: {
    heading: 'Get in touch',
    email: 'info@onixdatacentres.com',
    phones: ['+233 50 086 5266', '+221 77 668 41 10'],
  },
  social: [
    { platform: 'Twitter', url: 'https://twitter.com/ONIXDCdata' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/onixdc' },
  ],
  copyright: '© 2026 All Rights Reserved.',
}

/** Live French homepage has no body copy — title only */
export const FRENCH_HOMEPAGE = {
  title: 'Home – Français',
  contactCta: {
    heading: 'Contactez-nous',
    body: 'Parlez à notre équipe au Ghana, au Sénégal ou au Royaume-Uni.',
    buttonLabel: 'Contactez-nous',
    buttonUrl: '/fr/contactez-nous',
  },
}

export const FRENCH_BREADCRUMB_HOME = { label: 'Accueil', href: '/fr/' }
