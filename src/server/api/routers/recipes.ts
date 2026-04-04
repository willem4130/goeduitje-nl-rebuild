import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const recipeInputSchema = z.object({
  title: z.string().min(1, "Titel is verplicht"),
  slug: z.string().min(1, "Slug is verplicht"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  prepTime: z.number().int().positive().optional(),
  cookTime: z.number().int().positive().optional(),
  servings: z.number().int().positive().optional(),
  difficulty: z.string().optional(),
  category: z.string().optional(),
  ingredients: z.array(z.string()).default([]),
  steps: z.array(z.string()).default([]),
  tips: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const recipesRouter = createTRPCRouter({
  /**
   * Get all recipes (for admin, includes unpublished)
   */
  getAll: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          difficulty: z.string().optional(),
          search: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
          includeUnpublished: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const {
        category,
        difficulty,
        search,
        limit = 50,
        includeUnpublished,
      } = input ?? {};

      const recipes = await prisma.recipe.findMany({
        where: {
          ...(includeUnpublished ? {} : { isPublished: true }),
          ...(category && { category }),
          ...(difficulty && { difficulty }),
          ...(search && {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return recipes;
    }),

  /**
   * Get a single recipe by slug
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const recipe = await prisma.recipe.findUnique({
        where: { slug: input.slug, isPublished: true },
      });

      return recipe;
    }),

  /**
   * Get a single recipe by ID (for admin editing)
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.recipe.findUnique({
        where: { id: input.id },
      });
    }),

  /**
   * Get all unique categories in the correct order
   */
  getCategories: publicProcedure.query(async () => {
    const recipes = await prisma.recipe.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ["category"],
    });

    const categories = recipes
      .map((r) => r.category)
      .filter((c): c is string => c !== null);

    // Define the correct order for course types (matching goeduitje.nl)
    const categoryOrder = [
      "Voorgerecht",
      "Hoofdgerecht",
      "Bijgerecht",
      "Dessert",
    ];

    // Sort by the defined order
    return categories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }),

  /**
   * Get recipe count by category
   */
  getStats: publicProcedure.query(async () => {
    const [total, byCategory, byDifficulty] = await Promise.all([
      prisma.recipe.count({ where: { isPublished: true } }),
      prisma.recipe.groupBy({
        by: ["category"],
        where: { isPublished: true },
        _count: { id: true },
      }),
      prisma.recipe.groupBy({
        by: ["difficulty"],
        where: { isPublished: true },
        _count: { id: true },
      }),
    ]);

    return {
      total,
      byCategory: Object.fromEntries(
        byCategory.map((c) => [c.category, c._count.id])
      ),
      byDifficulty: Object.fromEntries(
        byDifficulty.map((d) => [d.difficulty, d._count.id])
      ),
    };
  }),

  /**
   * Create a new recipe
   */
  create: protectedProcedure
    .input(recipeInputSchema)
    .mutation(async ({ input }) => {
      return await prisma.recipe.create({
        data: {
          title: input.title,
          slug: input.slug,
          description: input.description,
          imageUrl: input.imageUrl,
          prepTime: input.prepTime,
          cookTime: input.cookTime,
          servings: input.servings,
          difficulty: input.difficulty,
          category: input.category,
          ingredients: input.ingredients,
          steps: input.steps,
          tips: input.tips,
          isPublished: input.isPublished ?? true,
        },
      });
    }),

  /**
   * Update a recipe
   */
  update: protectedProcedure
    .input(z.object({ id: z.string() }).merge(recipeInputSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.recipe.update({
        where: { id },
        data,
      });
    }),

  /**
   * Delete a recipe
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.recipe.delete({ where: { id: input.id } });
      return { success: true };
    }),

  /**
   * Toggle publish status
   */
  togglePublish: protectedProcedure
    .input(z.object({ id: z.string(), isPublished: z.boolean() }))
    .mutation(async ({ input }) => {
      return await prisma.recipe.update({
        where: { id: input.id },
        data: { isPublished: input.isPublished },
      });
    }),
});
