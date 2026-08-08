import type { OnixBlock } from '@/components/onix/blocks/OnixPageBlocksRenderer'
import type { Page } from '@/payload-types'

/** Default About Us blocks matching live production content. */
export const DEFAULT_ABOUT_US_BLOCKS: OnixBlock[] = [
  {
    blockType: 'hero',
    heading: 'State-of-the-Art Data Centres in West Africa for Global Standards',
    subheading:
      'Onix Data Centres Ltd. owns and operates world class carrier neutral colocation data centres across West Africa, delivering high speed and secure data services to enterprise, consumer and public sector markets.',
    imageUrl: '/images/about-us/hero.jpg',
  },
  {
    blockType: 'richText',
    body: `<p>The flagship facility is the Tier IV certified Data Centre in Accra, Ghana. The Data Centre in Dakar, Senegal is located at the 2Africa cable landing station and offers direct access to all major landing cables in Senegal.</p>`,
  },
  {
    blockType: 'imageText',
    heading: 'Leading Provider of Tier IV Colocation in West Africa',
    body: 'Onix is a leading provider of Carrier neutral colocation data centre services in West Africa focused currently on Ghana and Senegal. The state-of-the-art facilities are designed to meet the growing demands of businesses globally. Onix carrier-neutral data centres ensure freedom of choice and maximum flexibility for clients. Onix facilities are built to the highest industry standards, guaranteeing maximum uptime and reliability.\n\nOnix has a world class executive team with a track record of success in Africa. Onix majority shareholder is African Infrastructure Investment Managers (Pty) Ltd ("AIIM") who are committed to the long-term development of African infrastructure and the uplifting of its people.',
    imagePosition: 'right',
    imageUrl: '/images/about-us/screenshot-1.png',
  },
  {
    blockType: 'leadershipGrid',
    heading: 'Our Leadership Team',
    intro: 'Meet the executives leading Onix Data Centres across West Africa.',
  },
  {
    blockType: 'cta',
    heading: 'Partner with Onix',
    body: 'Learn how our infrastructure supports your organisation.',
    buttonLabel: 'Contact us',
    buttonUrl: '/contact-us',
  },
]

export function hasAboutUsContent(blocks?: Page['blocks'] | OnixBlock[] | null): boolean {
  return !!blocks?.some(
    (b) => b.blockType === 'hero' && String('heading' in b ? b.heading : '').includes('State-of-the-Art'),
  )
}

export function resolveAboutUsBlocks(blocks?: Page['blocks'] | OnixBlock[] | null): OnixBlock[] {
  if (hasAboutUsContent(blocks)) return (blocks as OnixBlock[]) || []
  return DEFAULT_ABOUT_US_BLOCKS
}
