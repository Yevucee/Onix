import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaUrl', type: 'text' },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  fields: [{ name: 'body', type: 'textarea' }],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'imagePosition',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'right',
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
    { name: 'buttonLabel', type: 'text' },
    { name: 'buttonUrl', type: 'text' },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const FeatureCardsBlock: Block = {
  slug: 'featureCards',
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'url', type: 'text' },
        { name: 'icon', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const LogoGridBlock: Block = {
  slug: 'logoGrid',
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'logos',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

export const DownloadsBlock: Block = {
  slug: 'downloads',
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'files',
      type: 'array',
      fields: [
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const VideoBlock: Block = {
  slug: 'video',
  fields: [
    { name: 'url', type: 'text', required: true, label: 'YouTube or Vimeo URL' },
    { name: 'heading', type: 'text' },
    { name: 'caption', type: 'text' },
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'images',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}

export const LeadershipGridBlock: Block = {
  slug: 'leadershipGrid',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
  ],
}

export const pageBlocks = [
  HeroBlock,
  RichTextBlock,
  ImageTextBlock,
  CtaBlock,
  StatsBlock,
  FeatureCardsBlock,
  LogoGridBlock,
  DownloadsBlock,
  VideoBlock,
  GalleryBlock,
  LeadershipGridBlock,
]
