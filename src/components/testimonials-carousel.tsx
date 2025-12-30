"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/star-rating";
import { GoogleIcon } from "@/components/google-review-card";
import { ReviewsSkeleton } from "@/components/reviews-skeleton";
import { api } from "@/trpc/client";

/**
 * Auto-rotating testimonials carousel
 * Features automatic rotation, manual navigation, and pause on hover
 * Supports both static testimonials and Google Reviews
 */

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
  rating?: number;
}

export interface GoogleReviewData {
  id: string;
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string | null;
  relativeTime: string;
}

interface TestimonialsCarouselProps {
  testimonials?: Testimonial[];
  autoPlayInterval?: number;
  title?: string;
  subtitle?: string;
  useGoogleReviews?: boolean;
  /** Fetch testimonials from database instead of using static fallback */
  useCustomTestimonials?: boolean;
  /** Show 2 testimonials side by side (default: true) */
  showPaired?: boolean;
}

export function TestimonialsCarousel({
  testimonials: propTestimonials,
  autoPlayInterval = 6000,
  title = "Jullie ervaringen",
  subtitle = "Wat onze klanten zeggen",
  useGoogleReviews = false,
  useCustomTestimonials = false,
  showPaired = true,
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch Google Reviews if enabled
  const {
    data: googleReviews,
    isLoading: isLoadingGoogle,
    error: googleError,
  } = api.reviews.getFeatured.useQuery(
    { limit: 10 },
    { enabled: useGoogleReviews }
  );

  // Fetch custom testimonials from database if enabled
  const { data: dbTestimonials, isLoading: isLoadingCustom } =
    api.testimonials.getFeatured.useQuery(undefined, {
      enabled: useCustomTestimonials && !propTestimonials,
    });

  // Transform DB testimonials to component format
  const customTestimonials: Testimonial[] = dbTestimonials
    ? dbTestimonials.map((t) => ({
        id: t.id,
        quote: t.quote,
        author: t.author,
        role: t.role || "",
        company: t.company || "",
        image: t.image || undefined,
        rating: t.rating,
      }))
    : [];

  // Priority: props > database > null (no fallback to fake data)
  const testimonials =
    propTestimonials ||
    (useCustomTestimonials && customTestimonials.length > 0
      ? customTestimonials
      : []);

  const isLoading =
    isLoadingGoogle || (useCustomTestimonials && isLoadingCustom);

  // Determine which data to use
  const hasGoogleReviews =
    useGoogleReviews && googleReviews && googleReviews.length > 0;
  const itemCount = hasGoogleReviews
    ? googleReviews.length
    : testimonials.length;

  // When showing paired, we navigate by pairs (2 at a time)
  const pairCount = showPaired ? Math.ceil(itemCount / 2) : itemCount;

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % pairCount);
  }, [pairCount]);

  const previousTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + pairCount) % pairCount);
  }, [pairCount]);

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  // Get the current pair of items to display
  const getCurrentPair = () => {
    if (hasGoogleReviews && googleReviews) {
      const startIndex = showPaired ? currentIndex * 2 : currentIndex;
      const first = googleReviews[startIndex];
      const second = showPaired ? googleReviews[startIndex + 1] : undefined;
      return { first, second, isGoogle: true };
    }
    const startIndex = showPaired ? currentIndex * 2 : currentIndex;
    const first = testimonials[startIndex];
    const second = showPaired ? testimonials[startIndex + 1] : undefined;
    return { first, second, isGoogle: false };
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || pairCount <= 1) return;

    const interval = setInterval(nextTestimonial, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, nextTestimonial, autoPlayInterval, pairCount]);

  // Reset index if it's out of bounds
  useEffect(() => {
    if (currentIndex >= pairCount) {
      setCurrentIndex(0);
    }
  }, [currentIndex, pairCount]);

  // Show loading state for Google Reviews
  if (useGoogleReviews && isLoading) {
    return (
      <section className="bg-accent section-md relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-10 text-center">
              <h2 className="text-primary tracking-tight">{title}</h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed tracking-wide sm:text-xl">
                {subtitle}
              </p>
            </div>
          </ScrollReveal>
          <ReviewsSkeleton variant="carousel" />
        </div>
      </section>
    );
  }

  // Check if Google Reviews available
  const showGoogleReviews = hasGoogleReviews && !googleError;

  // Return null if no data available (no fake fallbacks)
  if (!showGoogleReviews && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-accent section-md relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="slideUp">
          <div className="mb-10 text-center">
            <h2 className="text-primary tracking-tight">{title}</h2>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed tracking-wide sm:text-xl">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <ScrollReveal animation="slideUp" delay={0.2}>
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Testimonial Container */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {showPaired ? (
                    <PairedTestimonials pair={getCurrentPair()} />
                  ) : showGoogleReviews ? (
                    <GoogleReviewCard review={googleReviews[currentIndex]!} />
                  ) : testimonials[currentIndex] ? (
                    <TestimonialCard testimonial={testimonials[currentIndex]} />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {pairCount > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousTestimonial}
                  className="bg-background absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg transition-all hover:scale-110 sm:-left-4 sm:translate-x-0"
                  aria-label="Vorige testimonial"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="bg-background absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg transition-all hover:scale-110 sm:-right-4 sm:translate-x-0"
                  aria-label="Volgende testimonial"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {pairCount > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: pairCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2"
                  }`}
                  aria-label={`Ga naar testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Google Attribution */}
          {showGoogleReviews && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <GoogleIcon className="h-4 w-4" />
              <span className="text-muted-foreground text-xs">
                Geverifieerde reviews van Google
              </span>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}

/**
 * Individual testimonial card - Editorial pull-quote design
 */
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="bg-background shadow-editorial-lg relative overflow-hidden rounded-lg p-6 sm:p-10">
        {/* Asymmetric quote layout */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Large decorative quote mark */}
          <div className="hidden lg:col-span-2 lg:block">
            <span className="text-primary/15 font-serif text-[80px] leading-none">
              &ldquo;
            </span>
          </div>

          {/* Quote content */}
          <div className="lg:col-span-10">
            {testimonial.rating && (
              <div className="mb-3">
                <StarRating rating={testimonial.rating} size="md" />
              </div>
            )}

            <blockquote className="mb-5">
              <p className="text-foreground text-lg leading-relaxed italic sm:text-xl">
                {testimonial.quote}
              </p>
            </blockquote>

            {/* Refined attribution */}
            <div className="border-border flex items-center gap-3 border-t pt-4">
              <div>
                <p className="text-foreground font-semibold tracking-tight">
                  {testimonial.author}
                </p>
                <p className="text-muted-foreground text-sm tracking-wide">
                  {testimonial.role} · {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
 * Google Review card for carousel - Editorial pull-quote design
 */
function GoogleReviewCard({ review }: { review: GoogleReviewData }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="bg-background shadow-editorial-lg relative overflow-hidden rounded-lg p-6 sm:p-10">
        {/* Asymmetric quote layout */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Large decorative quote mark */}
          <div className="hidden lg:col-span-2 lg:block">
            <span className="text-primary/15 font-serif text-[80px] leading-none">
              &ldquo;
            </span>
          </div>

          {/* Quote content */}
          <div className="lg:col-span-10">
            {/* Star Rating */}
            <div className="mb-3">
              <StarRating rating={review.rating} size="md" />
            </div>

            <blockquote className="mb-5">
              <p className="text-foreground text-lg leading-relaxed italic sm:text-xl">
                {review.text || "Geweldige ervaring!"}
              </p>
            </blockquote>

            {/* Attribution with avatar */}
            <div className="border-border flex items-center gap-3 border-t pt-4">
              <Avatar className="h-10 w-10">
                {review.authorPhotoUrl && (
                  <AvatarImage
                    src={review.authorPhotoUrl}
                    alt={review.authorName}
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {getInitials(review.authorName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-foreground font-semibold tracking-tight">
                  {review.authorName}
                </p>
                <div className="text-muted-foreground flex items-center gap-2 text-sm tracking-wide">
                  <GoogleIcon className="h-4 w-4" />
                  <span>Google Review · {review.relativeTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Paired testimonials display - 2 smaller cards side by side
 */
interface PairedTestimonialsProps {
  pair: {
    first: GoogleReviewData | Testimonial | undefined;
    second: GoogleReviewData | Testimonial | undefined;
    isGoogle: boolean;
  };
}

function PairedTestimonials({ pair }: PairedTestimonialsProps) {
  const { first, second, isGoogle } = pair;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 md:grid-cols-2">
        {first &&
          (isGoogle ? (
            <CompactGoogleReviewCard review={first as GoogleReviewData} />
          ) : (
            <CompactTestimonialCard testimonial={first as Testimonial} />
          ))}
        {second &&
          (isGoogle ? (
            <CompactGoogleReviewCard review={second as GoogleReviewData} />
          ) : (
            <CompactTestimonialCard testimonial={second as Testimonial} />
          ))}
      </div>
    </div>
  );
}

/**
 * Compact testimonial card for paired display
 */
function CompactTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-background shadow-editorial relative overflow-hidden rounded-lg p-5 sm:p-6">
      {/* Quote mark */}
      <span className="text-primary/10 absolute -top-2 -left-1 font-serif text-[60px] leading-none">
        &ldquo;
      </span>

      <div className="relative">
        {testimonial.rating && (
          <div className="mb-2">
            <StarRating rating={testimonial.rating} size="sm" />
          </div>
        )}

        <blockquote className="mb-4">
          <p className="text-foreground line-clamp-4 text-sm leading-relaxed italic">
            {testimonial.quote}
          </p>
        </blockquote>

        {/* Attribution */}
        <div className="border-border border-t pt-3">
          <p className="text-foreground text-sm font-semibold tracking-tight">
            {testimonial.author}
          </p>
          <p className="text-muted-foreground text-xs tracking-wide">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Google Review card for paired display
 */
function CompactGoogleReviewCard({ review }: { review: GoogleReviewData }) {
  return (
    <div className="bg-background shadow-editorial relative overflow-hidden rounded-lg p-5 sm:p-6">
      {/* Quote mark */}
      <span className="text-primary/10 absolute -top-2 -left-1 font-serif text-[60px] leading-none">
        &ldquo;
      </span>

      <div className="relative">
        <div className="mb-2">
          <StarRating rating={review.rating} size="sm" />
        </div>

        <blockquote className="mb-4">
          <p className="text-foreground line-clamp-4 text-sm leading-relaxed italic">
            {review.text || "Geweldige ervaring!"}
          </p>
        </blockquote>

        {/* Attribution with avatar */}
        <div className="border-border flex items-center gap-2 border-t pt-3">
          <Avatar className="h-8 w-8">
            {review.authorPhotoUrl && (
              <AvatarImage
                src={review.authorPhotoUrl}
                alt={review.authorName}
              />
            )}
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {getInitials(review.authorName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-sm font-semibold tracking-tight">
              {review.authorName}
            </p>
            <div className="text-muted-foreground flex items-center gap-1 text-xs tracking-wide">
              <GoogleIcon className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{review.relativeTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
