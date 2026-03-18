import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";

const caller = appRouter.createCaller({} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("reviews.getAll", () => {
  const mockReviews = [
    {
      id: "rev1",
      authorName: "Jan",
      rating: 5,
      text: "Geweldig!",
      isVisible: true,
      reviewTime: new Date("2025-01-15"),
    },
    {
      id: "rev2",
      authorName: "Piet",
      rating: 4,
      text: "Heel goed",
      isVisible: true,
      reviewTime: new Date("2025-01-10"),
    },
  ];

  it("returns visible reviews with sorting", async () => {
    vi.mocked(prisma.googleReview.findMany).mockResolvedValue(mockReviews as any);
    // Mock the cache check (non-blocking)
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);

    const result = await caller.reviews.getAll({
      sortBy: "reviewTime",
      sortOrder: "desc",
      limit: 10,
    });

    expect(result).toEqual(mockReviews);
    expect(prisma.googleReview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isVisible: true }),
        orderBy: { reviewTime: "desc" },
        take: 10,
      })
    );
  });

  it("filters by minRating", async () => {
    vi.mocked(prisma.googleReview.findMany).mockResolvedValue([mockReviews[0]!] as any);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);

    await caller.reviews.getAll({ minRating: 5 });

    expect(prisma.googleReview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isVisible: true,
          rating: { gte: 5 },
        }),
      })
    );
  });
});

describe("reviews.getFeatured", () => {
  it("returns reviews with rating >= 4 and text", async () => {
    const mockFeatured = [
      { id: "rev1", authorName: "Jan", rating: 5, text: "Geweldig!", isVisible: true },
    ];
    vi.mocked(prisma.googleReview.findMany).mockResolvedValue(mockFeatured as any);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);

    const result = await caller.reviews.getFeatured({ limit: 5 });

    expect(result).toEqual(mockFeatured);
    expect(prisma.googleReview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          isVisible: true,
          rating: { gte: 4 },
          text: { not: null },
        },
        orderBy: { reviewTime: "desc" },
        take: 5,
      })
    );
  });
});

describe("reviews.getStats", () => {
  it("returns averageRating, totalCount, and ratingDistribution", async () => {
    const mockCache = {
      id: "singleton",
      averageRating: 4.5,
      totalReviewCount: 100,
      lastFetchedAt: new Date(),
      placeName: "Goeduitje",
    };
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(mockCache as any);
    vi.mocked(prisma.googleReview.aggregate).mockResolvedValue({
      _avg: { rating: 4.3 },
      _count: { id: 50 },
    } as any);
    vi.mocked(prisma.googleReview.groupBy).mockResolvedValue([
      { rating: 5, _count: { id: 30 } },
      { rating: 4, _count: { id: 15 } },
      { rating: 3, _count: { id: 3 } },
      { rating: 2, _count: { id: 1 } },
      { rating: 1, _count: { id: 1 } },
    ] as any);

    const result = await caller.reviews.getStats();

    expect(result.averageRating).toBe(4.5); // from cache
    expect(result.totalCount).toBe(100); // from cache
    expect(result.storedCount).toBe(50); // from aggregate
    expect(result.ratingDistribution).toEqual({
      5: 30,
      4: 15,
      3: 3,
      2: 1,
      1: 1,
    });
  });
});

describe("reviews.toggleVisibility", () => {
  it("updates isVisible field", async () => {
    const mockUpdated = { id: "rev1", isVisible: false };
    vi.mocked(prisma.googleReview.update).mockResolvedValue(mockUpdated as any);

    const result = await caller.reviews.toggleVisibility({
      reviewId: "rev1",
      isVisible: false,
    });

    expect(result).toEqual(mockUpdated);
    expect(prisma.googleReview.update).toHaveBeenCalledWith({
      where: { id: "rev1" },
      data: { isVisible: false },
    });
  });
});

describe("reviews.refreshFromGoogle", () => {
  it("throws PRECONDITION_FAILED when Google Places is not configured", async () => {
    // isGooglePlacesConfigured is already mocked to return false in vitest.setup.ts

    await expect(caller.reviews.refreshFromGoogle({})).rejects.toThrow(
      /Google Places API is not configured/
    );
  });
});
