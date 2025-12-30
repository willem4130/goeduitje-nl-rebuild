import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const faqData = [
  // Boekingen
  {
    category: "Boekingen",
    question: "Hoe kan ik een workshop boeken?",
    answer:
      "U kunt eenvoudig een workshop boeken via onze website. Kies de gewenste workshop, selecteer een datum en vul uw gegevens in. Na betaling ontvangt u direct een bevestiging per e-mail.",
    sortOrder: 1,
  },
  {
    category: "Boekingen",
    question: "Hoeveel personen moeten er minimaal deelnemen?",
    answer:
      "Het minimum aantal deelnemers verschilt per workshop. Over het algemeen is het minimum 8 personen. Bij sommige workshops is dit 6 of 10 personen. U vindt dit bij de workshopbeschrijving.",
    sortOrder: 2,
  },
  {
    category: "Boekingen",
    question: "Kan ik ook een privé-workshop boeken?",
    answer:
      "Ja, al onze workshops kunnen als privé-workshop worden geboekt voor uw groep. Neem contact met ons op voor een offerte op maat.",
    sortOrder: 3,
  },
  {
    category: "Boekingen",
    question: "Hoe ver van tevoren moet ik boeken?",
    answer:
      "Wij adviseren om minimaal 2 weken van tevoren te boeken. Voor populaire data en in het hoogseizoen raden we aan om nog eerder te reserveren. Last-minute boekingen zijn soms mogelijk, neem hiervoor contact met ons op.",
    sortOrder: 4,
  },
  // Betaling & Annulering
  {
    category: "Betaling & Annulering",
    question: "Welke betaalmethoden accepteren jullie?",
    answer:
      "Wij accepteren iDEAL, creditcard (Visa, Mastercard), en betaling op factuur voor zakelijke klanten. De betaling verloopt via Stripe, een beveiligde betalingsverwerker.",
    sortOrder: 1,
  },
  {
    category: "Betaling & Annulering",
    question: "Kan ik mijn boeking annuleren?",
    answer:
      "Ja, annuleren is mogelijk. Tot 30 dagen voor de activiteit ontvangt u volledige restitutie minus €25 administratiekosten. Tussen 14-30 dagen krijgt u 50% terug. Binnen 14 dagen is helaas geen restitutie mogelijk.",
    sortOrder: 2,
  },
  {
    category: "Betaling & Annulering",
    question: "Wat gebeurt er bij slecht weer?",
    answer:
      "Bij buitenactiviteiten houden we de weersverwachting in de gaten. Bij extreme weersomstandigheden nemen we contact met u op om de workshop te verplaatsen naar een andere datum. Dit is kosteloos.",
    sortOrder: 3,
  },
  // Praktische informatie
  {
    category: "Praktische informatie",
    question: "Wat moet ik meenemen naar een workshop?",
    answer:
      "Dit hangt af van de workshop. Bij kookworkshops zorgen wij voor alle ingrediënten en materialen. We adviseren comfortabele kleding te dragen. Specifieke benodigdheden staan vermeld in uw bevestigingsmail.",
    sortOrder: 1,
  },
  {
    category: "Praktische informatie",
    question: "Zijn er dieetopties beschikbaar?",
    answer:
      "Ja, bij onze kookworkshops kunnen we rekening houden met vegetarische, veganistische, glutenvrije en andere dieetwensen. Geef dit aan bij het boeken of neem vooraf contact met ons op.",
    sortOrder: 2,
  },
  {
    category: "Praktische informatie",
    question: "Waar vinden de workshops plaats?",
    answer:
      "Onze workshops vinden plaats op diverse locaties door heel Nederland. De exacte locatie en routebeschrijving ontvangt u in uw bevestigingsmail. We kunnen ook op locatie bij uw bedrijf komen voor grotere groepen.",
    sortOrder: 3,
  },
  {
    category: "Praktische informatie",
    question: "Hoe lang duurt een workshop?",
    answer:
      "De duur varieert per workshop, meestal tussen 2 en 4 uur. De exacte duur staat vermeld bij elke workshop op onze website.",
    sortOrder: 4,
  },
  // Voor bedrijven
  {
    category: "Voor bedrijven",
    question: "Kunnen jullie een factuur sturen?",
    answer:
      "Ja, voor zakelijke klanten kunnen we een factuur sturen met een betalingstermijn van 14 dagen. Neem contact met ons op voor deze optie.",
    sortOrder: 1,
  },
  {
    category: "Voor bedrijven",
    question: "Bieden jullie teambuilding op maat aan?",
    answer:
      "Absoluut! We denken graag mee over een programma dat past bij uw team en doelstellingen. Neem contact op voor een vrijblijvende offerte.",
    sortOrder: 2,
  },
  {
    category: "Voor bedrijven",
    question: "Kunnen jullie catering verzorgen?",
    answer:
      "Bij veel van onze workshops is catering inbegrepen. Voor extra catering of speciale wensen kunnen we in overleg aanvullende arrangementen aanbieden.",
    sortOrder: 3,
  },
];

async function main() {
  console.log("Seeding FAQ...");

  // Clear existing FAQ data
  await prisma.fAQ.deleteMany();

  // Create FAQ entries
  for (const faq of faqData) {
    await prisma.fAQ.create({
      data: {
        ...faq,
        isPublished: true,
      },
    });
  }

  console.log(`Seeded ${faqData.length} FAQ items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
