/**
 * Migration script: Add "De Duurzame Dag" workshop with 13 per-headcount price tiers.
 *
 * Pricing model is unusual ("8 personen €5.960 + €160 p.p. extra tot 20"), so each
 * supported headcount (8..20) gets its own tier with the correct effective per-person
 * rate. This keeps the configurator's `participants × pricePerPerson` math accurate
 * at every group size.
 *
 * BTW: 9% (food service) — confirmed by client 2026-05-02. Revisit if Mirjam's
 * sustainability portion should be 21%.
 *
 * Idempotent: upserts the workshop by slug, then deletes its workshop-level price
 * tiers and re-creates the 13 new ones. Safe to run multiple times.
 *
 * Usage: npx tsx prisma/migrate-add-duurzame-dag.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SLUG = "duurzame-dag";

const longDescription = `Eerst bewegen, denken en verbinden rondom duurzaamheid

Samen met duurzaamheidsexpert Mirjam van Laarhoven van SOW Sustainability duikt je team in de wereld van de SDG's (Sustainable Development Goals) en ESG-thema's. Geen PowerPoint, geen saaie presentatie. Mirjam begeleidt jullie door een interactieve workshop vol beweging, verrassende invalshoeken en inzichten die daadwerkelijk blijven hangen. Je team ontdekt zijn eigen rol in het grotere verhaal van duurzaamheid en maatschappelijke verantwoordelijkheid.

Dan de keuken in met onze Arabische koks

Na de duurzaamheidssessie stappen jullie de keuken in. Statushouders van Goeduitje nemen je mee in de Arabische keuken: zij leren je nieuwe gerechten bereiden én vertellen over hun cultuur en verhaal. Samen koken, lachen, proeven. En onder het eten en de afsluitende borrel is er volop ruimte voor een goed gesprek, ook over wat jullie eerder die dag hebben bedacht en gevoeld.

Voor wie is dit programma geschikt?

Teams die meer willen dan een standaard uitje. Organisaties die duurzaamheid concreet willen maken voor hun medewerkers. MT's die draagvlak willen creëren rondom SDG's of ESG-beleid. En iedereen die gewoon een keer écht wil verbinden met collega's, over iets wat ertoe doet.

Hoe ziet de dag eruit?

Dit is een voorbeeldprogramma voor een middag-avondsessie. We denken graag met je mee als een andere opzet beter past, bijvoorbeeld een dagprogramma met de kookworkshop rondom de lunch.

13:00 — Ontvangst met koffie & thee
13:30 — Opening
13:45 — Workshop duurzaamheid (incl. pauze)
16:30 — Koken met de koks van Goeduitje
18:00 — Samen eten
18:30 — Optioneel: pubquiz, lego game of spelelement
19:00 — Toetje maken en eten
19:30 — Borrel
20:00 — Einde

Grotere groepen? Dan maken we een prijsopgave op maat. Doe een aanvraag via onze Uitjesconfigurator of neem contact op voor een programma op maat.`;

// Per-headcount tiers: total = 5960 + (N-8) * 160; per-person = total / N
// inclBtw = exclBtw * 1.09 (9% food-service BTW)
const TIERS: Array<{
  participants: number;
  priceExclBtw: number;
  priceInclBtw: number;
}> = [
  { participants: 8, priceExclBtw: 745.0, priceInclBtw: 811.55 },
  { participants: 9, priceExclBtw: 680.0, priceInclBtw: 741.2 },
  { participants: 10, priceExclBtw: 628.0, priceInclBtw: 684.52 },
  { participants: 11, priceExclBtw: 585.45, priceInclBtw: 638.14 },
  { participants: 12, priceExclBtw: 550.0, priceInclBtw: 599.5 },
  { participants: 13, priceExclBtw: 520.0, priceInclBtw: 566.8 },
  { participants: 14, priceExclBtw: 494.29, priceInclBtw: 538.78 },
  { participants: 15, priceExclBtw: 472.0, priceInclBtw: 514.48 },
  { participants: 16, priceExclBtw: 452.5, priceInclBtw: 493.23 },
  { participants: 17, priceExclBtw: 435.29, priceInclBtw: 474.47 },
  { participants: 18, priceExclBtw: 420.0, priceInclBtw: 457.8 },
  { participants: 19, priceExclBtw: 406.32, priceInclBtw: 442.89 },
  { participants: 20, priceExclBtw: 394.0, priceInclBtw: 429.46 },
];

async function main() {
  // Determine sortOrder = highest existing + 1 (so the new uitje appears last on the grid)
  const lastWorkshop = await prisma.workshop.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  const sortOrder = (lastWorkshop?.sortOrder ?? 0) + 1;

  console.log(`Computed sortOrder: ${sortOrder} (last on grid)`);

  const workshop = await prisma.workshop.upsert({
    where: { slug: SLUG },
    update: {
      title: "De Duurzame Dag",
      subtitle:
        "Duurzaamheidsworkshop + maatschappelijke kookworkshop: een teamdag met impact",
      description:
        "Combineer een interactieve duurzaamheidsworkshop met een maatschappelijke Arabische kookworkshop — een teamdag met blijvende impact.",
      longDescription,
      image: "/images/workshops/duurzame-dag.jpg",
      duration: "6-8 uur",
      groupSize: "8-20 personen",
      location: "Diverse locaties in overleg",
      categories: ["Duurzaam", "Teambuilding", "Workshop"],
      includes: [
        "Professionele begeleiding",
        "Ontvangst met koffie & thee",
        "Consumpties",
        "Alle ingrediënten en materialen",
        "Afsluitende borrel",
        "Sociale impact – werk samen met statushouders",
      ],
      isPublished: true,
      minParticipants: 8,
      maxParticipants: 20,
    },
    create: {
      slug: SLUG,
      title: "De Duurzame Dag",
      subtitle:
        "Duurzaamheidsworkshop + maatschappelijke kookworkshop: een teamdag met impact",
      description:
        "Combineer een interactieve duurzaamheidsworkshop met een maatschappelijke Arabische kookworkshop — een teamdag met blijvende impact.",
      longDescription,
      image: "/images/workshops/duurzame-dag.jpg",
      duration: "6-8 uur",
      groupSize: "8-20 personen",
      location: "Diverse locaties in overleg",
      categories: ["Duurzaam", "Teambuilding", "Workshop"],
      includes: [
        "Professionele begeleiding",
        "Ontvangst met koffie & thee",
        "Consumpties",
        "Alle ingrediënten en materialen",
        "Afsluitende borrel",
        "Sociale impact – werk samen met statushouders",
      ],
      isPublished: true,
      sortOrder,
      minParticipants: 8,
      maxParticipants: 20,
    },
  });

  console.log(`Upserted workshop: ${workshop.id} (slug: ${workshop.slug})`);

  // Replace workshop-level price tiers (no variants used for this uitje)
  const deleted = await prisma.priceTier.deleteMany({
    where: { workshopId: workshop.id, variantId: null },
  });
  console.log(`Deleted ${deleted.count} existing price tier(s)`);

  const created = await prisma.priceTier.createMany({
    data: TIERS.map((t, idx) => ({
      workshopId: workshop.id,
      groupSize: `${t.participants} personen`,
      minParticipants: t.participants,
      maxParticipants: t.participants,
      priceExclBtw: t.priceExclBtw,
      priceInclBtw: t.priceInclBtw,
      sortOrder: idx + 1,
    })),
  });
  console.log(`✅ Created ${created.count} price tier(s)`);

  // Verify
  const tiers = await prisma.priceTier.findMany({
    where: { workshopId: workshop.id, variantId: null },
    orderBy: { sortOrder: "asc" },
  });
  console.log("\nCurrent De Duurzame Dag price tiers:");
  for (const tier of tiers) {
    const total = (tier.priceExclBtw * (tier.minParticipants ?? 0)).toFixed(2);
    console.log(
      `  ${tier.groupSize}: €${tier.priceExclBtw}/p excl (€${total} totaal) / €${tier.priceInclBtw}/p incl 9% BTW`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
