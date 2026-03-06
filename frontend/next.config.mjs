/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['192.168.1.142', 'localhost', 'light-laughter-714ca5c3e9.strapiapp.com']
  },
  reactStrictMode:false
}

export default nextConfig
