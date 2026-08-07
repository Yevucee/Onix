import type { Field } from 'payload'

export const legacyFields: Field[] = [
  {
    name: 'legacy',
    type: 'group',
    label: 'Migration / Legacy',
    admin: { position: 'sidebar' },
    fields: [
      { name: 'wordpressId', type: 'number', label: 'WordPress post ID', unique: true },
      { name: 'legacyPath', type: 'text', label: 'Legacy URL path' },
      { name: 'legacyUrl', type: 'text', label: 'Full legacy URL' },
    ],
  },
]
