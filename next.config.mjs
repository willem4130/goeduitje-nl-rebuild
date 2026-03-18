import "./env.ts";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack config to exclude emails from error page rendering
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude @react-email from the error page bundle
      config.externals = [
        ...(config.externals || []),
        "@react-email/components",
      ];
    }
    return config;
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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],

    // Disable image optimization warnings for unoptimized prop
    unoptimized: false,
  },

  // 301 redirects: old Wix URLs → new URLs (preserve SEO juice)
  async redirects() {
    return [
      {
        source: "/contactpagina",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/booking",
        destination: "/open-kookworkshops",
        permanent: true,
      },
      {
        source: "/kookworkshop",
        destination: "/onze-uitjes/kookworkshop",
        permanent: true,
      },
      {
        source: "/lunch-en-diner-uitjes",
        destination: "/onze-uitjes/lunch-diner",
        permanent: true,
      },
      {
        source: "/beachvolleybal-workshops",
        destination: "/onze-uitjes/beachvolleybal-workshop",
        permanent: true,
      },
      {
        source: "/koffie-en-thee-workshops",
        destination: "/onze-uitjes/koffie-thee-workshop",
        permanent: true,
      },
      {
        source: "/stadsspellen",
        destination: "/onze-uitjes/stadsspel",
        permanent: true,
      },
    ];
  },

  // Enable compression
  compress: true,

  // Optimize production builds
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
