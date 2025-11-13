"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";

/**
 * Auto-rotating testimonials carousel
 * Features automatic rotation, manual navigation, and pause on hover
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
}

export function TestimonialsCarousel({
  testimonials = DEFAULT_TESTIMONIALS,
  autoPlayInterval = 6000,
  title = "Jullie ervaringen",
  subtitle = "Wat onze klanten zeggen",
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const previousTestimonial = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;

    const interval = setInterval(nextTestimonial, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, nextTestimonial, autoPlayInterval, testimonials.length]);

  return (
    <section className="bg-accent section-md relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="slideUp">
          <div className="mb-16 text-center">
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
                  <TestimonialCard
                    testimonial={
                      testimonials[currentIndex] ?? DEFAULT_TESTIMONIALS[0]
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
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
          {testimonials.length > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {testimonials.map((_, index) => (
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
