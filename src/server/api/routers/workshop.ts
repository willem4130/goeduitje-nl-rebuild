import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { workshopConfigSchema } from "@/lib/validations/forms";

export const workshopRouter = createTRPCRouter({
  create: publicProcedure
    .input(workshopConfigSchema)
    .mutation(async ({ input }) => {
      // Process the data for database storage
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

  getAll: publicProcedure.query(async () => {
    return await prisma.workshopConfig.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.workshopConfig.findUnique({
        where: { id: input.id },
      });
    }),
});
