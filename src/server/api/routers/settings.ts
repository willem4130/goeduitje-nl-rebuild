import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

// Default settings to initialize
const DEFAULT_SETTINGS = {
  siteName: "Goeduitje.nl",
  siteDescription: "Unieke bedrijfsuitjes met sociale impact",
  contactEmail: "info@goeduitje.nl",
  maintenanceMode: "false",
  allowRegistration: "true",
};

export const settingsRouter = createTRPCRouter({
  // Get all settings
  getAll: publicProcedure.query(async () => {
    const settings = await prisma.siteSetting.findMany();

    // Convert to key-value object
    const settingsMap: Record<string, string> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }

    // Merge with defaults
    return { ...DEFAULT_SETTINGS, ...settingsMap };
  }),

  // Get single setting
  get: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: input.key },
      });
      return (
        setting?.value ??
        DEFAULT_SETTINGS[input.key as keyof typeof DEFAULT_SETTINGS] ??
        null
      );
    }),

  // Update single setting
  update: publicProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
        type: z.enum(["text", "boolean", "number", "json"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.siteSetting.upsert({
        where: { key: input.key },
        update: { value: input.value },
        create: {
          key: input.key,
          value: input.value,
          type: input.type ?? "text",
        },
      });
    }),

  // Update multiple settings at once
  updateMany: publicProcedure
    .input(
      z.object({
        siteName: z.string().min(2),
        siteDescription: z.string().min(10),
        contactEmail: z.string().email(),
        maintenanceMode: z.boolean(),
        allowRegistration: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const updates = [
        { key: "siteName", value: input.siteName, type: "text" },
        {
          key: "siteDescription",
          value: input.siteDescription,
          type: "text",
        },
        { key: "contactEmail", value: input.contactEmail, type: "text" },
        {
          key: "maintenanceMode",
          value: String(input.maintenanceMode),
          type: "boolean",
        },
        {
          key: "allowRegistration",
          value: String(input.allowRegistration),
          type: "boolean",
        },
      ];

      // Upsert all settings
      await Promise.all(
        updates.map((setting) =>
          prisma.siteSetting.upsert({
            where: { key: setting.key },
            update: { value: setting.value },
            create: setting,
          })
        )
      );

      return { success: true };
    }),
});
