import type { GlobalConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true, update: isAdmin },
  fields: [
    { name: 'siteName', type: 'text', required: true, localized: true },
    { name: 'tagline', type: 'text', localized: true },
    { name: 'contactEmail', type: 'email' },
    { name: 'phone', type: 'text' },
    { name: 'address', type: 'textarea', localized: true },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
  ],
}

export const HeaderNavigation: GlobalConfig = {
  slug: 'header-navigation',
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'children',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    {
      name: 'columns',
      type: 'array',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'copyright', type: 'text', localized: true },
    {
      name: 'legalLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}

export const SEODefaults: GlobalConfig = {
  slug: 'seo-defaults',
  access: { read: () => true, update: isAdmin },
  fields: [
    { name: 'titleTemplate', type: 'text', defaultValue: '%s – Onix Data Centre' },
    { name: 'defaultDescription', type: 'textarea', localized: true },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    { name: 'organizationName', type: 'text' },
    { name: 'organizationUrl', type: 'text' },
  ],
}
