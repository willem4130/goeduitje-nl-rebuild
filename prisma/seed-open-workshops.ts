import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const WORKSHOPS = [
  { id: "mrt-29-2026", date: "2026-03-29", startTime: "14:00", endTime: "16:30" },
  { id: "apr-13-2026", date: "2026-04-13", startTime: "19:00", endTime: "21:30" },
  { id: "apr-19-2026", date: "2026-04-19", startTime: "14:00", endTime: "16:30" },
  { id: "apr-20-2026", date: "2026-04-20", startTime: "19:00", endTime: "21:30" },
  { id: "apr-26-2026", date: "2026-04-26", startTime: "14:00", endTime: "16:30" },
  { id: "mei-11-2026", date: "2026-05-11", startTime: "19:00", endTime: "21:30" },
  { id: "mei-27-2026", date: "2026-05-27", startTime: "19:00", endTime: "21:30" },
  { id: "mei-31-2026", date: "2026-05-31", startTime: "14:00", endTime: "16:30" },
  { id: "jun-07-2026", date: "2026-06-07", startTime: "14:00", endTime: "16:30" },
  { id: "jun-08-2026", date: "2026-06-08", startTime: "19:00", endTime: "21:30" },
  { id: "jun-14-2026", date: "2026-06-14", startTime: "14:00", endTime: "16:30" },
  { id: "jun-17-2026", date: "2026-06-17", startTime: "19:00", endTime: "21:30" },
  { id: "jun-22-2026", date: "2026-06-22", startTime: "19:00", endTime: "21:30" },
  { id: "jun-28-2026", date: "2026-06-28", startTime: "14:00", endTime: "16:30" },
  { id: "jul-08-2026", date: "2026-07-08", startTime: "19:00", endTime: "21:30" },
  { id: "jul-19-2026", date: "2026-07-19", startTime: "14:00", endTime: "16:30" },
  { id: "jul-20-2026", date: "2026-07-20", startTime: "19:00", endTime: "21:30" },
  { id: "jul-22-2026", date: "2026-07-22", startTime: "19:00", endTime: "21:30" },
  { id: "aug-05-2026", date: "2026-08-05", startTime: "19:00", endTime: "21:30" },
  { id: "aug-09-2026", date: "2026-08-09", startTime: "14:00", endTime: "16:30" },
  { id: "sep-06-2026", date: "2026-09-06", startTime: "14:00", endTime: "16:30" },
  { id: "sep-07-2026", date: "2026-09-07", startTime: "19:00", endTime: "21:30" },
  { id: "sep-09-2026", date: "2026-09-09", startTime: "19:00", endTime: "21:30" },
];

async function main() {
  console.log("Seeding open workshop sessions...\n");

  // Map old ID -> new session DB ID for booking migration
  const oldIdToNewId: Record<string, string> = {};

  for (const ws of WORKSHOPS) {
    const date = new Date(ws.date + "T00:00:00.000Z");

    // Check if a session with this date and startTime already exists
    const existing = await prisma.openWorkshopSession.findFirst({
      where: {
        date,
        startTime: ws.startTime,
      },
    });

    if (existing) {
      console.log(`  [exists] ${ws.date} ${ws.startTime} -> ${existing.id}`);
      oldIdToNewId[ws.id] = existing.id;
    } else {
      const created = await prisma.openWorkshopSession.create({
        data: {
          date,
          startTime: ws.startTime,
          endTime: ws.endTime,
          location: "Nijmegen",
          maxCapacity: 12,
          pricePerPerson: 60,
          isActive: true,
        },
      });
      console.log(`  [created] ${ws.date} ${ws.startTime} -> ${created.id}`);
      oldIdToNewId[ws.id] = created.id;
    }
  }

  console.log(`\nCreated/found ${Object.keys(oldIdToNewId).length} sessions.`);

  // Migrate existing bookings that have old workshopId values
  console.log("\nMigrating existing bookings...");

  const oldIds = Object.keys(oldIdToNewId);
  const bookingsToMigrate = await prisma.booking.findMany({
    where: {
      workshopId: { in: oldIds },
      sessionId: null, // Only migrate if not already linked
    },
    select: { id: true, workshopId: true },
  });

  console.log(`  Found ${bookingsToMigrate.length} bookings to migrate.`);

  for (const booking of bookingsToMigrate) {
    if (booking.workshopId && oldIdToNewId[booking.workshopId]) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { sessionId: oldIdToNewId[booking.workshopId] },
      });
      console.log(
        `  [migrated] Booking ${booking.id}: workshopId="${booking.workshopId}" -> sessionId="${oldIdToNewId[booking.workshopId]}"`
      );
    }
  }

  console.log("\nDone!");
}

main()
  .catch((e) => {
    console.error("Error seeding open workshops:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
