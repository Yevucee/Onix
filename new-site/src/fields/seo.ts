import type { Field } from 'payload'

export const seoFields: Field[] = [
  {
    name: 'seo',
    type: 'group',
    label: 'SEO',
    fields: [
      { name: 'title', type: 'text', label: 'SEO title' },
      { name: 'description', type: 'textarea', label: 'Meta description' },
      { name: 'canonicalUrl', type: 'text', label: 'Canonical URL' },
      { name: 'ogTitle', type: 'text', label: 'Social / Open Graph title' },
      { name: 'ogDescription', type: 'textarea', label: 'Social / Open Graph description' },
      { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Social image' },
      {
        name: 'robots',
        type: 'select',
        label: 'Robots override',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Noindex', value: 'noindex' },
          { label: 'Nofollow', value: 'nofollow' },
          { label: 'Noindex, Nofollow', value: 'noindex,nofollow' },
        ],
        defaultValue: 'default',
      },
    ],
  },
]
