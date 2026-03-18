import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  fetchAllGoogleReviews,
  isGooglePlacesConfigured,
} from "@/lib/google-places";

// Mock next/headers – must return an async headers() function
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

import { headers } from "next/headers";
import { GET } from "@/app/api/cron/refresh-google-reviews/route";

const mockHeaders = (authValue: string | null) => {
  vi.mocked(headers).mockResolvedValue({
    get: (name: string) => (name === "authorization" ? authValue : null),
  } as any);
};

const mockReviewsResponse = {
  mostRelevant: [
    {
      googleReviewId: "rev-1",
      authorName: "Alice",
      authorPhotoUrl: "https://photo.example.com/a",
      rating: 5,
      text: "Great!",
      relativeTime: "1 week ago",
      reviewTime: new Date("2026-01-01"),
      language: "en",
    },
  ],
  newest: [],
  placeDetails: {
    name: "Test Place",
    rating: 4.8,
    totalReviews: 100,
  },
};

describe("GET /api/cron/refresh-google-reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = "test-secret";
    process.env.GOOGLE_PLACE_ID = "place_123";
  });

  it("returns 401 when authorization header is missing", async () => {
    mockHeaders(null);
    const res = await GET();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 401 when authorization header is wrong", async () => {
    mockHeaders("Bearer wrong-secret");
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns 400 when Google Places is not configured", async () => {
    mockHeaders("Bearer test-secret");
    vi.mocked(isGooglePlacesConfigured).mockReturnValue(false);

    const res = await GET();
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Google Places API not configured");
  });

  it("successfully refreshes reviews from Google", async () => {
    mockHeaders("Bearer test-secret");
    vi.mocked(isGooglePlacesConfigured).mockReturnValue(true);
    vi.mocked(fetchAllGoogleReviews).mockResolvedValue(
      mockReviewsResponse as any
    );
    vi.mocked(prisma.googleReview.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.googleReview.create).mockResolvedValue({} as any);
    vi.mocked(prisma.google_reviews_cache.upsert).mockResolvedValue({} as any);

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.newReviews).toBe(1);
    expect(json.totalFetched).toBe(1);

    expect(prisma.googleReview.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          googleReviewId: "rev-1",
          authorName: "Alice",
          rating: 5,
          sortOrder: "most_relevant",
          isVisible: true,
        }),
      })
    );

    expect(prisma.google_reviews_cache.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "singleton" },
      })
    );
  });

  it("returns 500 when fetchAllGoogleReviews throws", async () => {
    mockHeaders("Bearer test-secret");
    vi.mocked(isGooglePlacesConfigured).mockReturnValue(true);
    vi.mocked(fetchAllGoogleReviews).mockRejectedValue(
      new Error("API down")
    );

    const res = await GET();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("API down");
  });
});
