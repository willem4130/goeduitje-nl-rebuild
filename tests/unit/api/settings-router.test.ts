import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("settings.getAll", () => {
  it("returns settings merged with defaults", async () => {
    vi.mocked(prisma.siteSetting.findMany).mockResolvedValue([
      { key: "siteName", value: "Custom Name", type: "text", id: "1", updatedAt: new Date() },
    ] as any);
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

describe("settings.get", () => {
  it("returns setting value from DB", async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue({
      key: "siteName", value: "Custom", type: "text",
    } as any);
    const result = await caller.settings.get({ key: "siteName" });
    expect(result).toBe("Custom");
  });

  it("returns default when setting not in DB", async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue(null);
    const result = await caller.settings.get({ key: "siteName" });
    expect(result).toBe("Goeduitje.nl");
  });

  it("returns null for unknown key not in defaults", async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue(null);
    const result = await caller.settings.get({ key: "unknownKey" });
    expect(result).toBeNull();
  });
});

describe("settings.update", () => {
  it("upserts a single setting", async () => {
    vi.mocked(prisma.siteSetting.upsert).mockResolvedValue({
      key: "siteName", value: "New Name", type: "text",
    } as any);
    await caller.settings.update({ key: "siteName", value: "New Name" });
    expect(prisma.siteSetting.upsert).toHaveBeenCalledWith({
      where: { key: "siteName" },
      update: { value: "New Name" },
      create: { key: "siteName", value: "New Name", type: "text" },
    });
  });

  it("supports custom type", async () => {
    vi.mocked(prisma.siteSetting.upsert).mockResolvedValue({} as any);
    await caller.settings.update({ key: "k", value: "true", type: "boolean" });
    expect(prisma.siteSetting.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: { key: "k", value: "true", type: "boolean" },
      })
    );
  });
});

describe("settings.updateMany", () => {
  it("upserts all settings at once", async () => {
    vi.mocked(prisma.siteSetting.upsert).mockResolvedValue({} as any);
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
