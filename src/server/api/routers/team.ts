import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const teamMemberInputSchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  role: z.string().min(1, "Rol is verplicht"),
  origin: z.string().optional(),
  bio: z.string().min(1, "Bio is verplicht"),
  quote: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().optional(),
  isPublished: z.boolean().optional(),
});

export const teamRouter = createTRPCRouter({
  // Get all team members (for admin)
  getAll: publicProcedure
    .input(z.object({ includeUnpublished: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      const includeUnpublished = input?.includeUnpublished ?? false;
      return await prisma.teamMember.findMany({
        where: includeUnpublished ? {} : { isPublished: true },
        orderBy: { sortOrder: "asc" },
      });
    }),

  // Get single team member by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.teamMember.findUnique({
        where: { id: input.id },
      });
    }),

  // Create team member
  create: publicProcedure
    .input(teamMemberInputSchema)
    .mutation(async ({ input }) => {
      return await prisma.teamMember.create({
        data: {
          name: input.name,
          role: input.role,
          origin: input.origin,
          bio: input.bio,
          quote: input.quote,
          image: input.image,
          sortOrder: input.sortOrder ?? 0,
          isPublished: input.isPublished ?? true,
        },
      });
    }),

  // Update team member
  update: publicProcedure
    .input(z.object({ id: z.string() }).merge(teamMemberInputSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.teamMember.update({
        where: { id },
        data,
      });
    }),

  // Delete team member
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.teamMember.delete({ where: { id: input.id } });
      return { success: true };
    }),

  // Reorder team members
  reorder: publicProcedure
    .input(z.array(z.object({ id: z.string(), sortOrder: z.number() })))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.map(({ id, sortOrder }) =>
          prisma.teamMember.update({
            where: { id },
            data: { sortOrder },
          })
        )
      );
      return { success: true };
    }),

  // Toggle publish status
  togglePublish: publicProcedure
    .input(z.object({ id: z.string(), isPublished: z.boolean() }))
    .mutation(async ({ input }) => {
      return await prisma.teamMember.update({
        where: { id: input.id },
        data: { isPublished: input.isPublished },
      });
    }),
});
