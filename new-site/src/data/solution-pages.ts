import type { OnixBlock } from '@/components/onix/blocks/OnixPageBlocksRenderer'

/** Static structured content for solution pages — always preferred over migrated Elementor CMS blocks. */
export const SOLUTION_PAGE_PATHS = new Set([
  '/home/our-solutions/',
  '/home/finance/',
  '/home/virtual-machine/',
  '/services/',
])

const FINANCE_BLOCKS: OnixBlock[] = [
  {
    blockType: 'hero',
    variant: 'banner',
    heading: 'Elevate Your Financial Services with Onix Data Centres',
    subheading: 'Secure, Connected, and Certified Colocation Solutions',
    imageUrl: '/images/solutions/finance-hero.png',
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
    cardVariant: 'navy',
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
    variant: 'banner',
    heading: 'Onix Virtual Machines',
    subheading:
      'Experience the power of virtual machines: a software-based emulation of physical computers that run on your existing hardware while functioning as independent systems seamlessly.',
    imageUrl: '/images/solutions/vm-hero.jpg',
    ctaLabel: 'Talk to Us Today',
    ctaUrl: '/contact-us',
  },
  {
    blockType: 'featureCards',
    cardVariant: 'light',
    items: [
      { title: 'Development and Testing', body: 'Safe environments for developing and testing new software.' },
      { title: 'Server Consolidation', body: 'Continuous monitoring to preemptively address issues, maintaining system integrity.' },
      { title: 'Disaster Recovery', body: 'Rapid recovery solutions for business continuity.' },
      { title: 'Remote Work', body: 'Secure remote access to company resources.' },
    ],
  },
  {
    blockType: 'imageText',
    heading: 'Key Features of Onix Virtual Machines',
    body: 'Reduced Hardware Requirement\nLower Energy Costs\nIsolated Environments\nSafe Testing Area',
    imageUrl: '/images/solutions/vm-features.png',
    imagePosition: 'right',
  },
  {
    blockType: 'imageText',
    heading: 'Security and Reliability',
    body: 'Isolated Environments\nSecure Testing Area\nRobust Physical and Network Security',
    imageUrl: '/images/solutions/vm-vpn.png',
    imagePosition: 'left',
  },
  {
    blockType: 'imageText',
    heading: 'Enhanced Disaster Recovery',
    body: 'Easily backup and restore VMs\nMinimise downtime after failures\nSecure and reliable backup solutions',
    imageUrl: '/images/solutions/vm-server.png',
    imagePosition: 'right',
  },
  {
    blockType: 'imageText',
    heading: 'Cost Efficiency',
    body: 'Fewer physical machines needed\nDecreased operational costs\nPay for what you use.',
    imageUrl: '/images/solutions/vm-cost.png',
    imagePosition: 'left',
  },
  {
    blockType: 'featureCards',
    heading: 'Flexibility and Scalability',
    cardVariant: 'light',
    items: [
      { title: 'Adaptability', body: 'Easily add or remove resources as business needs change.' },
      { title: 'Support for Various Applications', body: 'Run different operating systems and applications' },
      { title: 'Scalable Resources', body: 'Quickly scale up or down without new hardware.' },
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
    cardVariant: 'navy',
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

export const OUR_SOLUTIONS_SECTIONS = [
  {
    id: 'tangor',
    title: 'Colocation',
    intro: 'We provide a range of options to suit your colocation requirements.',
    features: [
      { title: 'Tier IV Facility', body: 'Our World-Class Tier IV data centre currently houses 170 3kW and 5kW racks in module one.' },
      { title: 'Industry Certification', body: 'Our Tier IV certification ensures that our facility meets the highest industry standards for uptime and reliability.' },
      { title: 'Cost Efficiency', body: 'Colocation allows businesses to share infrastructure and reduce costs while still maintaining control over their own equipment.' },
      { title: 'Dedicated Pods', body: 'A pod of 30 or 50 racks available for individual clients' },
    ],
  },
  {
    id: 'virtualmachines',
    title: 'Virtual Machines',
    intro: 'Flexibility and Efficiency',
    features: [
      { title: 'Flexibility and Efficiency', body: 'VMs enable running multiple, isolated operating systems on a single server, enhancing resource efficiency.' },
      { title: 'Security and Scalability', body: 'Each VM operates independently, ensuring secure, scalable environments for business growth.' },
      { title: 'Rapid Deployment', body: 'Facilitates swift setup of new applications or services without additional hardware.' },
      { title: 'Expert Support', body: 'Our team delivers bespoke solutions, optimising VM performance for your specific requirements.' },
    ],
    linkUrl: '/home/virtual-machine/',
    linkLabel: 'Learn more about Virtual Machines',
  },
  {
    id: 'managedservices',
    title: 'Managed Services',
    intro: 'Comprehensive IT Support',
    features: [
      { title: 'Comprehensive IT Support', body: 'Our Managed Services provide full IT support, ensuring operational efficiency and reliability.' },
      { title: 'Proactive Monitoring', body: 'Continuous monitoring to preemptively address issues, maintaining system integrity.' },
      { title: 'Data Backup and Recovery', body: 'Robust solutions for data protection, ensuring business continuity with quick recovery from disruptions.' },
    ],
  },
  {
    id: 'cybersecurity',
    title: 'Cyber Security',
    intro: 'Advanced Threat Protection',
    features: [
      { title: 'Advanced Threat Protection', body: 'Utilising cutting-edge technologies to defend against sophisticated cyber threats, safeguarding your digital assets.' },
      { title: 'Continuous Security Monitoring', body: 'Round-the-clock surveillance of your systems to detect and mitigate risks promptly.' },
      { title: 'Incident Response', body: 'Swift action to manage and neutralize security breaches, minimizing potential impacts.' },
      { title: 'Compliance and Governance', body: 'Ensuring your IT practices meet regulatory standards, protecting data integrity and privacy.' },
    ],
  },
  {
    id: 'internetexchange',
    title: 'Internet Exchange',
    intro: 'Direct Connectivity',
    features: [
      { title: 'Direct Connectivity', body: 'Establishing direct routes between networks, enhancing speed and reducing latency for data exchange.' },
      { title: 'Cost Efficiency', body: 'Lowering operational costs by reducing reliance on external transit networks for data routing.' },
      { title: 'Improved Performance', body: 'Enhancing user experience through faster and more reliable internet services.' },
      { title: 'Network Resilience', body: 'Offering robust paths for data, ensuring continuous service even during network disruptions.' },
    ],
  },
  {
    id: 'carriern',
    title: 'Carrier Neutrality',
    intro: 'Affordable carrier-neutral data centre solutions for business with freedom of choice, maximum flexibility, reliability and affordability',
    features: [
      { title: 'Multi-carrier Access', body: 'Access to multiple cable operators, telcos, ISPs and IP Transit operators, offering capacity at varying prices and redundancy.' },
      { title: 'Cross Connect', body: 'Cross connect to your business partners for secure connections.' },
    ],
  },
  {
    id: 'candc',
    title: 'Cloud and Content',
    intro: 'Experience efficient delivery, scalability and reliability with our optimised cloud and content distribution solutions.',
    features: [
      { title: 'Data Sovereignty', body: 'International cloud services providers enable compliance with data sovereignty laws and ensure customers can meet their varying requirements and spread their workloads across multiple providers.' },
      { title: 'Efficient Delivery', body: 'Cloud and content distribution allows businesses to deliver their content and services more efficiently and with greater scalability.' },
    ],
  },
  {
    id: 'peering',
    title: 'Peering',
    intro: 'Peering allows networks to directly connect and exchange traffic, improving communication and reducing IP transit costs.',
    features: [
      { title: 'Performance', body: 'By peering with other networks, businesses can improve the performance of their internet services and access new content and services.' },
      { title: 'Redundancy', body: 'Multiple IX exchanges provide redundancy and resiliency ensuring that there are multiple paths for traffic to travel between networks, improving latency.' },
      { title: 'Expert Guidance', body: 'Our team of experts can work with you to determine the best peering options for your business and ensure a smooth and seamless connection.' },
    ],
  },
] as const

export const SOLUTION_PAGE_BLOCKS: Record<string, OnixBlock[]> = {
  '/home/finance/': FINANCE_BLOCKS,
  '/home/virtual-machine/': VIRTUAL_MACHINE_BLOCKS,
  '/services/': SERVICES_BLOCKS,
}

export function resolveSolutionBlocks(legacyPath: string | undefined | null, _blocks?: OnixBlock[] | null): OnixBlock[] {
  if (!legacyPath) return []
  return SOLUTION_PAGE_BLOCKS[legacyPath] || []
}

export function isStructuredSolutionPath(path: string | undefined | null): boolean {
  return !!path && SOLUTION_PAGE_PATHS.has(path)
}
