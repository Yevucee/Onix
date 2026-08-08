import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
  ],
}

export const ImageWithCaptionBlock: Block = {
  slug: 'imageWithCaption',
  labels: { singular: 'Image with caption', plural: 'Images with captions' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'textarea', required: true },
    { name: 'credit', type: 'text' },
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  fields: [
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}

export const VideoBlock: Block = {
  slug: 'video',
  fields: [
    { name: 'url', type: 'text', required: true, label: 'YouTube or Vimeo URL' },
    { name: 'caption', type: 'text' },
  ],
}

export const QuoteBlock: Block = {
  slug: 'quote',
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text' },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', required: true },
    { name: 'buttonUrl', type: 'text', required: true },
  ],
}

export const DownloadBlock: Block = {
  slug: 'download',
  fields: [
    { name: 'file', type: 'upload', relationTo: 'media', required: true },
    { name: 'label', type: 'text', required: true },
  ],
}

export const TableBlock: Block = {
  slug: 'table',
  fields: [
    {
      name: 'rows',
      type: 'array',
      fields: [
        {
          name: 'cells',
          type: 'array',
          fields: [{ name: 'value', type: 'text' }],
        },
      ],
    },
  ],
}

export const DividerBlock: Block = {
  slug: 'divider',
  fields: [],
}

export const RelatedArticleBlock: Block = {
  slug: 'relatedArticle',
  fields: [{ name: 'article', type: 'relationship', relationTo: 'articles', required: true }],
}

export const articleBlocks = [
  ImageBlock,
  ImageWithCaptionBlock,
  GalleryBlock,
  VideoBlock,
  QuoteBlock,
  CTABlock,
  DownloadBlock,
  TableBlock,
  DividerBlock,
  RelatedArticleBlock,
]
