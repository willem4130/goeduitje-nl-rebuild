import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const faqData = [
  // Boekingen
  {
    category: "Boekingen",
    question: "Hoe kan ik een workshop boeken?",
    answer:
      "Als je de uitjes configurator invult krijg je binnen 48 uur een reactie met een prijsvoorstel indien de gewenste datum nog beschikbaar is. Door akkoord te gaan met het prijsvoorstel boek je de workshop.\nWil je sneller weten of de door jouw gewenste datum en tijd mogelijk is? Bel dan met Guus 06-52675891.",
    sortOrder: 1,
  },
  {
    category: "Boekingen",
    question: "Hoeveel personen moeten er minimaal deelnemen?",
    answer:
      "Het minimum aantal deelnemers verschilt per workshop.\nBij de kookworkshop rekenen we vanaf 8 personen een prijs per persoon. Ben je met minder dan 8 personen dan rekenen we een vaste prijs die afhankelijk is van reistijd tot de locatie.\n\nVoor kleinere groepen en individuen organiseren wij regelmatig open kookworkshops. Kijk voor de beschikbare open kookworkshops op www.goeduitje.nl/open-kookworkshops\n\nVoor de andere workshops en activiteiten vindt u het minimale aantal bij de workshopbeschrijving.",
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
      "Beschikbaarheid is afhankelijk van reeds geplaatste boekingen.\n\nIn het hoogseizoen (april t/m juni en september t/m december) raden wij aan om minimaal zes weken van tevoren te boeken.\n\nLast-minute boekingen zijn soms mogelijk, neem hiervoor contact met ons op.",
    sortOrder: 4,
  },
  {
    category: "Boekingen",
    question: "Hebben jullie ook cadeaubonnen?",
    answer:
      "Voor onze Open Kookworkshops hebben wij cadeaubonnen. Die vind je hier (link naar cadeaubon).",
    sortOrder: 5,
  },
  // Betaling & Annulering
  {
    category: "Betaling & Annulering",
    question: "Welke betaalmethoden accepteren jullie?",
    answer:
      "Voor privé-workshops / gesloten boekingen sturen wij achteraf een rekening met een betalingstermijn van 14 dagen. Voor grote groepen (boven 20 personen) vragen wij om een aanbetaling van 40%.\n\nDe betaling van deelname aan Open Kookworkshops verloopt via Stripe, een beveiligde betalingsverwerker.",
    sortOrder: 1,
  },
  {
    category: "Betaling & Annulering",
    question: "Kan ik mijn boeking annuleren?",
    answer:
      "Ja, annuleren is mogelijk. Tot 30 dagen voor de activiteit brengen wij €25 administratiekosten in rekening. Tussen 14-30 dagen voor de datum van de activiteit brengen wij 20% van het prijsvoorstel in rekening. Binnen 14 dagen zijn wij helaas genoodzaakt om het volledige bedrag in rekening te brengen.",
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
      "Wij verzorgen alle materialen. Bij sommige spellen maakt u gebruik van uw telefoon; wij vermelden dit in de bevestigingsmail.",
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
      "Onze kookworkshops vinden plaats op uw locatie of, als u geen geschikte locatie heeft, op een externe locatie in overleg. We maken regelmatig gebruik van locaties in Nijmegen, Arnhem en Amersfoort, maar we hebben op tientallen andere locaties gekookt.\n\nOnze spellen kunnen zowel binnen als buiten worden gespeeld. We kiezen de locatie in overleg met u; een stadscentrum, een park of liever in de natuur.",
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
      "Ja, wij sturen altijd achteraf een factuur met een betalingstermijn van 14 dagen.",
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
      "Jazeker. Om onze impact te vergroten en onze medewerkers meer uren te laten maken bieden wij catering aan. Dit kan zowel in combinatie met onze spellen als los. De opties vindt u bij Lunch & Diner Uitjes.",
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
