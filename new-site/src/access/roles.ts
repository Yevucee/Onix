import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'
export const isAdminOrEditor: Access = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editor'

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}
