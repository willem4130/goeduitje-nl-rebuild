import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({} as unknown);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("settings.getAll", () => {
  it("returns settings merged with defaults", async () => {
    vi.mocked(prisma.siteSetting.findMany).mockResolvedValue([
      { key: "siteName", value: "Custom Name", type: "text", id: "1", updatedAt: new Date() },
    ] as unknown);
    const result = await caller.settings.getAll();
    expect(result).toEqual(expect.objectContaining({
      siteName: "Custom Name",
      siteDescription: "Unieke bedrijfsuitjes met sociale impact",
      contactEmail: "info@goeduitje.nl",
      maintenanceMode: "false",
      allowRegistration: "true",
    }));
  });

  it("returns all defaults when no settings in DB", async () => {
    vi.mocked(prisma.siteSetting.findMany).mockResolvedValue([]);
    const result = await caller.settings.getAll();
    expect(result.siteName).toBe("Goeduitje.nl");
  });
});

describe("settings.updateMany", () => {
  it("upserts all settings at once", async () => {
    vi.mocked(prisma.siteSetting.upsert).mockResolvedValue({} as unknown);
    const result = await caller.settings.updateMany({
      siteName: "Test",
      siteDescription: "Test description that is long enough",
      contactEmail: "test@test.nl",
      maintenanceMode: false,
      allowRegistration: true,
    });
    expect(result).toEqual({ success: true });
    expect(prisma.siteSetting.upsert).toHaveBeenCalledTimes(5);
    // Check boolean to string conversion
    expect(prisma.siteSetting.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: "maintenanceMode" },
        update: { value: "false" },
      })
    );
  });
});
