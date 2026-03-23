/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("workshop.create", () => {
  beforeEach(() => {
    // Mock workshop name resolution (needed for dual-write)
    vi.mocked(prisma.workshop.findMany).mockResolvedValue([
      { id: "kookworkshop", title: "Kookworkshop" } as any,
      { id: "stadsspel", title: "Stadsspel" } as any,
    ]);
    // Mock workshopRequest.create (dual-write target)
    vi.mocked(prisma.workshopRequest.create).mockResolvedValue({
      id: 1,
    } as any);
  });

  it("creates a workshop config with all fields including phone", async () => {
    const input = {
      type: "particulier" as const,
      participantCount: 10,
      workshops: ["kookworkshop"],
      location: "Nijmegen" as const,
      date: "2025-06-15",
      dateTbd: false,
      time: "14:00",
      timeTbd: false,
      duration: 3,
      name: "Jan Jansen",
      email: "jan@example.com",
      phone: "0612345678",
    };

    const mockResult = {
      id: "config-1",
      ...input,
      customCity: null,
      companyName: null,
      btwNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.workshopConfig.create).mockResolvedValue(
      mockResult as any
    );

    const result = await caller.workshop.create(input);

    expect(result).toEqual(mockResult);
    expect(prisma.workshopConfig.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: "particulier",
        participantCount: 10,
        name: "Jan Jansen",
        email: "jan@example.com",
        phone: "0612345678",
      }),
    });
    // Verify dual-write to workshopRequest
    expect(prisma.workshopRequest.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        source: "configurator",
        configId: "config-1",
        contactName: "Jan Jansen",
        email: "jan@example.com",
      }),
    });
  });

  it("saves companyName and btwNumber when provided (zakelijk type)", async () => {
    const input = {
      type: "zakelijk" as const,
      participantCount: 15,
      workshops: ["kookworkshop"],
      location: "Arnhem" as const,
      date: "2025-07-20",
      dateTbd: false,
      time: "10:00",
      timeTbd: false,
      duration: 4,
      name: "Piet Bakker",
      email: "piet@bedrijf.nl",
      phone: "0687654321",
      companyName: "Bakker BV",
      btwNumber: "NL123456789B01",
    };

    const mockResult = {
      id: "config-2",
      ...input,
      customCity: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.workshopConfig.create).mockResolvedValue(
      mockResult as any
    );

    const result = await caller.workshop.create(input);

    expect(result).toEqual(mockResult);
    expect(prisma.workshopConfig.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: "zakelijk",
        companyName: "Bakker BV",
        btwNumber: "NL123456789B01",
        name: "Piet Bakker",
        email: "piet@bedrijf.nl",
      }),
    });
    // Verify dual-write includes organization from companyName
    expect(prisma.workshopRequest.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        organization: "Bakker BV",
        source: "configurator",
      }),
    });
  });

  it("saves companyName: null and btwNumber: null when not provided (particulier type)", async () => {
    const input = {
      type: "particulier" as const,
      participantCount: 8,
      workshops: ["stadsspel"],
      location: "Nijmegen" as const,
      date: "2025-08-10",
      dateTbd: false,
      time: "15:00",
      timeTbd: false,
      duration: 2,
      name: "Marie de Vries",
      email: "marie@example.com",
      phone: "0698765432",
    };

    const mockResult = {
      id: "config-3",
      ...input,
      customCity: null,
      companyName: null,
      btwNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.workshopConfig.create).mockResolvedValue(
      mockResult as any
    );

    await caller.workshop.create(input);

    expect(prisma.workshopConfig.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        companyName: null,
        btwNumber: null,
      }),
    });
    // Verify dual-write with null organization
    expect(prisma.workshopRequest.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        organization: null,
        activityType: "Stadsspel",
      }),
    });
  });
});

describe("workshop.getConfigs", () => {
  it("returns list ordered by createdAt desc", async () => {
    const mockConfigs = [
      { id: "c2", type: "zakelijk", createdAt: new Date("2025-02-01") },
      { id: "c1", type: "particulier", createdAt: new Date("2025-01-01") },
    ];

    vi.mocked(prisma.workshopConfig.findMany).mockResolvedValue(
      mockConfigs as any
    );

    const result = await caller.workshop.getConfigs();

    expect(result).toEqual(mockConfigs);
    expect(prisma.workshopConfig.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
  });
});

describe("workshop.getConfigById", () => {
  it("returns config by ID", async () => {
    const mockConfig = { id: "config-1", type: "particulier", name: "Jan" };
    vi.mocked(prisma.workshopConfig.findUnique).mockResolvedValue(
      mockConfig as any
    );

    const result = await caller.workshop.getConfigById({ id: "config-1" });

    expect(result).toEqual(mockConfig);
    expect(prisma.workshopConfig.findUnique).toHaveBeenCalledWith({
      where: { id: "config-1" },
    });
  });

  it("returns null for nonexistent ID", async () => {
    vi.mocked(prisma.workshopConfig.findUnique).mockResolvedValue(null);

    const result = await caller.workshop.getConfigById({ id: "nonexistent" });

    expect(result).toBeNull();
  });
});

describe("workshop.list", () => {
  const mockWorkshops = [
    {
      id: "w1",
      name: "Kookworkshop",
      isPublished: true,
      priceTiers: [{ id: "pt1", priceInclBtw: 50 }],
      variants: [{ id: "v1", name: "Basic", priceTiers: [] }],
    },
  ];

  it("returns published workshops with price tiers and variants", async () => {
    vi.mocked(prisma.workshop.findMany).mockResolvedValue(mockWorkshops as any);

    const result = await caller.workshop.list();

    expect(result).toEqual(mockWorkshops);
    expect(prisma.workshop.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isPublished: true },
        include: expect.objectContaining({
          priceTiers: expect.any(Object),
          variants: expect.any(Object),
        }),
      })
    );
  });

  it("returns all workshops when includeUnpublished=true", async () => {
    vi.mocked(prisma.workshop.findMany).mockResolvedValue(mockWorkshops as any);

    await caller.workshop.list({ includeUnpublished: true });

    expect(prisma.workshop.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });
});

describe("workshop.getBySlug", () => {
  it("returns workshop with nested relations", async () => {
    const mockWorkshop = {
      id: "w1",
      slug: "kookworkshop",
      name: "Kookworkshop",
      priceTiers: [{ id: "pt1" }],
      variants: [{ id: "v1", priceTiers: [] }],
    };

    vi.mocked(prisma.workshop.findUnique).mockResolvedValue(
      mockWorkshop as any
    );

    const result = await caller.workshop.getBySlug({ slug: "kookworkshop" });

    expect(result).toEqual(mockWorkshop);
    expect(prisma.workshop.findUnique).toHaveBeenCalledWith({
      where: { slug: "kookworkshop" },
      include: expect.objectContaining({
        priceTiers: expect.any(Object),
        variants: expect.any(Object),
      }),
    });
  });
});

describe("workshop.getPrice", () => {
  it("returns matching price tier for participant count", async () => {
    const mockTier = {
      id: "pt1",
      workshopId: "w1",
      minParticipants: 5,
      maxParticipants: 15,
      priceExclBtw: 40,
      priceInclBtw: 48.4,
    };

    vi.mocked(prisma.priceTier.findFirst).mockResolvedValue(mockTier as any);

    const result = await caller.workshop.getPrice({
      workshopId: "w1",
      participantCount: 10,
    });

    expect(result).toEqual(mockTier);
    expect(prisma.priceTier.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          workshopId: "w1",
          variantId: null,
        }),
      })
    );
  });
});
