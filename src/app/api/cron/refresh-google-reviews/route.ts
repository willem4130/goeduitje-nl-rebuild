import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  fetchAllGoogleReviews,
  isGooglePlacesConfigured,
  type ProcessedReview,
  type SortOrder,
} from "@/lib/google-places";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Cron job to refresh Google Reviews weekly
 * Protected by CRON_SECRET environment variable
 */
export async function GET() {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  // Verify cron secret for security
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if Google Places is configured
  if (!isGooglePlacesConfigured()) {
    return NextResponse.json(
      { error: "Google Places API not configured" },
      { status: 400 }
    );
  }

  try {
    const result = await refreshReviewsFromGoogle();
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Refresh reviews from Google Places API
 */
async function refreshReviewsFromGoogle() {
  const now = new Date();

  // Fetch both sort orders for maximum unique reviews
  const { mostRelevant, newest, placeDetails } = await fetchAllGoogleReviews();

  let newReviews = 0;
  let updatedReviews = 0;

  // Process and upsert reviews
  const processReviews = async (
    reviews: ProcessedReview[],
    sortOrder: SortOrder
  ) => {
    for (const review of reviews) {
      const existing = await prisma.googleReview.findUnique({
        where: { googleReviewId: review.googleReviewId },
      });

      if (existing) {
        // Update existing review (relative time might change)
        await prisma.googleReview.update({
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
        await prisma.googleReview.create({
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
    totalFetched,
    newReviews,
    updatedReviews,
    message: `Successfully fetched ${totalFetched} reviews. ${newReviews} new, ${updatedReviews} updated.`,
    timestamp: now.toISOString(),
  };
}
