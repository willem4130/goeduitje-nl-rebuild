/**
 * Site Assets Fetcher
 *
 * Fetches site assets (logos, hero videos, etc.) from the backend API.
 * Used in Server Components to pass URLs to client components.
 */

export interface SiteAssets {
  logos: {
    nav?: string;
    footer?: string;
  };
  hero: {
    videos: {
      desktop?: { mp4?: string; webm?: string };
      mobile?: { mp4?: string; webm?: string };
    };
    posters: {
      desktop?: string;
      mobile?: string;
    };
  };
  og: {
    opengraph?: string;
    twitter?: string;
  };
}

// Fallback to static files if API fails
const FALLBACK_ASSETS: SiteAssets = {
  logos: {
    nav: "/images/logo/logo-nav.png",
    footer: "/images/logo/logo-footer.png",
  },
  hero: {
    videos: {
      desktop: {
        mp4: "/videos/hero/hero-background.mp4",
        webm: "/videos/hero/hero-background.webm",
      },
      mobile: {
        mp4: "/videos/hero/hero-background-mobile.mp4",
        webm: "/videos/hero/hero-background-mobile.webm",
      },
    },
    posters: {
      desktop: "/images/hero/hero-poster.jpg",
      mobile: "/images/hero/hero-poster-mobile.jpg",
    },
  },
  og: {
    opengraph: "/og-image.png",
    twitter: "/twitter-image.png",
  },
};

const BACKEND_URL =
  process.env.BACKEND_URL || "https://goeduitje-backend.vercel.app";

/**
 * Fetch site assets from the backend API
 * Returns fallback values if the API is unavailable
 */
export async function getSiteAssets(): Promise<SiteAssets> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/site-assets`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.warn("Failed to fetch site assets, using fallbacks");
      return FALLBACK_ASSETS;
    }

    const assets = (await response.json()) as SiteAssets;

    // Merge with fallbacks (in case some assets are missing)
    return {
      logos: {
        nav: assets.logos?.nav || FALLBACK_ASSETS.logos.nav,
        footer: assets.logos?.footer || FALLBACK_ASSETS.logos.footer,
      },
      hero: {
        videos: {
          desktop: {
            mp4:
              assets.hero?.videos?.desktop?.mp4 ||
              FALLBACK_ASSETS.hero.videos.desktop?.mp4,
            webm:
              assets.hero?.videos?.desktop?.webm ||
              FALLBACK_ASSETS.hero.videos.desktop?.webm,
          },
          mobile: {
            mp4:
              assets.hero?.videos?.mobile?.mp4 ||
              FALLBACK_ASSETS.hero.videos.mobile?.mp4,
            webm:
              assets.hero?.videos?.mobile?.webm ||
              FALLBACK_ASSETS.hero.videos.mobile?.webm,
          },
        },
        posters: {
          desktop:
            assets.hero?.posters?.desktop ||
            FALLBACK_ASSETS.hero.posters.desktop,
          mobile:
            assets.hero?.posters?.mobile || FALLBACK_ASSETS.hero.posters.mobile,
        },
      },
      og: {
        opengraph: assets.og?.opengraph || FALLBACK_ASSETS.og.opengraph,
        twitter: assets.og?.twitter || FALLBACK_ASSETS.og.twitter,
      },
    };
  } catch (error) {
    console.error("Error fetching site assets:", error);
    return FALLBACK_ASSETS;
  }
}
