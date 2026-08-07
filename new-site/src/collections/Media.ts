import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    staticDir: process.env.MEDIA_STORAGE_PATH || 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 450, position: 'centre' },
      { name: 'article', width: 1200, height: undefined },
      { name: 'hero', width: 1920, height: undefined },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'textarea' },
    {
      name: 'legacy',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'wordpressId', type: 'number', unique: true },
        { name: 'originalUrl', type: 'text' },
        { name: 'uploadPath', type: 'text', label: 'wp-content/uploads relative path' },
      ],
    },
  ],
}
