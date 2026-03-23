import { describe, it, expect } from "vitest";
import { DUTCH_CITIES } from "@/lib/constants/cities";

describe("DUTCH_CITIES", () => {
  it("contains at least 40 entries", () => {
    expect(DUTCH_CITIES.length).toBeGreaterThanOrEqual(40);
  });

  it("contains Nijmegen, Arnhem, Amsterdam, Amersfoort", () => {
    expect(DUTCH_CITIES).toContain("Nijmegen");
    expect(DUTCH_CITIES).toContain("Arnhem");
    expect(DUTCH_CITIES).toContain("Amsterdam");
    expect(DUTCH_CITIES).toContain("Amersfoort");
  });

  it("all entries are non-empty strings", () => {
    for (const city of DUTCH_CITIES) {
      expect(typeof city).toBe("string");
      expect(city.length).toBeGreaterThan(0);
    }
  });
});

// Workshop pricing tests moved to:
// - tests/unit/api/workshop-router.test.ts (tRPC router tests)
// - tests/integration/form-to-db-flow.test.ts (end-to-end flow)
// Workshop data is now fully database-driven via Workshop + PriceTier models
