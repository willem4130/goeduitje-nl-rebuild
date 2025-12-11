import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const recipesRouter = createTRPCRouter({
  /**
   * Get all published recipes with optional filtering
   */
  getAll: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          difficulty: z.string().optional(),
          search: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { category, difficulty, search, limit = 50 } = input ?? {};

      const recipes = await prisma.recipe.findMany({
        where: {
          isPublished: true,
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

    // Define the correct order for course types
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
      // If category not in order array, put it at the end
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
});
