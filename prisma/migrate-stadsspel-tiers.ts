/**
 * Migration script: Update stadsspel price tiers
 *
 * Replaces the single stadsspel price tier with 3 group-size-based tiers.
 * Only touches stadsspel price tiers — all other workshops are untouched.
 *
 * Safe to run multiple times (idempotent): deletes existing stadsspel
 * workshop-level price tiers first, then creates the 3 new ones.
 *
 * Usage: npx tsx prisma/migrate-stadsspel-tiers.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Find the stadsspel workshop
  const stadsspel = await prisma.workshop.findUnique({
    where: { slug: "stadsspel" },
  });

  if (!stadsspel) {
    console.error("❌ Workshop 'stadsspel' not found in DB. Is the DB seeded?");
    process.exit(1);
  }

  console.log(`Found stadsspel workshop: ${stadsspel.id}`);

  // Delete only stadsspel's workshop-level price tiers (not variant-level)
  const deleted = await prisma.priceTier.deleteMany({
    where: {
      workshopId: stadsspel.id,
      variantId: null,
    },
  });
  console.log(`Deleted ${deleted.count} existing stadsspel price tier(s)`);

  // Create 3 new tiers
  const created = await prisma.priceTier.createMany({
    data: [
      {
        workshopId: stadsspel.id,
        groupSize: "10-15 personen",
        minParticipants: 10,
        maxParticipants: 15,
        priceExclBtw: 27.5,
        priceInclBtw: 33.28,
        sortOrder: 1,
      },
      {
        workshopId: stadsspel.id,
        groupSize: "16-25 personen",
        minParticipants: 16,
        maxParticipants: 25,
        priceExclBtw: 25,
        priceInclBtw: 30.25,
        sortOrder: 2,
      },
      {
        workshopId: stadsspel.id,
        groupSize: "26+ personen",
        minParticipants: 26,
        maxParticipants: null,
        priceExclBtw: 22.5,
        priceInclBtw: 27.23,
        sortOrder: 3,
      },
    ],
  });
  console.log(`✅ Created ${created.count} new stadsspel price tiers`);

  // Verify
  const tiers = await prisma.priceTier.findMany({
    where: { workshopId: stadsspel.id, variantId: null },
    orderBy: { sortOrder: "asc" },
  });
  console.log("\nCurrent stadsspel price tiers:");
  for (const tier of tiers) {
    console.log(
      `  ${tier.groupSize}: €${tier.priceExclBtw} excl / €${tier.priceInclBtw} incl`
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
