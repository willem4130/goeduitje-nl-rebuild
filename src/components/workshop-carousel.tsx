"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ChevronRight } from "lucide-react";
import { EASING, ANIMATION_DURATION } from "@/lib/animations";
import { WORKSHOP_BLUR_PLACEHOLDERS } from "@/lib/image-placeholders";
import { cn } from "@/lib/utils";

/**
 * Workshop grid with clean 3x2 layout
 * Optimized to fit viewport - 3 columns on desktop, responsive on smaller screens
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

const DEFAULT_WORKSHOPS: Workshop[] = [
  {
    id: "kookworkshop",
    title: "Kookworkshop",
    subtitle: "Samen koken, samen genieten",
    description:
      "Bereid samen een heerlijke maaltijd en leer nieuwe recepten terwijl je impact maakt",
    video: "/images/workshops/workshop 1.mp4",
    slug: "kookworkshop",
    duration: "3-4 uur",
    groupSize: "8-30 personen",
    price: "Vanaf €45 p.p.",
  },
  {
    id: "stadsspel",
    title: "Stadsspel",
    subtitle: "Ontdek de stad op een nieuwe manier",
    description:
      "Een interactieve speurtocht door de stad met uitdagende opdrachten en verrassende ontdekkingen",
    video: "/images/workshops/workshop 2.mp4",
    slug: "stadsspel",
    duration: "2-3 uur",
    groupSize: "8-40 personen",
    price: "Vanaf €35 p.p.",
  },
  {
    id: "the-game",
    title: "The Game",
    subtitle: "Teamwork onder druk",
    description:
      "Een intense team challenge waarbij samenwerking en strategie centraal staan",
    image: "/images/workshops/the-game.jpg",
    slug: "the-game",
    duration: "2-3 uur",
    groupSize: "10-50 personen",
    price: "Vanaf €40 p.p.",
  },
  {
    id: "koffie-thee",
    title: "Koffie & Thee Workshop",
    subtitle: "De kunst van brouwen",
    description:
      "Leer alles over koffiebonen en thee, van herkomst tot perfecte bereiding",
    image: "/images/workshops/koffie-thee.jpg",
    slug: "koffie-thee-workshop",
    duration: "2-3 uur",
    groupSize: "8-25 personen",
    price: "Vanaf €40 p.p.",
  },
  {
    id: "beachvolleybal",
    title: "Beachvolleybal Workshop",
    subtitle: "Sport, zon en strand",
    description:
      "Actieve teambuilding op het strand met professionele coaching en leuke challenges",
    image: "/images/workshops/beachvolleybal.jpg",
    slug: "beachvolleybal-workshop",
    duration: "2-3 uur",
    groupSize: "12-40 personen",
    price: "Vanaf €35 p.p.",
  },
];

interface WorkshopCarouselProps {
  workshops?: Workshop[];
  title?: string;
  subtitle?: string;
  showViewAllButton?: boolean;
}

export function WorkshopCarousel({
  workshops = DEFAULT_WORKSHOPS,
  title = "Onze uitjes",
  subtitle = "Kies jouw ideale uitje",
  showViewAllButton = true,
}: WorkshopCarouselProps) {
  return (
    <section className="bg-background section-md relative overflow-hidden">
      <div className="container mx-auto px-2 lg:px-4 xl:px-6">
        {/* Section Header */}
        <ScrollReveal animation="slideUp">
          <div className="mb-6 text-center">
            <h2 className="text-primary tracking-tight">{title}</h2>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed tracking-wide sm:text-xl">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Workshop Grid - Full-width 5x1 Layout on desktop */}
        <ScrollReveal animation="slideUp" delay={0.2}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
            {workshops.map((workshop, index) => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                index={index}
              />
            ))}
          </div>
        </ScrollReveal>

        {/* View All CTA */}
        {showViewAllButton && (
          <ScrollReveal animation="slideUp" delay={0.4}>
            <div className="mt-12 text-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/onze-uitjes" className="group">
                  Bekijk alle workshops
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
      <Link href={`/onze-uitjes/${workshop.slug}`} className="block">
        <div className="bg-card border-border shadow-editorial hover:shadow-editorial-hover overflow-hidden border transition-all duration-500 hover:scale-[1.02]">
          {/* Media - Portrait aspect ratio for maximum prominence */}
          <div className="bg-muted relative aspect-[4/5] overflow-hidden">
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
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={
                  WORKSHOP_BLUR_PLACEHOLDERS[
                    workshop.id as keyof typeof WORKSHOP_BLUR_PLACEHOLDERS
                  ]
                }
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />

            {/* Price badge */}
            <div className="bg-primary shadow-editorial absolute top-3 right-3 rounded-full px-3 py-1">
              <span className="text-primary-foreground text-xs font-bold tracking-wide">
                {workshop.price}
              </span>
            </div>
          </div>

          {/* Content - Ultra compact layout */}
          <div className="p-3">
            <h3 className="text-foreground mb-1 line-clamp-1 text-lg font-bold tracking-tight">
              {workshop.title}
            </h3>
            <p className="text-primary mb-2 line-clamp-1 text-sm font-semibold tracking-tight">
              {workshop.subtitle}
            </p>
            <p className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">
              {workshop.description}
            </p>

            {/* Meta info */}
            <div className="border-border text-muted-foreground space-y-1 border-t pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Duur:</span>
                <span>{workshop.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Groepsgrootte:</span>
                <span className="line-clamp-1">{workshop.groupSize}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-primary text-sm font-bold tracking-wide">
                Meer info
              </span>
              <ChevronRight className="text-primary h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
