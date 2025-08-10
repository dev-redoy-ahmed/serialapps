/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure the app works behind a proxy
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Handle trailing slashes
  trailingSlash: false,
  // Ensure proper server configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
  },
}

module.exports = nextConfig