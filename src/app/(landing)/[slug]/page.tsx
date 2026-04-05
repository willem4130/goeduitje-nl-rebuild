import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  MapPin,
  ChefHat,
  CheckCircle2,
  ArrowRight,
  Heart,
  Star,
  Phone,
  Mail,
  Building2,
  Compass,
  Euro,
} from "lucide-react";
import { getCityImage } from "@/lib/city-data";
import { SITE_URL } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import type { Workshop, PriceTier, WorkshopVariant } from "@prisma/client";

export const revalidate = 300; // Revalidate every 5 minutes

type WorkshopWithPricing = Workshop & {
  priceTiers: PriceTier[];
  variants: (WorkshopVariant & { priceTiers: PriceTier[] })[];
};

async function getWorkshopsWithPricing(): Promise<WorkshopWithPricing[]> {
  return prisma.workshop.findMany({
    where: { isPublished: true },
    include: {
      priceTiers: {
        where: { variantId: null },
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        orderBy: { sortOrder: "asc" },
        include: {
          priceTiers: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

function formatEuro(amount: number | null): string {
  if (amount === null) return "Op aanvraag";
  return amount % 1 === 0
    ? `€${amount}`
    : `€${amount.toFixed(2).replace(".", ",")}`;
}

function formatPrice(price: number | null): string {
  if (price === null) return "Op aanvraag";
  return `Vanaf ${formatEuro(price)} p.p.`;
}

function getLowestPriceFromWorkshop(workshop: WorkshopWithPricing): number {
  let lowest = Infinity;
  for (const tier of workshop.priceTiers) {
    if (tier.priceExclBtw < lowest) lowest = tier.priceExclBtw;
  }
  for (const variant of workshop.variants) {
    for (const tier of variant.priceTiers) {
      if (tier.priceExclBtw < lowest) lowest = tier.priceExclBtw;
    }
  }
  return lowest === Infinity ? 0 : lowest;
}

function getLowestInclFromWorkshop(workshop: WorkshopWithPricing): number {
  let lowestExcl = Infinity;
  let correspondingIncl = 0;
  for (const tier of workshop.priceTiers) {
    if (tier.priceExclBtw < lowestExcl) {
      lowestExcl = tier.priceExclBtw;
      correspondingIncl = tier.priceInclBtw;
    }
  }
  for (const variant of workshop.variants) {
    for (const tier of variant.priceTiers) {
      if (tier.priceExclBtw < lowestExcl) {
        lowestExcl = tier.priceExclBtw;
        correspondingIncl = tier.priceInclBtw;
      }
    }
  }
  return correspondingIncl;
}

// All cities for kookworkshop landing pages - complete list from goeduitje.nl
const KOOKWORKSHOP_CITIES: CityData[] = [
  {
    slug: "kookworkshop-achterhoek",
    city: "Achterhoek",
    region: "de Achterhoek",
    tagline: "Unieke kookervaring",
  },
  {
    slug: "kookworkshop-andelst",
    city: "Andelst",
    region: "Andelst",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-apeldoorn",
    city: "Apeldoorn",
    region: "Apeldoorn",
    tagline: "Unieke kookervaring",
  },
  {
    slug: "kookworkshop-arnhem",
    city: "Arnhem",
    region: "Arnhem",
    tagline: "Dé culinaire ervaring",
  },
  {
    slug: "kookworkshop-bemmel",
    city: "Bemmel",
    region: "Bemmel",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-bennekom",
    city: "Bennekom",
    region: "Bennekom",
    tagline: "Unieke kookervaring",
  },
  {
    slug: "kookworkshop-best",
    city: "Best",
    region: "Best",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-beuningen",
    city: "Beuningen",
    region: "Beuningen",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-bij-je-thuis",
    city: "bij je thuis",
    region: "bij jou thuis",
    tagline: "Op locatie",
  },
  {
    slug: "kookworkshop-boxtel",
    city: "Boxtel",
    region: "Boxtel",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-cuijk",
    city: "Cuijk",
    region: "Cuijk",
    tagline: "Echte Arabische koks",
  },
  {
    slug: "kookworkshop-den-bosch",
    city: "Den Bosch",
    region: "Den Bosch",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-didam",
    city: "Didam",
    region: "Didam",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-doetinchem",
    city: "Doetinchem",
    region: "Doetinchem",
    tagline: "Unieke kookervaring",
  },
  {
    slug: "kookworkshop-druten",
    city: "Druten",
    region: "Druten",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-duiven",
    city: "Duiven",
    region: "Duiven",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-ede",
    city: "Ede",
    region: "Ede",
    tagline: "Unieke kookervaring",
  },
  {
    slug: "kookworkshop-eindhoven",
    city: "Eindhoven",
    region: "Eindhoven",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-elst",
    city: "Elst",
    region: "Elst",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-ewijk",
    city: "Ewijk",
    region: "Ewijk",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-geldermalsen",
    city: "Geldermalsen",
    region: "Geldermalsen",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-gendt",
    city: "Gendt",
    region: "Gendt",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-gennep",
    city: "Gennep",
    region: "Gennep",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-grave",
    city: "Grave",
    region: "Grave",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-groesbeek",
    city: "Groesbeek",
    region: "Groesbeek",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-helmond",
    city: "Helmond",
    region: "Helmond",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-huissen",
    city: "Huissen",
    region: "Huissen",
    tagline: "Het culinaire uitje",
  },
  {
    slug: "kookworkshop-malden",
    city: "Malden",
    region: "Malden",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-nijmegen",
    city: "Nijmegen",
    region: "de regio Nijmegen",
    tagline: "Unieke ervaring",
  },
  {
    slug: "kookworkshop-oss",
    city: "Oss",
    region: "Oss",
    tagline: "Een unieke culinaire ervaring",
  },
  {
    slug: "kookworkshop-tiel",
    city: "Tiel",
    region: "Tiel",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-uden",
    city: "Uden",
    region: "Uden",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-veenendaal",
    city: "Veenendaal",
    region: "Veenendaal",
    tagline: "Unieke kookcursus",
  },
  {
    slug: "kookworkshop-veghel",
    city: "Veghel",
    region: "Veghel",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-venray",
    city: "Venray",
    region: "Venray",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-wageningen",
    city: "Wageningen",
    region: "Wageningen",
    tagline: "Leer koken op een unieke manier",
  },
  {
    slug: "kookworkshop-wijchen",
    city: "Wijchen",
    region: "Wijchen",
    tagline: "Voor een culinaire ervaring",
  },
  {
    slug: "kookworkshop-zaltbommel",
    city: "Zaltbommel",
    region: "Zaltbommel",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-zetten",
    city: "Zetten",
    region: "Zetten",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-zevenaar",
    city: "Zevenaar",
    region: "Zevenaar",
    tagline: "Talentvolle Arabische koks",
  },
  {
    slug: "kookworkshop-zutphen",
    city: "Zutphen",
    region: "Zutphen",
    tagline: "Een unieke kookcursus",
  },
];

// Also add vegetarische-kookworkshop-nijmegen + type-specific city pages
const ALL_LANDING_PAGES: LandingPageData[] = [
  ...KOOKWORKSHOP_CITIES,
  {
    slug: "vegetarische-kookworkshop-nijmegen",
    city: "Nijmegen",
    region: "Nijmegen",
    tagline: "Vegetarische kookervaring",
    isVegetarian: true,
  },
  // Teambuilding city pages
  {
    slug: "teambuilding-nijmegen",
    city: "Nijmegen",
    region: "de regio Nijmegen",
    tagline: "Teambuilding met impact",
    type: "teambuilding",
  },
  {
    slug: "teambuilding-arnhem",
    city: "Arnhem",
    region: "Arnhem",
    tagline: "Teambuilding met impact",
    type: "teambuilding",
  },
  // Bedrijfsuitje city pages
  {
    slug: "bedrijfsuitje-nijmegen",
    city: "Nijmegen",
    region: "de regio Nijmegen",
    tagline: "Uniek bedrijfsuitje",
    type: "bedrijfsuitje",
  },
  {
    slug: "bedrijfsuitje-arnhem",
    city: "Arnhem",
    region: "Arnhem",
    tagline: "Uniek bedrijfsuitje",
    type: "bedrijfsuitje",
  },
  {
    slug: "kookworkshop-voor-bedrijven-arnhem",
    city: "Arnhem",
    region: "Arnhem",
    tagline: "Culinair bedrijfsuitje",
    type: "bedrijfsuitje",
    displayTitle: "Kookworkshop voor Bedrijven",
  },
  // Stadsspel city pages
  {
    slug: "stadsspel-achterhoek",
    city: "Achterhoek",
    region: "de Achterhoek",
    tagline: "Ontdek de regio",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-andelst",
    city: "Andelst",
    region: "Andelst",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-apeldoorn",
    city: "Apeldoorn",
    region: "Apeldoorn",
    tagline: "Unieke stadsspel ervaring",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-arnhem",
    city: "Arnhem",
    region: "Arnhem",
    tagline: "Dé interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-bemmel",
    city: "Bemmel",
    region: "Bemmel",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-bennekom",
    city: "Bennekom",
    region: "Bennekom",
    tagline: "Unieke speurtocht ervaring",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-best",
    city: "Best",
    region: "Best",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-beuningen",
    city: "Beuningen",
    region: "Beuningen",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-boxtel",
    city: "Boxtel",
    region: "Boxtel",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-cuijk",
    city: "Cuijk",
    region: "Cuijk",
    tagline: "Begeleid door statushouders",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-den-bosch",
    city: "Den Bosch",
    region: "Den Bosch",
    tagline: "Ontdek de stad",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-didam",
    city: "Didam",
    region: "Didam",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-doetinchem",
    city: "Doetinchem",
    region: "Doetinchem",
    tagline: "Unieke stadsspel ervaring",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-druten",
    city: "Druten",
    region: "Druten",
    tagline: "Culturele ontdekkingstocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-duiven",
    city: "Duiven",
    region: "Duiven",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-ede",
    city: "Ede",
    region: "Ede",
    tagline: "Unieke stadsspel ervaring",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-eindhoven",
    city: "Eindhoven",
    region: "Eindhoven",
    tagline: "Ontdek de stad",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-elst",
    city: "Elst",
    region: "Elst",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-ewijk",
    city: "Ewijk",
    region: "Ewijk",
    tagline: "Culturele ontdekkingstocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-geldermalsen",
    city: "Geldermalsen",
    region: "Geldermalsen",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-gendt",
    city: "Gendt",
    region: "Gendt",
    tagline: "Culturele ontdekkingstocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-gennep",
    city: "Gennep",
    region: "Gennep",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-grave",
    city: "Grave",
    region: "Grave",
    tagline: "Culturele ontdekkingstocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-groesbeek",
    city: "Groesbeek",
    region: "Groesbeek",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-helmond",
    city: "Helmond",
    region: "Helmond",
    tagline: "Ontdek de stad",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-huissen",
    city: "Huissen",
    region: "Huissen",
    tagline: "Het culturele teamuitje",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-malden",
    city: "Malden",
    region: "Malden",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-nijmegen",
    city: "Nijmegen",
    region: "de regio Nijmegen",
    tagline: "Unieke ervaring",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-oss",
    city: "Oss",
    region: "Oss",
    tagline: "Een unieke speurtocht ervaring",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-tiel",
    city: "Tiel",
    region: "Tiel",
    tagline: "Culturele ontdekkingstocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-uden",
    city: "Uden",
    region: "Uden",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-veenendaal",
    city: "Veenendaal",
    region: "Veenendaal",
    tagline: "Uniek stadsspel",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-veghel",
    city: "Veghel",
    region: "Veghel",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-venray",
    city: "Venray",
    region: "Venray",
    tagline: "Culturele ontdekkingstocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-wageningen",
    city: "Wageningen",
    region: "Wageningen",
    tagline: "Ontdek de stad op een unieke manier",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-wijchen",
    city: "Wijchen",
    region: "Wijchen",
    tagline: "Voor een culturele speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-zaltbommel",
    city: "Zaltbommel",
    region: "Zaltbommel",
    tagline: "Interactieve speurtocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-zetten",
    city: "Zetten",
    region: "Zetten",
    tagline: "Culturele ontdekkingstocht",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-zevenaar",
    city: "Zevenaar",
    region: "Zevenaar",
    tagline: "Speurtocht met statushouders",
    type: "stadsspel",
  },
  {
    slug: "stadsspel-zutphen",
    city: "Zutphen",
    region: "Zutphen",
    tagline: "Een unieke ontdekkingstocht",
    type: "stadsspel",
  },
];

type LandingType =
  | "kookworkshop"
  | "teambuilding"
  | "bedrijfsuitje"
  | "stadsspel";

interface CityData {
  slug: string;
  city: string;
  region: string;
  tagline: string;
}

interface LandingPageData extends CityData {
  isVegetarian?: boolean;
  type?: LandingType;
  displayTitle?: string;
}

type Props = {
  params: Promise<{ slug: string }>;
};

function getLandingPage(slug: string): LandingPageData | undefined {
  return ALL_LANDING_PAGES.find((page) => page.slug === slug);
}

function extractCitySlug(slug: string): string {
  // Order matters: most specific prefixes first
  return slug
    .replace("vegetarische-kookworkshop-", "")
    .replace("kookworkshop-voor-bedrijven-", "")
    .replace("kookworkshop-", "")
    .replace("teambuilding-", "")
    .replace("bedrijfsuitje-", "")
    .replace("stadsspel-", "");
}

interface ThemeConfig {
  gradient: string;
  badge: string;
  button: string;
  accent: string;
  iconBg: string;
  ctaBg: string;
  ctaButton: string;
  ctaOutline: string;
}

const THEMES: Record<LandingType, ThemeConfig> = {
  kookworkshop: {
    gradient: "from-amber-50 via-orange-50 to-white",
    badge: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    button: "bg-amber-600 hover:bg-amber-700",
    accent: "text-amber-600",
    iconBg: "bg-amber-100",
    ctaBg: "bg-amber-600",
    ctaButton: "bg-white text-amber-600 hover:bg-white/90",
    ctaOutline: "border-white bg-transparent text-white hover:bg-white/10",
  },
  teambuilding: {
    gradient: "from-secondary/10 via-sky-50 to-white",
    badge: "bg-secondary/15 text-secondary hover:bg-secondary/15",
    button: "bg-secondary hover:bg-secondary/90",
    accent: "text-secondary",
    iconBg: "bg-secondary/15",
    ctaBg: "bg-secondary",
    ctaButton: "bg-white text-secondary hover:bg-white/90",
    ctaOutline: "border-white bg-transparent text-white hover:bg-white/10",
  },
  bedrijfsuitje: {
    gradient: "from-green-50 via-emerald-50 to-white",
    badge: "bg-green-100 text-green-800 hover:bg-green-100",
    button: "bg-green-600 hover:bg-green-700",
    accent: "text-green-600",
    iconBg: "bg-green-100",
    ctaBg: "bg-green-600",
    ctaButton: "bg-white text-green-600 hover:bg-white/90",
    ctaOutline: "border-white bg-transparent text-white hover:bg-white/10",
  },
  stadsspel: {
    gradient: "from-indigo-50 via-violet-50 to-white",
    badge: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
    button: "bg-indigo-600 hover:bg-indigo-700",
    accent: "text-indigo-600",
    iconBg: "bg-indigo-100",
    ctaBg: "bg-indigo-600",
    ctaButton: "bg-white text-indigo-600 hover:bg-white/90",
    ctaOutline: "border-white bg-transparent text-white hover:bg-white/10",
  },
};

const TYPE_LABELS: Record<LandingType, string> = {
  kookworkshop: "Kookworkshop",
  teambuilding: "Teambuilding",
  bedrijfsuitje: "Bedrijfsuitje",
  stadsspel: "Stadsspel",
};

function getFallbackImages(type: LandingType): string[] {
  switch (type) {
    case "teambuilding":
      return [
        "/images/workshops/the-game.jpg",
        "/images/workshops/kookworkshop.jpg",
        "/images/workshops/beachvolleybal.jpg",
      ];
    case "bedrijfsuitje":
      return [
        "/images/workshops/kookworkshop.jpg",
        "/images/workshops/koffie-thee.jpg",
        "/images/workshops/the-game.jpg",
      ];
    case "stadsspel":
      return [
        "/images/workshops/the-game.jpg",
        "/images/workshops/kookworkshop.jpg",
        "/images/workshops/beachvolleybal.jpg",
      ];
    default:
      return [
        "/images/workshops/kookworkshop-hero.jpg",
        "/images/workshops/wat-uniek-maakt.jpg",
        "/images/workshops/open-kookworkshop.jpg",
      ];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const landing = getLandingPage(slug);

  if (!landing) {
    return {
      title: "Pagina niet gevonden | Goeduitje.nl",
    };
  }

  const type = landing.type || "kookworkshop";
  const pageTitle = landing.displayTitle
    ? `${landing.displayTitle} ${landing.city}`
    : landing.isVegetarian
      ? `Vegetarische Kookworkshop ${landing.city}`
      : `${TYPE_LABELS[type]} ${landing.city}`;

  const metaDescriptions: Record<LandingType, string> = {
    kookworkshop: `Bij onze sociale onderneming organiseren statushouders en asielzoekers unieke kookworkshops in ${landing.region}, waar u onder begeleiding van onze medewerkers aan de slag gaat.`,
    teambuilding: `Organiseer een onvergetelijke teambuilding in ${landing.region} met maatschappelijke impact. Kookworkshops, stadsspellen en interactieve challenges begeleid door statushouders.`,
    bedrijfsuitje: `Organiseer een uniek bedrijfsuitje in ${landing.region} met sociale impact. Van kookworkshops tot stadsspellen – activiteiten begeleid door statushouders en nieuwkomers.`,
    stadsspel: `Speel het unieke stadsspel in ${landing.city}! Een interactieve speurtocht in de stad met culturele uitdagingen, begeleid door statushouders en nieuwkomers.`,
  };

  const typeKeywords: Record<LandingType, string[]> = {
    kookworkshop: [
      `kookworkshop ${landing.city.toLowerCase()}`,
      `koken ${landing.city.toLowerCase()}`,
      "kookworkshop",
      "arabische keuken",
    ],
    teambuilding: [
      `teambuilding ${landing.city.toLowerCase()}`,
      `teamuitje ${landing.city.toLowerCase()}`,
      "teambuilding",
      "teambuilding activiteiten",
    ],
    bedrijfsuitje: [
      `bedrijfsuitje ${landing.city.toLowerCase()}`,
      `personeelsuitje ${landing.city.toLowerCase()}`,
      "bedrijfsuitje",
      "bedrijfsuitje organiseren",
    ],
    stadsspel: [
      `stadsspel ${landing.city.toLowerCase()}`,
      `citygame ${landing.city.toLowerCase()}`,
      "stadsspel",
      "speurtocht",
    ],
  };

  const metaDescription = metaDescriptions[type];

  const cityImage = getCityImage(extractCitySlug(landing.slug));
  const ogImage = cityImage
    ? `${SITE_URL}${cityImage}`
    : `${SITE_URL}/og-image.png`;

  return {
    title: `${pageTitle} | ${landing.tagline} | Goed Uitje`,
    description: metaDescription,
    keywords: [
      ...typeKeywords[type],
      `teambuilding ${landing.city.toLowerCase()}`,
      `bedrijfsuitje ${landing.city.toLowerCase()}`,
      "sociale impact",
      "statushouders",
    ],
    openGraph: {
      title: `${pageTitle} | ${landing.tagline} | Goed Uitje`,
      description: metaDescription,
      type: "website",
      locale: "nl_NL",
      siteName: "Goeduitje.nl",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | ${landing.tagline} | Goed Uitje`,
      description: metaDescription,
      images: [ogImage],
    },
  };
}

// Allow dynamic params so middleware can intercept uppercase URLs
// (dynamicParams = false causes Vercel CDN to 404 before middleware runs)
// Unknown slugs are handled by the notFound() call in the page component
export const dynamicParams = true;

export async function generateStaticParams() {
  return ALL_LANDING_PAGES.map((page) => ({
    slug: page.slug,
  }));
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const landing = getLandingPage(slug);

  if (!landing) {
    notFound();
  }

  const type = landing.type || "kookworkshop";
  const citySlug = extractCitySlug(slug);
  const fallbackImages = getFallbackImages(type);
  const imageIndex =
    slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    fallbackImages.length;
  const heroImage = getCityImage(citySlug) || fallbackImages[imageIndex];

  const [workshops, reviewStats] = await Promise.all([
    getWorkshopsWithPricing(),
    prisma.googleReview.aggregate({
      where: { isVisible: true },
      _avg: { rating: true },
    }),
  ]);
  const avgRating = reviewStats._avg.rating?.toFixed(1) || "4.9";

  // Non-kookworkshop types use a separate template
  if (type !== "kookworkshop") {
    return (
      <TypedLandingPage
        landing={landing}
        type={type}
        heroImage={heroImage}
        workshops={workshops}
        avgRating={avgRating}
      />
    );
  }

  // Get kookworkshop pricing from DB
  const kookworkshop = workshops.find((w) => w.slug === "kookworkshop");
  const arabischeVariant = kookworkshop?.variants.find((v) =>
    v.name.toLowerCase().includes("arabische")
  );
  const kookPriceTiers = arabischeVariant?.priceTiers ?? [];
  const kookLowestPrice = kookworkshop
    ? getLowestPriceFromWorkshop(kookworkshop)
    : null;

  const isVegetarian = landing.isVegetarian;
  const workshopType = isVegetarian
    ? "Vegetarische Kookworkshop"
    : "Kookworkshop";

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-white py-16 lg:py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div className="flex flex-col justify-center">
              <Badge className="mb-4 w-fit bg-amber-100 text-amber-800 hover:bg-amber-100">
                <MapPin className="mr-1 h-3 w-3" />
                {landing.region}
              </Badge>

              <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {workshopType} {landing.city}
              </h1>

              {/* Exact intro text from original pages */}
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Bij onze sociale onderneming organiseren statushouders en
                asielzoekers unieke kookworkshops in {landing.region}, waar je
                onder begeleiding van onze medewerkers aan de slag gaat. Deze
                workshops bieden niet alleen een culinaire reis door de
                Arabische keuken, maar ook een waardevolle kans om nieuwe
                talenten te ontdekken en met elkaar beter te leren kennen.
              </p>

              {/* USPs from original pages */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span className="text-gray-700">
                    Unieke kookervaring met statushouders en asielzoekers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span className="text-gray-700">
                    Op eigen- of af te spreken locatie in {landing.city}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span className="text-gray-700">
                    Professionele begeleiding van Arabische koks
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Link href="/kookworkshop">
                    <ChefHat className="mr-2 h-5 w-5" />
                    Bekijk onze kookworkshops
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">
                    Offerte aanvragen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl lg:aspect-square">
              <Image
                src={heroImage}
                alt={`Kookworkshop in ${landing.city}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute right-6 bottom-6 left-6">
                <div className="flex items-center gap-2 text-white">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {avgRating}/5 op Google
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="border-b bg-white py-8">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-xl border bg-amber-50/50 p-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <Euro className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Prijs</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(kookLowestPrice)}
                </p>
                <p className="text-xs text-gray-500">excl. btw</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border bg-amber-50/50 p-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duur</p>
                <p className="text-lg font-bold text-gray-900">
                  {kookworkshop?.duration ?? "Vanaf 2,5 uur"}
                </p>
                <p className="text-xs text-gray-500">volledig naar wens</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border bg-amber-50/50 p-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Groepsgrootte</p>
                <p className="text-lg font-bold text-gray-900">
                  {kookworkshop?.groupSize ?? "Vanaf 8 personen"}
                </p>
                <p className="text-xs text-gray-500">ook grotere groepen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Our Workshops Section - Exact text from original */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
              Onze kookworkshops in {landing.city}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Onze kookworkshops worden geleid door Arabische koks, die niet
              alleen de fijne kneepjes van hun keuken delen, maar je vooral
              laten ervaren hoe authentieke Arabische gerechten worden bereid.
              Onder hun begeleiding leer je, in kleine teams van twee of drie,
              diverse hoofdgerechten en desserts maken. Na het koken kun je
              genieten van je eigen culinaire creaties, aangevuld met gerechten
              die de koks speciaal voor jullie bereiden.
            </p>
          </div>
        </div>
      </section>

      {/* Workshop Types Section - Exact text from original */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Populaire kookworkshops in {landing.city}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              We stemmen onze kookworkshop graag af op jouw wensen. Ook hebben
              wij een aantal standaard kookworkshops op een rijtje gezet als je
              gewoon makkelijk wilt kiezen:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Arabische kookworkshop */}
            <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <ChefHat className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Arabische kookworkshop</h3>
              <p className="text-muted-foreground">
                Leer met je team diverse Arabische gerechten bereiden.
                Afhankelijk van de gewenste lengte maken we samen een keuze uit
                vele voor- en hoofdgerechten, salades en toetjes. Wij koken met
                vlees, vegetarisch en veganistisch. En daarna gezellig genieten
                van de bereide gerechten.
              </p>
            </div>

            {/* Dessert workshop */}
            <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <Heart className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Dessert workshop</h3>
              <p className="text-muted-foreground">
                Uitermate geschikt als opwarmertje of kennismakingsactiviteit
                tijdens een teamdag, maar ook als onderbreking tijdens een
                congres of strategiedag.
              </p>
            </div>

            {/* Oogsten, koken & genieten */}
            <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">
                Oogsten, koken &amp; genieten
              </h3>
              <p className="text-muted-foreground">
                Eerst lekker ontspannen je eigen groenten oogsten en kruiden
                verzamelen in de pluktuin en het voedselbos. En deze dan onder
                leiding van onze koks met aanvulling van Oosterse kruiden en
                ingrediënten om te toveren tot verrukkelijke gerechten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            {/* Price Tiers */}
            <div>
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
                <Euro className="mr-1 h-3 w-3" />
                Prijzen
              </Badge>
              <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Tarieven kookworkshop
              </h2>
              <p className="text-muted-foreground mb-6">
                Prijzen per persoon, afhankelijk van groepsgrootte. Alle
                ingrediënten, materialen en begeleiding zijn inbegrepen.
              </p>

              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Groepsgrootte
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        Excl. btw
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        Incl. btw
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {kookPriceTiers.map((tier, index) => {
                      const isLast = index === kookPriceTiers.length - 1;
                      return (
                        <tr
                          key={tier.id}
                          className={isLast ? "bg-amber-50/50" : "bg-white"}
                        >
                          <td
                            className={`px-4 py-3 text-sm ${isLast ? "font-medium" : ""} text-gray-700`}
                          >
                            {tier.groupSize}
                          </td>
                          <td
                            className={`px-4 py-3 text-right text-sm ${isLast ? "font-bold text-amber-700" : "font-medium text-gray-900"}`}
                          >
                            {formatEuro(tier.priceExclBtw)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-600">
                            {formatEuro(tier.priceInclBtw)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-muted-foreground mt-3 text-xs">
                Prijzen zijn indicatief voor de Arabische kookworkshop. Andere
                varianten (Oogsten &amp; Koken, Koken op Maat) kunnen afwijken.{" "}
                <Link
                  href="/kookworkshop"
                  className="text-amber-600 underline hover:text-amber-700"
                >
                  Bekijk alle varianten
                </Link>
              </p>
            </div>

            {/* Wat is inbegrepen */}
            <div>
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Inbegrepen
              </Badge>
              <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Wat is inbegrepen?
              </h2>
              <p className="text-muted-foreground mb-6">
                Bij onze kookworkshops in {landing.city} is alles geregeld zodat
                jij je nergens zorgen over hoeft te maken.
              </p>

              <div className="space-y-3">
                {[
                  "Begeleiding door gepassioneerde Arabische koks",
                  "Alle ingrediënten en materialen",
                  "Recepten om mee naar huis te nemen",
                  "Complete maaltijd (samen eten na het koken)",
                  "Keuze uit vlees, vegetarisch of veganistisch",
                  "Sociale impact — draag bij aan arbeidsparticipatie",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg border bg-white p-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact Section - Exact text from original */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
                <Heart className="mr-1 h-3 w-3" />
                Maatschappelijke Impact
              </Badge>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Wat Goeduitje echt uniek maakt
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Wat Goeduitje echt uniek maakt, is de combinatie van culinair
                genieten en maatschappelijke impact. Onze kookworkshops in{" "}
                {landing.city} worden verzorgd door statushouders en
                asielzoekers die hun talent, passie en cultuur met jou delen. Zo
                beleef je niet alleen een smakelijke kookervaring, maar draag je
                ook bij aan hun integratie en kansen op de arbeidsmarkt. Elke
                workshop is daarmee een bijzondere ontmoeting tussen culturen,
                waarin koken, leren en verbinden centraal staan.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>
                    Onder leiding van onze getalenteerde Arabische chefs ontdek
                    je traditionele recepten en bijzondere kooktechnieken, van
                    hartige hoofdgerechten tot zoete desserts.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>
                    Alle ingrediënten, materialen en keukengerei zijn
                    inbegrepen. Je kookt samen in kleine teams en geniet daarna
                    van de gerechten die je zelf en onze chefs hebben bereid.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>
                    De workshops vinden plaats op een gezellige locatie in{" "}
                    {landing.city} of in overleg op een plek die je zelf kiest.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>
                    Of je nu beginner bent of ervaren kookliefhebber, een
                    kookworkshop in {landing.city} is de perfecte gelegenheid om
                    nieuwe smaken te ontdekken, technieken te leren en samen een
                    bijzondere tijd te beleven.
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/images/workshops/wat-uniek-maakt.jpg"
                alt={`Kookworkshop ${landing.city} met sociale impact`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Practical Info Section */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left - Info */}
            <div>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Praktische informatie
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Hoe lang duurt een kookworkshop bij jullie?
                    </h3>
                    <p className="text-muted-foreground">
                      Onze kookworkshops zijn volledig naar wens te plannen. Een
                      standaard workshop duurt 3 uur. Dit geeft voldoende tijd
                      om de gerechten grondig uit te leggen, samen te bereiden
                      en daarna te genieten van wat we hebben gemaakt.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Heb ik kookervaring nodig om mee te doen?
                    </h3>
                    <p className="text-muted-foreground">
                      Nee, iedereen is welkom, of je nu een beginner bent of al
                      ervaring hebt in de keuken! Onze chefs begeleiden je stap
                      voor stap, zodat iedereen op zijn eigen tempo mee kan doen
                      en kan leren.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Waar worden de kookworkshops gehouden in {landing.city}?
                    </h3>
                    <p className="text-muted-foreground">
                      Onze kookworkshops worden georganiseerd bij jou op locatie
                      of we huren een locatie naar keuze.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - CTA Card */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h3 className="mb-2 text-xl font-bold">
                  Boek je kookworkshop in {landing.city}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Wil je samen met vrienden, familie of collega&apos;s een
                  unieke kookervaring beleven? Neem dan vandaag nog contact op
                  voor een kookworkshop in {landing.city}
                  en ontdek de geheimen van authentieke gerechten!
                </p>

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    <Link href="/onze-uitjes#configurator">
                      Configureer je uitje
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact opnemen
                    </Link>
                  </Button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4 border-t pt-6">
                  <a
                    href="tel:+31652675891"
                    aria-label="Bel ons"
                    className="text-muted-foreground hover:text-amber-600"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                  <a
                    href="mailto:info@goeduitje.nl"
                    aria-label="E-mail ons"
                    className="text-muted-foreground hover:text-amber-600"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-4xl px-6">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Veelgestelde vragen over kookworkshops in {landing.city}
          </h2>

          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">
                Moeten we zelf iets meenemen naar de kookworkshop?
              </h3>
              <p className="text-muted-foreground">
                Nee, alle benodigde ingrediënten en kookmaterialen worden door
                ons verzorgd. Het enige dat je mee hoeft te nemen, is een goede
                dosis enthousiasme en zin om te leren!
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">
                Kunnen jullie rekening houden met dieetwensen of allergieën?
              </h3>
              <p className="text-muted-foreground">
                Ja, wij houden graag rekening met dieetwensen en allergieën.
                Geef dit bij je boeking aan, zodat we de nodige aanpassingen
                kunnen maken. Op basis van jullie wensen stellen wij de
                gerechten die we samen gaan koken voor. We werken veel met verse
                ingrediënten en in veel van onze gerechten kunnen we variëren
                met de ingrediënten.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">
                Wat voor soort gerechten maken we tijdens de kookworkshop?
              </h3>
              <p className="text-muted-foreground">
                De gerechten variëren per type workshop en stemmen we volledig
                naar wens af. We bieden workshops aan waarin je gerechten uit de
                Arabische keuken leert maken. Dit is een combinatie van hoofd-
                en bijgerechten met meestal als afsluiter een lekker dessert.
                Elke workshop is gericht op authentieke, smaakvolle gerechten
                die je stap voor stap leert bereiden.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">
                Kan ik een kookworkshop boeken als bedrijfsuitje of teamuitje?
              </h3>
              <p className="text-muted-foreground">
                Absoluut! Onze kookworkshops zijn erg geschikt als
                bedrijfsuitje, teambuilding-activiteit of voor een gezellig
                teamuitje. We kunnen zelfs workshops op maat maken, afgestemd op
                de behoeften en wensen van jouw team.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">
                Krijgen we de recepten na afloop?
              </h3>
              <p className="text-muted-foreground">
                Na de workshop krijgen jullie een link naar de recepten op onze
                website. En stel dat er nog eten over is, dan zorgen wij voor
                een bakje zodat je familie en vrienden ook kunt laten genieten
                van de smaakvolle Arabische keuken en jouw kooktalenten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-amber-600 py-16 text-white lg:py-20">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Benieuwd wat we voor elkaar kunnen betekenen?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Neem dan snel contact met ons op en boek snel jouw kookworkshop in{" "}
            {landing.city}! Samen zorgen we ervoor dat jouw kookworkshop een
            onvergetelijke culinaire reis wordt!
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-amber-600 hover:bg-white/90"
            >
              <Link href="/kookworkshop">
                <ChefHat className="mr-2 h-5 w-5" />
                Bekijk kookworkshops
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/contact">Offerte aanvragen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer info */}
      <section className="border-t py-8">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <p className="text-muted-foreground text-sm">
            Goeduitje B.V. | Groenestraat 48 | 6531 HS Nijmegen
          </p>
        </div>
      </section>
    </main>
  );
}

// ============================================================
// Non-kookworkshop landing page template
// ============================================================

interface TypedLandingPageProps {
  landing: LandingPageData;
  type: LandingType;
  heroImage: string;
  workshops: WorkshopWithPricing[];
  avgRating: string;
}

function getWorkshopCards(
  type: LandingType,
  city: string
): {
  title: string;
  description: string;
  icon: "ChefHat" | "MapPin" | "Star" | "Heart" | "Compass";
}[] {
  switch (type) {
    case "teambuilding":
      return [
        {
          title: "Kookworkshop",
          icon: "ChefHat",
          description:
            "Samen koken onder begeleiding van Arabische koks. Bereid authentieke gerechten en geniet samen van het resultaat.",
        },
        {
          title: "Stadsspel / Citygame",
          icon: "Compass",
          description: `Een interactieve speurtocht in ${city} vol culturele uitdagingen en verrassende ontmoetingen.`,
        },
        {
          title: "The Game - Koffer Challenge",
          icon: "Star",
          description:
            "Team up and crack it! Zoek samen de code om de koffer te openen. Perfecte test voor communicatie en samenwerking.",
        },
      ];
    case "bedrijfsuitje":
      return [
        {
          title: "Kookworkshop",
          icon: "ChefHat",
          description:
            "Het populairste bedrijfsuitje: samen koken onder begeleiding van Arabische koks. Kies uit diverse workshops.",
        },
        {
          title: "Stadsspel / Citygame",
          icon: "Compass",
          description: `Ontdek ${city} met je collega's via een interactieve speurtocht vol culturele uitdagingen.`,
        },
        {
          title: "Koffie & Thee Workshop",
          icon: "Heart",
          description:
            "Een ontspannen workshop waarin je de kunst van Arabische koffie en thee ontdekt onder begeleiding van onze medewerkers.",
        },
      ];
    case "stadsspel":
      return [
        {
          title: "Het Stadsspel",
          icon: "Compass",
          description: `De originele interactieve speurtocht in ${city}. Ontdek verborgen plekjes en los culturele uitdagingen op met je team.`,
        },
        {
          title: "The Game - Koffer Challenge",
          icon: "Star",
          description:
            "De indoor variant: zoek samen de code om de koffer te openen. Perfecte aanvulling op het stadsspel.",
        },
        {
          title: "Combinatie Stadsspel + Koken",
          icon: "ChefHat",
          description:
            "Start met het stadsspel en sluit af met een gezamenlijke kookworkshop. Het beste van twee werelden.",
        },
      ];
    default:
      return [];
  }
}

function getCtaConfig(type: LandingType): {
  link: string;
  label: string;
  icon: "Users" | "Building2" | "Compass";
} {
  switch (type) {
    case "teambuilding":
      return {
        link: "/teambuilding",
        label: "Bekijk teambuilding",
        icon: "Users",
      };
    case "bedrijfsuitje":
      return {
        link: "/bedrijfsuitjes",
        label: "Bekijk bedrijfsuitjes",
        icon: "Building2",
      };
    case "stadsspel":
      return {
        link: "/onze-uitjes/stadsspel",
        label: "Meer over het stadsspel",
        icon: "Compass",
      };
    default:
      return { link: "/onze-uitjes", label: "Bekijk uitjes", icon: "Users" };
  }
}

const ICON_MAP = {
  ChefHat,
  MapPin,
  Star,
  Heart,
  Compass,
  Users,
  Building2,
} as const;

function TypedLandingPage({
  landing,
  type,
  heroImage,
  workshops,
  avgRating,
}: TypedLandingPageProps) {
  const theme = THEMES[type];
  const label = landing.displayTitle || TYPE_LABELS[type];
  const pageTitle = `${label} ${landing.city}`;
  const workshopCards = getWorkshopCards(type, landing.city);
  const cta = getCtaConfig(type);
  const CtaIcon = ICON_MAP[cta.icon];

  // Get dynamic prices from workshops
  const stadsspelWs = workshops.find((w) => w.slug === "stadsspel");
  const theGameWs = workshops.find((w) => w.slug === "the-game");
  const koffieWs = workshops.find((w) => w.slug === "koffie-thee-workshop");
  const kookWs = workshops.find((w) => w.slug === "kookworkshop");

  const stadsspelLowest = stadsspelWs
    ? getLowestPriceFromWorkshop(stadsspelWs)
    : null;
  const theGameLowest = theGameWs
    ? getLowestPriceFromWorkshop(theGameWs)
    : null;
  const koffieLowest = koffieWs ? getLowestPriceFromWorkshop(koffieWs) : null;
  const kookLowest = kookWs ? getLowestPriceFromWorkshop(kookWs) : null;

  // Incl BTW prices
  const stadsspelLowestIncl = stadsspelWs
    ? getLowestInclFromWorkshop(stadsspelWs)
    : null;
  const theGameLowestIncl = theGameWs
    ? getLowestInclFromWorkshop(theGameWs)
    : null;
  const koffieLowestIncl = koffieWs
    ? getLowestInclFromWorkshop(koffieWs)
    : null;
  const kookLowestIncl = kookWs ? getLowestInclFromWorkshop(kookWs) : null;

  // Overall lowest for teambuilding/bedrijfsuitje
  const allPrices = [
    stadsspelLowest,
    theGameLowest,
    koffieLowest,
    kookLowest,
  ].filter((p): p is number => p !== null);
  const overallLowest = allPrices.length > 0 ? Math.min(...allPrices) : null;

  const heroDescriptions: Record<
    Exclude<LandingType, "kookworkshop">,
    string
  > = {
    teambuilding: `Zoek je een teambuilding activiteit in ${landing.region} die verder gaat dan het gewone? Bij Goeduitje organiseren statushouders en nieuwkomers activiteiten die je team verbinden én bijdragen aan integratie. Kies uit kookworkshops, stadsspellen of de Koffer Challenge.`,
    bedrijfsuitje: `Op zoek naar een origineel bedrijfsuitje in ${landing.region}? Bij Goeduitje organiseren statushouders en nieuwkomers activiteiten die je collega's verbinden en bijdragen aan een goede zaak. Van kookworkshops tot stadsspellen – er is voor elk team een passende activiteit.`,
    stadsspel: `Ontdek ${landing.city} op een unieke manier met ons stadsspel. Een interactieve speurtocht vol culturele uitdagingen en verrassende ontmoetingen met statushouders en nieuwkomers die hun stad en cultuur met jou delen.`,
  };

  const usps: Record<Exclude<LandingType, "kookworkshop">, string[]> = {
    teambuilding: [
      "Diverse teambuilding activiteiten voor elk team",
      `Op eigen of af te spreken locatie in ${landing.city}`,
      "Begeleid door statushouders en nieuwkomers",
    ],
    bedrijfsuitje: [
      "Activiteiten op maat voor elk bedrijf",
      `Op eigen of af te spreken locatie in ${landing.city}`,
      "Sociale impact door samenwerking met statushouders",
    ],
    stadsspel: [
      `Interactieve speurtocht in ${landing.city}`,
      "Culturele uitdagingen en verrassende ontmoetingen",
      "Begeleiding door statushouders en nieuwkomers",
    ],
  };

  const aboutTexts: Record<
    Exclude<LandingType, "kookworkshop">,
    { title: string; text: string }
  > = {
    teambuilding: {
      title: `Teambuilding activiteiten in ${landing.city}`,
      text: `Bij Goeduitje bieden we verschillende teambuilding activiteiten aan die je team op een unieke manier samenbrengen. Of jullie nou samen willen koken, de stad willen verkennen of een uitdagende game willen spelen – elke activiteit wordt begeleid door statushouders en nieuwkomers die hun talent en cultuur met jullie delen. Zo is je teambuilding in ${landing.city} niet alleen leuk, maar draag je ook bij aan een goede zaak.`,
    },
    bedrijfsuitje: {
      title: `Bedrijfsuitjes in ${landing.city}`,
      text: `Goeduitje biedt diverse bedrijfsuitjes aan in ${landing.region} die verder gaan dan het standaard uitje. Of je nu kiest voor een kookworkshop, stadsspel of een creatieve workshop – elke activiteit wordt begeleid door statushouders en nieuwkomers. Zo combineer je een gezellig bedrijfsuitje met maatschappelijke impact en draag je bij aan integratie en kansen op de arbeidsmarkt.`,
    },
    stadsspel: {
      title: `Het stadsspel in ${landing.city}`,
      text: `Ons stadsspel in ${landing.city} is een interactieve speurtocht waarbij je team samen de stad ontdekt. Onder begeleiding van statushouders en nieuwkomers los je culturele opdrachten op, ontdek je verborgen plekjes en leer je de stad op een geheel nieuwe manier kennen. Het stadsspel is perfect als teambuilding, bedrijfsuitje of gewoon als leuke groepsactiviteit.`,
    },
  };

  const faqItems: Record<
    Exclude<LandingType, "kookworkshop">,
    { q: string; a: string }[]
  > = {
    teambuilding: [
      {
        q: `Welke teambuilding activiteiten bieden jullie aan in ${landing.city}?`,
        a: `In ${landing.city} bieden we diverse teambuilding activiteiten aan: kookworkshops onder leiding van Arabische koks, een interactief stadsspel door de stad, en de Koffer Challenge (The Game). Elke activiteit wordt begeleid door statushouders en nieuwkomers.`,
      },
      {
        q: "Hoe groot moet de groep minimaal zijn?",
        a: "Voor de meeste teambuilding activiteiten hanteren we een minimum van 8 personen. Voor het stadsspel en The Game is een groep van 10-20 personen ideaal. Neem gerust contact op voor maatwerk bij kleinere of grotere groepen.",
      },
      {
        q: "Kunnen we meerdere activiteiten combineren?",
        a: "Ja, dat is zeker mogelijk! Een populaire combinatie is bijvoorbeeld het stadsspel gevolgd door een kookworkshop. We stellen graag een programma samen dat past bij jullie wensen en beschikbare tijd.",
      },
      {
        q: `Waar vinden de activiteiten plaats in ${landing.city}?`,
        a: `Onze activiteiten vinden plaats op een locatie in ${landing.city} of omgeving, of we komen bij jullie op locatie. Het stadsspel speelt zich af in het centrum van ${landing.city}.`,
      },
    ],
    bedrijfsuitje: [
      {
        q: `Welke bedrijfsuitjes bieden jullie aan in ${landing.city}?`,
        a: `In ${landing.city} bieden we diverse bedrijfsuitjes aan: kookworkshops, stadsspellen, de Koffer Challenge, koffie & thee workshops en meer. Elk uitje wordt begeleid door statushouders en nieuwkomers, wat zorgt voor een unieke ervaring met maatschappelijke impact.`,
      },
      {
        q: "Zijn jullie bedrijfsuitjes geschikt voor grote groepen?",
        a: "Ja, we hebben ervaring met groepen van 8 tot meer dan 100 personen. Bij grotere groepen splitsen we op in kleinere teams voor een optimale beleving. Neem contact op voor de mogelijkheden.",
      },
      {
        q: "Kunnen we het bedrijfsuitje aanpassen aan onze wensen?",
        a: "Absoluut! We stemmen elk bedrijfsuitje af op jullie wensen. Van de keuze van activiteiten tot de duur en locatie – we denken graag mee om het perfecte uitje samen te stellen.",
      },
      {
        q: "Wat kost een bedrijfsuitje bij Goeduitje?",
        a: `De prijzen variëren per activiteit. Een kookworkshop begint ${kookLowest !== null ? `vanaf ${formatEuro(kookLowest)} p.p.` : "op aanvraag"}, een stadsspel ${stadsspelLowest !== null ? `vanaf ${formatEuro(stadsspelLowest)} p.p.` : "op aanvraag"} en een koffie & thee workshop ${koffieLowest !== null ? `vanaf ${formatEuro(koffieLowest)} p.p.` : "op aanvraag"}. Neem contact op voor een offerte op maat.`,
      },
    ],
    stadsspel: [
      {
        q: `Hoe werkt het stadsspel in ${landing.city}?`,
        a: `Het stadsspel is een interactieve speurtocht door of in ${landing.city}. In teams van 4-5 personen of juist in één groep team (tot 20 personen) lopen jullie door de stad waarbij je allerlei opdrachten oplost. Statushouders en nieuwkomers begeleiden jullie en delen hun verhalen en cultuur.`,
      },
      {
        q: "Hoe lang duurt het stadsspel?",
        a: "Het stadsspel duurt 2-3 uur, afhankelijk van de opzet van het spel. We kunnen het programma aanpassen aan jullie beschikbare tijd.",
      },
      {
        q: "Is het stadsspel geschikt bij slecht weer?",
        a: "Het stadsspel vindt grotendeels buiten plaats. Bij licht regenachtig weer kan het gewoon doorgaan. Bij echt slecht weer kunnen we uitwijken naar The Game (Koffer Challenge), een indoor alternatief dat net zo leuk en uitdagend is.",
      },
      {
        q: "Kunnen we het stadsspel combineren met andere activiteiten?",
        a: "Ja! Een populaire combinatie is het stadsspel gevolgd door een kookworkshop of een Arabisch buffet. Zo heb je een complete dag vol teambuilding en culinair genieten. Neem contact op voor de mogelijkheden.",
      },
    ],
  };

  const quickInfoConfig: Record<
    Exclude<LandingType, "kookworkshop">,
    { price: string; duration: string; groupSize: string; groupNote: string }
  > = {
    teambuilding: {
      price: formatPrice(overallLowest),
      duration: stadsspelWs?.duration ?? "2-3 uur",
      groupSize: stadsspelWs?.groupSize ?? "Vanaf 8 personen",
      groupNote: "ook grotere groepen",
    },
    bedrijfsuitje: {
      price: formatPrice(overallLowest),
      duration: stadsspelWs?.duration ?? "2-3 uur",
      groupSize: stadsspelWs?.groupSize ?? "Vanaf 8 personen",
      groupNote: "ook grotere groepen",
    },
    stadsspel: {
      price: formatPrice(stadsspelLowest),
      duration: stadsspelWs?.duration ?? "2-3 uur",
      groupSize: stadsspelWs?.groupSize ?? "10-50 personen",
      groupNote: "grotere groepen op aanvraag",
    },
  };

  const priceTiersConfig: Record<
    Exclude<LandingType, "kookworkshop">,
    {
      title: string;
      tiers: {
        label: string;
        exclBtw: string;
        inclBtw: string;
        highlight?: boolean;
      }[];
      note: string;
    }
  > = {
    teambuilding: {
      title: "Tarieven teambuilding activiteiten",
      tiers: [
        {
          label: "Stadsspel / Citygame",
          exclBtw: formatEuro(stadsspelLowest),
          inclBtw: formatEuro(stadsspelLowestIncl),
        },
        {
          label: "The Game - Koffer Challenge",
          exclBtw: formatEuro(theGameLowest),
          inclBtw: formatEuro(theGameLowestIncl),
        },
        {
          label: "Koffie & Thee Workshop",
          exclBtw: formatEuro(koffieLowest),
          inclBtw: formatEuro(koffieLowestIncl),
        },
        {
          label: "Kookworkshop (16+ pers.)",
          exclBtw: formatEuro(kookLowest),
          inclBtw: formatEuro(kookLowestIncl),
          highlight: true,
        },
      ],
      note: "Prijzen zijn indicatief per persoon. Combinaties en maatwerk zijn mogelijk.",
    },
    bedrijfsuitje: {
      title: "Tarieven bedrijfsuitjes",
      tiers: [
        {
          label: "Stadsspel / Citygame",
          exclBtw: formatEuro(stadsspelLowest),
          inclBtw: formatEuro(stadsspelLowestIncl),
        },
        {
          label: "The Game - Koffer Challenge",
          exclBtw: formatEuro(theGameLowest),
          inclBtw: formatEuro(theGameLowestIncl),
        },
        {
          label: "Koffie & Thee Workshop",
          exclBtw: formatEuro(koffieLowest),
          inclBtw: formatEuro(koffieLowestIncl),
        },
        {
          label: "Kookworkshop (16+ pers.)",
          exclBtw: formatEuro(kookLowest),
          inclBtw: formatEuro(kookLowestIncl),
          highlight: true,
        },
      ],
      note: "Prijzen zijn indicatief per persoon. Combinaties en maatwerk zijn mogelijk.",
    },
    stadsspel: {
      title: "Tarieven stadsspel",
      tiers:
        stadsspelWs && stadsspelWs.priceTiers.length > 0
          ? stadsspelWs.priceTiers.map((tier, index) => ({
              label: tier.groupSize,
              exclBtw: formatEuro(tier.priceExclBtw),
              inclBtw: formatEuro(tier.priceInclBtw),
              highlight: index === stadsspelWs.priceTiers.length - 1,
            }))
          : [
              {
                label: "Op aanvraag",
                exclBtw: "Op aanvraag",
                inclBtw: "Op aanvraag",
              },
            ],
      note: "Prijzen zijn per persoon. Het stadsspel kan ook gecombineerd worden met een kookworkshop.",
    },
  };

  const includedItemsConfig: Record<
    Exclude<LandingType, "kookworkshop">,
    string[]
  > = {
    teambuilding: [
      "Professionele begeleiding door statushouders en nieuwkomers",
      "Alle benodigde materialen en attributen",
      "Organisatie en planning op maat",
      "Flexibele locatiekeuze",
      "Sociale impact — draag bij aan integratie",
      "Geschikt voor groepen van 8 tot 100+ personen",
    ],
    bedrijfsuitje: [
      "Professionele begeleiding door statushouders en nieuwkomers",
      "Alle benodigde materialen en attributen",
      "Organisatie en planning op maat",
      "Flexibele locatiekeuze",
      "Sociale impact — draag bij aan arbeidsparticipatie",
      "Geschikt voor groepen van 8 tot 100+ personen",
    ],
    stadsspel: [
      "Begeleiding door statushouders en nieuwkomers",
      "Alle opdrachten en materialen",
      "Uitgezette route door het centrum",
      "Culturele uitdagingen en verrassende ontmoetingen",
      "Sociale impact — draag bij aan integratie",
      "Geschikt voor groepen van 10 tot 50 personen",
    ],
  };

  const typeKey = type as Exclude<LandingType, "kookworkshop">;
  const quickInfo = quickInfoConfig[typeKey];
  const priceTiers = priceTiersConfig[typeKey];
  const includedItems = includedItemsConfig[typeKey];

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${theme.gradient} py-16 lg:py-24`}>
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge className={`w-fit ${theme.badge}`}>
                  <MapPin className="mr-1 h-3 w-3" />
                  {landing.region}
                </Badge>
                <Badge className={`w-fit ${theme.badge}`}>
                  <Euro className="mr-1 h-3 w-3" />
                  {quickInfo.price}
                </Badge>
              </div>

              <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {pageTitle}
              </h1>

              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                {heroDescriptions[typeKey]}
              </p>

              <div className="mb-8 space-y-3">
                {usps[typeKey].map((usp) => (
                  <div key={usp} className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-5 w-5 flex-shrink-0 ${theme.accent}`}
                    />
                    <span className="text-gray-700">{usp}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className={theme.button}>
                  <Link href={cta.link}>
                    <CtaIcon className="mr-2 h-5 w-5" />
                    {cta.label}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">
                    Offerte aanvragen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl lg:aspect-square">
              <Image
                src={heroImage}
                alt={`${label} in ${landing.city}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute right-6 bottom-6 left-6">
                <div className="flex items-center gap-2 text-white">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {avgRating}/5 op Google
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="border-b bg-white py-8">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div
              className={`flex items-center gap-4 rounded-xl border p-4 ${type === "teambuilding" ? "bg-secondary/10" : type === "bedrijfsuitje" ? "bg-green-50/50" : "bg-indigo-50/50"}`}
            >
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}
              >
                <Euro className={`h-6 w-6 ${theme.accent}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Prijs</p>
                <p className="text-lg font-bold text-gray-900">
                  {quickInfo.price}
                </p>
                <p className="text-xs text-gray-500">excl. btw</p>
              </div>
            </div>
            <div
              className={`flex items-center gap-4 rounded-xl border p-4 ${type === "teambuilding" ? "bg-secondary/10" : type === "bedrijfsuitje" ? "bg-green-50/50" : "bg-indigo-50/50"}`}
            >
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}
              >
                <Clock className={`h-6 w-6 ${theme.accent}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duur</p>
                <p className="text-lg font-bold text-gray-900">
                  {quickInfo.duration}
                </p>
                <p className="text-xs text-gray-500">
                  afhankelijk van activiteit
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-4 rounded-xl border p-4 ${type === "teambuilding" ? "bg-secondary/10" : type === "bedrijfsuitje" ? "bg-green-50/50" : "bg-indigo-50/50"}`}
            >
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}
              >
                <Users className={`h-6 w-6 ${theme.accent}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Groepsgrootte</p>
                <p className="text-lg font-bold text-gray-900">
                  {quickInfo.groupSize}
                </p>
                <p className="text-xs text-gray-500">{quickInfo.groupNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
              {aboutTexts[typeKey].title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {aboutTexts[typeKey].text}
            </p>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {type === "stadsspel"
                ? `Stadsspel opties in ${landing.city}`
                : type === "teambuilding"
                  ? `Populaire teambuilding activiteiten in ${landing.city}`
                  : `Populaire bedrijfsuitjes in ${landing.city}`}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              {type === "stadsspel"
                ? "Kies de variant die het beste bij jullie groep past:"
                : "We stemmen onze activiteiten graag af op jouw wensen. Hier een overzicht van onze populairste opties:"}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {workshopCards.map((card) => {
              const CardIcon = ICON_MAP[card.icon];
              return (
                <div
                  key={card.title}
                  className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${theme.iconBg}`}
                  >
                    <CardIcon className={`h-6 w-6 ${theme.accent}`} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{card.title}</h3>
                  <p className="text-muted-foreground">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing & Wat is inbegrepen Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            {/* Price Tiers */}
            <div>
              <Badge className={`mb-4 ${theme.badge}`}>
                <Euro className="mr-1 h-3 w-3" />
                Prijzen
              </Badge>
              <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {priceTiers.title}
              </h2>
              <p className="text-muted-foreground mb-6">
                Prijzen per persoon. Alle materialen en begeleiding zijn
                inbegrepen.
              </p>

              <div className="overflow-hidden rounded-xl border">
                <table className="w-full">
                  <thead>
                    <tr
                      className={
                        type === "teambuilding"
                          ? "bg-secondary/10"
                          : type === "bedrijfsuitje"
                            ? "bg-green-50"
                            : "bg-indigo-50"
                      }
                    >
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        {type === "stadsspel" ? "Groepsgrootte" : "Activiteit"}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        Excl. btw
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        Incl. btw
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {priceTiers.tiers.map((tier) => (
                      <tr
                        key={tier.label}
                        className={
                          tier.highlight
                            ? type === "teambuilding"
                              ? "bg-secondary/10"
                              : type === "bedrijfsuitje"
                                ? "bg-green-50/50"
                                : "bg-indigo-50/50"
                            : "bg-white"
                        }
                      >
                        <td
                          className={`px-4 py-3 text-sm ${tier.highlight ? "font-medium" : ""} text-gray-700`}
                        >
                          {tier.label}
                        </td>
                        <td
                          className={`px-4 py-3 text-right text-sm ${tier.highlight ? `font-bold ${theme.accent}` : "font-medium text-gray-900"}`}
                        >
                          {tier.exclBtw}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                          {tier.inclBtw}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-muted-foreground mt-3 text-xs">
                {priceTiers.note}{" "}
                <Link href="/contact" className={`${theme.accent} underline`}>
                  Vraag een offerte op maat aan
                </Link>
              </p>
            </div>

            {/* Wat is inbegrepen */}
            <div>
              <Badge className={`mb-4 ${theme.badge}`}>
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Inbegrepen
              </Badge>
              <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Wat is inbegrepen?
              </h2>
              <p className="text-muted-foreground mb-6">
                Bij onze{" "}
                {type === "stadsspel"
                  ? "stadsspellen"
                  : type === "teambuilding"
                    ? "teambuilding activiteiten"
                    : "bedrijfsuitjes"}{" "}
                in {landing.city} is alles geregeld zodat jij je nergens zorgen
                over hoeft te maken.
              </p>

              <div className="space-y-3">
                {includedItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg border bg-white p-3"
                  >
                    <CheckCircle2
                      className={`mt-0.5 h-5 w-5 flex-shrink-0 ${theme.accent}`}
                    />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className={`mb-4 ${theme.badge}`}>
                <Heart className="mr-1 h-3 w-3" />
                Maatschappelijke Impact
              </Badge>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Wat Goeduitje echt uniek maakt
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Wat Goeduitje echt uniek maakt, is de combinatie van een leuke
                activiteit en maatschappelijke impact. Onze{" "}
                {type === "stadsspel"
                  ? "stadsspellen"
                  : type === "teambuilding"
                    ? "teambuilding activiteiten"
                    : "bedrijfsuitjes"}{" "}
                in {landing.city} worden verzorgd door statushouders en
                nieuwkomers die hun talent, passie en cultuur met jou delen. Zo
                beleef je niet alleen een bijzondere ervaring, maar draag je ook
                bij aan hun integratie en kansen op de arbeidsmarkt.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className={`mt-0.5 h-5 w-5 flex-shrink-0 ${theme.accent}`}
                  />
                  <span>
                    Elke activiteit wordt begeleid door getalenteerde
                    statushouders en nieuwkomers die hun cultuur en vaardigheden
                    met jou delen.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className={`mt-0.5 h-5 w-5 flex-shrink-0 ${theme.accent}`}
                  />
                  <span>
                    Alle materialen en begeleiding zijn inbegrepen. Jullie
                    hoeven alleen maar te komen en te genieten.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className={`mt-0.5 h-5 w-5 flex-shrink-0 ${theme.accent}`}
                  />
                  <span>
                    De activiteiten vinden plaats op een gezellige locatie in{" "}
                    {landing.city} of in overleg op een plek die je zelf kiest.
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={
                  type === "stadsspel"
                    ? "/images/workshops/stadsspel.jpg"
                    : "/images/workshops/wat-uniek-maakt.jpg"
                }
                alt={`${label} ${landing.city} met sociale impact`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Practical Info Section */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Praktische informatie
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}
                  >
                    <Clock className={`h-5 w-5 ${theme.accent}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {type === "stadsspel"
                        ? "Hoe lang duurt het stadsspel?"
                        : `Hoe lang duurt een ${TYPE_LABELS[type].toLowerCase()}?`}
                    </h3>
                    <p className="text-muted-foreground">
                      {type === "stadsspel"
                        ? "Het stadsspel duurt 2-3 uur, afhankelijk van de opzet van het spel. We kunnen het programma aanpassen aan jullie beschikbare tijd."
                        : type === "teambuilding"
                          ? "De duur hangt af van de gekozen activiteit. Een kookworkshop duurt circa 3 uur, het stadsspel 2-3 uur, en The Game ook 2-3 uur. Combinaties zijn uiteraard ook mogelijk."
                          : "De duur hangt af van de gekozen activiteit. Een kookworkshop duurt circa 3 uur, andere activiteiten 2-3 uur. We stemmen het programma af op jullie beschikbare tijd."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}
                  >
                    <Users className={`h-5 w-5 ${theme.accent}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Voor hoeveel personen is dit geschikt?
                    </h3>
                    <p className="text-muted-foreground">
                      {type === "stadsspel"
                        ? "Het stadsspel is geschikt voor groepen van 10-50 personen. Bij grotere groepen splitsen we op in meerdere teams. Neem contact op voor de mogelijkheden."
                        : "Onze activiteiten zijn geschikt voor groepen vanaf 8 personen. Ook voor grotere groepen (50+) hebben we ruime ervaring. Neem contact op voor maatwerk."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}
                  >
                    <MapPin className={`h-5 w-5 ${theme.accent}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {type === "stadsspel"
                        ? `Waar vindt het stadsspel plaats in ${landing.city}?`
                        : `Waar worden de activiteiten gehouden in ${landing.city}?`}
                    </h3>
                    <p className="text-muted-foreground">
                      {type === "stadsspel"
                        ? `Het stadsspel kan op elke (toegankelijke) plek gespeeld worden in ${landing.city} of omgeving. In het centrum of juist in een park. We stemmen de locatie af op jullie wensen.`
                        : `Onze activiteiten worden georganiseerd bij jou op locatie of we huren een locatie naar keuze in ${landing.city} of omgeving.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h3 className="mb-2 text-xl font-bold">
                  {type === "stadsspel"
                    ? `Boek het stadsspel in ${landing.city}`
                    : type === "teambuilding"
                      ? `Plan je teambuilding in ${landing.city}`
                      : `Boek je bedrijfsuitje in ${landing.city}`}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {type === "stadsspel"
                    ? `Wil je met je team ${landing.city} op een unieke manier ontdekken? Neem contact op en we plannen het stadsspel voor jullie.`
                    : type === "teambuilding"
                      ? `Wil je een onvergetelijke teambuilding organiseren in ${landing.city}? Neem contact op en we stellen samen het perfecte programma samen.`
                      : `Op zoek naar een origineel bedrijfsuitje in ${landing.city}? Neem contact op voor een vrijblijvende offerte.`}
                </p>

                <div className="space-y-3">
                  <Button asChild className={`w-full ${theme.button}`}>
                    <Link href="/onze-uitjes#configurator">
                      Configureer je uitje
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact opnemen
                    </Link>
                  </Button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4 border-t pt-6">
                  <a
                    href="tel:+31652675891"
                    aria-label="Bel ons"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                  <a
                    href="mailto:info@goeduitje.nl"
                    aria-label="E-mail ons"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-4xl px-6">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            {type === "stadsspel"
              ? `Veelgestelde vragen over het stadsspel in ${landing.city}`
              : type === "teambuilding"
                ? `Veelgestelde vragen over teambuilding in ${landing.city}`
                : `Veelgestelde vragen over bedrijfsuitjes in ${landing.city}`}
          </h2>

          <div className="space-y-6">
            {faqItems[typeKey].map((item) => (
              <div key={item.q} className="rounded-lg border bg-white p-6">
                <h3 className="mb-2 font-semibold">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`${theme.ctaBg} py-16 text-white lg:py-20`}>
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Benieuwd wat we voor elkaar kunnen betekenen?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            {type === "stadsspel"
              ? `Neem contact op en ontdek ${landing.city} op een unieke manier met ons stadsspel! Een onvergetelijke ervaring voor je hele team.`
              : type === "teambuilding"
                ? `Neem contact op en plan je teambuilding in ${landing.city}! Samen zorgen we voor een onvergetelijke teamervaring met impact.`
                : `Neem contact op en boek je bedrijfsuitje in ${landing.city}! Een unieke ervaring voor je hele team met maatschappelijke impact.`}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className={theme.ctaButton}>
              <Link href={cta.link}>
                <CtaIcon className="mr-2 h-5 w-5" />
                {cta.label}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className={theme.ctaOutline}
            >
              <Link href="/contact">Offerte aanvragen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer info */}
      <section className="border-t py-8">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <p className="text-muted-foreground text-sm">
            Goeduitje B.V. | Groenestraat 48 | 6531 HS Nijmegen
          </p>
        </div>
      </section>
    </main>
  );
}
