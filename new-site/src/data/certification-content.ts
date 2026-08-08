import type { OnixBlock } from '@/components/onix/blocks/OnixPageBlocksRenderer'

export const CERTIFICATION_ITEMS = [
  {
    title: 'Tier IV',
    description: "Tier IV certification denotes a data centre's top-tier redundancy, fault tolerance, with 99.995% uptime.",
    imageUrl: '/images/certification/tier-iv.png',
  },
  {
    title: 'ISO 27001:2013',
    description:
      'ISO 27001:2013 is the international standard for information security management. It ensures the protection of sensitive company information.',
    imageUrl: '/images/certification/iso-27001.png',
  },
  {
    title: 'ISO 9001:2015',
    description:
      'ISO 9001:2015 is the international standard for quality management. It ensures consistent customer satisfaction and continuous improvement.',
    imageUrl: '/images/certification/iso-9001.png',
  },
  {
    title: 'PCI-DSS',
    description:
      'PCI-DSS certification involves meeting rigorous security standards set by the PCI SSC, ensuring the safe handling of card data for financial institutions and promoting secure customer transactions.',
    imageUrl: '/images/certification/pci-dss.png',
  },
]

export const DEFAULT_CERTIFICATION_BLOCKS: OnixBlock[] = [
  {
    blockType: 'richText',
    body: `<p>At our data centre, we take the security and quality of our services very seriously. The certifications below demonstrate our commitment to providing our customers with the highest level of security and quality in all our operations.</p>`,
  },
  {
    blockType: 'certificationGrid',
    intro:
      'At our data centre, we take the security and quality of our services very seriously. The certifications below demonstrate our commitment to providing our customers with the highest level of security and quality in all our operations.',
    items: CERTIFICATION_ITEMS,
  },
  {
    blockType: 'richText',
    body: `<h2>As a globally certified Tier IV data centre, we have a lot to be proud of</h2>
<p>We have an amazing facility and an amazing team. We also have amazing processes. Our quality management system (QMS) conforms to ISO 9001:2015. This ensures that we are able to do things consistently and continually improve.</p>
<p>At Onix Data Centres, we are steadfast in our commitment to excellence, security, and continual improvement. Our adherence to ISO 9001 and ISO 27001 reflects our dedication to delivering consistent, high-quality services while ensuring the highest standards of information security.</p>`,
  },
  {
    blockType: 'cta',
    heading: "Let's build this together!",
    body: 'ISO 9001 benefits you, the management and the customer! If it does not, then it needs to be changed',
    buttonLabel: 'Contact us',
    buttonUrl: '/contact-us',
  },
]

export function hasCertificationContent(blocks?: OnixBlock[] | null): boolean {
  return !!blocks?.some((b) => b.blockType === 'certificationGrid')
}

export function resolveCertificationBlocks(blocks?: OnixBlock[] | null): OnixBlock[] {
  if (hasCertificationContent(blocks)) return blocks || []
  return DEFAULT_CERTIFICATION_BLOCKS
}
