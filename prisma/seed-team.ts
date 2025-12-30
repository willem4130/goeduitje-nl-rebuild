import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const teamData = [
  {
    name: "Ahmad",
    role: "Workshop Begeleider",
    origin: "Syrië",
    bio: "Ahmad deelt met passie de rijke culinaire tradities uit zijn thuisland. Zijn kookworkshops brengen teams samen rond heerlijke Arabische gerechten.",
    quote: "Koken verbindt mensen, ongeacht waar je vandaan komt.",
    image: "/images/team/placeholder-1.jpg",
    sortOrder: 1,
  },
  {
    name: "Fatima",
    role: "Workshop Begeleidster",
    origin: "Jemen",
    bio: "Fatima brengt de kunst van Jemenitische gastvrijheid naar elke workshop. Haar warmte en enthousiasme maken elk uitje bijzonder.",
    quote: "Samen eten is samen leven.",
    image: "/images/team/placeholder-2.jpg",
    sortOrder: 2,
  },
  {
    name: "Mohammed",
    role: "Activiteitenbegeleider",
    origin: "Palestina",
    bio: "Mohammed organiseert teambuilding activiteiten waarbij plezier en verbinding centraal staan. Zijn energie werkt aanstekelijk.",
    quote: "Sport en spel brengen mensen dichter bij elkaar.",
    image: "/images/team/placeholder-3.jpg",
    sortOrder: 3,
  },
  {
    name: "Layla",
    role: "Workshop Begeleidster",
    origin: "Syrië",
    bio: "Layla combineert creativiteit met cultuur in haar workshops. Ze deelt graag de verhalen en tradities van haar achtergrond.",
    quote: "Elke workshop is een kans om iets nieuws te leren.",
    image: "/images/team/placeholder-4.jpg",
    sortOrder: 4,
  },
  {
    name: "Hassan",
    role: "Kookworkshop Specialist",
    origin: "Irak",
    bio: "Hassan is een meester in het bereiden van traditionele Midden-Oosterse gerechten. Zijn passie voor eten is voelbaar in elke hap.",
    quote: "De beste gesprekken ontstaan aan tafel.",
    image: "/images/team/placeholder-5.jpg",
    sortOrder: 5,
  },
  {
    name: "Nour",
    role: "Workshop Begeleidster",
    origin: "Jemen",
    bio: "Nour brengt haar rijke culturele achtergrond naar elke workshop. Ze zorgt ervoor dat deelnemers zich welkom en gewaardeerd voelen.",
    quote: "Gastvrijheid is de sleutel tot verbinding.",
    image: "/images/team/placeholder-6.jpg",
    sortOrder: 6,
  },
];

async function main() {
  console.log("Seeding team members...");

  // Clear existing team data
  await prisma.teamMember.deleteMany();

  // Create team member entries
  for (const member of teamData) {
    await prisma.teamMember.create({
      data: {
        ...member,
        isPublished: true,
      },
    });
  }

  console.log(`Seeded ${teamData.length} team members`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
