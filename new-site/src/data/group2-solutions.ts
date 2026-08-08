import type { OnixBlock } from '@/components/onix/blocks/OnixPageBlocksRenderer'

const FINANCE_BLOCKS: OnixBlock[] = [
  {
    blockType: 'hero',
    heading: 'Elevate Your Financial Services with Onix Data Centres',
    subheading: 'Secure, Connected, and Certified Colocation Solutions',
    ctaLabel: 'Talk to Us Today',
    ctaUrl: '/contact-us',
  },
  {
    blockType: 'richText',
    body: `<h2>The Onix Advantage in Financial Services</h2>
<p>In a financial landscape that demands both agility and security, Onix Data Centres stands as your reliable partner. We offer colocation services that excel in physical security, connectivity, power, cooling, and certifications. We have the blueprint for your digital future.</p>
<p>Our colocation services are meticulously designed to meet the stringent requirements of the financial sector.</p>`,
  },
  {
    blockType: 'featureCards',
    heading: 'The Onix Advantage in Financial Services',
    items: [
      { title: 'Physical Security', body: 'State-of-the-art security measures to protect your valuable data.' },
      { title: 'Connectivity', body: 'High-speed, reliable connections for seamless operations.' },
      { title: 'Power', body: 'Uninterrupted power supply to ensure your services are always online' },
      { title: 'Cooling', body: 'Advanced cooling systems to maintain optimal performance.' },
      { title: 'Certifications', body: 'Tier IV and other industry certifications for peace of mind.' },
    ],
  },
  {
    blockType: 'cta',
    heading: 'Your Path to Secure and Efficient Operations Starts Here',
    body: 'Contact Us Now for a Tailored Colocation Solution',
    buttonLabel: 'Talk to Us Today',
    buttonUrl: '/contact-us',
  },
]

const VIRTUAL_MACHINE_BLOCKS: OnixBlock[] = [
  {
    blockType: 'hero',
    heading: 'Onix Virtual Machines',
    subheading:
      'Experience the power of virtual machines: a software-based emulation of physical computers that run on your existing hardware while functioning as independent systems seamlessly.',
    ctaLabel: 'Talk to Us Today',
    ctaUrl: '/contact-us',
  },
  {
    blockType: 'featureCards',
    items: [
      { title: 'Development and Testing', body: 'Safe environments for developing and testing new software.' },
      { title: 'Server Consolidation', body: 'Continuous monitoring to preemptively address issues, maintaining system integrity.' },
      { title: 'Disaster Recovery', body: 'Rapid recovery solutions for business continuity.' },
      { title: 'Remote Work', body: 'Secure remote access to company resources.' },
    ],
  },
  {
    blockType: 'bulletedFeatures',
    heading: 'Key Features of Onix Virtual Machines',
    sections: [
      { title: 'Key Features', bullets: [{ text: 'Reduced Hardware Requirement' }, { text: 'Lower Energy Costs' }, { text: 'Isolated Environments' }, { text: 'Safe Testing Area' }] },
      { title: 'Security and Reliability', bullets: [{ text: 'Isolated Environments' }, { text: 'Secure Testing Area' }, { text: 'Robust Physical and Network Security' }] },
      { title: 'Enhanced Disaster Recovery', bullets: [{ text: 'Easily backup and restore VMs' }, { text: 'Minimise downtime after failures' }, { text: 'Secure and reliable backup solutions' }] },
      { title: 'Cost Efficiency', bullets: [{ text: 'Fewer physical machines needed' }, { text: 'Decreased operational costs' }, { text: 'Pay for what you use.' }] },
    ],
  },
  {
    blockType: 'bulletedFeatures',
    heading: 'Flexibility and Scalability',
    variant: 'alt',
    sections: [
      { title: 'Adaptability', bullets: [{ text: 'Easily add or remove resources as business needs change.' }] },
      { title: 'Support for Various Applications', bullets: [{ text: 'Run different operating systems and applications' }] },
      { title: 'Scalable Resources', bullets: [{ text: 'Quickly scale up or down without new hardware.' }] },
    ],
  },
  {
    blockType: 'cta',
    heading: 'Transform Your Business with Onix Virtual Machines',
    body: 'Contact us to start your journey with GH₵2000 in free credits',
    buttonLabel: 'Talk to Us Today',
    buttonUrl: '/contact-us',
  },
]

const SERVICES_BLOCKS: OnixBlock[] = [
  {
    blockType: 'hero',
    heading: 'Services',
    subheading: 'Carrier-neutral colocation, cloud, connectivity and interconnection solutions across West Africa.',
    ctaLabel: 'Contact us',
    ctaUrl: '/contact-us',
  },
  {
    blockType: 'featureCards',
    items: [
      {
        title: 'Colocation',
        body: "Nous proposons une gamme d'options pour répondre à vos besoins de colocation. Notre centre de données de niveau III de classe mondiale abrite actuellement un module de 300m². La certification de niveau III garantit que notre installation répond aux normes les plus élevées de l'industrie pour le temps de fonctionnement et la fiabilité.",
      },
      {
        title: "Neutralité de l'opérateur",
        body: "Solutions de centre de données neutres en termes d'opérateur à un prix abordable pour les entreprises avec liberté de choix, flexibilité maximale, fiabilité et abordabilité. Connectez-vous en croisé à vos partenaires commerciaux pour des connexions sécurisées.",
      },
      {
        title: 'Cloud et Contenu',
        body: "Expérimentez une livraison efficace, une évolutivité et une fiabilité avec nos solutions optimisées de cloud et de distribution de contenu. Les fournisseurs de services cloud internationaux permettent de se conformer aux lois sur la souveraineté des données.",
      },
      {
        title: 'Interconnexion',
        body: "L'interconnexion permet aux réseaux de se connecter directement et d'échanger du trafic, améliorant la communication et réduisant les coûts de transit IP. Notre équipe d'experts peut travailler avec vous pour déterminer les meilleures options d'interconnexion.",
      },
    ],
  },
  {
    blockType: 'cta',
    heading: 'Get in touch with us today',
    body: 'Speak with our team about colocation, connectivity and managed services.',
    buttonLabel: 'Contact us',
    buttonUrl: '/contact-us',
  },
]

export const GROUP2_SOLUTION_PAGES: Record<string, { blocks: OnixBlock[]; marker: string }> = {
  '/home/finance/': { blocks: FINANCE_BLOCKS, marker: 'Elevate Your Financial Services' },
  '/home/virtual-machine/': { blocks: VIRTUAL_MACHINE_BLOCKS, marker: 'Onix Virtual Machines' },
  '/services/': { blocks: SERVICES_BLOCKS, marker: 'Colocation' },
}

export function resolveSolutionBlocks(legacyPath: string | undefined | null, blocks?: OnixBlock[] | null): OnixBlock[] {
  if (!legacyPath) return blocks || []
  const config = GROUP2_SOLUTION_PAGES[legacyPath]
  if (!config) return blocks || []
  const hasContent = blocks?.some(
    (b) => (b.blockType === 'hero' && String(b.heading || '').includes(config.marker)) || b.blockType === 'featureCards',
  )
  if (hasContent) return blocks || []
  return config.blocks
}
