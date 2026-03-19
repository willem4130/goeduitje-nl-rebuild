import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-config";

// All landing page slugs (city pages + type-specific pages)
const LANDING_PAGE_SLUGS = [
  "kookworkshop-amsterdam",
  "kookworkshop-apeldoorn",
  "kookworkshop-arnhem",
  "kookworkshop-bemmel",
  "kookworkshop-bennekom",
  "kookworkshop-best",
  "kookworkshop-beuningen",
  "kookworkshop-bij-je-thuis",
  "kookworkshop-boxtel",
  "kookworkshop-cuijk",
  "kookworkshop-den-bosch",
  "kookworkshop-didam",
  "kookworkshop-doetinchem",
  "kookworkshop-druten",
  "kookworkshop-duiven",
  "kookworkshop-ede",
  "kookworkshop-eindhoven",
  "kookworkshop-elst",
  "kookworkshop-ewijk",
  "kookworkshop-geldermalsen",
  "kookworkshop-gendt",
  "kookworkshop-gennep",
  "kookworkshop-grave",
  "kookworkshop-groesbeek",
  "kookworkshop-helmond",
  "kookworkshop-huissen",
  "kookworkshop-malden",
  "kookworkshop-nijmegen",
  "kookworkshop-oss",
  "kookworkshop-tiel",
  "kookworkshop-uden",
  "kookworkshop-veenendaal",
  "kookworkshop-veghel",
  "kookworkshop-venray",
  "kookworkshop-wageningen",
  "kookworkshop-wijchen",
  "kookworkshop-zaltbommel",
  "kookworkshop-zetten",
  "kookworkshop-zevenaar",
  "kookworkshop-zutphen",
  "vegetarische-kookworkshop-nijmegen",
  "teambuilding-nijmegen",
  "teambuilding-arnhem",
  "bedrijfsuitje-nijmegen",
  "bedrijfsuitje-arnhem",
  "kookworkshop-voor-bedrijven-arnhem",
  "stadsspel-nijmegen",
  "stadsspel-arnhem",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Fetch workshops from database
  const workshops = await prisma.workshop.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  // Fetch recipes from database
  const recipes = await prisma.recipe.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/onze-uitjes`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ons-verhaal`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/jullie-ervaringen`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/onze-impact`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/recepten`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bedrijfsuitjes`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/teambuilding`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/workshops`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/open-kookworkshops`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/voorwaarden`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Workshop detail pages
  const workshopPages: MetadataRoute.Sitemap = workshops.map((workshop) => ({
    url: `${baseUrl}/onze-uitjes/${workshop.slug}`,
    lastModified: workshop.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Recipe detail pages
  const recipePages: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${baseUrl}/recepten/${recipe.slug}`,
    lastModified: recipe.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // City landing pages
  const landingPages: MetadataRoute.Sitemap = LANDING_PAGE_SLUGS.map(
    (slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...workshopPages, ...recipePages, ...landingPages];
}
