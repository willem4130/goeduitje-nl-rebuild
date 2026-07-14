import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({
  headers: new Headers({ "x-api-secret": "test-api-secret" }),
} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

const baseBookingInput = {
  firstName: "Jan",
  lastName: "Jansen",
  email: "jan@example.com",
  numberOfPeople: 4,
  totalPrice: 240,
  remainingAmount: 240,
  currency: "eur",
  paymentStatus: "paid",
};

describe("booking.create", () => {
  it("creates a booking with session using $transaction for overbooking protection", async () => {
    const input = {
      ...baseBookingInput,
      sessionId: "session-1",
    };

    const mockSession = {
      id: "session-1",
      maxCapacity: 30,
      date: new Date("2025-07-01"),
    };

    const mockBooking = {
      id: "booking-1",
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock $transaction to execute the callback with the prisma client
    vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) =>
      cb(prisma)
    );
    vi.mocked(prisma.openWorkshopSession.findUnique).mockResolvedValue(
      mockSession as any
    );
    vi.mocked(prisma.booking.aggregate).mockResolvedValue({
      _sum: { numberOfPeople: 10 },
    } as any);
    vi.mocked(prisma.booking.create).mockResolvedValue(mockBooking as any);
    vi.mocked(prisma.workshopRequest.create).mockResolvedValue({} as any);

    const result = await caller.booking.create(input);

    expect(result.success).toBe(true);
    expect(result.booking).toEqual(mockBooking);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(prisma.openWorkshopSession.findUnique).toHaveBeenCalledWith({
      where: { id: "session-1" },
    });
    expect(prisma.booking.aggregate).toHaveBeenCalledWith({
      where: {
        sessionId: "session-1",
        paymentStatus: { in: ["paid", "pending"] },
      },
      _sum: { numberOfPeople: true },
    });
  });

  it("throws PRECONDITION_FAILED when session capacity is exceeded", async () => {
    const input = {
      ...baseBookingInput,
      sessionId: "session-full",
      numberOfPeople: 5,
    };

    const mockSession = {
      id: "session-full",
      maxCapacity: 30,
      date: new Date("2025-07-01"),
    };

    vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) =>
      cb(prisma)
    );
    vi.mocked(prisma.openWorkshopSession.findUnique).mockResolvedValue(
      mockSession as any
    );
    vi.mocked(prisma.booking.aggregate).mockResolvedValue({
      _sum: { numberOfPeople: 28 },
    } as any);

    await expect(caller.booking.create(input)).rejects.toThrow(
      /plekken beschikbaar/
    );
  });

  it("throws NOT_FOUND when session does not exist", async () => {
    const input = {
      ...baseBookingInput,
      sessionId: "session-nonexistent",
    };

    vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) =>
      cb(prisma)
    );
    vi.mocked(prisma.openWorkshopSession.findUnique).mockResolvedValue(null);

    await expect(caller.booking.create(input)).rejects.toThrow(/niet gevonden/);
  });

  it("creates a booking with WorkshopRequest when no sessionId is provided", async () => {
    const input = {
      ...baseBookingInput,
    };

    const mockBooking = {
      id: "booking-2",
      ...input,
      sessionId: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) =>
      cb(prisma)
    );
    vi.mocked(prisma.booking.create).mockResolvedValue(mockBooking as any);
    vi.mocked(prisma.workshopRequest.create).mockResolvedValue({} as any);

    const result = await caller.booking.create(input);

    expect(result.success).toBe(true);
    expect(result.booking).toEqual(mockBooking);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(prisma.booking.create).toHaveBeenCalled();
    expect(prisma.workshopRequest.create).toHaveBeenCalled();
  });

  it("succeeds when session has exactly enough capacity", async () => {
    const input = {
      ...baseBookingInput,
      sessionId: "session-tight",
      numberOfPeople: 5,
    };

    const mockSession = {
      id: "session-tight",
      maxCapacity: 30,
      date: new Date("2025-07-01"),
    };

    const mockBooking = {
      id: "booking-3",
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) =>
      cb(prisma)
    );
    vi.mocked(prisma.openWorkshopSession.findUnique).mockResolvedValue(
      mockSession as any
    );
    vi.mocked(prisma.booking.aggregate).mockResolvedValue({
      _sum: { numberOfPeople: 25 },
    } as any);
    vi.mocked(prisma.booking.create).mockResolvedValue(mockBooking as any);

    const result = await caller.booking.create(input);

    expect(result.success).toBe(true);
    expect(result.booking).toEqual(mockBooking);
  });
});

describe("booking.create voucher recognition", () => {
  const sessionInput = {
    ...baseBookingInput,
    sessionId: "session-1",
  };

  const mockSession = {
    id: "session-1",
    maxCapacity: 30,
    cuisine: "perzisch",
    date: new Date("2026-07-01"),
  };

  const setupSessionMocks = () => {
    vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) =>
      cb(prisma)
    );
    vi.mocked(prisma.openWorkshopSession.findUnique).mockResolvedValue(
      mockSession as any
    );
    vi.mocked(prisma.booking.aggregate).mockResolvedValue({
      _sum: { numberOfPeople: 0 },
    } as any);
    vi.mocked(prisma.booking.create).mockResolvedValue({
      id: "booking-v1",
    } as any);
    vi.mocked(prisma.workshopRequest.create).mockResolvedValue({} as any);
  };

  it("links an active gift card and reports it as recognized", async () => {
    setupSessionMocks();
    vi.mocked(prisma.giftCard.findFirst).mockResolvedValue({
      id: "gc-1",
      code: "GU-2026-ABCDE",
      status: "active",
      valueInEuros: 240,
      expiresAt: null,
    } as any);

    const result = await caller.booking.create({
      ...sessionInput,
      voucherCode: "gu-2026-abcde",
    });

    expect(prisma.giftCard.findFirst).toHaveBeenCalledWith({
      where: { code: { equals: "gu-2026-abcde", mode: "insensitive" } },
    });
    expect(prisma.booking.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        voucherCode: "gu-2026-abcde",
        hasGiftCard: true,
        giftCardId: "gc-1",
        giftCardValue: 240,
      }),
    });
    expect(prisma.workshopRequest.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        notes: expect.stringContaining("herkend, waarde €240"),
      }),
    });
    expect(prisma.workshopRequest.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        notes: expect.stringContaining("Keuken: Perzische keuken"),
      }),
    });
    expect(result.voucher).toEqual({
      code: "gu-2026-abcde",
      recognized: true,
      valueInEuros: 240,
    });
  });

  it("stores an unknown code without blocking the signup", async () => {
    setupSessionMocks();
    vi.mocked(prisma.giftCard.findFirst).mockResolvedValue(null);

    const result = await caller.booking.create({
      ...sessionInput,
      voucherCode: "ONBEKEND-123",
    });

    expect(result.success).toBe(true);
    expect(prisma.booking.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        voucherCode: "ONBEKEND-123",
        hasGiftCard: false,
        giftCardId: undefined,
        giftCardValue: undefined,
      }),
    });
    expect(prisma.workshopRequest.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        notes: expect.stringContaining("niet herkend"),
      }),
    });
    expect(result.voucher).toEqual({
      code: "ONBEKEND-123",
      recognized: false,
      valueInEuros: null,
    });
  });

  it("does not link a gift card that is already used", async () => {
    setupSessionMocks();
    vi.mocked(prisma.giftCard.findFirst).mockResolvedValue({
      id: "gc-2",
      code: "GU-2025-USED1",
      status: "used",
      valueInEuros: 120,
      expiresAt: null,
    } as any);

    const result = await caller.booking.create({
      ...sessionInput,
      voucherCode: "GU-2025-USED1",
    });

    expect(result.success).toBe(true);
    expect(prisma.booking.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        voucherCode: "GU-2025-USED1",
        hasGiftCard: false,
      }),
    });
    expect(result.voucher?.recognized).toBe(false);
  });

  it("skips the gift card lookup when no code is entered", async () => {
    setupSessionMocks();

    const result = await caller.booking.create(sessionInput);

    expect(prisma.giftCard.findFirst).not.toHaveBeenCalled();
    expect(result.voucher).toBeNull();
  });
});

describe("booking.getAll", () => {
  it("returns bookings with default limit 50", async () => {
    const mockBookings = [
      { id: "b1", firstName: "Jan", createdAt: new Date() },
      { id: "b2", firstName: "Piet", createdAt: new Date() },
    ];

    vi.mocked(prisma.booking.findMany).mockResolvedValue(mockBookings as any);

    const result = await caller.booking.getAll();

    expect(result).toEqual(mockBookings);
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 50,
        orderBy: { createdAt: "desc" },
      })
    );
  });

  it("filters by paymentStatus when provided", async () => {
    vi.mocked(prisma.booking.findMany).mockResolvedValue([] as any);

    await caller.booking.getAll({ paymentStatus: "paid" });

    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { paymentStatus: "paid" },
      })
    );
  });
});
