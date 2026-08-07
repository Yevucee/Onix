import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrAuthenticated } from '../access/roles'
import { legacyFields } from '../fields/legacy'
import { seoFields } from '../fields/seo'

export const Leadership: CollectionConfig = {
  slug: 'leadership',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'title', 'sortOrder'] },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { visible: { equals: true } }
    },
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'title', type: 'text', label: 'Job title', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'biography', type: 'richText', localized: true },
    { name: 'linkedinUrl', type: 'text' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: true,
      label: 'Published / visible',
    },
    ...seoFields,
    ...legacyFields,
  ],
}
