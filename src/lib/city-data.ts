/**
 * City data for kookworkshop landing pages and city gallery
 *
 * Single source of truth for:
 * - Hero images on landing pages (/kookworkshop-[city])
 * - City gallery grid on /onze-uitjes/kookworkshop
 *
 * Images sourced from goeduitje.nl (Wix CDN) and stored locally
 * in public/images/cities/
 */

export interface FeaturedCity {
  slug: string;
  name: string;
  image: string;
}

export interface OtherCity {
  slug: string;
  name: string;
}

/**
 * Featured cities with images (displayed in gallery grid)
 * These 13 cities are shown with images in the "Locaties" section
 * Images are city landmarks/streetscapes from the original goeduitje.nl
 */
export const FEATURED_CITIES: FeaturedCity[] = [
  {
    slug: "nijmegen",
    name: "Nijmegen",
    image: "/images/cities/nijmegen.jpg",
  },
  {
    slug: "arnhem",
    name: "Arnhem",
    image: "/images/cities/arnhem.jpg",
  },
  {
    slug: "doetinchem",
    name: "Doetinchem",
    image: "/images/cities/doetinchem.jpg",
  },
  {
    slug: "huissen",
    name: "Huissen",
    image: "/images/cities/huissen.jpg",
  },
  {
    slug: "apeldoorn",
    name: "Apeldoorn",
    image: "/images/cities/apeldoorn.jpg",
  },
  {
    slug: "ede",
    name: "Ede",
    image: "/images/cities/ede.jpg",
  },
  {
    slug: "wijchen",
    name: "Wijchen",
    image: "/images/cities/wijchen.jpg",
  },
  {
    slug: "oss",
    name: "Oss",
    image: "/images/cities/oss.jpg",
  },
  {
    slug: "zevenaar",
    name: "Zevenaar",
    image: "/images/cities/zevenaar.jpg",
  },
  {
    slug: "cuijk",
    name: "Cuijk",
    image: "/images/cities/cuijk.jpg",
  },
  {
    slug: "zutphen",
    name: "Zutphen",
    image: "/images/cities/zutphen.jpg",
  },
  {
    slug: "wageningen",
    name: "Wageningen",
    image: "/images/cities/wageningen.jpg",
  },
  {
    slug: "veenendaal",
    name: "Veenendaal",
    image: "/images/cities/veenendaal.jpg",
  },
];

/**
 * Other cities (displayed as text links below gallery)
 * These 29 cities are shown as simple links without images
 */
export const OTHER_CITIES: OtherCity[] = [
  { slug: "achterhoek", name: "Achterhoek" },
  { slug: "andelst", name: "Andelst" },
  { slug: "bemmel", name: "Bemmel" },
  { slug: "bennekom", name: "Bennekom" },
  { slug: "best", name: "Best" },
  { slug: "beuningen", name: "Beuningen" },
  { slug: "bij-je-thuis", name: "Bij je thuis" },
  { slug: "boxtel", name: "Boxtel" },
  { slug: "den-bosch", name: "Den Bosch" },
  { slug: "didam", name: "Didam" },
  { slug: "druten", name: "Druten" },
  { slug: "duiven", name: "Duiven" },
  { slug: "eindhoven", name: "Eindhoven" },
  { slug: "elst", name: "Elst" },
  { slug: "ewijk", name: "Ewijk" },
  { slug: "geldermalsen", name: "Geldermalsen" },
  { slug: "gendt", name: "Gendt" },
  { slug: "gennep", name: "Gennep" },
  { slug: "grave", name: "Grave" },
  { slug: "groesbeek", name: "Groesbeek" },
  { slug: "helmond", name: "Helmond" },
  { slug: "malden", name: "Malden" },
  { slug: "tiel", name: "Tiel" },
  { slug: "uden", name: "Uden" },
  { slug: "veghel", name: "Veghel" },
  { slug: "venray", name: "Venray" },
  { slug: "zaltbommel", name: "Zaltbommel" },
  { slug: "zetten", name: "Zetten" },
];

/**
 * Get city image for landing page hero
 * Returns the image URL for featured cities, undefined for others
 *
 * @param citySlug - The city slug (e.g., "nijmegen", "arnhem")
 * @returns Image URL if featured city, undefined otherwise
 */
export function getCityImage(citySlug: string): string | undefined {
  const featured = FEATURED_CITIES.find((c) => c.slug === citySlug);
  return featured?.image;
}

/**
 * Check if a city is a featured city
 */
export function isFeaturedCity(citySlug: string): boolean {
  return FEATURED_CITIES.some((c) => c.slug === citySlug);
}

/**
 * Get all city slugs (featured + other)
 */
export function getAllCitySlugs(): string[] {
  return [
    ...FEATURED_CITIES.map((c) => c.slug),
    ...OTHER_CITIES.map((c) => c.slug),
  ];
}
