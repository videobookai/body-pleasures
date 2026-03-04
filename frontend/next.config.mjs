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
    remotePatterns: [
      { hostname: '192.168.1.142' },
      { hostname: 'localhost' },
      { hostname: '172.20.240.1' },
      { hostname: '*.strapiapp.com' },
    ],
  },
  reactStrictMode:false
}

export default nextConfig
