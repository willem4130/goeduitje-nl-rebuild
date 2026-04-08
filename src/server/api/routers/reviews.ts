import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import {
  fetchAllGoogleReviews,
  isGooglePlacesConfigured,
  type ProcessedReview,
  type SortOrder,
} from "@/lib/google-places";
import {
  getReviewsQuerySchema,
  getFeaturedReviewsSchema,
  toggleReviewVisibilitySchema,
  refreshReviewsSchema,
} from "@/lib/validations/reviews";
import { TRPCError } from "@trpc/server";

// Cache duration: 24 hours in milliseconds
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

// Minimum time between manual refreshes: 1 hour
const MIN_REFRESH_INTERVAL_MS = 60 * 60 * 1000;

export const reviewsRouter = createTRPCRouter({
  /**
   * Get all visible reviews for public display
   */
  getAll: publicProcedure
    .input(getReviewsQuerySchema)
    .query(async ({ input }) => {
      const {
        sortBy = "reviewTime",
        sortOrder = "desc",
        minRating,
        limit = 10,
        visibleOnly = true,
      } = input ?? {};

      // Check if cache needs refresh (non-blocking)
      checkAndRefreshCache().catch(console.error);

      const reviews = await prisma.googleReview.findMany({
        where: {
          ...(visibleOnly && { isVisible: true }),
          ...(minRating && { rating: { gte: minRating } }),
        },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
      });

      return reviews;
    }),

  /**
   * Get featured reviews (4-5 stars with text) for homepage carousel
   */
  getFeatured: publicProcedure
    .input(getFeaturedReviewsSchema)
    .query(async ({ input }) => {
      const { limit = 5 } = input ?? {};

      // Check if cache needs refresh (non-blocking)
      checkAndRefreshCache().catch(console.error);

      const reviews = await prisma.googleReview.findMany({
        where: {
          isVisible: true,
          rating: { gte: 4 },
          text: { not: null },
        },
        orderBy: { reviewTime: "desc" },
        take: limit,
      });

      return reviews;
    }),

  /**
   * Get aggregate statistics for reviews
   */
  getStats: publicProcedure.query(async () => {
    const [cache, reviewStats] = await Promise.all([
      prisma.google_reviews_cache.findFirst(),
      prisma.googleReview.aggregate({
        where: { isVisible: true },
        _avg: { rating: true },
        _count: { id: true },
      }),
    ]);

    // Calculate rating distribution
    const ratingDistribution = await prisma.googleReview.groupBy({
      by: ["rating"],
      where: { isVisible: true },
      _count: { id: true },
    });

    const distribution = Object.fromEntries(
      ratingDistribution.map(
        (r: { rating: number; _count: { id: number } }) => [
          r.rating,
          r._count.id,
        ]
      )
    );

    return {
      averageRating: cache?.averageRating ?? reviewStats._avg.rating ?? 0,
      totalCount: cache?.totalReviewCount ?? reviewStats._count.id,
      storedCount: reviewStats._count.id,
      lastUpdated: cache?.lastFetchedAt ?? null,
      placeName: cache?.placeName ?? null,
      ratingDistribution: {
        5: distribution[5] ?? 0,
        4: distribution[4] ?? 0,
        3: distribution[3] ?? 0,
        2: distribution[2] ?? 0,
        1: distribution[1] ?? 0,
      },
    };
  }),

  /**
   * Get all reviews including hidden ones (for admin)
   */
  getAllAdmin: protectedProcedure.query(async () => {
    const reviews = await prisma.googleReview.findMany({
      orderBy: [{ isVisible: "desc" }, { reviewTime: "desc" }],
    });

    const cache = await prisma.google_reviews_cache.findFirst();

    return {
      reviews,
      cacheStatus: {
        lastFetchedAt: cache?.lastFetchedAt ?? null,
        fetchErrorCount: cache?.fetchErrorCount ?? 0,
        lastErrorMessage: cache?.lastErrorMessage ?? null,
        isConfigured: isGooglePlacesConfigured(),
      },
    };
  }),

  /**
   * Toggle review visibility (admin feature)
   */
  toggleVisibility: protectedProcedure
    .input(toggleReviewVisibilitySchema)
    .mutation(async ({ input }) => {
      const { reviewId, isVisible } = input;

      const updated = await prisma.googleReview.update({
        where: { id: reviewId },
        data: { isVisible },
      });

      return updated;
    }),

  /**
   * Force refresh reviews from Google API
   * Rate limited to once per hour
   */
  refreshFromGoogle: protectedProcedure
    .input(refreshReviewsSchema)
    .mutation(async ({ input }) => {
      const { forceRefresh = false } = input ?? {};

      // Check if Google Places is configured
      if (!isGooglePlacesConfigured()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "Google Places API is not configured. Please add GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID to your environment variables.",
        });
      }

      // Check rate limit if not forcing
      if (!forceRefresh) {
        const cache = await prisma.google_reviews_cache.findFirst();
        if (cache?.lastFetchedAt) {
          const timeSinceLastFetch = Date.now() - cache.lastFetchedAt.getTime();
          if (timeSinceLastFetch < MIN_REFRESH_INTERVAL_MS) {
            const minutesRemaining = Math.ceil(
              (MIN_REFRESH_INTERVAL_MS - timeSinceLastFetch) / 60000
            );
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: `Reviews can only be refreshed once per hour. Try again in ${minutesRemaining} minutes.`,
            });
          }
        }
      }

      // Fetch and store new reviews
      const result = await refreshReviewsFromGoogle();

      return result;
    }),

  /**
   * Get cache status (for admin dashboard)
   */
  getCacheStatus: publicProcedure.query(async () => {
    const cache = await prisma.google_reviews_cache.findFirst();
    const reviewCount = await prisma.googleReview.count();
    const visibleCount = await prisma.googleReview.count({
      where: { isVisible: true },
    });

    const now = new Date();
    const isStale =
      !cache ||
      now.getTime() - cache.lastFetchedAt.getTime() > CACHE_DURATION_MS;

    return {
      lastFetchedAt: cache?.lastFetchedAt ?? null,
      fetchErrorCount: cache?.fetchErrorCount ?? 0,
      lastErrorMessage: cache?.lastErrorMessage ?? null,
      totalReviews: reviewCount,
      visibleReviews: visibleCount,
      isStale,
      isConfigured: isGooglePlacesConfigured(),
    };
  }),
});

/**
 * Check if cache is stale and refresh in background if needed
 */
async function checkAndRefreshCache(): Promise<void> {
  if (!isGooglePlacesConfigured()) {
    return;
  }

  const cache = await prisma.google_reviews_cache.findFirst();
  const now = new Date();

  const isStale =
    !cache || now.getTime() - cache.lastFetchedAt.getTime() > CACHE_DURATION_MS;

  if (isStale) {
    // Fire-and-forget background refresh
    refreshReviewsFromGoogle().catch(console.error);
  }
}

/**
 * Internal function to refresh reviews from Google
 */
async function refreshReviewsFromGoogle(): Promise<{
  success: boolean;
  totalFetched: number;
  newReviews: number;
  updatedReviews: number;
  message: string;
}> {
  const now = new Date();

  try {
    // Fetch both sort orders for maximum unique reviews
    const { mostRelevant, newest, placeDetails } =
      await fetchAllGoogleReviews();

    let newReviews = 0;
    let updatedReviews = 0;

    // Process and upsert reviews
    const processReviews = async (
      reviews: ProcessedReview[],
      sortOrder: SortOrder
    ) => {
      await prisma.$transaction(async (tx) => {
        for (const review of reviews) {
          const existing = await tx.googleReview.findUnique({
            where: { googleReviewId: review.googleReviewId },
          });

          if (existing) {
            // Update existing review (relative time might change)
            await tx.googleReview.update({
              where: { googleReviewId: review.googleReviewId },
              data: {
                text: review.text,
                relativeTime: review.relativeTime,
                lastSeenAt: now,
              },
            });
            updatedReviews++;
          } else {
            // Create new review
            await tx.googleReview.create({
              data: {
                googleReviewId: review.googleReviewId,
                authorName: review.authorName,
                authorPhotoUrl: review.authorPhotoUrl,
                rating: review.rating,
                text: review.text,
                relativeTime: review.relativeTime,
                reviewTime: review.reviewTime,
                language: review.language,
                sortOrder,
                isVisible: true,
                fetchedAt: now,
                lastSeenAt: now,
              },
            });
            newReviews++;
          }
        }
      });
    };

    await processReviews(mostRelevant, "most_relevant");
    await processReviews(newest, "newest");

    // Update cache metadata
    await prisma.google_reviews_cache.upsert({
      where: { id: "singleton" },
      update: {
        placeId: process.env.GOOGLE_PLACE_ID!,
        placeName: placeDetails.name,
        averageRating: placeDetails.rating,
        totalReviewCount: placeDetails.totalReviews,
        lastFetchedAt: now,
        fetchErrorCount: 0,
        lastErrorMessage: null,
      },
      create: {
        id: "singleton",
        placeId: process.env.GOOGLE_PLACE_ID!,
        placeName: placeDetails.name,
        averageRating: placeDetails.rating,
        totalReviewCount: placeDetails.totalReviews,
        lastFetchedAt: now,
        fetchErrorCount: 0,
      },
    });

    const totalFetched = mostRelevant.length + newest.length;

    return {
      success: true,
      totalFetched,
      newReviews,
      updatedReviews,
      message: `Successfully fetched ${totalFetched} reviews. ${newReviews} new, ${updatedReviews} updated.`,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Update cache with error info
    await prisma.google_reviews_cache.upsert({
      where: { id: "singleton" },
      update: {
        fetchErrorCount: { increment: 1 },
        lastErrorMessage: errorMessage,
      },
      create: {
        id: "singleton",
        placeId: process.env.GOOGLE_PLACE_ID || "unknown",
        lastFetchedAt: now,
        fetchErrorCount: 1,
        lastErrorMessage: errorMessage,
      },
    });

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to fetch reviews from Google: ${errorMessage}`,
    });
  }
}
