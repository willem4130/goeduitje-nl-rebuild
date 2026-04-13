import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const OLD_CATEGORY = "Betaling & Annulering";
const NEW_CATEGORY = "Prijzen, Betaling & Annulering";

async function main() {
  console.log(`Renaming FAQ category "${OLD_CATEGORY}" → "${NEW_CATEGORY}"`);

  const before = await prisma.fAQ.findMany({
    where: { category: OLD_CATEGORY },
    select: { id: true, question: true, sortOrder: true },
    orderBy: { sortOrder: "asc" },
  });

  if (before.length === 0) {
    console.log(
      `No FAQ rows found with category "${OLD_CATEGORY}" — nothing to do.`
    );
    const already = await prisma.fAQ.count({
      where: { category: NEW_CATEGORY },
    });
    console.log(`(${already} rows already in "${NEW_CATEGORY}".)`);
    return;
  }

  console.log(`Found ${before.length} row(s) to rename:`);
  for (const row of before) {
    console.log(`  - [${row.sortOrder}] ${row.question}`);
  }

  const result = await prisma.fAQ.updateMany({
    where: { category: OLD_CATEGORY },
    data: { category: NEW_CATEGORY },
  });

  console.log(`\nRenamed ${result.count} row(s).`);

  const verify = await prisma.fAQ.findMany({
    where: { category: { in: [OLD_CATEGORY, NEW_CATEGORY] } },
    select: { category: true },
  });
  const counts = verify.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});
  console.log("\nVerification:");
  console.log(`  "${OLD_CATEGORY}": ${counts[OLD_CATEGORY] ?? 0}`);
  console.log(`  "${NEW_CATEGORY}": ${counts[NEW_CATEGORY] ?? 0}`);

  if ((counts[OLD_CATEGORY] ?? 0) !== 0) {
    throw new Error(
      `Rename incomplete — ${counts[OLD_CATEGORY]} row(s) still under old name.`
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
