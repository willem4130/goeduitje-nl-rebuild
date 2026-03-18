import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Bouw of Bak Battle workshop...");

  // Check if it already exists
  const existing = await prisma.workshop.findUnique({
    where: { slug: "bouw-of-bak-battle" },
  });

  if (existing) {
    console.log("Bouw of Bak Battle already exists, skipping...");
    return;
  }

  const workshop = await prisma.workshop.create({
    data: {
      slug: "bouw-of-bak-battle",
      title: "Bouw of Bak Battle",
      subtitle: "Teamwork onder tijdsdruk",
      description:
        "Bouw samen huisjes of maak snacks in een spannende teambuildingsbattle. Verbeter elke ronde jullie strijdplan en verover de eerste plek!",
      longDescription: `De Bouw Battle en de Bak Battle zijn teambuildingsspellen waarin je met je team in meerdere ronden zoveel mogelijk huisjes bouwt of zoveel mogelijk snacks maakt. Maar wel volgens de instructie, want onze controleurs zijn streng.

Een goed plan en goede samenwerking zijn cruciaal. Verbeter elke ronde jullie strijdplan; het team met de meeste punten verovert de eerste plek.

Combineer plezier, het verbeteren van teambuilding skills én leer je collega's beter kennen. Een uitje met impact, want onze medewerkers begeleiden en controleren.`,
      image: "/images/workshops/bouw-of-bak-battle.jpeg",
      video: null,
      duration: "2-6 uur",
      groupSize: "10-80 personen",
      location: "Diverse locaties in overleg",
      categories: ["Teambuilding", "Creatief"],
      includes: [
        "Professionele begeleiding",
        "Alle benodigde materialen",
        "Culturele uitwisseling",
        "Teamevaluatie achteraf",
        "Sociale impact - werk samen met statushouders",
      ],
      sortOrder: 7,
    },
  });

  await prisma.priceTier.create({
    data: {
      workshopId: workshop.id,
      groupSize: "Per persoon",
      minParticipants: 10,
      maxParticipants: null,
      priceExclBtw: 25,
      priceInclBtw: 30,
      sortOrder: 1,
    },
  });

  console.log("✅ Bouw of Bak Battle seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
