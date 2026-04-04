/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({
  headers: new Headers({ "x-api-secret": "test-api-secret" }),
} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("workshop.togglePublish", () => {
  it("toggles publish status", async () => {
    vi.mocked(prisma.workshop.update).mockResolvedValue({
      id: "w1",
      isPublished: false,
    } as any);
    const result = await caller.workshop.togglePublish({
      id: "w1",
      isPublished: false,
    });
    expect(result.isPublished).toBe(false);
    expect(prisma.workshop.update).toHaveBeenCalledWith({
      where: { id: "w1" },
      data: { isPublished: false },
    });
  });
});

describe("workshop.delete", () => {
  it("deletes a workshop", async () => {
    vi.mocked(prisma.workshop.delete).mockResolvedValue({} as any);
    const result = await caller.workshop.delete({ id: "w1" });
    expect(result).toEqual({ success: true });
    expect(prisma.workshop.delete).toHaveBeenCalledWith({
      where: { id: "w1" },
    });
  });
});

describe("workshop.getById", () => {
  it("returns workshop with price tiers and variants", async () => {
    const mockWorkshop = {
      id: "w1",
      slug: "kookworkshop",
      title: "Kookworkshop",
      priceTiers: [{ id: "pt1" }],
      variants: [{ id: "v1", priceTiers: [] }],
    };
    vi.mocked(prisma.workshop.findUnique).mockResolvedValue(
      mockWorkshop as any
    );
    const result = await caller.workshop.getById({ id: "w1" });
    expect(result).toEqual(mockWorkshop);
    expect(prisma.workshop.findUnique).toHaveBeenCalledWith({
      where: { id: "w1" },
      include: expect.objectContaining({
        priceTiers: expect.any(Object),
        variants: expect.any(Object),
      }),
    });
  });
});

describe("workshop.createWorkshop", () => {
  it("creates a workshop with nested price tiers and variants", async () => {
    const input = {
      slug: "new-workshop",
      title: "New Workshop",
      subtitle: "A new workshop",
      description: "Description",
      duration: "2 uur",
      groupSize: "8-20",
      location: "Nijmegen",
      categories: ["cooking"],
      includes: ["ingredients"],
      isPublished: true,
      sortOrder: 0,
      longDescription: null,
      image: null,
      video: null,
      priceTiers: [
        {
          groupSize: "8-10",
          minParticipants: 8,
          maxParticipants: 10,
          priceExclBtw: 70,
          priceInclBtw: 85,
          sortOrder: 0,
        },
      ],
      variants: [
        {
          name: "Basic",
          description: "Basic variant",
          duration: "2 uur",
          includes: ["stuff"],
          sortOrder: 0,
          priceTiers: [
            {
              groupSize: "8-10",
              minParticipants: 8,
              maxParticipants: 10,
              priceExclBtw: 50,
              priceInclBtw: 60,
              sortOrder: 0,
            },
          ],
        },
      ],
    };

    vi.mocked(prisma.workshop.create).mockResolvedValue({
      id: "w-new",
      ...input,
    } as any);
    const result = await caller.workshop.createWorkshop(input);
    expect(result).toBeDefined();
    expect(prisma.workshop.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "new-workshop",
          title: "New Workshop",
          priceTiers: expect.objectContaining({
            create: expect.any(Array),
          }),
          variants: expect.objectContaining({
            create: expect.any(Array),
          }),
        }),
      })
    );
  });
});

describe("workshop.updateWorkshop", () => {
  it("deletes old and recreates price tiers and variants", async () => {
    const input = {
      id: "w1",
      slug: "updated-workshop",
      title: "Updated Workshop",
      subtitle: "Updated subtitle",
      description: "Updated desc",
      longDescription: null,
      image: null,
      video: null,
      duration: "3 uur",
      groupSize: "10-30",
      location: "Arnhem",
      categories: ["cooking"],
      includes: ["more stuff"],
      isPublished: true,
      sortOrder: 1,
      priceTiers: [
        {
          groupSize: "10-15",
          minParticipants: 10,
          maxParticipants: 15,
          priceExclBtw: 60,
          priceInclBtw: 73,
          sortOrder: 0,
        },
      ],
      variants: [],
    };

    vi.mocked(prisma.priceTier.deleteMany).mockResolvedValue({
      count: 1,
    } as any);
    vi.mocked(prisma.workshopVariant.deleteMany).mockResolvedValue({
      count: 0,
    } as any);
    vi.mocked(prisma.workshop.update).mockResolvedValue({
      ...input,
      id: "w1",
    } as any);

    const result = await caller.workshop.updateWorkshop(input);
    expect(result).toBeDefined();
    // Verify old data deleted first
    expect(prisma.priceTier.deleteMany).toHaveBeenCalledWith({
      where: { workshopId: "w1", variantId: null },
    });
    expect(prisma.workshopVariant.deleteMany).toHaveBeenCalledWith({
      where: { workshopId: "w1" },
    });
    // Then update called
    expect(prisma.workshop.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "w1" },
      })
    );
  });
});

describe("workshop.create with TBD dates", () => {
  beforeEach(() => {
    vi.mocked(prisma.workshop.findMany).mockResolvedValue([
      { id: "kookworkshop", title: "Kookworkshop" } as any,
    ]);
    vi.mocked(prisma.workshopRequest.create).mockResolvedValue({
      id: 1,
    } as any);
  });

  it("stores TBD when dateTbd=true", async () => {
    vi.mocked(prisma.workshopConfig.create).mockResolvedValue({
      id: "c1",
      date: "TBD",
      time: "TBD",
    } as any);

    await caller.workshop.create({
      type: "particulier",
      participantCount: 10,
      workshops: ["kookworkshop"],
      location: "Nijmegen",
      dateTbd: true,
      timeTbd: true,
      name: "Test",
      email: "test@test.nl",
      phone: "0612345678",
    });

    expect(prisma.workshopConfig.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        date: "TBD",
        time: "TBD",
      }),
    });
  });

  it("stores customCity when location=other", async () => {
    vi.mocked(prisma.workshopConfig.create).mockResolvedValue({
      id: "c1",
    } as any);
    await caller.workshop.create({
      type: "particulier",
      participantCount: 10,
      workshops: ["kookworkshop"],
      location: "other",
      customCity: "Eindhoven",
      date: "2026-06-01",
      dateTbd: false,
      time: "14:00",
      timeTbd: false,
      name: "Test",
      email: "test@test.nl",
      phone: "0612345678",
    });

    expect(prisma.workshopConfig.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        location: "other",
        customCity: "Eindhoven",
      }),
    });
  });
});
