import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/lib/prisma";
import { isGooglePlacesConfigured } from "@/lib/google-places";

const caller = appRouter.createCaller({
  headers: new Headers({ "x-api-secret": "test-api-secret" }),
} as any);

beforeEach(() => {
  vi.clearAllMocks();
});

const mockReview = {
  id: "r1",
  googleReviewId: "g1",
  authorName: "Jan",
  authorPhotoUrl: null,
  rating: 5,
  text: "Geweldig!",
  relativeTime: "1 week ago",
  reviewTime: new Date("2025-01-01"),
  language: "nl",
  sortOrder: "most_relevant",
  isVisible: true,
  fetchedAt: new Date(),
  lastSeenAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("reviews.getAll", () => {
  it("returns visible reviews with default sorting", async () => {
    vi.mocked(prisma.googleReview.findMany).mockResolvedValue([
      mockReview,
    ] as any);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);
    const result = await caller.reviews.getAll({});
    expect(result).toEqual([mockReview]);
    expect(prisma.googleReview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isVisible: true }),
        take: 10,
      })
    );
  });

  it("filters by minRating", async () => {
    vi.mocked(prisma.googleReview.findMany).mockResolvedValue([]);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);
    await caller.reviews.getAll({ minRating: 4 });
    expect(prisma.googleReview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ rating: { gte: 4 } }),
      })
    );
  });

  it("includes hidden when visibleOnly=false", async () => {
    vi.mocked(prisma.googleReview.findMany).mockResolvedValue([]);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);
    await caller.reviews.getAll({ visibleOnly: false });
    expect(prisma.googleReview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });

  it("supports custom limit", async () => {
    vi.mocked(prisma.googleReview.findMany).mockResolvedValue([]);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);
    await caller.reviews.getAll({ limit: 20 });
    expect(prisma.googleReview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 20 })
    );
  });
});

describe("reviews.getFeatured", () => {
  it("returns visible reviews with rating >= 4 and text", async () => {
    vi.mocked(prisma.googleReview.findMany).mockResolvedValue([
      mockReview,
    ] as any);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);
    const result = await caller.reviews.getFeatured({});
    expect(result).toEqual([mockReview]);
    expect(prisma.googleReview.findMany).toHaveBeenCalledWith({
      where: { isVisible: true, rating: { gte: 4 }, text: { not: null } },
      orderBy: { reviewTime: "desc" },
      take: 5,
    });
  });

  it("supports custom limit", async () => {
    vi.mocked(prisma.googleReview.findMany).mockResolvedValue([]);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);
    await caller.reviews.getFeatured({ limit: 3 });
    expect(prisma.googleReview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 3 })
    );
  });
});

describe("reviews.getStats", () => {
  it("returns aggregate statistics", async () => {
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue({
      averageRating: 4.5,
      totalReviewCount: 100,
      placeName: "Goeduitje",
      lastFetchedAt: new Date(),
    } as any);
    vi.mocked(prisma.googleReview.aggregate).mockResolvedValue({
      _avg: { rating: 4.5 },
      _count: { id: 50 },
    } as any);
    vi.mocked(prisma.googleReview.groupBy).mockResolvedValue([
      { rating: 5, _count: { id: 30 } },
      { rating: 4, _count: { id: 15 } },
      { rating: 3, _count: { id: 5 } },
    ] as any);

    const result = await caller.reviews.getStats();
    expect(result.averageRating).toBe(4.5);
    expect(result.totalCount).toBe(100);
    expect(result.storedCount).toBe(50);
    expect(result.ratingDistribution).toEqual({
      5: 30,
      4: 15,
      3: 5,
      2: 0,
      1: 0,
    });
  });

  it("falls back to aggregate when no cache", async () => {
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.googleReview.aggregate).mockResolvedValue({
      _avg: { rating: 4.0 },
      _count: { id: 20 },
    } as any);
    vi.mocked(prisma.googleReview.groupBy).mockResolvedValue([]);

    const result = await caller.reviews.getStats();
    expect(result.averageRating).toBe(4.0);
    expect(result.totalCount).toBe(20);
    expect(result.lastUpdated).toBeNull();
  });
});

describe("reviews.getAllAdmin", () => {
  it("returns all reviews including hidden ones", async () => {
    vi.mocked(prisma.googleReview.findMany).mockResolvedValue([
      mockReview,
    ] as any);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);
    const result = await caller.reviews.getAllAdmin();
    expect(result.reviews).toEqual([mockReview]);
    expect(result.cacheStatus).toBeDefined();
    expect(result.cacheStatus.isConfigured).toBe(false);
  });
});

describe("reviews.toggleVisibility", () => {
  it("updates isVisible field", async () => {
    vi.mocked(prisma.googleReview.update).mockResolvedValue({
      ...mockReview,
      isVisible: false,
    } as any);
    const result = await caller.reviews.toggleVisibility({
      reviewId: "r1",
      isVisible: false,
    });
    expect(result.isVisible).toBe(false);
    expect(prisma.googleReview.update).toHaveBeenCalledWith({
      where: { id: "r1" },
      data: { isVisible: false },
    });
  });
});

describe("reviews.refreshFromGoogle", () => {
  it("throws PRECONDITION_FAILED when Google not configured", async () => {
    vi.mocked(isGooglePlacesConfigured).mockReturnValue(false);
    await expect(caller.reviews.refreshFromGoogle({})).rejects.toThrow();
  });

  it("throws TOO_MANY_REQUESTS when rate limited", async () => {
    vi.mocked(isGooglePlacesConfigured).mockReturnValue(true);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue({
      lastFetchedAt: new Date(), // just fetched
    } as any);
    await expect(
      caller.reviews.refreshFromGoogle({ forceRefresh: false })
    ).rejects.toThrow();
  });

  it("calls fetchAllGoogleReviews when configured and not rate limited", async () => {
    const { fetchAllGoogleReviews } = await import("@/lib/google-places");
    vi.mocked(isGooglePlacesConfigured).mockReturnValue(true);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue({
      lastFetchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    } as any);
    vi.mocked(fetchAllGoogleReviews).mockResolvedValue({
      mostRelevant: [
        {
          googleReviewId: "g1",
          authorName: "Jan",
          authorPhotoUrl: null,
          rating: 5,
          text: "Great!",
          relativeTime: "1 week ago",
          reviewTime: new Date(),
          language: "nl",
        },
      ],
      newest: [],
      placeDetails: { name: "Goeduitje", rating: 4.8, totalReviews: 50 },
    } as any);
    vi.mocked(prisma.googleReview.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.googleReview.create).mockResolvedValue({} as any);
    vi.mocked(prisma.google_reviews_cache.upsert).mockResolvedValue({} as any);

    const result = await caller.reviews.refreshFromGoogle({
      forceRefresh: false,
    });
    expect(result.success).toBe(true);
    expect(result.newReviews).toBe(1);
  });

  it("updates existing reviews on refresh", async () => {
    const { fetchAllGoogleReviews } = await import("@/lib/google-places");
    vi.mocked(isGooglePlacesConfigured).mockReturnValue(true);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);
    vi.mocked(fetchAllGoogleReviews).mockResolvedValue({
      mostRelevant: [
        {
          googleReviewId: "g1",
          authorName: "Jan",
          authorPhotoUrl: null,
          rating: 5,
          text: "Updated",
          relativeTime: "2w ago",
          reviewTime: new Date(),
          language: "nl",
        },
      ],
      newest: [],
      placeDetails: { name: "Goeduitje", rating: 4.8, totalReviews: 50 },
    } as any);
    vi.mocked(prisma.googleReview.findUnique).mockResolvedValue({
      id: "existing",
    } as any);
    vi.mocked(prisma.googleReview.update).mockResolvedValue({} as any);
    vi.mocked(prisma.google_reviews_cache.upsert).mockResolvedValue({} as any);

    const result = await caller.reviews.refreshFromGoogle({
      forceRefresh: true,
    });
    expect(result.success).toBe(true);
    expect(result.updatedReviews).toBe(1);
  });

  it("handles fetch error gracefully", async () => {
    const { fetchAllGoogleReviews } = await import("@/lib/google-places");
    vi.mocked(isGooglePlacesConfigured).mockReturnValue(true);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);
    vi.mocked(fetchAllGoogleReviews).mockRejectedValue(new Error("API error"));
    vi.mocked(prisma.google_reviews_cache.upsert).mockResolvedValue({} as any);

    await expect(
      caller.reviews.refreshFromGoogle({ forceRefresh: true })
    ).rejects.toThrow(/Failed to fetch reviews/);
  });
});

describe("reviews.getCacheStatus", () => {
  it("returns cache status when cache exists", async () => {
    vi.mocked(isGooglePlacesConfigured).mockReturnValue(false);
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue({
      lastFetchedAt: new Date(),
      fetchErrorCount: 0,
      lastErrorMessage: null,
    } as any);
    vi.mocked(prisma.googleReview.count)
      .mockResolvedValueOnce(50 as any)
      .mockResolvedValueOnce(45 as any);

    const result = await caller.reviews.getCacheStatus();
    expect(result.totalReviews).toBe(50);
    expect(result.visibleReviews).toBe(45);
    expect(result.isConfigured).toBe(false);
  });

  it("marks as stale when no cache", async () => {
    vi.mocked(prisma.google_reviews_cache.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.googleReview.count).mockResolvedValue(0 as any);

    const result = await caller.reviews.getCacheStatus();
    expect(result.isStale).toBe(true);
    expect(result.lastFetchedAt).toBeNull();
  });
});
