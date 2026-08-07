import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'onixdatacentres.com', pathname: '/wp-content/uploads/**' },
    ],
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
