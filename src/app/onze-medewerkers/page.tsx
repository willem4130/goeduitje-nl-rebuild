import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { OnzeMedewerkersContent } from "./content";

export const metadata: Metadata = {
  title: "Onze Medewerkers",
  description:
    "Ontmoet het team dat jullie bedrijfsuitjes tot een onvergetelijke ervaring maakt. Onze medewerkers zijn statushouders en asielzoekers die met passie hun cultuur en vaardigheden delen.",
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function OnzeMedewerkersPage() {
  const teamMembers = await prisma.teamMember.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });

  return <OnzeMedewerkersContent teamMembers={teamMembers} />;
}
