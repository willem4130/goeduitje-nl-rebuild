/**
 * One-time migration script: Backfill WorkshopRequest records for existing WorkshopConfig entries.
 *
 * This creates a WorkshopRequest (source: 'configurator') for each WorkshopConfig
 * that doesn't already have a corresponding request (via configId).
 *
 * Run: npx tsx prisma/migrate-configs-to-requests.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get all existing configs
  const configs = await prisma.workshopConfig.findMany({
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${configs.length} WorkshopConfig records`);

  // Get all existing requests that already have a configId
  const existingRequests = await prisma.workshopRequest.findMany({
    where: { configId: { not: null } },
    select: { configId: true },
  });
  const existingConfigIds = new Set(
    existingRequests.map((r) => r.configId).filter(Boolean)
  );

  console.log(
    `${existingConfigIds.size} configs already have a matching request`
  );

  let created = 0;
  let skipped = 0;

  for (const config of configs) {
    if (existingConfigIds.has(config.id)) {
      skipped++;
      continue;
    }

    // Resolve workshop IDs to names
    let activityDisplay = "Website configuratie";
    if (config.workshops && config.workshops.length > 0) {
      const workshops = await prisma.workshop.findMany({
        where: { id: { in: config.workshops } },
        select: { id: true, title: true },
      });
      const nameMap = Object.fromEntries(workshops.map((w) => [w.id, w.title]));
      activityDisplay = config.workshops
        .map((id) => nameMap[id] || id)
        .join(", ");
    }

    // Build summary
    const summaryParts: string[] = [
      `Type: ${config.type}`,
      `${config.participantCount} deelnemers`,
    ];
    if (config.companyName) summaryParts.push(`Bedrijf: ${config.companyName}`);
    if (config.duration) summaryParts.push(`Duur: ${config.duration}u`);

    await prisma.workshopRequest.create({
      data: {
        status: "leeg",
        contactName: config.name,
        email: config.email,
        phone: config.phone || null,
        organization: config.companyName || null,
        activityType: activityDisplay,
        preferredDate: config.date || null,
        participants: config.participantCount,
        location: config.customCity || config.location,
        source: "configurator",
        configId: config.id,
        notes: `Website configuratie: ${summaryParts.join(" | ")}`,
      },
    });

    created++;
    console.log(
      `  Created request for config ${config.id} (${config.name}, ${config.email})`
    );
  }

  console.log(
    `\nDone! Created ${created} new requests, skipped ${skipped} existing.`
  );
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
