import { z } from "zod";

// Schema for a single Google Review from database
export const googleReviewSchema = z.object({
  id: z.string(),
  googleReviewId: z.string(),
  authorName: z.string(),
  authorPhotoUrl: z.string().nullable(),
  rating: z.number().min(1).max(5),
  text: z.string().nullable(),
  relativeTime: z.string(),
  reviewTime: z.date(),
  language: z.string(),
  sortOrder: z.enum(["most_relevant", "newest"]),
  isVisible: z.boolean(),
  fetchedAt: z.date(),
  lastSeenAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GoogleReviewType = z.infer<typeof googleReviewSchema>;

// Schema for get reviews query parameters
export const getReviewsQuerySchema = z
  .object({
    sortBy: z.enum(["rating", "reviewTime"]).default("reviewTime"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    minRating: z.number().min(1).max(5).optional(),
    limit: z.number().min(1).max(100).default(10),
    visibleOnly: z.boolean().default(true),
  })
  .optional();

export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>;

// Schema for get featured reviews
export const getFeaturedReviewsSchema = z
  .object({
    limit: z.number().min(1).max(10).default(5),
  })
  .optional();

export type GetFeaturedReviewsQuery = z.infer<typeof getFeaturedReviewsSchema>;

// Schema for admin visibility toggle
export const toggleReviewVisibilitySchema = z.object({
  reviewId: z.string(),
  isVisible: z.boolean(),
});

export type ToggleReviewVisibilityInput = z.infer<
  typeof toggleReviewVisibilitySchema
>;

// Schema for refresh request
export const refreshReviewsSchema = z
  .object({
    forceRefresh: z.boolean().default(false),
  })
  .optional();

export type RefreshReviewsInput = z.infer<typeof refreshReviewsSchema>;
