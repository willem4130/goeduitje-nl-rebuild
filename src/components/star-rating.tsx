"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  className,
}: StarRatingProps) {
  const roundedRating = Math.round(rating);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            sizeClasses[size],
            index < roundedRating
              ? "fill-primary text-primary"
              : "text-muted-foreground/30 fill-muted-foreground/10"
          )}
        />
      ))}
      {showValue && (
        <span className="text-muted-foreground ml-2 text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
