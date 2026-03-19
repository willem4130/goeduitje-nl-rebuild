/**
 * Site URL used for SEO (sitemap, robots, JSON-LD, OG tags).
 * Set via NEXT_PUBLIC_SITE_URL env var. Defaults to production domain.
 *
 * When migrating domains, change the env var — no code changes needed.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.goeduitje.nl";
