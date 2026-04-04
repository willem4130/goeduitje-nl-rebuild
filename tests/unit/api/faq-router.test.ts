import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({
  headers: new Headers({ "x-api-secret": "test-api-secret" }),
} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

const mockFAQ = {
  id: "faq1",
  question: "Wat kost het?",
  answer: "Dat hangt af van de groepsgrootte.",
  category: "Prijzen",
  sortOrder: 0,
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("faq.getAll", () => {
  it("returns published FAQs ordered by category and sortOrder", async () => {
    vi.mocked(prisma.fAQ.findMany).mockResolvedValue([mockFAQ] as any);
    const result = await caller.faq.getAll();
    expect(result).toEqual([mockFAQ]);
    expect(prisma.fAQ.findMany).toHaveBeenCalledWith({
      where: { isPublished: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
  });

  it("includes unpublished when flag set", async () => {
    vi.mocked(prisma.fAQ.findMany).mockResolvedValue([mockFAQ] as any);
    await caller.faq.getAll({ includeUnpublished: true });
    expect(prisma.fAQ.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
  });
});

describe("faq.getByCategory", () => {
  it("returns FAQs for a specific category", async () => {
    vi.mocked(prisma.fAQ.findMany).mockResolvedValue([mockFAQ] as any);
    const result = await caller.faq.getByCategory({ category: "Prijzen" });
    expect(result).toEqual([mockFAQ]);
    expect(prisma.fAQ.findMany).toHaveBeenCalledWith({
      where: { category: "Prijzen", isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
  });
});

describe("faq.getCategories", () => {
  it("returns unique categories", async () => {
    vi.mocked(prisma.fAQ.findMany).mockResolvedValue([
      { category: "Prijzen" },
      { category: "Locatie" },
    ] as any);
    const result = await caller.faq.getCategories();
    expect(result).toEqual(["Prijzen", "Locatie"]);
  });
});

describe("faq.create", () => {
  it("creates a FAQ with defaults", async () => {
    vi.mocked(prisma.fAQ.create).mockResolvedValue(mockFAQ as any);
    await caller.faq.create({
      question: "Wat kost het?",
      answer: "Dat hangt af van de groepsgrootte.",
      category: "Prijzen",
    });
    expect(prisma.fAQ.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        question: "Wat kost het?",
        answer: "Dat hangt af van de groepsgrootte.",
        category: "Prijzen",
        sortOrder: 0,
        isPublished: true,
      }),
    });
  });

  it("creates with custom sortOrder and isPublished", async () => {
    vi.mocked(prisma.fAQ.create).mockResolvedValue(mockFAQ as any);
    await caller.faq.create({
      question: "Q",
      answer: "A",
      category: "Cat",
      sortOrder: 5,
      isPublished: false,
    });
    expect(prisma.fAQ.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ sortOrder: 5, isPublished: false }),
    });
  });
});

describe("faq.update", () => {
  it("updates a FAQ", async () => {
    vi.mocked(prisma.fAQ.update).mockResolvedValue(mockFAQ as any);
    await caller.faq.update({ id: "faq1", question: "Updated question?" });
    expect(prisma.fAQ.update).toHaveBeenCalledWith({
      where: { id: "faq1" },
      data: { question: "Updated question?" },
    });
  });
});

describe("faq.delete", () => {
  it("deletes a FAQ", async () => {
    vi.mocked(prisma.fAQ.delete).mockResolvedValue(mockFAQ as any);
    const result = await caller.faq.delete({ id: "faq1" });
    expect(result).toEqual({ success: true });
  });
});

describe("faq.reorder", () => {
  it("updates sortOrder for multiple FAQs", async () => {
    vi.mocked(prisma.fAQ.update).mockResolvedValue(mockFAQ as any);
    const result = await caller.faq.reorder([
      { id: "faq1", sortOrder: 2 },
      { id: "faq2", sortOrder: 1 },
    ]);
    expect(result).toEqual({ success: true });
    expect(prisma.fAQ.update).toHaveBeenCalledTimes(2);
  });
});

describe("faq.togglePublish", () => {
  it("toggles publish status", async () => {
    vi.mocked(prisma.fAQ.update).mockResolvedValue({
      ...mockFAQ,
      isPublished: false,
    } as any);
    await caller.faq.togglePublish({ id: "faq1", isPublished: false });
    expect(prisma.fAQ.update).toHaveBeenCalledWith({
      where: { id: "faq1" },
      data: { isPublished: false },
    });
  });
});
