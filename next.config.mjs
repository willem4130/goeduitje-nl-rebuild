import "./env.ts";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Specify project root to avoid lockfile warnings
  turbopack: {
    root: process.cwd(),
  },

  images: {
    // Modern image formats for better compression
    formats: ["image/webp", "image/avif"],

    // Device sizes for responsive images (matches Tailwind breakpoints)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 760, 1520],

    // Cache optimized images for 60 days
    minimumCacheTTL: 5184000,

    // Allow Instagram images (used in instagram-feed.tsx)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "scontent-*.cdninstagram.com",
      },
    ],

    // Disable image optimization warnings for unoptimized prop
    unoptimized: false,
  },

  // Enable compression
  compress: true,

  // Optimize production builds
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
