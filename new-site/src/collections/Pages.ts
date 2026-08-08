import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOrAuthenticated } from '../access/roles'
import { pageBlocks } from '../blocks/pageBlocks'
import { legacyFields } from '../fields/legacy'
import { seoFields } from '../fields/seo'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
  },
  versions: { drafts: true },
  access: {
    read: publishedOrAuthenticated,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'pageType',
      type: 'select',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Homepage', value: 'homepage' },
        { label: 'Corporate', value: 'corporate' },
      ],
      defaultValue: 'standard',
    },
    {
      name: 'blocks',
      type: 'blocks',
      localized: true,
      blocks: pageBlocks,
    },
    ...seoFields,
    ...legacyFields,
  ],
}
