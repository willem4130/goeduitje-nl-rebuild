import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding workshops...");

  // Clear existing data
  await prisma.priceTier.deleteMany();
  await prisma.workshopVariant.deleteMany();
  await prisma.workshop.deleteMany();

  // 1. Kookworkshop (with variants)
  const kookworkshop = await prisma.workshop.create({
    data: {
      slug: "kookworkshop",
      title: "Kookworkshops",
      subtitle: "Samen koken, samen genieten",
      description:
        "Bereid samen een heerlijke maaltijd onder begeleiding van gepassioneerde koks uit de Arabische keuken",
      longDescription: `Onder begeleiding van gepassioneerde koks (asielzoekers en statushouders) leer je de geheimen van verschillende keukens.
Je wordt begeleid door enthousiaste en ervaren koks die graag hun liefde voor koken en hun cultuur delen.

Kies uit verschillende kookworkshops: Arabische kookworkshop, Oogsten & Koken, Vegetarische kookworkshop, of Koken op Maat.`,
      video: "/images/workshops/workshop 1.mp4",
      image: "/images/workshops/kookworkshop.jpg",
      duration: "vanaf 2,5 uur",
      groupSize: "vanaf 8 personen",
      location: "Op locatie naar keuze of bij u op locatie",
      categories: ["Koken", "Teambuilding", "Cultureel"],
      includes: [
        "Begeleiding door gepassioneerde koks",
        "Alle ingrediënten en materialen",
        "Recepten om mee naar huis te nemen",
        "Complete maaltijd",
        "Keuze uit vlees, vegetarisch of veganistisch",
        "Sociale impact - draag bij aan arbeidsparticipatie",
      ],
      sortOrder: 1,
      minParticipants: 8,
      maxParticipants: null,
    },
  });

  // Kookworkshop Variant 1: Arabische Kookworkshop
  const arabisch = await prisma.workshopVariant.create({
    data: {
      workshopId: kookworkshop.id,
      name: "Arabische Kookworkshop",
      description:
        "Leer met je team diverse Arabische gerechten bereiden. Afhankelijk van de gewenste lengte maken we samen een keuze uit vele voor- en hoofdgerechten, salades en toetjes. Wij koken met vlees, vegetarisch en veganistisch. En daarna gezellig genieten van de bereide gerechten. Indien gewenst maken onze koks vooraf nog wat extra gerechten.",
      duration: "2,5 tot 3 uur",
      includes: [
        "Begeleiding door gepassioneerde koks",
        "Alle ingrediënten en materialen",
        "Recepten om mee naar huis te nemen",
        "Complete maaltijd",
        "Keuze uit vlees, vegetarisch of veganistisch",
        "Locatie in overleg",
      ],
      sortOrder: 1,
    },
  });

  await prisma.priceTier.createMany({
    data: [
      {
        workshopId: kookworkshop.id,
        variantId: arabisch.id,
        groupSize: "8-10 personen",
        minParticipants: 8,
        maxParticipants: 10,
        priceExclBtw: 70,
        priceInclBtw: 85,
        sortOrder: 1,
      },
      {
        workshopId: kookworkshop.id,
        variantId: arabisch.id,
        groupSize: "11-15 personen",
        minParticipants: 11,
        maxParticipants: 15,
        priceExclBtw: 60,
        priceInclBtw: 73,
        sortOrder: 2,
      },
      {
        workshopId: kookworkshop.id,
        variantId: arabisch.id,
        groupSize: "16+ personen",
        minParticipants: 16,
        maxParticipants: null,
        priceExclBtw: 55,
        priceInclBtw: 67,
        sortOrder: 3,
      },
    ],
  });

  // Kookworkshop Variant 2: Oogsten, Koken & Genieten
  const oogsten = await prisma.workshopVariant.create({
    data: {
      workshopId: kookworkshop.id,
      name: "Oogsten, Koken & Genieten",
      description:
        "Eerst lekker ontspannen je eigen groenten oogsten en kruiden verzamelen in de pluktuin en het voedselbos. En deze dan onder leiding van onze koks met aanvulling van Oosterse kruiden en ingrediënten om te toveren tot verrukkelijke gerechten. En natuurlijk afsluiten met een gezellig diner!",
      duration: "3 tot 4 uur",
      includes: [
        "Oogsten in de pluktuin en voedselbos",
        "Begeleiding door koks",
        "Oosterse kruiden en ingrediënten",
        "Complete maaltijd",
        "Locatie: Amersfoort of Wijchen",
      ],
      sortOrder: 2,
    },
  });

  await prisma.priceTier.createMany({
    data: [
      {
        workshopId: kookworkshop.id,
        variantId: oogsten.id,
        groupSize: "8-10 personen",
        minParticipants: 8,
        maxParticipants: 10,
        priceExclBtw: 80,
        priceInclBtw: 97,
        sortOrder: 1,
      },
      {
        workshopId: kookworkshop.id,
        variantId: oogsten.id,
        groupSize: "11-15 personen",
        minParticipants: 11,
        maxParticipants: 15,
        priceExclBtw: 70,
        priceInclBtw: 85,
        sortOrder: 2,
      },
      {
        workshopId: kookworkshop.id,
        variantId: oogsten.id,
        groupSize: "16+ personen",
        minParticipants: 16,
        maxParticipants: null,
        priceExclBtw: 65,
        priceInclBtw: 79,
        sortOrder: 3,
      },
    ],
  });

  // Kookworkshop Variant 3: Koken op Maat
  const kokenOpMaat = await prisma.workshopVariant.create({
    data: {
      workshopId: kookworkshop.id,
      name: "Koken op Maat",
      description:
        "Onze kookworkshops zijn een sociale en culinaire ervaring die verder gaat dan koken alleen. Maak samen met ons het perfecte programma voor jullie dag of avond. De chef komt naar jou toe en kan zo persoonlijke begeleiding bieden afgestemd op jouw wensen.",
      duration: "vanaf 3 uur",
      includes: [
        "Chef komt naar jouw locatie",
        "Volledig aangepast aan jouw wensen",
        "Persoonlijke begeleiding",
        "Alle ingrediënten en materialen",
        "Keuze uit vlees, vegetarisch of veganistisch",
        "Locatie in overleg",
      ],
      sortOrder: 3,
    },
  });

  await prisma.priceTier.create({
    data: {
      workshopId: kookworkshop.id,
      variantId: kokenOpMaat.id,
      groupSize: "Per persoon",
      minParticipants: 8,
      maxParticipants: null,
      priceExclBtw: 55,
      priceInclBtw: 67,
      sortOrder: 1,
    },
  });

  // Kookworkshop Variant 4: Vegetarische Kookworkshop
  const vegetarisch = await prisma.workshopVariant.create({
    data: {
      workshopId: kookworkshop.id,
      name: "Vegetarische Kookworkshop",
      description:
        "Een vegetarische kookworkshop gericht op teambuilding, waarbij je leert koken met seizoensgebonden, lokale ingrediënten onder begeleiding van gepassioneerde koks (statushouders en asielzoekers). We bieden volledig vegetarische kookworkshops waarbij we rekening houden met dieetwensen en allergieën.",
      duration: "2,5 tot 3 uur",
      includes: [
        "Begeleiding door gepassioneerde koks",
        "Seizoensgebonden, lokale ingrediënten",
        "Volledig vegetarisch menu",
        "Recepten om mee naar huis te nemen",
        "Complete maaltijd",
        "Locatie in overleg",
      ],
      sortOrder: 4,
    },
  });

  await prisma.priceTier.createMany({
    data: [
      {
        workshopId: kookworkshop.id,
        variantId: vegetarisch.id,
        groupSize: "8-10 personen",
        minParticipants: 8,
        maxParticipants: 10,
        priceExclBtw: 70,
        priceInclBtw: 85,
        sortOrder: 1,
      },
      {
        workshopId: kookworkshop.id,
        variantId: vegetarisch.id,
        groupSize: "11-15 personen",
        minParticipants: 11,
        maxParticipants: 15,
        priceExclBtw: 60,
        priceInclBtw: 73,
        sortOrder: 2,
      },
      {
        workshopId: kookworkshop.id,
        variantId: vegetarisch.id,
        groupSize: "16+ personen",
        minParticipants: 16,
        maxParticipants: null,
        priceExclBtw: 55,
        priceInclBtw: 67,
        sortOrder: 3,
      },
    ],
  });

  // 2. Stadsspel
  const stadsspel = await prisma.workshop.create({
    data: {
      slug: "stadsspel",
      title: "Stadsspel / Citygame",
      subtitle: "Ontdek de stad op een nieuwe manier",
      description:
        "Een interactieve speurtocht door de stad met culturele uitdagingen en verrassende ontmoetingen",
      longDescription: `Ons culture stadsspel is uniek door de integratie van statushouders en asielzoekers in het spel.
Het spel kan zich afspelen in de stad, in de natuur of zelfs binnen.

Kies uit twee varianten:
- Teamspel: Competitief spel waar je strijdt tegen andere teams
- "Team up and crack it!" (Koffer): Als één team op zoek naar de code om de koffer te openen

Perfect voor teams die op zoek zijn naar een actieve, culturele en vooral leuke ervaring.`,
      video: "/images/workshops/workshop 2.mp4",
      image: "/images/workshops/stadsspel.jpg",
      duration: "2-3 uur",
      groupSize: "10-20 personen",
      location: "Nijmegen, Arnhem en andere steden",
      categories: ["Outdoor", "Teambuilding", "Cultureel"],
      includes: [
        "Professionele begeleiding",
        "Spannende challenges en puzzels",
        "Culturele ontmoetingen",
        "Prijzen voor het winnende team",
        "Optioneel: lunch of borrel achteraf",
        "Sociale impact - ontmoet statushouders",
      ],
      sortOrder: 2,
      minParticipants: 10,
      maxParticipants: null,
    },
  });

  await prisma.priceTier.createMany({
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

  // 3. The Game - Koffer Challenge
  const theGame = await prisma.workshop.create({
    data: {
      slug: "the-game",
      title: "The Game - Koffer Challenge",
      subtitle: "Team up and crack it!",
      description:
        "Zoek samen de code om de koffer te openen. Vereist afstemming, communicatie en samenwerking",
      longDescription: `"Team up and crack it!" - Als één team ga je op zoek naar de code om de koffer te openen.
Dit vereist afstemming, communicatie en samenwerking tussen alle teamleden.

Uniek door de integratie van statushouders en asielzoekers in het spel. Zij begeleiden
de activiteit en maken het tot een bijzondere culturele ervaring.

Communicatie, leiderschap en probleemoplossend denken worden op de proef gesteld
terwijl jullie samen de puzzel oplossen.`,
      image: "/images/workshops/the-game.jpg",
      duration: "2-3 uur",
      groupSize: "10-20 personen",
      location: "Diverse locaties in overleg",
      categories: ["Indoor", "Teambuilding", "Cultureel"],
      includes: [
        "Professionele begeleiding",
        "Alle benodigde materialen",
        "Culturele uitwisseling",
        "Teamevaluatie achteraf",
        "Drankjes tijdens het spel",
        "Sociale impact - werk samen met statushouders",
      ],
      sortOrder: 3,
      minParticipants: 10,
      maxParticipants: 20,
    },
  });

  await prisma.priceTier.create({
    data: {
      workshopId: theGame.id,
      groupSize: "Per persoon",
      minParticipants: 10,
      maxParticipants: null,
      priceExclBtw: 32.5,
      priceInclBtw: 39,
      sortOrder: 1,
    },
  });

  // 4. Koffie & Thee Workshop
  const koffieTee = await prisma.workshop.create({
    data: {
      slug: "koffie-thee-workshop",
      title: "Koffie & Thee Workshop",
      subtitle: "De kunst van Arabische koffie en thee",
      description:
        "Leer hoe Arabische koffie en thee gemaakt worden en experimenteer met kruiden en specerijen",
      longDescription: `Onze medewerkers laten zien hoe Arabische koffie gemaakt wordt. Daarna maakt u in groepjes zelf koffie
en experimenteert u met verschillende kruiden en specerijen om de perfecte smaak te ontdekken.

U kunt de koffie van collega's of teamgenoten proeven en samen bepalen hoe de lekkerste Arabische koffie te maken.
Theeliefhebbers kunnen ook aan de slag met diverse kruiden en specerijen.

Tijdens de workshop serveren ze heerlijke Arabische lekkernijen. Optioneel te combineren met een maaltijd
uit de Arabische keuken.`,
      image: "/images/workshops/koffie-thee.jpg",
      duration: "in overleg",
      groupSize: "8-25 personen",
      location:
        "Bij u op locatie (binnen of buiten) of gezamenlijk gekozen locatie",
      categories: ["Workshop", "Cultureel", "Culinair"],
      includes: [
        "Begeleiding door onze medewerkers",
        "Diverse koffie- en theesoorten",
        "Kruiden en specerijen om mee te experimenteren",
        "Arabische lekkernijen",
        "Culturele uitwisseling",
        "Optioneel: maaltijd uit de Arabische keuken",
      ],
      sortOrder: 4,
      minParticipants: 8,
      maxParticipants: 25,
    },
  });

  await prisma.priceTier.create({
    data: {
      workshopId: koffieTee.id,
      groupSize: "Per persoon",
      minParticipants: 8,
      maxParticipants: null,
      priceExclBtw: 32.5,
      priceInclBtw: 39,
      sortOrder: 1,
    },
  });

  // 5. Beachvolleybal Workshop
  const beachvolleybal = await prisma.workshop.create({
    data: {
      slug: "beachvolleybal-workshop",
      title: "Beachvolleybal Workshop",
      subtitle: "Sport, zon en strand",
      description:
        "Actieve teambuilding met gecertificeerde trainers. Clinic, toernooi of combinatie van beide",
      longDescription: `Onder leiding van gecertificeerde beachvolleybaltrainers leer je de beginselen van het beachvolleybal
of breid je je volleybalskills uit. Serveren, passen, duiken en aanvallen komen allemaal aan bod.

Kies uit verschillende opties:
- Dynamische clinic door gecertificeerde trainer
- Spannend toernooi
- Combinatie van beide

Geschikt voor beginners én gevorderden. Met de zon op je gezicht en zand tussen je tenen
creëer je herinneringen die je team nog lang zal bijblijven.`,
      image: "/images/workshops/beachvolleybal.jpg",
      duration: "2-4 uur",
      groupSize: "12-40 personen",
      location: "Beachclubs in heel Nederland",
      categories: ["Outdoor", "Sport", "Teambuilding"],
      includes: [
        "Gecertificeerde volleybalcoaches",
        "Gebruik van velden en materiaal",
        "Warming-up en techniektraining",
        "Toernooi met prijzen",
        "Geschikt voor beginners én gevorderden",
        "Optioneel: drankjes en hapjes",
      ],
      sortOrder: 5,
      minParticipants: 12,
      maxParticipants: 40,
    },
  });

  await prisma.priceTier.create({
    data: {
      workshopId: beachvolleybal.id,
      groupSize: "Per persoon",
      minParticipants: 12,
      maxParticipants: null,
      priceExclBtw: 25,
      priceInclBtw: 30,
      sortOrder: 1,
    },
  });

  // 6. Lunch & Diner
  const lunchDiner = await prisma.workshop.create({
    data: {
      slug: "lunch-diner",
      title: "Lunch & Diner Uitjes",
      subtitle: "Culinaire beleving met impact",
      description:
        "Unieke lunches en diners waarbij statushouders en asielzoekers je kennis laten maken met verrukkelijke smaken",
      longDescription: `Unieke lunches en diners waarbij statushouders en asielzoekers je kennis laten maken met verrukkelijke smaken
en exotische gerechten. Zowel buffetten als uitgebreide diners op locatie zijn een culinaire reis.

Kies uit verschillende opties: van een simpel buffet tot een uitgebreid Arabisch diner of combineer
een kookworkshop met diner voor de complete ervaring.`,
      image: "/images/workshops/lunch-diner.jpg",
      duration: "1-4 uur",
      groupSize: "8-100 personen",
      location: "Op locatie naar keuze of bij u op locatie",
      categories: ["Culinair", "Cultureel", "Teambuilding"],
      includes: [
        "Bereiding door onze koks",
        "Alle ingrediënten en materialen",
        "Serveren en opruimen",
        "Culturele toelichting bij gerechten",
        "Keuze uit diverse menu's",
        "Sociale impact - werk met statushouders",
      ],
      sortOrder: 6,
      minParticipants: 8,
      maxParticipants: 100,
    },
  });

  // Lunch & Diner Variant 1: Buffet
  const buffet = await prisma.workshopVariant.create({
    data: {
      workshopId: lunchDiner.id,
      name: "Buffet",
      description:
        "Een heerlijk buffet met diverse Arabische en Perzische gerechten. Perfect voor grotere groepen of informele bijeenkomsten.",
      duration: "1-2 uur",
      includes: [
        "Diverse warme en koude gerechten",
        "Brood en dips",
        "Vegetarische opties",
        "Serveren en opruimen",
      ],
      sortOrder: 1,
    },
  });

  await prisma.priceTier.create({
    data: {
      workshopId: lunchDiner.id,
      variantId: buffet.id,
      groupSize: "Vanaf 30 personen",
      minParticipants: 30,
      maxParticipants: null,
      priceExclBtw: 22.5,
      priceInclBtw: 24.5, // 9% BTW (food service)
      sortOrder: 1,
    },
  });

  // Lunch & Diner Variant 2: Lunch
  const lunch = await prisma.workshopVariant.create({
    data: {
      workshopId: lunchDiner.id,
      name: "Lunch",
      description:
        "Een uitgebreide lunch met verse gerechten uit de Arabische keuken. Ideaal voor zakelijke bijeenkomsten of teamlunches.",
      duration: "1,5-2 uur",
      includes: [
        "Meerdere gangen",
        "Verse ingrediënten",
        "Vegetarische opties",
        "Koffie en thee",
      ],
      sortOrder: 2,
    },
  });

  await prisma.priceTier.create({
    data: {
      workshopId: lunchDiner.id,
      variantId: lunch.id,
      groupSize: "Vanaf 15 personen",
      minParticipants: 15,
      maxParticipants: null,
      priceExclBtw: 35,
      priceInclBtw: 38, // 9% BTW (food service)
      sortOrder: 1,
    },
  });

  // Lunch & Diner Variant 3: Arabisch Diner
  const diner = await prisma.workshopVariant.create({
    data: {
      workshopId: lunchDiner.id,
      name: "Arabisch Diner",
      description:
        "Een uitgebreid meergangen diner met de beste gerechten uit de Arabische en Perzische keuken. Een culinaire reis voor jullie team.",
      duration: "2-3 uur",
      includes: [
        "Meerdere gangen",
        "Authentieke recepten",
        "Culturele toelichting",
        "Vegetarische opties",
        "Koffie, thee en dessert",
      ],
      sortOrder: 3,
    },
  });

  await prisma.priceTier.create({
    data: {
      workshopId: lunchDiner.id,
      variantId: diner.id,
      groupSize: "Vanaf 15 personen",
      minParticipants: 15,
      maxParticipants: null,
      priceExclBtw: 47.5,
      priceInclBtw: 52, // 9% BTW (food service)
      sortOrder: 1,
    },
  });

  // Lunch & Diner Variant 4: Kookworkshop met Diner
  const workshopDiner = await prisma.workshopVariant.create({
    data: {
      workshopId: lunchDiner.id,
      name: "Kookworkshop met Diner",
      description:
        "De complete ervaring: eerst samen koken onder begeleiding van onze koks, daarna genieten van jullie zelfbereide maaltijd.",
      duration: "3-4 uur",
      includes: [
        "Kookworkshop",
        "Alle ingrediënten",
        "Begeleiding door koks",
        "Complete maaltijd",
        "Recepten voor thuis",
      ],
      sortOrder: 4,
    },
  });

  await prisma.priceTier.create({
    data: {
      workshopId: lunchDiner.id,
      variantId: workshopDiner.id,
      groupSize: "Per persoon",
      minParticipants: 8,
      maxParticipants: null,
      priceExclBtw: 55,
      priceInclBtw: 67,
      sortOrder: 1,
    },
  });

  console.log("✅ Workshops seeded successfully!");
  console.log(`Created ${await prisma.workshop.count()} workshops`);
  console.log(`Created ${await prisma.workshopVariant.count()} variants`);
  console.log(`Created ${await prisma.priceTier.count()} price tiers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
