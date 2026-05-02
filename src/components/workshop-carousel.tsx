"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ChevronRight, Loader2 } from "lucide-react";
import { EASING, ANIMATION_DURATION } from "@/lib/animations";
import { WORKSHOP_BLUR_PLACEHOLDERS } from "@/lib/image-placeholders";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/client";

/**
 * Workshop grid with clean 3x2 layout
 * Optimized to fit viewport - 3 columns on desktop, responsive on smaller screens
 * Fetches workshops from database with fallback to static content
 */

export interface Workshop {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  video?: string;
  slug: string;
  duration: string;
  groupSize: string;
  price: string;
}

// Helper to get lowest price from price tiers
function getLowestPrice(
  priceTiers: Array<{ priceExclBtw: number }>,
  variants: Array<{ priceTiers: Array<{ priceExclBtw: number }> }>
): string {
  let lowest = Infinity;
  for (const tier of priceTiers) {
    if (tier.priceExclBtw < lowest) lowest = tier.priceExclBtw;
  }
  for (const variant of variants) {
    for (const tier of variant.priceTiers) {
      if (tier.priceExclBtw < lowest) lowest = tier.priceExclBtw;
    }
  }
  return lowest === Infinity ? "Op aanvraag" : `Vanaf €${lowest} p.p.`;
}

interface WorkshopCarouselProps {
  workshops?: Workshop[];
  title?: string;
  subtitle?: string;
  showViewAllButton?: boolean;
  compact?: boolean;
  maxItems?: number;
}

export function WorkshopCarousel({
  workshops: propWorkshops,
  title = "Onze uitjes",
  subtitle = "Kies jouw ideale uitje",
  showViewAllButton = true,
  compact = false,
  maxItems = 12,
}: WorkshopCarouselProps) {
  // Fetch workshops from database
  const { data: dbWorkshops, isLoading } = api.workshop.list.useQuery(
    {},
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: false,
    }
  );

  // Transform DB workshops to component format
  const workshops: Workshop[] = propWorkshops
    ? propWorkshops
    : (dbWorkshops || []).slice(0, maxItems).map((w) => ({
        id: w.id,
        title: w.title,
        subtitle: w.subtitle,
        description: w.description,
        image: w.image || undefined,
        video: w.video || undefined,
        slug: w.slug,
        duration: w.duration,
        groupSize: w.groupSize,
        price:
          w.slug === "duurzame-dag"
            ? "€5.960 voor 8 pers., +€160 p.p. extra"
            : getLowestPrice(w.priceTiers, w.variants),
      }));

  return (
    <section
      className={`bg-background relative overflow-hidden ${compact ? "" : "py-4 lg:py-6"}`}
    >
      <div className="container mx-auto px-3 lg:px-6">
        {/* Section Header */}
        {!compact && (
          <ScrollReveal animation="slideUp">
            <div className="mb-3 text-center">
              <h2 className="text-primary text-xl tracking-tight lg:text-2xl">
                {title}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {subtitle}
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Loading State */}
        {isLoading && !propWorkshops ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : workshops.length > 0 ? (
          /* Workshop Grid - 3x2 Layout to fit viewport */
          <ScrollReveal animation="slideUp" delay={0.2}>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-3 lg:gap-2.5">
              {workshops.map((workshop, index) => (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  index={index}
                />
              ))}
            </div>
          </ScrollReveal>
        ) : (
          <div className="text-muted-foreground py-16 text-center">
            Geen workshops gevonden.
          </div>
        )}

        {/* View All CTA */}
        {showViewAllButton && workshops.length > 0 && (
          <ScrollReveal animation="slideUp" delay={0.4}>
            <div className="mt-4 text-center">
              <Button asChild variant="outline">
                <Link href="/onze-uitjes" className="group">
                  Bekijk alle uitjes
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

/**
 * Standard workshop card for grid items
 */
interface WorkshopCardProps {
  workshop: Workshop;
  index: number;
  className?: string;
}

function WorkshopCard({ workshop, index, className }: WorkshopCardProps) {
  const blurDataURL =
    WORKSHOP_BLUR_PLACEHOLDERS[
      workshop.slug as keyof typeof WORKSHOP_BLUR_PLACEHOLDERS
    ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: ANIMATION_DURATION.slow,
        ease: EASING.editorial,
      }}
      className={cn("group relative", className)}
    >
      <Link
        href={
          workshop.slug === "kookworkshop"
            ? "/kookworkshop"
            : `/onze-uitjes/${workshop.slug}`
        }
        className="block"
      >
        <div className="bg-card border-border shadow-editorial hover:shadow-editorial-hover overflow-hidden border transition-all duration-500 hover:scale-[1.02]">
          {/* Media - 16:9 aspect ratio for compact viewport fit */}
          <div className="bg-muted relative aspect-video overflow-hidden">
            {workshop.video ? (
              <video
                src={workshop.video}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <Image
                src={workshop.image || ""}
                alt={workshop.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                placeholder={blurDataURL ? "blur" : "empty"}
                blurDataURL={blurDataURL}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />

            {/* Price badge */}
            <div className="bg-primary shadow-editorial absolute top-2 right-2 rounded-full px-1.5 py-0.5 sm:px-2">
              <span className="text-primary-foreground text-[8px] font-bold tracking-wide sm:text-[10px]">
                {workshop.price}
              </span>
            </div>
          </div>

          {/* Content - Ultra compact layout for 3x2 grid */}
          <div className="p-1.5 sm:p-2">
            <h3 className="text-foreground mb-0.5 line-clamp-1 text-xs font-bold tracking-tight sm:text-sm">
              {workshop.title}
            </h3>
            <p className="text-primary mb-1 line-clamp-1 text-xs font-medium">
              {workshop.subtitle}
            </p>

            {/* Meta info - single line */}
            <div className="text-muted-foreground flex items-center gap-1.5 text-[9px] sm:gap-3 sm:text-[10px]">
              <span>{workshop.duration}</span>
              <span>•</span>
              <span className="line-clamp-1">{workshop.groupSize}</span>
            </div>

            {/* CTA */}
            <div className="mt-1 flex items-center justify-between sm:mt-1.5">
              <span className="text-primary text-xs font-semibold">
                Meer info
              </span>
              <ChevronRight className="text-primary h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
