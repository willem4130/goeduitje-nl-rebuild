import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("feedback.submit", () => {
  it("creates feedback with all fields and returns success message", async () => {
    const input = {
      name: "Jan Jansen",
      email: "jan@example.com",
      phone: "0612345678",
      subject: "Geweldige workshop",
      message: "Het was een fantastische ervaring!",
      rating: 5,
    };

    const mockFeedback = {
      id: "fb-1",
      ...input,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.feedback.create).mockResolvedValue(mockFeedback as any);

    const result = await caller.feedback.submit(input);

    expect(result.success).toBe(true);
    expect(result.message).toContain("Bedankt");
    expect(result.feedback).toEqual(mockFeedback);
    expect(prisma.feedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "Jan Jansen",
        email: "jan@example.com",
        phone: "0612345678",
        subject: "Geweldige workshop",
        message: "Het was een fantastische ervaring!",
        rating: 5,
        isRead: false,
      }),
    });
  });

  it("saves structured feedback fields when provided", async () => {
    const input = {
      name: "Fatima El-Amin",
      email: "fatima@example.com",
      message: "Geweldige kookworkshop, alles was perfect geregeld!",
      rating: 5,
      firstName: "Fatima",
      lastName: "El-Amin",
      eventDate: "2025-05-10",
      eventLocation: "Nijmegen",
      whatWasBest: "De sfeer en het eten",
      whatToImprove: "Meer vegetarische opties",
    };

    const mockFeedback = {
      id: "fb-3",
      ...input,
      phone: undefined,
      subject: undefined,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.feedback.create).mockResolvedValue(mockFeedback as any);

    const result = await caller.feedback.submit(input);

    expect(result.success).toBe(true);
    expect(result.feedback).toEqual(mockFeedback);
    expect(prisma.feedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        firstName: "Fatima",
        lastName: "El-Amin",
        eventDate: "2025-05-10",
        eventLocation: "Nijmegen",
        whatWasBest: "De sfeer en het eten",
        whatToImprove: "Meer vegetarische opties",
      }),
    });
  });

  it("saves undefined for structured fields when not provided (contact form case)", async () => {
    const input = {
      name: "Karel Smit",
      email: "karel@example.com",
      message: "Ik heb een vraag over de workshops in Arnhem.",
    };

    const mockFeedback = {
      id: "fb-4",
      ...input,
      phone: undefined,
      subject: undefined,
      rating: undefined,
      firstName: undefined,
      lastName: undefined,
      eventDate: undefined,
      eventLocation: undefined,
      whatWasBest: undefined,
      whatToImprove: undefined,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.feedback.create).mockResolvedValue(mockFeedback as any);

    const result = await caller.feedback.submit(input);

    expect(result.success).toBe(true);
    expect(prisma.feedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "Karel Smit",
        email: "karel@example.com",
        message: "Ik heb een vraag over de workshops in Arnhem.",
        firstName: undefined,
        lastName: undefined,
        eventDate: undefined,
        eventLocation: undefined,
        whatWasBest: undefined,
        whatToImprove: undefined,
      }),
    });
  });

  it("handles Prisma error gracefully (throws INTERNAL_SERVER_ERROR)", async () => {
    vi.mocked(prisma.feedback.create).mockRejectedValue(new Error("DB error"));

    const input = {
      name: "Jan Jansen",
      email: "jan@example.com",
      message: "Test bericht voor de feedback",
    };

    await expect(caller.feedback.submit(input)).rejects.toThrow(
      /misgegaan/
    );
  });
});

describe("feedback.getAll", () => {
  const mockFeedbackList = [
    { id: "fb-1", name: "Jan", isRead: false, createdAt: new Date() },
    { id: "fb-2", name: "Piet", isRead: true, createdAt: new Date() },
  ];

  it("returns feedback list with default limit 50", async () => {
    vi.mocked(prisma.feedback.findMany).mockResolvedValue(mockFeedbackList as any);

    const result = await caller.feedback.getAll();

    expect(result).toEqual(mockFeedbackList);
    expect(prisma.feedback.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 50,
        orderBy: { createdAt: "desc" },
      })
    );
  });

  it("filters by isRead when provided", async () => {
    vi.mocked(prisma.feedback.findMany).mockResolvedValue([mockFeedbackList[0]!] as any);

    await caller.feedback.getAll({ isRead: false });

    expect(prisma.feedback.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isRead: false },
      })
    );
  });
});

describe("feedback.toggleRead", () => {
  it("updates isRead field", async () => {
    const mockUpdated = { id: "fb-1", isRead: true };
    vi.mocked(prisma.feedback.update).mockResolvedValue(mockUpdated as any);

    const result = await caller.feedback.toggleRead({ id: "fb-1", isRead: true });

    expect(result).toEqual(mockUpdated);
    expect(prisma.feedback.update).toHaveBeenCalledWith({
      where: { id: "fb-1" },
      data: { isRead: true },
    });
  });
});

describe("feedback.delete", () => {
  it("deletes feedback by ID", async () => {
    vi.mocked(prisma.feedback.delete).mockResolvedValue({} as any);

    const result = await caller.feedback.delete({ id: "fb-1" });

    expect(result).toEqual({ success: true });
    expect(prisma.feedback.delete).toHaveBeenCalledWith({
      where: { id: "fb-1" },
    });
  });
});

describe("feedback.getStats", () => {
  it("returns total, unread, and averageRating", async () => {
    vi.mocked(prisma.feedback.count)
      .mockResolvedValueOnce(25 as any) // total
      .mockResolvedValueOnce(10 as any); // unread
    vi.mocked(prisma.feedback.aggregate).mockResolvedValue({
      _avg: { rating: 4.2 },
    } as any);

    const result = await caller.feedback.getStats();

    expect(result).toEqual({
      total: 25,
      unread: 10,
      averageRating: 4.2,
    });
  });

  it("returns 0 averageRating when no ratings exist", async () => {
    vi.mocked(prisma.feedback.count)
      .mockResolvedValueOnce(5 as any)
      .mockResolvedValueOnce(2 as any);
    vi.mocked(prisma.feedback.aggregate).mockResolvedValue({
      _avg: { rating: null },
    } as any);

    const result = await caller.feedback.getStats();

    expect(result.averageRating).toBe(0);
  });
});
