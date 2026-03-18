import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const prismaSchemaPath = join(process.cwd(), "prisma/schema.prisma");
const drizzleSchemaPath = join(
  process.cwd(),
  "../goeduitje-backend/src/db/schema.ts"
);

const prismaSchema = readFileSync(prismaSchemaPath, "utf-8");
const drizzleSchema = readFileSync(drizzleSchemaPath, "utf-8");

describe("Backend Drizzle schema sync with frontend Prisma schema", () => {
  const sharedTables: Array<{
    prismaModel: string;
    drizzleExport: string;
    drizzleTable: string;
  }> = [
    { prismaModel: "Feedback", drizzleExport: "contactFeedback", drizzleTable: "Feedback" },
    { prismaModel: "GoogleReview", drizzleExport: "googleReview", drizzleTable: "GoogleReview" },
    { prismaModel: "TeamMember", drizzleExport: "teamMember", drizzleTable: "TeamMember" },
    { prismaModel: "Recipe", drizzleExport: "recipe", drizzleTable: "Recipe" },
    { prismaModel: "Workshop", drizzleExport: "workshop", drizzleTable: "Workshop" },
    { prismaModel: "PriceTier", drizzleExport: "priceTier", drizzleTable: "PriceTier" },
    { prismaModel: "FAQ", drizzleExport: "faq", drizzleTable: "FAQ" },
    { prismaModel: "PageContent", drizzleExport: "pageContent", drizzleTable: "PageContent" },
  ];

  for (const { prismaModel, drizzleExport, drizzleTable } of sharedTables) {
    it(`backend has Drizzle table for ${prismaModel} (exported as '${drizzleExport}')`, () => {
      // Verify Prisma has the model
      expect(prismaSchema).toMatch(new RegExp(`model\\s+${prismaModel}\\s*\\{`));

      // Verify Drizzle has the export with the correct table name
      expect(drizzleSchema).toContain(`export const ${drizzleExport}`);
      expect(drizzleSchema).toContain(`'${drizzleTable}'`);
    });
  }

  it("backend has Drizzle table for session_changes (exported as 'sessionChanges')", () => {
    expect(prismaSchema).toContain('@@map("session_changes")');
    expect(drizzleSchema).toContain("export const sessionChanges");
    expect(drizzleSchema).toContain("'session_changes'");
  });

  it("backend schema references correct table names matching Prisma", () => {
    // Verify Prisma models that map to specific table names also match in Drizzle
    // SessionChange maps to session_changes
    expect(prismaSchema).toContain('@@map("session_changes")');
    expect(drizzleSchema).toContain("pgTable('session_changes'");

    // SessionChangeFeedback maps to session_change_feedback
    expect(prismaSchema).toContain('@@map("session_change_feedback")');
    expect(drizzleSchema).toContain("pgTable('session_change_feedback'");

    // MediaGallery maps to media_gallery
    expect(prismaSchema).toContain('@@map("media_gallery")');
    expect(drizzleSchema).toContain("pgTable('media_gallery'");
  });
});
