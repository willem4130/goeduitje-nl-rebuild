/**
 * One-time bulk import of Google Reviews via Outscraper API (free tier: 50 reviews/month)
 *
 * Prerequisites:
 *   1. Sign up at https://outscraper.com and get an API key
 *   2. Set OUTSCRAPER_API_KEY in your .env file
 *   3. Set GOOGLE_PLACE_ID in your .env file
 *
 * Usage:
 *   npx tsx scripts/import-google-reviews.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface OutscraperReview {
  author_title: string;
  author_image?: string;
  review_rating: number;
  review_text?: string;
  review_datetime_utc: string;
  review_timestamp: number;
  review_likes?: number;
  owner_answer?: string;
  owner_answer_timestamp?: number;
  review_id?: string;
  review_link?: string;
  review_relative_date?: string;
  language?: string;
}

interface OutscraperResponse {
  id: string;
  status: string;
  results_location?: string;
  data?: OutscraperReview[][];
}

function generateGoogleReviewId(authorName: string, timestamp: number): string {
  const sanitizedName = authorName.replace(/\s+/g, "_").toLowerCase();
  return `${sanitizedName}_${timestamp}`;
}

async function fetchFromOutscraper(
  placeId: string,
  apiKey: string
): Promise<OutscraperReview[]> {
  const params = new URLSearchParams({
    query: placeId,
    reviewsLimit: "100",
    sort: "newest",
    language: "nl",
    fields:
      "author_title,author_image,review_rating,review_text,review_datetime_utc,review_timestamp,review_relative_date,language",
  });

  const url = `https://api.app.outscraper.com/maps/reviews-v3?${params}`;

  console.log("Fetching reviews from Outscraper...");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-KEY": apiKey,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Outscraper API error: ${response.status} - ${text}`);
  }

  const data: OutscraperResponse = await response.json();

  if (!data.data || data.data.length === 0 || data.data[0].length === 0) {
    console.log(
      "No reviews returned from Outscraper. Response:",
      JSON.stringify(data, null, 2)
    );
    return [];
  }

  return data.data[0];
}

async function importReviews(
  reviews: OutscraperReview[]
): Promise<{ newCount: number; skippedCount: number }> {
  let newCount = 0;
  let skippedCount = 0;
  const now = new Date();

  for (const review of reviews) {
    const timestamp =
      review.review_timestamp ||
      Math.floor(new Date(review.review_datetime_utc).getTime() / 1000);
    const googleReviewId = generateGoogleReviewId(
      review.author_title,
      timestamp
    );

    const existing = await prisma.googleReview.findUnique({
      where: { googleReviewId },
    });

    if (existing) {
      skippedCount++;
      continue;
    }

    await prisma.googleReview.create({
      data: {
        googleReviewId,
        authorName: review.author_title,
        authorPhotoUrl: review.author_image || null,
        rating: review.review_rating,
        text: review.review_text || null,
        relativeTime: review.review_relative_date || "",
        reviewTime: new Date(timestamp * 1000),
        language: review.language || "nl",
        sortOrder: "outscraper_import",
        isVisible: true,
        fetchedAt: now,
        lastSeenAt: now,
      },
    });

    newCount++;
  }

  return { newCount, skippedCount };
}

async function main() {
  const apiKey = process.env.OUTSCRAPER_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey) {
    console.error(
      "Error: OUTSCRAPER_API_KEY not set in environment variables."
    );
    console.error(
      "Sign up at https://outscraper.com and add your API key to .env"
    );
    process.exit(1);
  }

  if (!placeId) {
    console.error("Error: GOOGLE_PLACE_ID not set in environment variables.");
    process.exit(1);
  }

  console.log(`Importing reviews for Place ID: ${placeId}`);

  try {
    const reviews = await fetchFromOutscraper(placeId, apiKey);
    console.log(`Fetched ${reviews.length} reviews from Outscraper`);

    if (reviews.length === 0) {
      console.log("No reviews to import.");
      return;
    }

    const { newCount, skippedCount } = await importReviews(reviews);

    console.log(`\nImport complete:`);
    console.log(`  - New reviews imported: ${newCount}`);
    console.log(`  - Duplicates skipped: ${skippedCount}`);
    console.log(`  - Total processed: ${reviews.length}`);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
