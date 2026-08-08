/**
 * Canonical navigation, footer, and homepage structure extracted from
 * https://onixdatacentres.com (live production) — 2026-08-08 audit.
 * Source of truth for CHECKPOINT 1B reconstruction layer.
 */

export type NavItem = {
  label: string
  url: string
  external?: boolean
  children?: NavItem[]
}

export const LIVE_LOGO = {
  src: '/images/onix-logo.png',
  alt: 'Onix Data Centres',
  width: 150,
  height: 98,
}

export const LIVE_HEADER_NAV: NavItem[] = [
  {
    label: '🇬🇭 Ghana',
    url: '/',
    children: [{ label: '🇬🇭 Ghana', url: '/' }],
  },
  {
    label: '🇸🇳 Senegal',
    url: '/o-home/senegal',
  },
  {
    label: 'Our Solutions',
    url: '/home/our-solutions',
    children: [
      { label: 'Colocation', url: '/o-home/o-ghana/our-solutions#tangor' },
      { label: 'Virtual machines', url: '/o-home/o-ghana/our-solutions#virtualmachines' },
      { label: 'Managed Services', url: '/o-home/o-ghana/our-solutions#managedservices' },
      { label: 'Cyber Security', url: '/o-home/o-ghana/our-solutions#cybersecurity' },
      { label: 'Internet Exchange', url: '/o-home/o-ghana/our-solutions#internetexchange' },
      { label: 'Carrier Neutrality', url: '/o-home/o-ghana/our-solutions#carriern' },
      { label: 'Cloud and Connect', url: '/o-home/o-ghana/our-solutions#candc' },
      { label: 'Peering', url: '/o-home/o-ghana/our-solutions#peering' },
      { label: 'Finance', url: '/home/finance' },
    ],
  },
  {
    label: 'Infrastructure',
    url: '/home/infrastructure',
  },
  {
    label: 'Blog',
    url: '/blog',
  },
  {
    label: 'Contact Us',
    url: '/home/contact-us',
  },
]

export const LIVE_HEADER_CTA = {
  label: 'Contact Us',
  url: '/home/contact-us',
}

export const LIVE_FOOTER = {
  tagline: 'Connecting Africa to the Globe',
  ctaHeading: 'Get in touch with us today',
  navigate: {
    heading: 'Navigate',
    links: [
      { label: 'About Us', url: '/o-home/about-us' },
      { label: 'Certification', url: '/o-home/certification' },
      { label: 'Sustainability', url: '/home/sustainability' },
      { label: 'Privacy Policy', url: '/o-home/privacy-policy' },
      {
        label: 'IMS Policy',
        url: 'https://onixdatacentres.com/wp-content/uploads/2025/05/IMS-SIMPLIFIED-12-May-2025.pdf',
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

export const LIVE_HOMEPAGE = {
  hero: {
    heading: 'Welcome to Onix Data Centres',
    body: 'Onix is the leading provider of Tier IV Colocation data centre services in Ghana. Our state-of-the-art facility is designed to meet the growing demands of businesses in Ghana and the region. Our carrier-neutral data centre ensures freedom of choice and maximum flexibility for our clients.',
    ctaLabel: 'About Us',
    ctaUrl: '/o-home/about-us',
    backgroundImage: '/images/home-hero-bg.jpg',
  },
  serviceShowcase: [
    { title: 'Virtual Machines', body: "Maximise efficiency with VMs, offering direct access to Ghana's top networks.", url: '/o-home/o-ghana/our-solutions#virtualmachines' },
    { title: 'Managed Services', body: 'Boost IT reliability with our comprehensive Managed Services.', url: '/o-home/o-ghana/our-solutions#managedservices' },
    { title: 'Cyber Security', body: 'Defend against cyber threats with cutting-edge security measures', url: '/o-home/o-ghana/our-solutions#cybersecurity' },
    { title: 'Internet Exchange', body: 'Enhance connectivity, reduce latency and costs with our Internet Exchange', url: '/o-home/o-ghana/our-solutions#internetexchange' },
    { title: 'Colocation', body: 'Achieve unparalleled uptime in our Tier IV certified Colocation facility', url: '/o-home/o-ghana/our-solutions#tangor' },
    { title: 'Cloud and Content', body: 'Efficiently scale and deliver with our Cloud and Content solutions', url: '/o-home/o-ghana/our-solutions#candc' },
    { title: 'Secure Power Supply', body: 'Ensure continuous operation with our robust power backup systems.', url: '/home/infrastructure' },
    { title: 'Sustainable Operations', body: 'Embrace sustainability with operations powered by our solar farm, a first in West Africa.', url: '/home/sustainability' },
    { title: 'Advanced Security Measures', body: 'Protect your assets with advanced security and fire protection systems at our Ghana centre.', url: '/home/infrastructure' },
  ],
  whoWeAre: {
    heading: 'Who we are',
    body: 'Onix flagship facility is the Tier IV certified, carrier neutral co-location facility, in Accra, Ghana. The Accra facility is the only Tier IV certified facility in the region. As an enterprise class facility, the Data Centre offers stable, reliable, and uninterrupted service with an annual uptime of 99.995%.\n\nAs a neutral colocation facility, clients benefit from the ability to select carriers and internet exchanges providing IP transit services as well as well as cloud service providers. Tier IV cooling, fire suppression and back up power systems offer redundancy, mitigating for the use of the colocation facility in preference to building and maintaining an in-house facility.',
    image: '/images/onix/collage.png',
    stats: [
      { value: '99.995%', label: 'Uptime Guaranteed' },
      { value: '15+', label: 'Network Carriers' },
      { value: '0.88', label: 'PUE Renewable' },
    ],
  },
  solutions: {
    heading: 'Our Solutions',
    intro: 'We provide a range of options to suit your colocation requirements.',
    items: [
      { title: 'Colocation', body: 'Achieve unparalleled uptime in our Tier IV certified Colocation facility.', url: '/o-home/o-ghana/our-solutions#tangor' },
      { title: 'Cybersecurity', body: 'Defend against cyber threats with cutting-edge security measures.', url: '/o-home/o-ghana/our-solutions#cybersecurity' },
      { title: 'Virtual Machines', body: "Maximise efficiency with VMs, offering direct access to Ghana's top networks.", url: '/o-home/o-ghana/our-solutions#virtualmachines' },
    ],
  },
  infrastructure: {
    heading: 'Infrastucture',
    intro: 'We provide a range of options to suit your colocation requirements.',
    items: [
      { title: 'Secure Power Supply', body: 'Ensure continuous operation with our robust power backup systems.', url: '/home/infrastructure' },
      { title: 'Sustainable Operations', body: 'Embrace sustainability with operations powered by our solar farm, a first in West Africa.', url: '/home/sustainability' },
      { title: 'Advanced Security Measures', body: 'Protect your assets with advanced security and fire protection systems at our Ghana centre.', url: '/home/infrastructure' },
    ],
  },
  contactCta: {
    heading: 'Get in touch with us today',
    tagline: 'Connecting Africa to the Globe',
    url: '/home/contact-us',
  },
}

/** Flatten nav for gap-analysis CSV generation */
export function flattenNav(items: NavItem[], level = 1): Array<{ label: string; url: string; level: number }> {
  const out: Array<{ label: string; url: string; level: number }> = []
  for (const item of items) {
    out.push({ label: item.label, url: item.url, level })
    if (item.children) out.push(...flattenNav(item.children, level + 1))
  }
  return out
}
