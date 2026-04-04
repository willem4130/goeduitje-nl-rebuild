import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const userInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["user", "moderator", "admin"]).default("user"),
  bio: z.string().max(500).optional(),
});

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.user.findUnique({
        where: { id: input.id },
      });
    }),

  create: protectedProcedure.input(userInputSchema).mutation(async ({ input }) => {
    return await prisma.user.create({
      data: input,
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string() }).merge(userInputSchema))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.user.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.user.delete({
        where: { id: input.id },
      });
    }),
});
