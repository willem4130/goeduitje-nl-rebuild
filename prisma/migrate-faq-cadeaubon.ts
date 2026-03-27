import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.fAQ.updateMany({
    where: {
      question: "Hebben jullie ook cadeaubonnen?",
      category: "Boekingen",
    },
    data: {
      answer:
        "Voor onze open kookworkshops hebben we cadeaubonnen voor één of meerdere personen à € 60 per persoon. Stuur een mailtje naar guus@goeduitje.nl voor een gepersonaliseerde cadeaubon.",
    },
  });

  if (result.count === 0) {
    // FAQ doesn't exist yet — create it
    await prisma.fAQ.create({
      data: {
        question: "Hebben jullie ook cadeaubonnen?",
        answer:
          "Voor onze open kookworkshops hebben we cadeaubonnen voor één of meerdere personen à € 60 per persoon. Stuur een mailtje naar guus@goeduitje.nl voor een gepersonaliseerde cadeaubon.",
        category: "Boekingen",
        sortOrder: 5,
        isPublished: true,
      },
    });
    console.log("Created new FAQ item");
  } else {
    console.log(`Updated ${result.count} FAQ item(s)`);
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
