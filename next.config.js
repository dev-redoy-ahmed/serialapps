/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: __dirname,
  },
  // Ensure the app works behind a proxy
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Handle trailing slashes
  trailingSlash: false,
}

module.exports = nextConfig