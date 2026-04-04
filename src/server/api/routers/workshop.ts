import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure, rateLimitedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { workshopConfigSchema } from "@/lib/validations/forms";
import {
  createWorkshopSchema,
  updateWorkshopSchema,
} from "@/lib/validations/workshop";

export const workshopRouter = createTRPCRouter({
  // Booking configuration endpoints
  create: rateLimitedProcedure
    .input(workshopConfigSchema)
    .mutation(async ({ input }) => {
      // Resolve workshop IDs to human-readable names for the request
      const workshops = await prisma.workshop.findMany({
        where: { id: { in: input.workshops } },
        select: { id: true, title: true },
      });
      const nameMap = Object.fromEntries(workshops.map((w) => [w.id, w.title]));
      const activityDisplay = input.workshops
        .map((id) => nameMap[id] || id)
        .join(", ");

      // Build a human-readable summary for the notes field
      const summaryParts: string[] = [
        `Type: ${input.type}`,
        `${input.participantCount} deelnemers`,
      ];
      if (input.companyName) summaryParts.push(`Bedrijf: ${input.companyName}`);
      if (input.duration) summaryParts.push(`Duur: ${input.duration}u`);
      if (input.selectedVariants) {
        const variantEntries = Object.entries(
          input.selectedVariants as Record<string, string[]>
        ).filter(([, v]) => v.length > 0);
        if (variantEntries.length > 0) {
          summaryParts.push(
            `Varianten: ${variantEntries.map(([k, v]) => `${nameMap[k] || k}: ${v.join(", ")}`).join("; ")}`
          );
        }
      }

      // Dual-write: create both WorkshopConfig and WorkshopRequest in a transaction
      const workshopConfig = await prisma.$transaction(async (tx) => {
        const config = await tx.workshopConfig.create({
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
            phone: input.phone || null,
            companyName: input.companyName || null,
            btwNumber: input.btwNumber || null,
            selectedVariants: input.selectedVariants ?? undefined,
          },
        });

        // Also create a WorkshopRequest so it appears in the admin CRM pipeline
        const request = await tx.workshopRequest.create({
          data: {
            status: "leeg",
            contactName: input.name,
            email: input.email,
            phone: input.phone || null,
            organization: input.companyName || null,
            activityType: activityDisplay,
            preferredDate: input.dateTbd ? null : input.date || null,
            participants: input.participantCount,
            location:
              input.location === "other"
                ? input.customCity || input.location
                : input.location,
            source: "configurator",
            configId: config.id,
            notes: `Website configuratie: ${summaryParts.join(" | ")}`,
          },
        });

        return { ...config, requestId: request.id };
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
  togglePublish: protectedProcedure
    .input(z.object({ id: z.string(), isPublished: z.boolean() }))
    .mutation(async ({ input }) => {
      return await prisma.workshop.update({
        where: { id: input.id },
        data: { isPublished: input.isPublished },
      });
    }),

  // Admin: Delete workshop (cascades to variants and price tiers)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.workshop.delete({ where: { id: input.id } });
      return { success: true };
    }),

  // Admin: Get workshop by ID for editing
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.workshop.findUnique({
        where: { id: input.id },
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

  // Admin: Create new workshop with nested price tiers and variants
  createWorkshop: protectedProcedure
    .input(createWorkshopSchema)
    .mutation(async ({ input }) => {
      const {
        priceTiers,
        variants,
        image,
        video,
        longDescription,
        ...workshopData
      } = input;

      // Create workshop with nested data
      const workshop = await prisma.workshop.create({
        data: {
          ...workshopData,
          image: image || null,
          video: video || null,
          longDescription: longDescription || null,
          priceTiers: {
            create: priceTiers.map((tier, index) => ({
              groupSize: tier.groupSize,
              minParticipants: tier.minParticipants ?? null,
              maxParticipants: tier.maxParticipants ?? null,
              priceExclBtw: tier.priceExclBtw,
              priceInclBtw: tier.priceInclBtw,
              sortOrder: tier.sortOrder ?? index,
            })),
          },
          variants: {
            create: variants.map((variant, vIndex) => ({
              name: variant.name,
              description: variant.description,
              duration: variant.duration,
              includes: variant.includes,
              sortOrder: variant.sortOrder ?? vIndex,
              priceTiers: {
                create: variant.priceTiers.map((tier, tIndex) => ({
                  workshopId: "", // Will be set by Prisma via the relation
                  groupSize: tier.groupSize,
                  minParticipants: tier.minParticipants ?? null,
                  maxParticipants: tier.maxParticipants ?? null,
                  priceExclBtw: tier.priceExclBtw,
                  priceInclBtw: tier.priceInclBtw,
                  sortOrder: tier.sortOrder ?? tIndex,
                })),
              },
            })),
          },
        },
        include: {
          priceTiers: true,
          variants: { include: { priceTiers: true } },
        },
      });

      return workshop;
    }),

  // Admin: Update workshop with nested price tiers and variants
  updateWorkshop: protectedProcedure
    .input(updateWorkshopSchema)
    .mutation(async ({ input }) => {
      const {
        id,
        priceTiers,
        variants,
        image,
        video,
        longDescription,
        ...workshopData
      } = input;

      // Delete existing price tiers and variants (cascade handles nested price tiers)
      await prisma.priceTier.deleteMany({
        where: { workshopId: id, variantId: null },
      });
      await prisma.workshopVariant.deleteMany({
        where: { workshopId: id },
      });

      // Update workshop and recreate nested data
      const workshop = await prisma.workshop.update({
        where: { id },
        data: {
          ...workshopData,
          image: image || null,
          video: video || null,
          longDescription: longDescription || null,
          priceTiers: {
            create: priceTiers.map((tier, index) => ({
              groupSize: tier.groupSize,
              minParticipants: tier.minParticipants ?? null,
              maxParticipants: tier.maxParticipants ?? null,
              priceExclBtw: tier.priceExclBtw,
              priceInclBtw: tier.priceInclBtw,
              sortOrder: tier.sortOrder ?? index,
            })),
          },
          variants: {
            create: variants.map((variant, vIndex) => ({
              name: variant.name,
              description: variant.description,
              duration: variant.duration,
              includes: variant.includes,
              sortOrder: variant.sortOrder ?? vIndex,
              priceTiers: {
                create: variant.priceTiers.map((tier, tIndex) => ({
                  workshopId: id,
                  groupSize: tier.groupSize,
                  minParticipants: tier.minParticipants ?? null,
                  maxParticipants: tier.maxParticipants ?? null,
                  priceExclBtw: tier.priceExclBtw,
                  priceInclBtw: tier.priceInclBtw,
                  sortOrder: tier.sortOrder ?? tIndex,
                })),
              },
            })),
          },
        },
        include: {
          priceTiers: true,
          variants: { include: { priceTiers: true } },
        },
      });

      return workshop;
    }),
});
