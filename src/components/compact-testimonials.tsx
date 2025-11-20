"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Compact testimonials carousel for sidebar display
 * Features automatic rotation and pause on hover
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

// Featured testimonials for the configurator sidebar
const FEATURED_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "Een geweldige ervaring! Het team van Goeduitje heeft ons bedrijfsuitje tot een onvergetelijke dag gemaakt.",
    author: "Sarah van der Berg",
    role: "HR Manager",
    company: "TechCorp Amsterdam",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "De kookworkshop was fantastisch. Niet alleen hebben we als team beter leren samenwerken.",
    author: "Mohammed Al-Hassan",
    role: "Team Lead",
    company: "Design Studio Rotterdam",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "Het stadsspel was precies wat we nodig hadden - uitdagend, leuk en betekenisvol.",
    author: "Lisa de Vries",
    role: "Operations Director",
    company: "Sustainable Solutions",
    rating: 5,
  },
];

interface CompactTestimonialsProps {
  testimonials?: Testimonial[];
  autoPlayInterval?: number;
}

export function CompactTestimonials({
  testimonials = FEATURED_TESTIMONIALS,
  autoPlayInterval = 5000,
}: CompactTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;

    const interval = setInterval(nextTestimonial, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, nextTestimonial, autoPlayInterval, testimonials.length]);

  const currentTestimonial =
    testimonials[currentIndex] ?? FEATURED_TESTIMONIALS[0];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative"
    >
      <Card className="shadow-editorial overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Quote className="text-primary h-5 w-5" />
              <span className="text-foreground text-sm font-semibold">
                Ervaringen
              </span>
            </div>
            {currentTestimonial.rating && (
              <div className="flex items-center gap-1">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="fill-primary text-primary h-3 w-3" />
                ))}
              </div>
            )}
          </div>

          {/* Testimonial Content */}
          <div className="relative min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <blockquote className="mb-4">
                  <p className="text-foreground text-sm leading-relaxed">
                    &ldquo;{currentTestimonial.quote}&rdquo;
                  </p>
                </blockquote>

                <div className="border-border border-t pt-4">
                  <p className="text-foreground text-sm font-semibold">
                    {currentTestimonial.author}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {currentTestimonial.role}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {currentTestimonial.company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5"
                  }`}
                  aria-label={`Ga naar testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
