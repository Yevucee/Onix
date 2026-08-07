import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrAuthenticated } from '../access/roles'
import { legacyFields } from '../fields/legacy'
import { seoFields } from '../fields/seo'

export const DataCentres: CollectionConfig = {
  slug: 'data-centres',
  admin: { useAsTitle: 'name' },
  versions: { drafts: true },
  access: {
    read: publishedOrAuthenticated,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'city', type: 'text', localized: true },
    { name: 'country', type: 'text', localized: true },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'richText', localized: true },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'icon', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'connectivity', type: 'richText', localized: true },
    { name: 'infrastructure', type: 'richText', localized: true },
    { name: 'sustainability', type: 'richText', localized: true },
    {
      name: 'downloads',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
        { name: 'buttonLabel', type: 'text' },
        { name: 'buttonUrl', type: 'text' },
      ],
    },
    ...seoFields,
    ...legacyFields,
  ],
}
