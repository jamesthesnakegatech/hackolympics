/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hackolympics/ui"],
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
}

module.exports = nextConfig 