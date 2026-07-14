import { describe, it, expect } from "vitest";
import {
  OPEN_WORKSHOP_PRICE,
  cuisineLabel,
  cuisineLabelShort,
} from "@/lib/open-workshops";
import type { OpenWorkshop } from "@/lib/open-workshops";

describe("OPEN_WORKSHOP_PRICE", () => {
  it("equals 60", () => {
    expect(OPEN_WORKSHOP_PRICE).toBe(60);
  });
});

describe("OpenWorkshop type", () => {
  it("can create a valid OpenWorkshop object", () => {
    const workshop: OpenWorkshop = {
      id: "test-id",
      date: "2026-04-01",
      dateDisplay: "Woensdag 1 april",
      dayName: "WO",
      dayNumber: "1",
      month: "APR",
      time: "14:00 - 16:30",
      availableSeats: 10,
      maxCapacity: 12,
      location: "Nijmegen",
      cuisine: "arabisch",
      pricePerPerson: 60,
      isFull: false,
    };

    expect(workshop.id).toBe("test-id");
    expect(workshop.maxCapacity).toBe(12);
    expect(workshop.pricePerPerson).toBe(60);
  });
});

describe("cuisine labels", () => {
  it("maps known cuisines to full and short labels", () => {
    expect(cuisineLabel("arabisch")).toBe("Arabische keuken");
    expect(cuisineLabel("perzisch")).toBe("Perzische keuken");
    expect(cuisineLabelShort("arabisch")).toBe("Arabisch");
    expect(cuisineLabelShort("perzisch")).toBe("Perzisch");
  });

  it("falls back to the raw value for unknown cuisines", () => {
    expect(cuisineLabel("italiaans")).toBe("italiaans");
    expect(cuisineLabelShort("italiaans")).toBe("italiaans");
  });
});
