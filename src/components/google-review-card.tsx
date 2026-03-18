"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/star-rating";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface GoogleReview {
  id: string;
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string | null;
  relativeTime: string;
  reviewTime: Date;
}

interface GoogleReviewCardProps {
  review: GoogleReview;
  variant?: "standard" | "featured" | "compact";
  className?: string;
}

/**
 * Get initials from author name for avatar fallback
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Standard Google Review Card - for masonry grid
 */
function StandardCard({
  review,
  className,
}: {
  review: GoogleReview;
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = review.text && review.text.length > 200;
  const displayText =
    shouldTruncate && !isExpanded
      ? review.text?.slice(0, 200) + "..."
      : review.text;

  return (
    <motion.div
      className={cn(
        "bg-background shadow-editorial hover:shadow-editorial-hover p-6 transition-shadow duration-300",
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header with Avatar */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          {review.authorPhotoUrl && (
            <AvatarImage src={review.authorPhotoUrl} alt={review.authorName} />
          )}
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
            {getInitials(review.authorName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-foreground font-semibold tracking-tight">
            {review.authorName}
          </p>
        </div>
      </div>

      {/* Star Rating */}
      <div className="mt-3">
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Review Text */}
      {review.text && (
        <div className="mt-4">
          <Quote className="text-primary/30 mb-2 h-5 w-5" />
          <p className="text-foreground/90 text-sm leading-relaxed tracking-wide italic">
            {displayText}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary mt-2 text-sm font-medium hover:underline"
            >
              {isExpanded ? "Minder tonen" : "Lees meer"}
            </button>
          )}
        </div>
      )}

      {/* Google Badge */}
      <div className="border-border mt-4 flex items-center gap-2 border-t pt-4">
        <GoogleIcon className="h-4 w-4" />
        <span className="text-muted-foreground text-xs">Google Review</span>
      </div>
    </motion.div>
  );
}

/**
 * Featured Google Review Card - large editorial style
 */
function FeaturedCard({
  review,
  className,
}: {
  review: GoogleReview;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-background shadow-editorial-lg relative overflow-hidden p-8 sm:p-12",
        className
      )}
    >
      {/* Asymmetric quote layout */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Large decorative quote mark */}
        <div className="hidden lg:col-span-2 lg:block">
          <span className="text-primary/15 font-serif text-[100px] leading-none">
            &ldquo;
          </span>
        </div>

        {/* Quote content */}
        <div className="lg:col-span-10">
          {/* Star Rating */}
          <div className="mb-4">
            <StarRating rating={review.rating} size="lg" />
          </div>

          <blockquote className="mb-8">
            <p className="text-foreground text-xl leading-relaxed font-light italic sm:text-2xl">
              {review.text}
            </p>
          </blockquote>

          {/* Attribution */}
          <div className="border-border flex items-center gap-4 border-t pt-6">
            <Avatar className="h-12 w-12">
              {review.authorPhotoUrl && (
                <AvatarImage
                  src={review.authorPhotoUrl}
                  alt={review.authorName}
                />
              )}
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(review.authorName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-foreground text-lg font-semibold tracking-tight">
                {review.authorName}
              </p>
              <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                <GoogleIcon className="h-4 w-4" />
                <span>Google Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Google Review Card - for sidebar or small spaces
 */
function CompactCard({
  review,
  className,
}: {
  review: GoogleReview;
  className?: string;
}) {
  const truncatedText =
    review.text && review.text.length > 100
      ? review.text.slice(0, 100) + "..."
      : review.text;

  return (
    <div className={cn("bg-background p-4", className)}>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          {review.authorPhotoUrl && (
            <AvatarImage src={review.authorPhotoUrl} alt={review.authorName} />
          )}
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            {getInitials(review.authorName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-sm font-medium">
            {review.authorName}
          </p>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size="sm" />
          </div>
        </div>
      </div>
      {truncatedText && (
        <p className="text-foreground/80 mt-3 text-sm leading-relaxed italic">
          &ldquo;{truncatedText}&rdquo;
        </p>
      )}
    </div>
  );
}

/**
 * Main GoogleReviewCard component with variant support
 */
export function GoogleReviewCard({
  review,
  variant = "standard",
  className,
}: GoogleReviewCardProps) {
  switch (variant) {
    case "featured":
      return <FeaturedCard review={review} className={className} />;
    case "compact":
      return <CompactCard review={review} className={className} />;
    default:
      return <StandardCard review={review} className={className} />;
  }
}

/**
 * Google 'G' Icon
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export { GoogleIcon };
