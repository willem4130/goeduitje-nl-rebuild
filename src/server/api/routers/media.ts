import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

// Content image categories
const contentCategory = z.enum([
  "workshop",
  "setup",
  "cooking",
  "results",
  "group",
  "food",
  "venue",
]);

// Site asset categories
const siteAssetCategory = z.enum([
  "site-hero-video",
  "site-hero-poster",
  "site-logo",
  "site-og",
]);

export const mediaRouter = createTRPCRouter({
  // Get all content media visible on website (excludes site assets)
  getAll: publicProcedure
    .input(
      z
        .object({
          category: contentCategory.optional(),
          limit: z.number().min(1).max(100).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return await prisma.mediaGallery.findMany({
        where: {
          showOnWebsite: true,
          // Exclude site assets from general content queries
          NOT: {
            category: { startsWith: "site-" },
          },
          ...(input?.category && { category: input.category }),
        },
        orderBy: { displayOrder: "asc" },
        take: input?.limit,
      });
    }),

  // Get featured media for homepage (content images only)
  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).optional() }).optional())
    .query(async ({ input }) => {
      return await prisma.mediaGallery.findMany({
        where: {
          showOnWebsite: true,
          featuredOnHomepage: true,
          NOT: {
            category: { startsWith: "site-" },
          },
        },
        orderBy: { displayOrder: "asc" },
        take: input?.limit ?? 10,
      });
    }),

  // Get media by category (content images)
  getByCategory: publicProcedure
    .input(
      z.object({
        category: contentCategory,
        limit: z.number().min(1).max(100).optional(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.mediaGallery.findMany({
        where: {
          showOnWebsite: true,
          category: input.category,
        },
        orderBy: { displayOrder: "asc" },
        take: input.limit,
      });
    }),

  // Get single media item by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await prisma.mediaGallery.findUnique({
        where: { id: input.id },
      });
    }),

  // ============================================================
  // SITE ASSETS - Hero, Logos, OG Images
  // ============================================================

  // Get a specific site asset by category (returns first match)
  // Use for: hero video, hero poster, logo, og image
  getSiteAsset: publicProcedure
    .input(
      z.object({
        category: siteAssetCategory,
        variant: z.string().optional(), // e.g., "desktop", "mobile", "nav", "footer"
      })
    )
    .query(async ({ input }) => {
      // Look for variant in tags if specified
      const where = input.variant
        ? {
            category: input.category,
            tags: { array_contains: [input.variant] },
          }
        : { category: input.category };

      return await prisma.mediaGallery.findFirst({
        where,
        orderBy: { displayOrder: "asc" },
      });
    }),

  // Get all site assets of a category (for multiple variants)
  // Use for: getting both desktop and mobile hero videos/posters
  getSiteAssets: publicProcedure
    .input(
      z.object({
        category: siteAssetCategory,
      })
    )
    .query(async ({ input }) => {
      return await prisma.mediaGallery.findMany({
        where: { category: input.category },
        orderBy: { displayOrder: "asc" },
      });
    }),

  // Get hero media (videos + posters) for hero section
  // Returns structured object with desktop/mobile variants
  getHeroMedia: publicProcedure.query(async () => {
    const [videos, posters] = await Promise.all([
      prisma.mediaGallery.findMany({
        where: { category: "site-hero-video" },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.mediaGallery.findMany({
        where: { category: "site-hero-poster" },
        orderBy: { displayOrder: "asc" },
      }),
    ]);

    // Helper to find by variant tag
    const findByVariant = (items: typeof videos, variant: string) =>
      items.find(
        (item) => item.tags && (item.tags as string[]).includes(variant)
      );

    return {
      videos: {
        desktop: findByVariant(videos, "desktop") ?? videos[0] ?? null,
        mobile: findByVariant(videos, "mobile") ?? null,
      },
      posters: {
        desktop: findByVariant(posters, "desktop") ?? posters[0] ?? null,
        mobile: findByVariant(posters, "mobile") ?? null,
      },
    };
  }),

  // Get logos for navigation and footer
  getLogos: publicProcedure.query(async () => {
    const logos = await prisma.mediaGallery.findMany({
      where: { category: "site-logo" },
      orderBy: { displayOrder: "asc" },
    });

    const findByVariant = (variant: string) =>
      logos.find(
        (item) => item.tags && (item.tags as string[]).includes(variant)
      );

    return {
      nav: findByVariant("nav") ?? logos[0] ?? null,
      footer: findByVariant("footer") ?? logos[1] ?? logos[0] ?? null,
    };
  }),
});
