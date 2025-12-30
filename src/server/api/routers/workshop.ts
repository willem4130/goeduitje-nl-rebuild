import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { workshopConfigSchema } from "@/lib/validations/forms";

export const workshopRouter = createTRPCRouter({
  // Booking configuration endpoints
  create: publicProcedure
    .input(workshopConfigSchema)
    .mutation(async ({ input }) => {
      const workshopConfig = await prisma.workshopConfig.create({
        data: {
          type: input.type,
          participantCount: input.participantCount,
          workshops: input.workshops,
          location: input.location,
          customCity: input.customCity || null,
          date: input.dateTbd ? "TBD" : input.date || null,
          time: input.timeTbd ? "TBD" : input.time || null,
          duration: input.duration || null,
          name: input.name,
          email: input.email,
        },
      });
      return workshopConfig;
    }),

  getConfigs: publicProcedure.query(async () => {
    return await prisma.workshopConfig.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getConfigById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.workshopConfig.findUnique({
        where: { id: input.id },
      });
    }),

  // Workshop catalog endpoints
  list: publicProcedure
    .input(z.object({ includeUnpublished: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      const includeUnpublished = input?.includeUnpublished ?? false;
      return await prisma.workshop.findMany({
        where: includeUnpublished ? {} : { isPublished: true },
        include: {
          priceTiers: {
            where: { variantId: null },
            orderBy: { sortOrder: "asc" },
          },
          variants: {
            orderBy: { sortOrder: "asc" },
            include: {
              priceTiers: { orderBy: { sortOrder: "asc" } },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      });
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await prisma.workshop.findUnique({
        where: { slug: input.slug },
        include: {
          priceTiers: {
            where: { variantId: null },
            orderBy: { sortOrder: "asc" },
          },
          variants: {
            orderBy: { sortOrder: "asc" },
            include: {
              priceTiers: { orderBy: { sortOrder: "asc" } },
            },
          },
        },
      });
    }),

  // Get price for a specific workshop and participant count
  getPrice: publicProcedure
    .input(
      z.object({
        workshopId: z.string(),
        variantId: z.string().optional(),
        participantCount: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { workshopId, variantId, participantCount } = input;

      // Find matching price tier
      const tier = await prisma.priceTier.findFirst({
        where: {
          workshopId,
          variantId: variantId ?? null,
          OR: [
            {
              minParticipants: { lte: participantCount },
              maxParticipants: { gte: participantCount },
            },
            {
              minParticipants: { lte: participantCount },
              maxParticipants: null,
            },
          ],
        },
        orderBy: { minParticipants: "desc" },
      });

      return tier;
    }),

  // Admin: Toggle workshop publish status
  togglePublish: publicProcedure
    .input(z.object({ id: z.string(), isPublished: z.boolean() }))
    .mutation(async ({ input }) => {
      return await prisma.workshop.update({
        where: { id: input.id },
        data: { isPublished: input.isPublished },
      });
    }),

  // Admin: Delete workshop (cascades to variants and price tiers)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.workshop.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
