import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { useAsTitle: 'sourcePath', defaultColumns: ['sourcePath', 'destination', 'statusCode', 'active'] },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'sourcePath', type: 'text', required: true, unique: true },
    { name: 'destination', type: 'text', required: true },
    {
      name: 'statusCode',
      type: 'select',
      defaultValue: '301',
      options: [
        { label: '301 Permanent', value: '301' },
        { label: '302 Temporary', value: '302' },
      ],
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'notes', type: 'textarea' },
  ],
}
