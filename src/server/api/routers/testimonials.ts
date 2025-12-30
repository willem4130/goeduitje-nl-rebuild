import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const testimonialInputSchema = z.object({
  quote: z.string().min(1, "Quote is verplicht"),
  author: z.string().min(1, "Auteur is verplicht"),
  role: z.string().optional(),
  company: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  image: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export const testimonialsRouter = createTRPCRouter({
  // Get all testimonials (for admin)
  getAll: publicProcedure
    .input(z.object({ includeUnpublished: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      const includeUnpublished = input?.includeUnpublished ?? false;
      return await prisma.testimonial.findMany({
        where: includeUnpublished ? {} : { isPublished: true },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Get featured testimonials
  getFeatured: publicProcedure.query(async () => {
    return await prisma.testimonial.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get single testimonial by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.testimonial.findUnique({
        where: { id: input.id },
      });
    }),

  // Create testimonial
  create: publicProcedure
    .input(testimonialInputSchema)
    .mutation(async ({ input }) => {
      return await prisma.testimonial.create({
        data: {
          quote: input.quote,
          author: input.author,
          role: input.role,
          company: input.company,
          rating: input.rating ?? 5,
          image: input.image,
          isFeatured: input.isFeatured ?? false,
          isPublished: input.isPublished ?? true,
        },
      });
    }),

  // Update testimonial
  update: publicProcedure
    .input(z.object({ id: z.string() }).merge(testimonialInputSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.testimonial.update({
        where: { id },
        data,
      });
    }),

  // Delete testimonial
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.testimonial.delete({ where: { id: input.id } });
      return { success: true };
    }),

  // Toggle publish status
  togglePublish: publicProcedure
    .input(z.object({ id: z.string(), isPublished: z.boolean() }))
    .mutation(async ({ input }) => {
      return await prisma.testimonial.update({
        where: { id: input.id },
        data: { isPublished: input.isPublished },
      });
    }),

  // Toggle featured status
  toggleFeatured: publicProcedure
    .input(z.object({ id: z.string(), isFeatured: z.boolean() }))
    .mutation(async ({ input }) => {
      return await prisma.testimonial.update({
        where: { id: input.id },
        data: { isFeatured: input.isFeatured },
      });
    }),
});
