import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const prismaSchemaPath = join(process.cwd(), "prisma/schema.prisma");
const drizzleSchemaPath = join(
  process.cwd(),
  "../goeduitje-backend/src/db/schema.ts"
);

const backendAvailable = existsSync(drizzleSchemaPath);

const prismaSchema = readFileSync(prismaSchemaPath, "utf-8");
const drizzleSchema = backendAvailable
  ? readFileSync(drizzleSchemaPath, "utf-8")
  : "";

describe.skipIf(!backendAvailable)(
  "Backend Drizzle schema sync with frontend Prisma schema",
  () => {
  const sharedTables: Array<{
    prismaModel: string;
    drizzleExport: string;
    drizzleTable: string;
  }> = [
    {
      prismaModel: "Feedback",
      drizzleExport: "contactFeedback",
      drizzleTable: "Feedback",
    },
    {
      prismaModel: "GoogleReview",
      drizzleExport: "googleReview",
      drizzleTable: "GoogleReview",
    },
    {
      prismaModel: "TeamMember",
      drizzleExport: "teamMember",
      drizzleTable: "TeamMember",
    },
    { prismaModel: "Recipe", drizzleExport: "recipe", drizzleTable: "Recipe" },
    {
      prismaModel: "Workshop",
      drizzleExport: "workshop",
      drizzleTable: "Workshop",
    },
    {
      prismaModel: "PriceTier",
      drizzleExport: "priceTier",
      drizzleTable: "PriceTier",
    },
    { prismaModel: "FAQ", drizzleExport: "faq", drizzleTable: "FAQ" },
    {
      prismaModel: "PageContent",
      drizzleExport: "pageContent",
      drizzleTable: "PageContent",
    },
  ];

  for (const { prismaModel, drizzleExport, drizzleTable } of sharedTables) {
    it(`backend has Drizzle table for ${prismaModel} (exported as '${drizzleExport}')`, () => {
      // Verify Prisma has the model
      expect(prismaSchema).toMatch(
        new RegExp(`model\\s+${prismaModel}\\s*\\{`)
      );

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

  it("backend Drizzle schema has companyName column in workshopConfig", () => {
    // Extract from workshopConfig export to the next export
    const wcMatch = drizzleSchema.match(
      /export const workshopConfig\s*=[\s\S]*?(?=\nexport )/
    );
    const wcBlock = wcMatch?.[0] ?? "";
    expect(wcBlock).toContain("companyName");
  });

  it("backend Drizzle schema has btwNumber column in workshopConfig", () => {
    const wcMatch = drizzleSchema.match(
      /export const workshopConfig\s*=[\s\S]*?(?=\nexport )/
    );
    const wcBlock = wcMatch?.[0] ?? "";
    expect(wcBlock).toContain("btwNumber");
  });

  it("backend Drizzle schema has structured feedback fields", () => {
    // The contactFeedback table maps to Feedback
    const fbMatch = drizzleSchema.match(
      /export const contactFeedback\s*=[\s\S]*?\}\)/
    );
    const fbBlock = fbMatch?.[0] ?? "";
    const fields = [
      "firstName",
      "lastName",
      "eventDate",
      "eventLocation",
      "whatWasBest",
      "whatToImprove",
    ];
    for (const field of fields) {
      expect(fbBlock).toContain(field);
    }
  });

  it("backend has Drizzle table for EmailTemplate", () => {
    expect(drizzleSchema).toContain("export const emailTemplate");
    expect(drizzleSchema).toContain("'EmailTemplate'");
  });

  it("backend has Drizzle table for EmailLog", () => {
    expect(drizzleSchema).toContain("export const emailLog");
    expect(drizzleSchema).toContain("'EmailLog'");
  });

  it("EmailTemplate Drizzle schema has key, name, subject, body, isActive columns", () => {
    const etMatch = drizzleSchema.match(
      /export const emailTemplate\s*=[\s\S]*?\}\)/
    );
    const etBlock = etMatch?.[0] ?? "";
    for (const col of ["key", "name", "subject", "body", "isActive"]) {
      expect(etBlock).toContain(col);
    }
  });

  it("EmailLog Drizzle schema has templateKey, to, subject, body, variables, status columns", () => {
    const elMatch = drizzleSchema.match(
      /export const emailLog\s*=[\s\S]*?\}\)/
    );
    const elBlock = elMatch?.[0] ?? "";
    for (const col of [
      "templateKey",
      "to",
      "subject",
      "body",
      "variables",
      "status",
    ]) {
      expect(elBlock).toContain(col);
    }
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
  },
);
