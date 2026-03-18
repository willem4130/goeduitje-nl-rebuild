import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const schemaPath = join(process.cwd(), "prisma/schema.prisma");
const schema = readFileSync(schemaPath, "utf-8");

describe("Prisma schema validation", () => {
  it("uses PostgreSQL as provider", () => {
    expect(schema).toContain('provider = "postgresql"');
  });

  describe("contains all required models", () => {
    const requiredModels = [
      "WorkshopConfig",
      "Feedback",
      "Workshop",
      "PriceTier",
      "WorkshopVariant",
      "Recipe",
      "TeamMember",
      "Testimonial",
      "GoogleReview",
      "google_reviews_cache",
      "FAQ",
      "PageContent",
      "SiteSetting",
      "SessionChange",
      "SessionChangeFeedback",
      "MediaGallery",
    ];

    for (const model of requiredModels) {
      it(`has model ${model}`, () => {
        const pattern = new RegExp(`model\\s+${model}\\s*\\{`);
        expect(schema).toMatch(pattern);
      });
    }
  });

  describe("WorkshopConfig model fields", () => {
    const fields = [
      "type",
      "participantCount",
      "workshops",
      "location",
      "customCity",
      "date",
      "time",
      "duration",
      "name",
      "email",
      "phone",
    ];

    // Extract the WorkshopConfig block
    const match = schema.match(/model\s+WorkshopConfig\s*\{([\s\S]*?)\n\}/);
    const block = match?.[1] ?? "";

    for (const field of fields) {
      it(`has field '${field}'`, () => {
        expect(block).toContain(field);
      });
    }
  });

  describe("Feedback model fields", () => {
    const fields = ["name", "email", "phone", "subject", "message", "rating", "isRead"];

    const match = schema.match(/model\s+Feedback\s*\{([\s\S]*?)\n\}/);
    const block = match?.[1] ?? "";

    for (const field of fields) {
      it(`has field '${field}'`, () => {
        expect(block).toContain(field);
      });
    }
  });

  describe("Workshop model fields", () => {
    const fields = [
      "slug",
      "title",
      "subtitle",
      "description",
      "duration",
      "groupSize",
      "location",
      "categories",
      "includes",
      "isPublished",
      "sortOrder",
    ];

    const match = schema.match(/model\s+Workshop\s*\{([\s\S]*?)\n\}/);
    const block = match?.[1] ?? "";

    for (const field of fields) {
      it(`has field '${field}'`, () => {
        expect(block).toContain(field);
      });
    }
  });

  describe("GoogleReview model fields", () => {
    const fields = ["googleReviewId", "authorName", "rating", "text", "isVisible"];

    const match = schema.match(/model\s+GoogleReview\s*\{([\s\S]*?)\n\}/);
    const block = match?.[1] ?? "";

    for (const field of fields) {
      it(`has field '${field}'`, () => {
        expect(block).toContain(field);
      });
    }
  });

  describe("all models have createdAt and updatedAt", () => {
    const modelsWithBoth = [
      "WorkshopConfig",
      "Feedback",
      "Workshop",
      "PriceTier",
      "WorkshopVariant",
      "Recipe",
      "TeamMember",
      "Testimonial",
      "GoogleReview",
      "FAQ",
      "SessionChange",
      "MediaGallery",
    ];

    for (const model of modelsWithBoth) {
      it(`${model} has createdAt`, () => {
        const match = schema.match(new RegExp(`model\\s+${model}\\s*\\{([\\s\\S]*?)\\n\\}`));
        const block = match?.[1] ?? "";
        expect(block).toContain("createdAt");
      });

      it(`${model} has updatedAt`, () => {
        const match = schema.match(new RegExp(`model\\s+${model}\\s*\\{([\\s\\S]*?)\\n\\}`));
        const block = match?.[1] ?? "";
        expect(block).toContain("updatedAt");
      });
    }

    // SessionChangeFeedback has createdAt only (no updatedAt)
    it("SessionChangeFeedback has createdAt", () => {
      const match = schema.match(/model\s+SessionChangeFeedback\s*\{([\s\S]*?)\n\}/);
      const block = match?.[1] ?? "";
      expect(block).toContain("createdAt");
    });

    // PageContent has updatedAt only (no createdAt)
    it("PageContent has updatedAt", () => {
      const match = schema.match(/model\s+PageContent\s*\{([\s\S]*?)\n\}/);
      const block = match?.[1] ?? "";
      expect(block).toContain("updatedAt");
    });
  });
});
