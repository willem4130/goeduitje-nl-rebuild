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
      // --- Redirects from redirect schema (Wix → new site) ---
      { source: "/almutanabbi", destination: "/", permanent: true },
      {
        source: "/beachvolleybal-workshops",
        destination: "/onze-uitjes/beachvolleybal-workshop",
        permanent: true,
      },
      {
        source: "/citygame-3",
        destination: "/onze-uitjes/stadsspel",
        permanent: true,
      },
      { source: "/contactpagina", destination: "/contact", permanent: true },
      {
        source: "/events-1/arabisch-dineren",
        destination: "/cookies",
        permanent: true,
      },
      {
        source: "/events-1/arabische-kook-workshop",
        destination: "/kookworkshop",
        permanent: true,
      },
      {
        source: "/events-1/beachvolleybal-clinic-beachvolleybal-toernooi",
        destination: "/onze-uitjes/beachvolleybal-workshop",
        permanent: true,
      },
      {
        source: "/events-1/koffie-en-thee-workshop",
        destination: "/onze-uitjes/koffie-thee-workshop",
        permanent: true,
      },
      {
        source: "/events-1/the-oriental-challenge-1",
        destination: "/onze-uitjes/the-game",
        permanent: true,
      },
      // NOTE: /feedback exists as a page on the new site — no redirect needed (schema says → /)
      // NOTE: /recepten exists as a page on the new site — no redirect needed (schema says → /)
      { source: "/home", destination: "/", permanent: true },
      {
        source: "/koffie-en-thee-workshops",
        destination: "/onze-uitjes/koffie-thee-workshop",
        permanent: true,
      },
      // NOTE: /kookworkshop-voor-bedrijven-arnhem has its own landing page — no redirect needed (schema says → /)
      // NOTE: /vegetarische-kookworkshop-nijmegen has its own landing page — no redirect needed (schema says → /voorwaarden)
      {
        source: "/lunch-en-diner-uitjes",
        destination: "/onze-uitjes",
        permanent: true,
      },
      { source: "/profile/info/events", destination: "/", permanent: true },
      { source: "/profile/info/profile", destination: "/", permanent: true },
      {
        source: "/profile/info87811/events",
        destination: "/",
        permanent: true,
      },
      {
        source: "/profile/info87811/profile",
        destination: "/",
        permanent: true,
      },
      {
        source: "/stadsspellen",
        destination: "/onze-uitjes/stadsspel",
        permanent: true,
      },
      // --- Pre-existing redirects (not in schema) ---
      {
        source: "/booking",
        destination: "/open-kookworkshops",
        permanent: true,
      },
      {
        source: "/onze-uitjes/kookworkshop",
        destination: "/kookworkshop",
        permanent: true,
      },
      // Note: Case-sensitive redirects (e.g. /teambuilding-Nijmegen → /teambuilding-nijmegen)
      // are handled by middleware.ts which normalizes ALL uppercase URLs to lowercase.
    ];
  },

  // Security headers for all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://tagmanager.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' https:; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com; frame-src https://www.googletagmanager.com; frame-ancestors 'none'; form-action 'self'; object-src 'none';",
          },
        ],
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
