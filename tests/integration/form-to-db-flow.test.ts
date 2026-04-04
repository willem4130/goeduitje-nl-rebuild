import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { createCallerFactory } from "@/server/api/trpc";
import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

const createCaller = createCallerFactory(appRouter);
const caller = createCaller({ headers: new Headers({ "x-api-secret": "test-api-secret" }) });

/* eslint-disable @typescript-eslint/no-explicit-any */
describe("Workshop Configurator → tRPC → Database flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock workshop name resolution (needed for dual-write to workshopRequest)
    vi.mocked(prisma.workshop.findMany).mockResolvedValue([
      { id: "Kookworkshop", title: "Kookworkshop" } as any,
      { id: "Stadsspel", title: "Stadsspel" } as any,
    ]);
    // Mock workshopRequest.create (dual-write target)
    vi.mocked(prisma.workshopRequest.create).mockResolvedValue({
      id: 1,
    } as any);
  });

  it("workshop.create saves all fields including phone to WorkshopConfig", async () => {
    const mockConfig = {
      id: "cfg-1",
      type: "particulier",
      participantCount: 8,
      workshops: ["Kookworkshop"],
      location: "Nijmegen",
      customCity: null,
      date: "2026-05-01",
      time: "14:00",
      duration: 3,
      name: "Jan Jansen",
      email: "jan@example.com",
      phone: "0612345678",
      companyName: null,
      btwNumber: null,
      selectedVariants: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(prisma.workshopConfig.create).mockResolvedValueOnce(mockConfig);

    const result = await caller.workshop.create({
      type: "particulier",
      participantCount: 8,
      workshops: ["Kookworkshop"],
      selectedVariants: {
        Kookworkshop: ["Arabische kookworkshop", "Vegetarische kookworkshop"],
      },
      location: "Nijmegen",
      date: "2026-05-01",
      dateTbd: false,
      time: "14:00",
      timeTbd: false,
      duration: 3,
      name: "Jan Jansen",
      email: "jan@example.com",
      phone: "0612345678",
    });

    expect(prisma.workshopConfig.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: "particulier",
        participantCount: 8,
        workshops: ["Kookworkshop"],
        location: "Nijmegen",
        name: "Jan Jansen",
        email: "jan@example.com",
        phone: "0612345678",
      }),
    });
    expect(result).toMatchObject(mockConfig);
  });

  it("stores TBD date/time when dateTbd/timeTbd are true", async () => {
    vi.mocked(prisma.workshopConfig.create).mockResolvedValueOnce({} as never);

    await caller.workshop.create({
      type: "particulier",
      participantCount: 5,
      workshops: ["Stadsspel"],
      location: "Arnhem",
      dateTbd: true,
      timeTbd: true,
      name: "Piet",
      email: "piet@example.com",
      phone: "0687654321",
    });

    expect(prisma.workshopConfig.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        date: "TBD",
        time: "TBD",
      }),
    });
  });

  it("stores customCity when location is 'other'", async () => {
    vi.mocked(prisma.workshopConfig.create).mockResolvedValueOnce({} as never);

    await caller.workshop.create({
      type: "particulier",
      participantCount: 10,
      workshops: ["Kookworkshop"],
      location: "other",
      customCity: "Rotterdam",
      date: "2026-06-15",
      dateTbd: false,
      time: "10:00",
      timeTbd: false,
      name: "Kees",
      email: "kees@example.com",
      phone: "0611223344",
    });

    expect(prisma.workshopConfig.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        location: "other",
        customCity: "Rotterdam",
      }),
    });
  });

  it("stores null for empty optional fields", async () => {
    vi.mocked(prisma.workshopConfig.create).mockResolvedValueOnce({} as never);

    await caller.workshop.create({
      type: "particulier",
      participantCount: 4,
      workshops: ["Kookworkshop"],
      location: "Nijmegen",
      dateTbd: true,
      timeTbd: true,
      name: "Anna",
      email: "anna@example.com",
      phone: "0699887766",
    });

    expect(prisma.workshopConfig.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        customCity: null,
        duration: null,
      }),
    });
  });

  it("zakelijk type requires companyName in validation", async () => {
    vi.mocked(prisma.workshopConfig.create).mockResolvedValueOnce({} as never);

    // Should fail validation: zakelijk without companyName
    await expect(
      caller.workshop.create({
        type: "zakelijk",
        participantCount: 20,
        workshops: ["Kookworkshop"],
        location: "Nijmegen",
        date: "2026-07-01",
        dateTbd: false,
        time: "09:00",
        timeTbd: false,
        name: "Bedrijf B.V.",
        email: "info@bedrijf.nl",
        phone: "0200000000",
        // missing companyName
      })
    ).rejects.toThrow();
  });

  it("workshop.create saves companyName and btwNumber for zakelijk type", async () => {
    vi.mocked(prisma.workshopConfig.create).mockResolvedValue({
      id: "cfg-2",
      type: "zakelijk",
      participantCount: 15,
      workshops: ["Kookworkshop"],
      location: "Nijmegen",
      customCity: null,
      date: "2026-08-01",
      time: "10:00",
      duration: null,
      name: "Jan Directeur",
      email: "jan@testbv.nl",
      phone: "0201234567",
      companyName: "Test BV",
      btwNumber: "NL123456789B01",
      selectedVariants: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await caller.workshop.create({
      type: "zakelijk",
      participantCount: 15,
      workshops: ["Kookworkshop"],
      location: "Nijmegen",
      date: "2026-08-01",
      dateTbd: false,
      time: "10:00",
      timeTbd: false,
      name: "Jan Directeur",
      email: "jan@testbv.nl",
      phone: "0201234567",
      companyName: "Test BV",
      btwNumber: "NL123456789B01",
    });

    expect(prisma.workshopConfig.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: "zakelijk",
        companyName: "Test BV",
        btwNumber: "NL123456789B01",
        name: "Jan Directeur",
        email: "jan@testbv.nl",
      }),
    });
  });

  it("workshop.create saves null for company fields when particulier", async () => {
    const mockConfig = {
      id: "cfg-3",
      type: "particulier",
      participantCount: 6,
      workshops: ["Stadsspel"],
      location: "Arnhem",
      customCity: null,
      date: "2026-09-01",
      time: "15:00",
      duration: null,
      name: "Piet Particulier",
      email: "piet@email.nl",
      phone: "0612345678",
      companyName: null,
      btwNumber: null,
      selectedVariants: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(prisma.workshopConfig.create).mockResolvedValueOnce(mockConfig);

    await caller.workshop.create({
      type: "particulier",
      participantCount: 6,
      workshops: ["Stadsspel"],
      location: "Arnhem",
      date: "2026-09-01",
      dateTbd: false,
      time: "15:00",
      timeTbd: false,
      name: "Piet Particulier",
      email: "piet@email.nl",
      phone: "0612345678",
    });

    expect(prisma.workshopConfig.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        companyName: null,
        btwNumber: null,
      }),
    });
  });
});

describe("Contact Form → tRPC → Database flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("feedback.submit saves to Feedback table with correct fields", async () => {
    const mockFeedback = {
      id: "fb-1",
      name: "Maria",
      email: "maria@example.com",
      phone: "0612345678",
      subject: "Vraag over workshops",
      message: "Ik wil graag meer informatie over de kookworkshop.",
      rating: 5,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: null,
      lastName: null,
      eventDate: null,
      eventLocation: null,
      whatWasBest: null,
      whatToImprove: null,
    };
    vi.mocked(prisma.feedback.create).mockResolvedValueOnce(mockFeedback);

    const result = await caller.feedback.submit({
      name: "Maria",
      email: "maria@example.com",
      phone: "0612345678",
      subject: "Vraag over workshops",
      message: "Ik wil graag meer informatie over de kookworkshop.",
      rating: 5,
      source: "contact",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("Bedankt");
    expect(prisma.feedback.create).toHaveBeenCalledWith({
      data: {
        name: "Maria",
        email: "maria@example.com",
        phone: "0612345678",
        subject: "Vraag over workshops",
        message: "Ik wil graag meer informatie over de kookworkshop.",
        rating: 5,
        isRead: false,
      },
    });
  });

  it("isRead defaults to false", async () => {
    vi.mocked(prisma.feedback.create).mockResolvedValueOnce({} as never);

    await caller.feedback.submit({
      name: "Test User",
      email: "test@example.com",
      message: "Dit is een testbericht voor feedback.",
      source: "contact",
    });

    expect(prisma.feedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ isRead: false }),
    });
  });

  it("handles database error by throwing TRPC INTERNAL_SERVER_ERROR", async () => {
    vi.mocked(prisma.feedback.create).mockRejectedValueOnce(
      new Error("DB connection lost")
    );

    await expect(
      caller.feedback.submit({
        name: "Error Test",
        email: "error@example.com",
        message: "This should trigger an error in the database layer.",
        source: "contact",
      })
    ).rejects.toThrow();
  });
});

describe("Feedback Form → tRPC → Database flow (structured fields)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("feedback.submit saves structured fields when provided", async () => {
    const mockFeedback = {
      id: "fb-struct-1",
      name: "Ahmed",
      email: "ahmed@example.com",
      phone: null,
      subject: null,
      message: "Geweldige ervaring bij de kookworkshop!",
      rating: null,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: "Ahmed",
      lastName: "El Fassi",
      eventDate: "2026-03-15",
      eventLocation: "Nijmegen",
      whatWasBest: "De sfeer en het eten waren fantastisch",
      whatToImprove: "Meer tijd voor de desserts",
    };
    vi.mocked(prisma.feedback.create).mockResolvedValueOnce(mockFeedback);

    const result = await caller.feedback.submit({
      name: "Ahmed",
      email: "ahmed@example.com",
      message: "Geweldige ervaring bij de kookworkshop!",
      firstName: "Ahmed",
      lastName: "El Fassi",
      eventDate: "2026-03-15",
      eventLocation: "Nijmegen",
      whatWasBest: "De sfeer en het eten waren fantastisch",
      whatToImprove: "Meer tijd voor de desserts",
      source: "feedback",
    });

    expect(result.success).toBe(true);
    expect(prisma.feedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        firstName: "Ahmed",
        lastName: "El Fassi",
        eventDate: "2026-03-15",
        eventLocation: "Nijmegen",
        whatWasBest: "De sfeer en het eten waren fantastisch",
        whatToImprove: "Meer tijd voor de desserts",
      }),
    });
  });

  it("feedback.submit saves undefined for structured fields when not provided (contact form case)", async () => {
    const mockFeedback = {
      id: "fb-contact-1",
      name: "Lisa",
      email: "lisa@example.com",
      phone: null,
      subject: null,
      message: "Ik wil graag meer informatie over jullie workshops.",
      rating: null,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: null,
      lastName: null,
      eventDate: null,
      eventLocation: null,
      whatWasBest: null,
      whatToImprove: null,
    };
    vi.mocked(prisma.feedback.create).mockResolvedValueOnce(mockFeedback);

    await caller.feedback.submit({
      name: "Lisa",
      email: "lisa@example.com",
      message: "Ik wil graag meer informatie over jullie workshops.",
      source: "contact",
    });

    const createCall = vi.mocked(prisma.feedback.create).mock.calls[0]![0];
    expect(createCall.data.firstName).toBeUndefined();
    expect(createCall.data.lastName).toBeUndefined();
    expect(createCall.data.eventDate).toBeUndefined();
    expect(createCall.data.eventLocation).toBeUndefined();
    expect(createCall.data.whatWasBest).toBeUndefined();
    expect(createCall.data.whatToImprove).toBeUndefined();
  });
});

describe("Feedback admin operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("feedback.getAll with default params", async () => {
    const mockItems = [
      {
        id: "fb-1",
        name: "A",
        email: "a@x.com",
        message: "msg",
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    vi.mocked(prisma.feedback.findMany).mockResolvedValueOnce(
      mockItems as never
    );

    const result = await caller.feedback.getAll();

    expect(prisma.feedback.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    );
    expect(result).toEqual(mockItems);
  });

  it("feedback.getAll with isRead filter", async () => {
    vi.mocked(prisma.feedback.findMany).mockResolvedValueOnce([] as never);

    await caller.feedback.getAll({ isRead: true, limit: 10 });

    expect(prisma.feedback.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isRead: true },
        take: 10,
      })
    );
  });

  it("feedback.toggleRead updates the correct record", async () => {
    const updated = { id: "fb-1", isRead: true };
    vi.mocked(prisma.feedback.update).mockResolvedValueOnce(updated as never);

    const result = await caller.feedback.toggleRead({
      id: "fb-1",
      isRead: true,
    });

    expect(prisma.feedback.update).toHaveBeenCalledWith({
      where: { id: "fb-1" },
      data: { isRead: true },
    });
    expect(result).toEqual(updated);
  });

  it("feedback.delete removes the record", async () => {
    vi.mocked(prisma.feedback.delete).mockResolvedValueOnce({} as never);

    const result = await caller.feedback.delete({ id: "fb-99" });

    expect(prisma.feedback.delete).toHaveBeenCalledWith({
      where: { id: "fb-99" },
    });
    expect(result).toEqual({ success: true });
  });

  it("feedback.getStats returns correct aggregated stats", async () => {
    vi.mocked(prisma.feedback.count)
      .mockResolvedValueOnce(25 as never) // total
      .mockResolvedValueOnce(7 as never); // unread
    vi.mocked(prisma.feedback.aggregate).mockResolvedValueOnce({
      _avg: { rating: 4.2 },
    } as never);

    const stats = await caller.feedback.getStats();

    expect(stats).toEqual({
      total: 25,
      unread: 7,
      averageRating: 4.2,
    });
  });
});

describe("Booking Overbooking Protection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("booking.create with sessionId checks capacity and creates booking within transaction", async () => {
    const mockBooking = {
      id: "bk-1",
      firstName: "Sara",
      lastName: "de Vries",
      email: "sara@example.com",
      numberOfPeople: 3,
      sessionId: "session-1",
      totalPrice: 180,
      remainingAmount: 180,
      paymentStatus: "pending",
      currency: "eur",
      hasGiftCard: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock $transaction to execute the callback with a mock tx
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) => {
      const tx = {
        openWorkshopSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: "session-1",
            maxCapacity: 12,
          }),
        },
        booking: {
          aggregate: vi.fn().mockResolvedValue({
            _sum: { numberOfPeople: 5 },
          }),
          create: vi.fn().mockResolvedValue(mockBooking),
        },
        workshopRequest: {
          create: vi.fn().mockResolvedValue({}),
        },
      };
      return cb(tx);
    });

    const result = await caller.booking.create({
      firstName: "Sara",
      lastName: "de Vries",
      email: "sara@example.com",
      numberOfPeople: 3,
      sessionId: "session-1",
      totalPrice: 180,
      remainingAmount: 180,
    });

    expect(result.success).toBe(true);
    expect(result.booking).toBeDefined();
    expect(prisma.$transaction).toHaveBeenCalledOnce();
  });

  it("booking.create rejects when session is full", async () => {
    // Mock $transaction to execute the callback with a mock tx where capacity is almost full
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) => {
      const tx = {
        openWorkshopSession: {
          findUnique: vi.fn().mockResolvedValue({
            id: "session-1",
            maxCapacity: 12,
          }),
        },
        booking: {
          aggregate: vi.fn().mockResolvedValue({
            _sum: { numberOfPeople: 11 },
          }),
          create: vi.fn(),
        },
      };
      return cb(tx);
    });

    await expect(
      caller.booking.create({
        firstName: "Tom",
        lastName: "Bakker",
        email: "tom@example.com",
        numberOfPeople: 3,
        sessionId: "session-1",
        totalPrice: 180,
        remainingAmount: 180,
      })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.booking.create({
        firstName: "Tom",
        lastName: "Bakker",
        email: "tom@example.com",
        numberOfPeople: 3,
        sessionId: "session-1",
        totalPrice: 180,
        remainingAmount: 180,
      })
    ).rejects.toMatchObject({
      code: "PRECONDITION_FAILED",
    });
  });
});
