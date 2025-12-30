import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const faqInputSchema = z.object({
  question: z.string().min(1, "Vraag is verplicht"),
  answer: z.string().min(1, "Antwoord is verplicht"),
  category: z.string().min(1, "Categorie is verplicht"),
  sortOrder: z.number().optional(),
  isPublished: z.boolean().optional(),
});

export const faqRouter = createTRPCRouter({
  // Get all FAQs (for admin)
  getAll: publicProcedure
    .input(z.object({ includeUnpublished: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      const includeUnpublished = input?.includeUnpublished ?? false;
      return await prisma.fAQ.findMany({
        where: includeUnpublished ? {} : { isPublished: true },
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      });
    }),

  // Get FAQs by category
  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return await prisma.fAQ.findMany({
        where: { category: input.category, isPublished: true },
        orderBy: { sortOrder: "asc" },
      });
    }),

  // Get unique categories
  getCategories: publicProcedure.query(async () => {
    const faqs = await prisma.fAQ.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ["category"],
    });
    return faqs.map((f) => f.category);
  }),

  // Create FAQ
  create: publicProcedure.input(faqInputSchema).mutation(async ({ input }) => {
    return await prisma.fAQ.create({
      data: {
        question: input.question,
        answer: input.answer,
        category: input.category,
        sortOrder: input.sortOrder ?? 0,
        isPublished: input.isPublished ?? true,
      },
    });
  }),

  // Update FAQ
  update: publicProcedure
    .input(z.object({ id: z.string() }).merge(faqInputSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.fAQ.update({
        where: { id },
        data,
      });
    }),

  // Delete FAQ
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.fAQ.delete({ where: { id: input.id } });
      return { success: true };
    }),

  // Reorder FAQs
  reorder: publicProcedure
    .input(z.array(z.object({ id: z.string(), sortOrder: z.number() })))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.map(({ id, sortOrder }) =>
          prisma.fAQ.update({
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
      return await prisma.fAQ.update({
        where: { id: input.id },
        data: { isPublished: input.isPublished },
      });
    }),
});
