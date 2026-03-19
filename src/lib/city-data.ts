/**
 * City data for kookworkshop landing pages and city gallery
 *
 * Single source of truth for:
 * - Hero images on landing pages (/kookworkshop-[city])
 * - City gallery grid on /kookworkshop
 *
 * Images sourced from Wikipedia Commons and goeduitje.nl
 * Stored locally in public/images/cities/
 */

export interface City {
  slug: string;
  name: string;
  image: string;
}

/**
 * Featured cities (displayed in gallery grid with images)
 * These 13 cities are shown prominently in the "Locaties" section
 */
export const FEATURED_CITIES: City[] = [
  { slug: "nijmegen", name: "Nijmegen", image: "/images/cities/nijmegen.jpg" },
  { slug: "arnhem", name: "Arnhem", image: "/images/cities/arnhem.jpg" },
  {
    slug: "doetinchem",
    name: "Doetinchem",
    image: "/images/cities/doetinchem.jpg",
  },
  { slug: "huissen", name: "Huissen", image: "/images/cities/huissen.jpg" },
  {
    slug: "apeldoorn",
    name: "Apeldoorn",
    image: "/images/cities/apeldoorn.jpg",
  },
  { slug: "ede", name: "Ede", image: "/images/cities/ede.jpg" },
  { slug: "wijchen", name: "Wijchen", image: "/images/cities/wijchen.jpg" },
  { slug: "oss", name: "Oss", image: "/images/cities/oss.jpg" },
  { slug: "zevenaar", name: "Zevenaar", image: "/images/cities/zevenaar.jpg" },
  { slug: "cuijk", name: "Cuijk", image: "/images/cities/cuijk.jpg" },
  { slug: "zutphen", name: "Zutphen", image: "/images/cities/zutphen.jpg" },
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
 * All have images for their landing pages
 */
export const OTHER_CITIES: City[] = [
  {
    slug: "achterhoek",
    name: "Achterhoek",
    image: "/images/cities/achterhoek.jpg",
  },
  { slug: "andelst", name: "Andelst", image: "/images/cities/andelst.jpg" },
  { slug: "bemmel", name: "Bemmel", image: "/images/cities/bemmel.jpg" },
  { slug: "bennekom", name: "Bennekom", image: "/images/cities/bennekom.jpg" },
  { slug: "best", name: "Best", image: "/images/cities/best.jpg" },
  {
    slug: "beuningen",
    name: "Beuningen",
    image: "/images/cities/beuningen.jpg",
  },
  {
    slug: "bij-je-thuis",
    name: "Bij je thuis",
    image: "/images/workshops/kookworkshop-hero.jpg",
  },
  { slug: "boxtel", name: "Boxtel", image: "/images/cities/boxtel.jpg" },
  {
    slug: "den-bosch",
    name: "Den Bosch",
    image: "/images/cities/den-bosch.jpg",
  },
  { slug: "didam", name: "Didam", image: "/images/cities/didam.jpg" },
  { slug: "druten", name: "Druten", image: "/images/cities/druten.jpg" },
  { slug: "duiven", name: "Duiven", image: "/images/cities/duiven.jpg" },
  {
    slug: "eindhoven",
    name: "Eindhoven",
    image: "/images/cities/eindhoven.jpg",
  },
  { slug: "elst", name: "Elst", image: "/images/cities/elst.jpg" },
  { slug: "ewijk", name: "Ewijk", image: "/images/cities/ewijk.jpg" },
  {
    slug: "geldermalsen",
    name: "Geldermalsen",
    image: "/images/cities/geldermalsen.jpg",
  },
  { slug: "gendt", name: "Gendt", image: "/images/cities/gendt.jpg" },
  { slug: "gennep", name: "Gennep", image: "/images/cities/gennep.jpg" },
  { slug: "grave", name: "Grave", image: "/images/cities/grave.jpg" },
  {
    slug: "groesbeek",
    name: "Groesbeek",
    image: "/images/cities/groesbeek.jpg",
  },
  { slug: "helmond", name: "Helmond", image: "/images/cities/helmond.jpg" },
  { slug: "malden", name: "Malden", image: "/images/cities/malden.jpg" },
  { slug: "tiel", name: "Tiel", image: "/images/cities/tiel.jpg" },
  { slug: "uden", name: "Uden", image: "/images/cities/uden.jpg" },
  { slug: "veghel", name: "Veghel", image: "/images/cities/veghel.jpg" },
  { slug: "venray", name: "Venray", image: "/images/cities/venray.jpg" },
  {
    slug: "zaltbommel",
    name: "Zaltbommel",
    image: "/images/cities/zaltbommel.jpg",
  },
  { slug: "zetten", name: "Zetten", image: "/images/cities/zetten.jpg" },
];

/**
 * All cities combined
 */
export const ALL_CITIES: City[] = [...FEATURED_CITIES, ...OTHER_CITIES];

/**
 * Get city image for landing page hero
 * Returns the image URL for any city
 *
 * @param citySlug - The city slug (e.g., "nijmegen", "arnhem")
 * @returns Image URL if city found, undefined otherwise
 */
export function getCityImage(citySlug: string): string | undefined {
  const city = ALL_CITIES.find((c) => c.slug === citySlug);
  return city?.image;
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
  return ALL_CITIES.map((c) => c.slug);
}
