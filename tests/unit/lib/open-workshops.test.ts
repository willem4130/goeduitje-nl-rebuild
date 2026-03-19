import { describe, it, expect, vi, afterEach } from "vitest";
import {
  OPEN_WORKSHOPS,
  OPEN_WORKSHOP_PRICE,
  getUpcomingWorkshops,
  getNextWorkshop,
} from "@/lib/open-workshops";

afterEach(() => {
  vi.useRealTimers();
});

describe("OPEN_WORKSHOPS data integrity", () => {
  it("has at least 5 workshops", () => {
    expect(OPEN_WORKSHOPS.length).toBeGreaterThanOrEqual(5);
  });

  it("all have required fields", () => {
    for (const w of OPEN_WORKSHOPS) {
      expect(w).toHaveProperty("id");
      expect(w).toHaveProperty("date");
      expect(w).toHaveProperty("dateDisplay");
      expect(w).toHaveProperty("dayName");
      expect(w).toHaveProperty("dayNumber");
      expect(w).toHaveProperty("month");
      expect(w).toHaveProperty("time");
      expect(w).toHaveProperty("availableSeats");
      expect(w).toHaveProperty("location");
    }
  });

  it("all dates match YYYY-MM-DD pattern", () => {
    for (const w of OPEN_WORKSHOPS) {
      expect(w.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("all availableSeats > 0", () => {
    for (const w of OPEN_WORKSHOPS) {
      expect(w.availableSeats).toBeGreaterThan(0);
    }
  });

  it('all locations are "Nijmegen"', () => {
    for (const w of OPEN_WORKSHOPS) {
      expect(w.location).toBe("Nijmegen");
    }
  });
});

describe("OPEN_WORKSHOP_PRICE", () => {
  it("equals 60", () => {
    expect(OPEN_WORKSHOP_PRICE).toBe(60);
  });
});

describe("getUpcomingWorkshops", () => {
  it("when date is 2025-01-01, returns all workshops", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01"));
    const upcoming = getUpcomingWorkshops();
    expect(upcoming).toHaveLength(OPEN_WORKSHOPS.length);
  });

  it("when date is 2027-01-01, returns empty array", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-01-01"));
    expect(getUpcomingWorkshops()).toHaveLength(0);
  });

  it("when date is 2026-03-01, filters out past workshops", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01"));
    const upcoming = getUpcomingWorkshops();
    // Jan 25 and Feb 22 are past, so should be filtered out
    for (const w of upcoming) {
      expect(new Date(w.date).getTime()).toBeGreaterThanOrEqual(
        new Date("2026-03-01").setHours(0, 0, 0, 0)
      );
    }
    expect(upcoming.length).toBe(
      OPEN_WORKSHOPS.filter((w) => new Date(w.date) >= new Date("2026-03-01"))
        .length
    );
  });

  it("results are in chronological order", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01"));
    const upcoming = getUpcomingWorkshops();
    for (let i = 1; i < upcoming.length; i++) {
      expect(new Date(upcoming[i].date).getTime()).toBeGreaterThanOrEqual(
        new Date(upcoming[i - 1].date).getTime()
      );
    }
  });
});

describe("getNextWorkshop", () => {
  it("when date is 2025-01-01, returns the first workshop (mrt-29-2026)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01"));
    const next = getNextWorkshop();
    expect(next).not.toBeNull();
    expect(next!.id).toBe(OPEN_WORKSHOPS[0].id);
  });

  it("when date is 2027-01-01, returns null", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-01-01"));
    expect(getNextWorkshop()).toBeNull();
  });
});
