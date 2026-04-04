import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const contentKeySchema = z.object({
  page: z.string(),
  section: z.string(),
  key: z.string(),
});

export const contentRouter = createTRPCRouter({
  // Get all content for a specific page
  getByPage: publicProcedure
    .input(z.object({ page: z.string() }))
    .query(async ({ input }) => {
      const content = await prisma.pageContent.findMany({
        where: { page: input.page },
      });

      // Transform to a nested object: { section: { key: value } }
      const result: Record<string, Record<string, string>> = {};
      for (const item of content) {
        if (!result[item.section]) {
          result[item.section] = {};
        }
        result[item.section][item.key] = item.value;
      }
      return result;
    }),

  // Get a specific content value
  get: publicProcedure.input(contentKeySchema).query(async ({ input }) => {
    const content = await prisma.pageContent.findUnique({
      where: {
        page_section_key: {
          page: input.page,
          section: input.section,
          key: input.key,
        },
      },
    });
    return content?.value ?? null;
  }),

  // Get all pages with their content (for admin)
  getAll: publicProcedure.query(async () => {
    const content = await prisma.pageContent.findMany({
      orderBy: [{ page: "asc" }, { section: "asc" }, { key: "asc" }],
    });

    // Group by page
    const grouped: Record<
      string,
      Array<{ section: string; key: string; value: string; type: string }>
    > = {};
    for (const item of content) {
      if (!grouped[item.page]) {
        grouped[item.page] = [];
      }
      grouped[item.page].push({
        section: item.section,
        key: item.key,
        value: item.value,
        type: item.type,
      });
    }
    return grouped;
  }),

  // Update or create content
  update: protectedProcedure
    .input(
      contentKeySchema.merge(
        z.object({
          value: z.string(),
          type: z.enum(["text", "richtext", "url"]).optional(),
        })
      )
    )
    .mutation(async ({ input }) => {
      return await prisma.pageContent.upsert({
        where: {
          page_section_key: {
            page: input.page,
            section: input.section,
            key: input.key,
          },
        },
        update: {
          value: input.value,
          type: input.type,
        },
        create: {
          page: input.page,
          section: input.section,
          key: input.key,
          value: input.value,
          type: input.type ?? "text",
        },
      });
    }),

  // Bulk update content for a page
  updateMany: protectedProcedure
    .input(
      z.object({
        page: z.string(),
        content: z.array(
          z.object({
            section: z.string(),
            key: z.string(),
            value: z.string(),
            type: z.enum(["text", "richtext", "url"]).optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const updates = input.content.map((item) =>
        prisma.pageContent.upsert({
          where: {
            page_section_key: {
              page: input.page,
              section: item.section,
              key: item.key,
            },
          },
          update: {
            value: item.value,
            type: item.type,
          },
          create: {
            page: input.page,
            section: item.section,
            key: item.key,
            value: item.value,
            type: item.type ?? "text",
          },
        })
      );
      await Promise.all(updates);
      return { success: true };
    }),

  // Delete content
  delete: protectedProcedure
    .input(contentKeySchema)
    .mutation(async ({ input }) => {
      await prisma.pageContent.delete({
        where: {
          page_section_key: {
            page: input.page,
            section: input.section,
            key: input.key,
          },
        },
      });
      return { success: true };
    }),

  // Get list of unique pages
  getPages: publicProcedure.query(async () => {
    const pages = await prisma.pageContent.findMany({
      select: { page: true },
      distinct: ["page"],
    });
    return pages.map((p) => p.page);
  }),
});
