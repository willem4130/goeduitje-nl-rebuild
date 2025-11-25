import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Sample testimonials based on Goeduitje's kookworkshops
const sampleReviews = [
  {
    googleReviewId: "review-1-sarah-vdberg",
    authorName: "Sarah van der Berg",
    authorPhotoUrl: null,
    rating: 5,
    text: "Een geweldige ervaring! Het team van Goeduitje heeft ons bedrijfsuitje tot een onvergetelijke dag gemaakt. De combinatie van plezier en sociale impact is uniek. De statushouders die ons begeleidden waren zo enthousiast en lieten ons de lekkerste Arabische gerechten maken.",
    relativeTime: "2 weken geleden",
    reviewTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    language: "nl",
    sortOrder: "most_relevant",
    isVisible: true,
  },
  {
    googleReviewId: "review-2-mohammed-hassan",
    authorName: "Mohammed Al-Hassan",
    authorPhotoUrl: null,
    rating: 5,
    text: "De kookworkshop was fantastisch. Niet alleen hebben we als team beter leren samenwerken, maar we weten ook dat we tegelijkertijd iets goeds hebben gedaan voor mensen in nood. Heel mooi concept!",
    relativeTime: "3 weken geleden",
    reviewTime: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    language: "nl",
    sortOrder: "most_relevant",
    isVisible: true,
  },
  {
    googleReviewId: "review-3-lisa-devries",
    authorName: "Lisa de Vries",
    authorPhotoUrl: null,
    rating: 5,
    text: "Onze collega's praten er nog steeds over! Een perfecte teambuilding activiteit met een sociale twist. De gerechten waren verrassend lekker en we hebben veel geleerd over de Arabische keuken.",
    relativeTime: "1 maand geleden",
    reviewTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    language: "nl",
    sortOrder: "most_relevant",
    isVisible: true,
  },
  {
    googleReviewId: "review-4-jasper-winters",
    authorName: "Jasper Winters",
    authorPhotoUrl: null,
    rating: 5,
    text: "Goeduitje denkt echt met je mee. Van begin tot eind was alles perfect geregeld. De sociale impact maakt het extra bijzonder. Ons hele team was enthousiast, zelfs de collega's die normaal niet van koken houden.",
    relativeTime: "1 maand geleden",
    reviewTime: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    language: "nl",
    sortOrder: "most_relevant",
    isVisible: true,
  },
  {
    googleReviewId: "review-5-anna-jansen",
    authorName: "Anna Jansen",
    authorPhotoUrl: null,
    rating: 5,
    text: "We hebben met het team genoten van de Arabische kookworkshop. De koks waren zo gastvrij en deelden niet alleen recepten maar ook verhalen uit hun thuisland. Een bijzondere en leerzame ervaring!",
    relativeTime: "2 maanden geleden",
    reviewTime: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    language: "nl",
    sortOrder: "newest",
    isVisible: true,
  },
  {
    googleReviewId: "review-6-peter-bakker",
    authorName: "Peter Bakker",
    authorPhotoUrl: null,
    rating: 5,
    text: "Uitstekend georganiseerd bedrijfsuitje. De locatie was prachtig, de sfeer ontspannen en het eten heerlijk. Fijn om te zien hoe onze deelname bijdraagt aan de integratie van statushouders.",
    relativeTime: "2 maanden geleden",
    reviewTime: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
    language: "nl",
    sortOrder: "newest",
    isVisible: true,
  },
  {
    googleReviewId: "review-7-emma-smit",
    authorName: "Emma Smit",
    authorPhotoUrl: null,
    rating: 4,
    text: "Leuke workshop! Het eten was heerlijk en de begeleiding was top. Enige minpuntje was dat we iets te weinig tijd hadden, maar voor de rest een aanrader.",
    relativeTime: "2 maanden geleden",
    reviewTime: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
    language: "nl",
    sortOrder: "newest",
    isVisible: true,
  },
  {
    googleReviewId: "review-8-jan-kuiper",
    authorName: "Jan Kuiper",
    authorPhotoUrl: null,
    rating: 5,
    text: "Wat een feest! Als HR-manager zoek ik altijd naar teamactiviteiten met betekenis. Deze kookworkshop was precies dat: gezellig, leerzaam en maatschappelijk relevant. Volgend jaar weer!",
    relativeTime: "3 maanden geleden",
    reviewTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    language: "nl",
    sortOrder: "most_relevant",
    isVisible: true,
  },
  {
    googleReviewId: "review-9-marieke-dejong",
    authorName: "Marieke de Jong",
    authorPhotoUrl: null,
    rating: 5,
    text: "De vegetarische workshop was een schot in de roos. Alle collega's, of ze nu vegetarier zijn of niet, waren onder de indruk van de smaken. De koks legden geduldig alles uit en deelden hun persoonlijke verhalen.",
    relativeTime: "3 maanden geleden",
    reviewTime: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    language: "nl",
    sortOrder: "newest",
    isVisible: true,
  },
  {
    googleReviewId: "review-10-thomas-vandam",
    authorName: "Thomas van Dam",
    authorPhotoUrl: null,
    rating: 5,
    text: "Professioneel, hartelijk en smaakvol. Goeduitje levert kwaliteit en doet dat met een goed hart. Onze klanten waren onder de indruk toen we hen meenamen naar deze workshop.",
    relativeTime: "4 maanden geleden",
    reviewTime: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    language: "nl",
    sortOrder: "most_relevant",
    isVisible: true,
  },
];

async function main() {
  console.log("Seeding database with sample reviews...");

  // Upsert each review
  for (const review of sampleReviews) {
    await prisma.googleReview.upsert({
      where: { googleReviewId: review.googleReviewId },
      update: {
        ...review,
        fetchedAt: new Date(),
        lastSeenAt: new Date(),
      },
      create: {
        ...review,
        fetchedAt: new Date(),
        lastSeenAt: new Date(),
      },
    });
    console.log(`  Added review from ${review.authorName}`);
  }

  // Create cache metadata
  await prisma.googleReviewsCache.upsert({
    where: { id: "singleton" },
    update: {
      placeName: "Goeduitje - Kookworkshops",
      averageRating: 4.9,
      totalReviewCount: sampleReviews.length,
      lastFetchedAt: new Date(),
      fetchErrorCount: 0,
      lastErrorMessage: null,
    },
    create: {
      id: "singleton",
      placeId: "manual-seed",
      placeName: "Goeduitje - Kookworkshops",
      averageRating: 4.9,
      totalReviewCount: sampleReviews.length,
      lastFetchedAt: new Date(),
      fetchErrorCount: 0,
    },
  });

  console.log(`\nSeeded ${sampleReviews.length} reviews successfully!`);
  console.log("Visit /jullie-ervaringen to see the reviews page.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
