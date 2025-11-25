// Google Places API wrapper with lazy initialization
// Following the pattern established in stripe.ts

interface GooglePlacesConfig {
  apiKey: string;
  placeId: string;
}

interface GoogleReviewFromAPI {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number; // Unix timestamp
}

interface PlaceDetailsResponse {
  result: {
    reviews?: GoogleReviewFromAPI[];
    rating?: number;
    user_ratings_total?: number;
    name?: string;
  };
  status: string;
  error_message?: string;
}

export interface ProcessedReview {
  googleReviewId: string;
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string | null;
  relativeTime: string;
  reviewTime: Date;
  language: string;
}

export type SortOrder = "most_relevant" | "newest";

// Lazy initialization to avoid build-time errors
let googlePlacesConfig: GooglePlacesConfig | null = null;

function getConfig(): GooglePlacesConfig {
  if (!googlePlacesConfig) {
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      throw new Error(
        "GOOGLE_PLACES_API_KEY is not set in environment variables"
      );
    }
    if (!process.env.GOOGLE_PLACE_ID) {
      throw new Error("GOOGLE_PLACE_ID is not set in environment variables");
    }
    googlePlacesConfig = {
      apiKey: process.env.GOOGLE_PLACES_API_KEY,
      placeId: process.env.GOOGLE_PLACE_ID,
    };
  }
  return googlePlacesConfig;
}

/**
 * Generate a unique ID for a Google review.
 * Uses author name + publish timestamp since Google doesn't provide review IDs.
 */
export function generateGoogleReviewId(
  authorName: string,
  timestamp: number
): string {
  const sanitizedName = authorName.replace(/\s+/g, "_").toLowerCase();
  return `${sanitizedName}_${timestamp}`;
}

/**
 * Fetches reviews from Google Places API
 * Returns max 5 reviews per request (API limitation)
 * @param sortOrder - "most_relevant" (default) or "newest"
 */
export async function fetchGoogleReviews(
  sortOrder: SortOrder = "most_relevant"
): Promise<ProcessedReview[]> {
  const config = getConfig();

  const params = new URLSearchParams({
    place_id: config.placeId,
    fields: "reviews,rating,user_ratings_total,name",
    reviews_sort: sortOrder,
    key: config.apiKey,
    language: "nl", // Dutch reviews preferred
  });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // No cache - we handle caching in database
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Google Places API error: ${response.status} ${response.statusText}`
    );
  }

  const data: PlaceDetailsResponse = await response.json();

  if (data.status !== "OK") {
    throw new Error(
      `Google Places API error: ${data.status} - ${data.error_message || "Unknown error"}`
    );
  }

  const reviews = data.result.reviews || [];

  return reviews.map((review) => ({
    googleReviewId: generateGoogleReviewId(review.author_name, review.time),
    authorName: review.author_name,
    authorPhotoUrl: review.profile_photo_url || null,
    rating: review.rating,
    text: review.text || null,
    relativeTime: review.relative_time_description,
    reviewTime: new Date(review.time * 1000),
    language: review.language,
  }));
}

/**
 * Fetches place details (rating, total reviews)
 */
export async function fetchPlaceDetails(): Promise<{
  rating: number | null;
  totalReviews: number | null;
  name: string | null;
}> {
  const config = getConfig();

  const params = new URLSearchParams({
    place_id: config.placeId,
    fields: "rating,user_ratings_total,name",
    key: config.apiKey,
  });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.status}`);
  }

  const data: PlaceDetailsResponse = await response.json();

  if (data.status !== "OK") {
    throw new Error(`Google Places API error: ${data.status}`);
  }

  return {
    rating: data.result.rating || null,
    totalReviews: data.result.user_ratings_total || null,
    name: data.result.name || null,
  };
}

/**
 * Fetches reviews with both sort orders to maximize unique reviews
 * Strategy: Fetch "most_relevant" + "newest" to potentially get up to 10 unique reviews
 */
export async function fetchAllGoogleReviews(): Promise<{
  mostRelevant: ProcessedReview[];
  newest: ProcessedReview[];
  placeDetails: {
    rating: number | null;
    totalReviews: number | null;
    name: string | null;
  };
}> {
  const [mostRelevant, newest, placeDetails] = await Promise.all([
    fetchGoogleReviews("most_relevant"),
    fetchGoogleReviews("newest"),
    fetchPlaceDetails(),
  ]);

  return { mostRelevant, newest, placeDetails };
}

/**
 * Get Place ID helper - useful for verification
 */
export function getPlaceId(): string {
  return getConfig().placeId;
}

/**
 * Check if Google Places is configured
 */
export function isGooglePlacesConfigured(): boolean {
  return !!(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID);
}
