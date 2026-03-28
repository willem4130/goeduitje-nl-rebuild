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
