import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { HomeContent } from "./home-content";

export const metadata: Metadata = {
  title: "Goeduitje – Samen een geweldige ervaring creëren",
  description:
    "Boek een uniek bedrijfsuitje dat impact maakt. Kies uit workshops geleid door statushouders en asielzoekers die hun cultuur en vaardigheden delen.",
  openGraph: {
    title: "Goeduitje – Samen een geweldige ervaring creëren",
    description:
      "Boek een uniek bedrijfsuitje dat impact maakt. Kies uit workshops geleid door statushouders en asielzoekers die hun cultuur en vaardigheden delen.",
    type: "website",
    url: "https://goeduitje.nl",
  },
};

export const revalidate = 300; // Revalidate every 5 minutes

/**
 * Transform raw PageContent rows into a nested { section: { key: value } } map,
 * matching the shape returned by the tRPC content.getByPage query.
 */
function toContentMap(
  rows: { section: string; key: string; value: string }[]
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};
  for (const item of rows) {
    if (!result[item.section]) {
      result[item.section] = {};
    }
    result[item.section][item.key] = item.value;
  }
  return result;
}

export default async function Home() {
  const [homepageRows, siteStatsRows] = await Promise.all([
    prisma.pageContent.findMany({ where: { page: "homepage" } }),
    prisma.pageContent.findMany({ where: { page: "site-stats" } }),
  ]);

  const pageContent = toContentMap(homepageRows);
  const siteStats = toContentMap(siteStatsRows);

  return <HomeContent pageContent={pageContent} siteStats={siteStats} />;
}
