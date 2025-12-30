import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const onsVerhaalContent = [
  // Hero section
  { section: "hero", key: "title", value: "Ons Verhaal", type: "text" },
  {
    section: "hero",
    key: "description",
    value:
      "Wij zijn een sociale onderneming waar statushouders* en asielzoekers uw bedrijfsuitjes organiseren en u een onvergetelijke dag bezorgen.",
    type: "text",
  },

  // Doen section
  {
    section: "doen",
    key: "title",
    value: "Doen én bijzonder eten",
    type: "text",
  },
  {
    section: "doen",
    key: "description",
    value:
      "Onze bedrijfsuitjes bestaan uit een mix van actieve en minder actieve Uitjes met vaak een cultureel tintje al dan niet gecombineerd met heerlijk eten uit de Arabische of Perzische keuken.",
    type: "text",
  },

  // Ervaring section
  { section: "ervaring", key: "title", value: "Ervaring opdoen", type: "text" },
  {
    section: "ervaring",
    key: "description",
    value:
      "Onze medewerkers organiseren en begeleiden de workshops en activiteiten, waardoor zij kennismaken met de Nederlandse werkcultuur en gewoonten en contact hebben met deelnemers. Dit biedt een praktische omgeving om de taal te oefenen, vaardigheden te ontwikkelen voor de arbeidsmarkt, hun netwerk te vergroten en een waardevolle referentie op te bouwen voor een toekomstige baan bij een Nederlandse organisatie.",
    type: "text",
  },

  // Culturen section
  {
    section: "culturen",
    key: "title",
    value: "Nieuwe culturen leren kennen",
    type: "text",
  },
  {
    section: "culturen",
    key: "description1",
    value:
      "Tijdens onze workshops en activiteiten stimuleren wij interactie tussen deelnemers en medewerkers om zodoende deelnemers kennis te laten maken met onze medewerkers, hun cultuur en hun achtergrond.",
    type: "text",
  },
  {
    section: "culturen",
    key: "description2",
    value:
      "Daarmee vergroten wij de kennis van deelnemers over de achtergrond en cultuur van onze medewerkers waardoor zij meer openstaan voor statushouders en asielzoekers en we onze samenleving inclusiever maken.",
    type: "text",
  },

  // Quote section
  {
    section: "quote",
    key: "text",
    value:
      "Wij vergroten de kennis van deelnemers over de achtergrond en cultuur van onze medewerkers waardoor zij meer openstaan voor statushouders en asielzoekers.",
    type: "text",
  },
  {
    section: "quote",
    key: "author",
    value: "Het Goeduitje Team",
    type: "text",
  },
  {
    section: "quote",
    key: "subtitle",
    value: "Be a part of it!",
    type: "text",
  },

  // Visie section
  { section: "visie", key: "title", value: "Onze Visie", type: "text" },
  {
    section: "visie",
    key: "paragraph1",
    value:
      "Wij streven naar een samenleving waarin diversiteit wordt gevierd en iedereen gelijke kansen heeft op de arbeidsmarkt.",
    type: "text",
  },
  {
    section: "visie",
    key: "paragraph2",
    value:
      "Door het potentieel van statushouders en asielzoekers te erkennen en te benutten, bouwen we bruggen tussen culturen en versterken we de sociale cohesie.",
    type: "text",
  },
  {
    section: "visie",
    key: "paragraph3",
    value:
      "We zien een toekomst voor ons waarin onze organisatie een toonaangevende rol speelt in het creëren van inclusieve werkplekken, waar talenten uit alle hoeken van de wereld samenkomen en bijdragen aan gezamenlijke groei en welvaart.",
    type: "text",
  },

  // Missie section
  { section: "missie", key: "title", value: "Onze Missie", type: "text" },
  {
    section: "missie",
    key: "description",
    value:
      "Het is onze missie om statushouders en asielzoekers in hun baan bij Goeduitje voor te bereiden op een baan die aansluit bij hun kennis, ervaring en interesses en Nederlanders kennis te laten maken met onze medewerkers en hun cultuur zodat zij statushouders en asielzoekers waarderen om hun kennis en kwaliteiten.",
    type: "text",
  },

  // CTA section
  {
    section: "cta",
    key: "title",
    value: "Word Deel van Ons Verhaal",
    type: "text",
  },
  {
    section: "cta",
    key: "description",
    value:
      "Organiseer een bedrijfsuitje dat verder gaat dan teambuilding. Maak impact die telt en draag bij aan een inclusievere samenleving.",
    type: "text",
  },
  {
    section: "cta",
    key: "buttonText",
    value: "Bekijk Onze Workshops",
    type: "text",
  },

  // Footnote
  {
    section: "footnote",
    key: "text",
    value:
      "*statushouder: Asielzoeker die een verblijfsvergunning heeft en in Nederland mag blijven.",
    type: "text",
  },
];

async function main() {
  console.log("Seeding ons-verhaal page content...");

  for (const item of onsVerhaalContent) {
    await prisma.pageContent.upsert({
      where: {
        page_section_key: {
          page: "ons-verhaal",
          section: item.section,
          key: item.key,
        },
      },
      update: { value: item.value, type: item.type },
      create: {
        page: "ons-verhaal",
        section: item.section,
        key: item.key,
        value: item.value,
        type: item.type,
      },
    });
  }

  console.log(
    `Seeded ${onsVerhaalContent.length} content items for ons-verhaal`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
