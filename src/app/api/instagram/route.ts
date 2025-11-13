import { NextResponse } from "next/server";

/**
 * Instagram Graph API Route
 *
 * Fetches recent media from Instagram account @goeduitje
 *
 * Setup Instructions:
 * 1. Go to https://developers.facebook.com/apps/
 * 2. Create a new Facebook App
 * 3. Add "Instagram Basic Display" product
 * 4. Configure Instagram Basic Display:
 *    - Add Instagram Test User
 *    - Generate User Token
 * 5. Exchange for long-lived token (60 days):
 *    GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret={app-secret}&access_token={short-lived-token}
 * 6. Add INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN to .env
 *
 * API Documentation: https://developers.facebook.com/docs/instagram-basic-display-api
 */

interface InstagramMedia {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

interface InstagramApiResponse {
  data: InstagramMedia[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

// Simple in-memory cache
const cache: {
  data: InstagramMedia[] | null;
  timestamp: number | null;
} = {
  data: null,
  timestamp: null,
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export async function GET() {
  try {
    const userId = process.env.INSTAGRAM_USER_ID;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    // Validate environment variables
    if (!userId || !accessToken) {
      return NextResponse.json(
        {
          error: "Instagram API credentials not configured",
          message:
            "Please set INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN in .env",
        },
        { status: 500 }
      );
    }

    // Check if we have placeholder values (not configured yet)
    if (
      userId === "your_instagram_user_id_here" ||
      accessToken === "your_instagram_access_token_here"
    ) {
      return NextResponse.json(
        {
          error: "Instagram API credentials not configured",
          message:
            "Please update INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN with real values",
        },
        { status: 500 }
      );
    }

    // Check cache first
    const now = Date.now();
    if (
      cache.data &&
      cache.timestamp &&
      now - cache.timestamp < CACHE_DURATION
    ) {
      return NextResponse.json({
        data: cache.data,
        cached: true,
        cacheAge: Math.floor((now - cache.timestamp) / 1000),
      });
    }

    // Fetch from Instagram API
    const fields = "id,media_type,media_url,permalink,caption,timestamp";
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=12&access_token=${accessToken}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Instagram API error:", errorData);

      return NextResponse.json(
        {
          error: "Failed to fetch Instagram posts",
          message: errorData.error?.message || "Unknown error",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data: InstagramApiResponse = await response.json();

    // Filter to only include images and carousels (not videos for simplicity)
    const filteredMedia = data.data
      .filter(
        (item) =>
          item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM"
      )
      .slice(0, 12);

    // Update cache
    cache.data = filteredMedia;
    cache.timestamp = now;

    return NextResponse.json({
      data: filteredMedia,
      cached: false,
      count: filteredMedia.length,
    });
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
