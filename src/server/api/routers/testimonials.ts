import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const testimonialsRouter = createTRPCRouter({
  // Get featured testimonials (only used procedure)
  getFeatured: publicProcedure.query(async () => {
    return await prisma.testimonial.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
    });
  }),
});
