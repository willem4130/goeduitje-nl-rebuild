import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const testimonialsData = [
  {
    quote:
      "Een geweldige ervaring! Het team van Goeduitje heeft ons bedrijfsuitje tot een onvergetelijke dag gemaakt. De combinatie van plezier en sociale impact is uniek.",
    author: "Sarah van der Berg",
    role: "HR Manager",
    company: "TechCorp Amsterdam",
    rating: 5,
    isFeatured: true,
  },
  {
    quote:
      "De kookworkshop was fantastisch. Niet alleen hebben we als team beter leren samenwerken, maar we weten ook dat we tegelijkertijd iets goeds hebben gedaan voor mensen in nood.",
    author: "Mohammed Al-Hassan",
    role: "Team Lead",
    company: "Design Studio Rotterdam",
    rating: 5,
    isFeatured: true,
  },
  {
    quote:
      "Het stadsspel was precies wat we nodig hadden - uitdagend, leuk en betekenisvol. Onze collega's praten er nog steeds over!",
    author: "Lisa de Vries",
    role: "Operations Director",
    company: "Sustainable Solutions",
    rating: 5,
    isFeatured: true,
  },
  {
    quote:
      "Goeduitje denkt écht met je mee. Van begin tot eind was alles perfect geregeld. De sociale impact maakt het extra bijzonder.",
    author: "Jasper Winters",
    role: "CEO",
    company: "Innovation Hub Utrecht",
    rating: 5,
    isFeatured: true,
  },
];

async function main() {
  console.log("Seeding testimonials...");

  // Clear existing testimonials data
  await prisma.testimonial.deleteMany();

  // Create testimonial entries
  for (const testimonial of testimonialsData) {
    await prisma.testimonial.create({
      data: {
        ...testimonial,
        isPublished: true,
      },
    });
  }

  console.log(`Seeded ${testimonialsData.length} testimonials`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
