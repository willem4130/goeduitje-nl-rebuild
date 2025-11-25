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

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "Een geweldige ervaring! Het team van Goeduitje heeft ons bedrijfsuitje tot een onvergetelijke dag gemaakt. De combinatie van plezier en sociale impact is uniek.",
    author: "Sarah van der Berg",
    role: "HR Manager",
    company: "TechCorp Amsterdam",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "De kookworkshop was fantastisch. Niet alleen hebben we als team beter leren samenwerken, maar we weten ook dat we tegelijkertijd iets goeds hebben gedaan voor mensen in nood.",
    author: "Mohammed Al-Hassan",
    role: "Team Lead",
    company: "Design Studio Rotterdam",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "Het stadsspel was precies wat we nodig hadden - uitdagend, leuk en betekenisvol. Onze collega's praten er nog steeds over!",
    author: "Lisa de Vries",
    role: "Operations Director",
    company: "Sustainable Solutions",
    rating: 5,
  },
  {
    id: "4",
    quote:
      "Goeduitje denkt écht met je mee. Van begin tot eind was alles perfect geregeld. De sociale impact maakt het extra bijzonder.",
    author: "Jasper Winters",
    role: "CEO",
    company: "Innovation Hub Utrecht",
    rating: 5,
  },
];

interface TestimonialsCarouselProps {
  testimonials?: Testimonial[];
  autoPlayInterval?: number;
  title?: string;
  subtitle?: string;
  useGoogleReviews?: boolean;
}

export function TestimonialsCarousel({
  testimonials = DEFAULT_TESTIMONIALS,
  autoPlayInterval = 6000,
  title = "Jullie ervaringen",
  subtitle = "Wat onze klanten zeggen",
  useGoogleReviews = false,
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch Google Reviews if enabled
  const {
    data: googleReviews,
    isLoading,
    error,
  } = api.reviews.getFeatured.useQuery(
    { limit: 10 },
    { enabled: useGoogleReviews }
  );

  // Determine which data to use
  const hasGoogleReviews =
    useGoogleReviews && googleReviews && googleReviews.length > 0;
  const displayCount = hasGoogleReviews
    ? googleReviews.length
    : testimonials.length;

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayCount);
  }, [displayCount]);

  const previousTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displayCount) % displayCount);
  }, [displayCount]);

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || displayCount <= 1) return;

    const interval = setInterval(nextTestimonial, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, nextTestimonial, autoPlayInterval, displayCount]);

  // Reset index if it's out of bounds
  useEffect(() => {
    if (currentIndex >= displayCount) {
      setCurrentIndex(0);
    }
  }, [currentIndex, displayCount]);

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

  // Fallback to default testimonials if Google Reviews fails or is empty
  const showGoogleReviews = hasGoogleReviews && !error;

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
            <div className="relative min-h-[400px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {showGoogleReviews ? (
                    <GoogleReviewCard review={googleReviews[currentIndex]!} />
                  ) : (
                    <TestimonialCard
                      testimonial={
                        testimonials[currentIndex] ?? DEFAULT_TESTIMONIALS[0]
                      }
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {displayCount > 1 && (
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
          {displayCount > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: displayCount }).map((_, index) => (
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
    <div className="mx-auto max-w-5xl">
      <div className="bg-background shadow-editorial-lg relative overflow-hidden p-8 sm:p-16">
        {/* Asymmetric quote layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Large decorative quote mark */}
          <div className="hidden lg:col-span-2 lg:block">
            <span className="text-primary/15 font-serif text-[120px] leading-none">
              &ldquo;
            </span>
          </div>

          {/* Quote content */}
          <div className="lg:col-span-10">
            {testimonial.rating && (
              <div className="mb-4">
                <StarRating rating={testimonial.rating} size="lg" />
              </div>
            )}

            <blockquote className="mb-8">
              <p className="text-quote text-foreground leading-relaxed">
                {testimonial.quote}
              </p>
            </blockquote>

            {/* Refined attribution */}
            <div className="border-border flex items-center gap-4 border-t pt-6">
              <div>
                <p className="text-foreground text-lg font-semibold tracking-tight">
                  {testimonial.author}
                </p>
                <p className="text-muted-foreground mt-1 text-sm tracking-wide">
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
    <div className="mx-auto max-w-5xl">
      <div className="bg-background shadow-editorial-lg relative overflow-hidden p-8 sm:p-16">
        {/* Asymmetric quote layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Large decorative quote mark */}
          <div className="hidden lg:col-span-2 lg:block">
            <span className="text-primary/15 font-serif text-[120px] leading-none">
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
              <p className="text-quote text-foreground leading-relaxed">
                {review.text || "Geweldige ervaring!"}
              </p>
            </blockquote>

            {/* Attribution with avatar */}
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
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm tracking-wide">
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
