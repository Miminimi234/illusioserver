/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy admin requests to Railway server
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: 'https://server-production-d3da.up.railway.app/admin-dashboard'
      },
      {
        source: '/admin/:path*',
        destination: 'https://server-production-d3da.up.railway.app/admin-dashboard/:path*'
      },
      {
        source: '/api/admin/:path*',
        destination: 'https://server-production-d3da.up.railway.app/api/admin/:path*'
      }
    ]
  },
  // CSP headers - relaxed for admin route
  async headers() {
    return [
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
  experimental: {
    esmExternals: 'loose'
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
