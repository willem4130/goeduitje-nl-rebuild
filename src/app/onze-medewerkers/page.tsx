import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { OnzeMedewerkersContent } from "./content";

export const metadata: Metadata = {
  title: "Onze Medewerkers",
  description:
    "Ontmoet het team dat jullie bedrijfsuitjes tot een onvergetelijke ervaring maakt. Onze medewerkers zijn statushouders en asielzoekers die met passie hun cultuur en vaardigheden delen.",
  openGraph: {
    title: "Onze Medewerkers | Goeduitje.nl",
    description:
      "Ontmoet het team dat jullie bedrijfsuitjes tot een onvergetelijke ervaring maakt.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onze Medewerkers | Goeduitje.nl",
    description:
      "Ontmoet het team dat jullie bedrijfsuitjes tot een onvergetelijke ervaring maakt.",
  },
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function OnzeMedewerkersPage() {
  const teamMembers = await prisma.teamMember.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });

  return <OnzeMedewerkersContent teamMembers={teamMembers} />;
}
