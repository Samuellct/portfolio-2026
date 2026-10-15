import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  // Build version sent with the field Web Vitals (Workers Builds sets the sha)
  env: {
    NEXT_PUBLIC_BUILD_SHA: (process.env.WORKERS_CI_COMMIT_SHA || 'local').slice(0, 7),
  },

  // Image optimisation
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  
  // Tree-shake the barrel imports of these packages
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)

// Cloudflare bindings during `next dev` (no-op in production/build).
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
initOpenNextCloudflareForDev()
