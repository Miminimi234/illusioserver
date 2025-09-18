/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force rebuild to clear cache
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Proxy admin requests to Railway server
  async rewrites() {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://testillusioserver-production-3833.up.railway.app'
        : 'http://localhost:8080');
    
    return [
      {
        source: '/admin',
        destination: `${serverUrl}/admin-dashboard`
      },
      {
        source: '/admin/:path*',
        destination: `${serverUrl}/admin-dashboard/:path*`
      },
      {
        source: '/api/admin/:path*',
        destination: `${serverUrl}/api/admin/:path*`
      }
    ]
  },
  experimental: {
    esmExternals: 'loose'
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Image optimization
  images: {
    domains: ['testillusioserver-production-3833.up.railway.app'],
    formats: ['image/webp', 'image/avif'],
  },
  // Caching headers for better performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/admin',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net",
              "script-src-attr 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "connect-src 'self' https: wss:",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'"
            ].join('; ')
          }
        ]
      }
    ]
  },
  // Optimize bundle splitting for mobile route
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Separate mobile route chunks
          mobile: {
            test: /[\\/]app[\\/]mobile[\\/]/,
            name: 'mobile',
            chunks: 'all',
            priority: 20,
          },
          // Keep desktop chunks separate
          desktop: {
            test: /[\\/]app[\\/](?!mobile)[\\/]/,
            name: 'desktop',
            chunks: 'all',
            priority: 10,
          },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig
