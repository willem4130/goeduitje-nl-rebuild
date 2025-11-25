"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ReviewsSkeletonProps {
  count?: number;
  variant?: "standard" | "featured" | "carousel";
  className?: string;
}

/**
 * Standard review card skeleton for masonry grid
 */
function StandardCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-background shadow-editorial p-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      {/* Stars */}
      <div className="mt-3 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-3" />
        ))}
      </div>
      {/* Quote icon */}
      <Skeleton className="mt-4 h-5 w-5" />
      {/* Text lines */}
      <div className="mt-2 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      {/* Google badge */}
      <div className="border-border mt-4 flex items-center gap-2 border-t pt-4">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/**
 * Featured review card skeleton
 */
function FeaturedCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("bg-background shadow-editorial-lg p-8 sm:p-12", className)}
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Quote mark area */}
        <div className="hidden lg:col-span-2 lg:block">
          <Skeleton className="h-24 w-16" />
        </div>

        {/* Content */}
        <div className="lg:col-span-10">
          {/* Stars */}
          <div className="mb-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-5" />
            ))}
          </div>

          {/* Quote text */}
          <div className="mb-8 space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>

          {/* Attribution */}
          <div className="border-border flex items-center gap-4 border-t pt-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Carousel skeleton for testimonials
 */
function CarouselSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative min-h-[400px]", className)}>
      <div className="mx-auto max-w-5xl">
        <FeaturedCardSkeleton />
      </div>
    </div>
  );
}

/**
 * Masonry grid skeleton with varying heights
 */
export function ReviewsGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  // Varying heights for masonry effect
  const heights = ["h-auto", "h-auto", "h-auto", "h-auto", "h-auto", "h-auto"];

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <StandardCardSkeleton key={i} className={heights[i % heights.length]} />
      ))}
    </div>
  );
}

/**
 * Main ReviewsSkeleton component
 */
export function ReviewsSkeleton({
  count = 6,
  variant = "standard",
  className,
}: ReviewsSkeletonProps) {
  switch (variant) {
    case "featured":
      return <FeaturedCardSkeleton className={className} />;
    case "carousel":
      return <CarouselSkeleton className={className} />;
    default:
      return <ReviewsGridSkeleton count={count} className={className} />;
  }
}

/**
 * Stats skeleton for review statistics section
 */
export function ReviewsStatsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-8", className)}>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-12" />
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4" />
          ))}
        </div>
      </div>
      <Skeleton className="h-5 w-24" />
    </div>
  );
}
