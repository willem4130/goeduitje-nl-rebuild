/**
 * Scrape ALL Google Reviews using google-maps-review-scraper.
 * No API keys needed — uses the same endpoint as the Google Maps website.
 *
 * Uses: https://github.com/YasogaN/google-maps-review-scraper (MIT)
 *
 * Usage:
 *   npx tsx scripts/scrape-google-reviews.ts
 */

import { PrismaClient } from "@prisma/client";
import { scraper } from "google-maps-review-scraper";

const prisma = new PrismaClient();

// Google Maps URL format required by the scraper (constructed from hex CID)
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Goeduitje/data=!4m7!3m6!1s0xfe07f98f5fb93f7:0x3cb989dcf183b624!8m2!3d52.8021667!4d6.8945833!16s";

interface ParsedReview {
  review_id: string;
  time: { published: number | null; last_edited: number | null };
  author: {
    name: string;
    profile_url: string;
    url: string;
    id: string;
  };
  review: {
    rating: number;
    text: string | null;
    language: string | null;
  };
  images: Array<{
    id: string;
    url: string;
  }> | null;
  source: string;
  response: {
    text: string | null;
    time: { published: number | null; last_edited: number | null };
  } | null;
}

async function importToDatabase(
  reviews: ParsedReview[]
): Promise<{ newCount: number; skippedCount: number; updatedCount: number }> {
  let newCount = 0;
  let skippedCount = 0;
  let updatedCount = 0;
  const now = new Date();

  for (const review of reviews) {
    const authorName = review.author?.name;
    const rating = review.review?.rating;
    const text = review.review?.text || null;
    const language = review.review?.language || "nl";
    const publishedTimestamp = review.time?.published
      ? Math.floor(review.time.published / 1000000)
      : null;

    if (!authorName || rating === undefined) continue;

    // Generate a stable ID matching existing format
    const sanitizedName = authorName.replace(/\s+/g, "_").toLowerCase();
    const timestamp = publishedTimestamp || 0;
    const googleReviewId = `${sanitizedName}_${timestamp}`;

    const existing = await prisma.googleReview.findUnique({
      where: { googleReviewId },
    });

    if (existing) {
      if (existing.text !== text) {
        await prisma.googleReview.update({
          where: { googleReviewId },
          data: { text, lastSeenAt: now },
        });
        updatedCount++;
      } else {
        await prisma.googleReview.update({
          where: { googleReviewId },
          data: { lastSeenAt: now },
        });
        skippedCount++;
      }
      continue;
    }

    const profileUrl = review.author?.url || review.author?.profile_url || null;

    await prisma.googleReview.create({
      data: {
        googleReviewId,
        authorName,
        authorPhotoUrl: profileUrl,
        rating,
        text,
        relativeTime: "",
        reviewTime: publishedTimestamp
          ? new Date(publishedTimestamp * 1000)
          : now,
        language,
        sortOrder: "scraper_import",
        isVisible: true,
        fetchedAt: now,
        lastSeenAt: now,
      },
    });

    newCount++;
  }

  return { newCount, skippedCount, updatedCount };
}

async function main() {
  console.log(`\n🔍 Scraping Google Reviews for: ${GOOGLE_MAPS_URL}\n`);

  try {
    console.log("Starting scraper (this may take a moment)...\n");

    const result = await scraper(GOOGLE_MAPS_URL, {
      sort_type: "newest",
      pages: "max",
      clean: true,
    });

    if (result === 0 || !Array.isArray(result) || result.length === 0) {
      console.log("No reviews found.");
      return;
    }

    const reviews = result as ParsedReview[];
    console.log(`✅ Scraped ${reviews.length} reviews\n`);

    // Preview
    console.log("Preview:");
    for (const r of reviews.slice(0, 5)) {
      console.log(
        `  ${r.author?.name} | ${r.review?.rating}⭐ | ${(r.review?.text || "").substring(0, 60)}...`
      );
    }
    console.log("");

    // Import
    console.log("Importing to database...");
    const { newCount, skippedCount, updatedCount } =
      await importToDatabase(reviews);

    console.log(`\n📊 Import complete:`);
    console.log(`  - New reviews imported: ${newCount}`);
    console.log(`  - Existing (skipped): ${skippedCount}`);
    console.log(`  - Updated: ${updatedCount}`);
    console.log(`  - Total processed: ${reviews.length}`);

    const totalInDb = await prisma.googleReview.count({
      where: { isVisible: true },
    });
    console.log(`  - Total visible in DB: ${totalInDb}`);
  } catch (error) {
    console.error("Scrape failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
