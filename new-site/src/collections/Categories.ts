import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access/roles'
import { legacyFields } from '../fields/legacy'
import { seoFields } from '../fields/seo'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', localized: true },
    ...seoFields,
    ...legacyFields,
  ],
}
