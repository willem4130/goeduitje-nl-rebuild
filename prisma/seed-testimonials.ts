import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// NOTE: This seed file is intentionally empty.
// Testimonials should only come from real Google Reviews.
// Use the Google Reviews system (/api/cron/refresh-google-reviews) for real reviews.

async function main() {
  console.log("Clearing fake testimonials...");

  // Clear any existing fake testimonials
  await prisma.testimonial.deleteMany();

  console.log(
    "Fake testimonials cleared. Use Google Reviews for real testimonials."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
