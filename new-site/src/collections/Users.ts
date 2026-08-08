import type { CollectionConfig, FieldAccess } from 'payload'
import { isAdmin } from '../access/roles'

const adminOnlyField: FieldAccess = ({ req }) => req.user?.role === 'admin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        update: adminOnlyField,
        create: adminOnlyField,
      },
    },
  ],
}
