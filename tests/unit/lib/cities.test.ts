import { describe, it, expect } from "vitest";
import {
  DUTCH_CITIES,
  WORKSHOPS,
  getWorkshopPrice,
  calculateEstimatedPrice,
} from "@/lib/constants/cities";

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

describe("WORKSHOPS", () => {
  it("has 6 workshops total", () => {
    expect(WORKSHOPS).toHaveLength(6);
  });

  it("all have unique IDs matching expected set", () => {
    const ids = WORKSHOPS.map((w) => w.id);
    const expected = [
      "kookworkshop",
      "stadsspel",
      "the-game",
      "beachvolleybal",
      "koffie-thee",
      "lunch-diner",
    ];
    expect(ids).toEqual(expect.arrayContaining(expected));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all have at least one price tier", () => {
    for (const w of WORKSHOPS) {
      expect(w.priceTiers.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("all price tiers have minParticipants, priceExclBtw, priceInclBtw", () => {
    for (const w of WORKSHOPS) {
      for (const tier of w.priceTiers) {
        expect(tier).toHaveProperty("minParticipants");
        expect(tier).toHaveProperty("priceExclBtw");
        expect(tier).toHaveProperty("priceInclBtw");
      }
    }
  });

  it("kookworkshop basePrice matches lowest priceExclBtw (55)", () => {
    const kook = WORKSHOPS.find((w) => w.id === "kookworkshop")!;
    const lowestPrice = Math.min(...kook.priceTiers.map((t) => t.priceExclBtw));
    expect(kook.basePrice).toBe(lowestPrice);
    expect(kook.basePrice).toBe(55);
  });
});

describe("getWorkshopPrice", () => {
  it("kookworkshop, 8 → tier with priceExclBtw 70", () => {
    const tier = getWorkshopPrice("kookworkshop", 8);
    expect(tier).toEqual(
      expect.objectContaining({ priceExclBtw: 70, priceInclBtw: 85 })
    );
  });

  it("kookworkshop, 12 → tier with priceExclBtw 60", () => {
    const tier = getWorkshopPrice("kookworkshop", 12);
    expect(tier).toEqual(
      expect.objectContaining({ priceExclBtw: 60, priceInclBtw: 73 })
    );
  });

  it("kookworkshop, 20 → tier with priceExclBtw 55", () => {
    const tier = getWorkshopPrice("kookworkshop", 20);
    expect(tier).toEqual(
      expect.objectContaining({ priceExclBtw: 55, priceInclBtw: 67 })
    );
  });

  it("stadsspel, 15 → tier with priceExclBtw 22.5", () => {
    const tier = getWorkshopPrice("stadsspel", 15);
    expect(tier).toEqual(
      expect.objectContaining({ priceExclBtw: 22.5, priceInclBtw: 27 })
    );
  });

  it("unknown ID → null", () => {
    expect(getWorkshopPrice("unknown", 10)).toBeNull();
  });

  it("kookworkshop, 5 → returns last tier as fallback", () => {
    // participantCount 5 doesn't match any tier's range, so fallback to last tier
    const tier = getWorkshopPrice("kookworkshop", 5);
    expect(tier).toEqual(
      expect.objectContaining({ priceExclBtw: 55, priceInclBtw: 67 })
    );
  });
});

describe("calculateEstimatedPrice", () => {
  it('["kookworkshop"], 10, false → 700', () => {
    expect(calculateEstimatedPrice(["kookworkshop"], 10, false)).toBe(700);
  });

  it('["kookworkshop"], 10, true → 850', () => {
    expect(calculateEstimatedPrice(["kookworkshop"], 10, true)).toBe(850);
  });

  it('["kookworkshop", "stadsspel"], 12, false → 990', () => {
    expect(
      calculateEstimatedPrice(["kookworkshop", "stadsspel"], 12, false)
    ).toBe(990);
  });

  it("[], 10, false → 0", () => {
    expect(calculateEstimatedPrice([], 10, false)).toBe(0);
  });

  it('["unknown-workshop"], 10, false → 0', () => {
    expect(calculateEstimatedPrice(["unknown-workshop"], 10, false)).toBe(0);
  });
});
