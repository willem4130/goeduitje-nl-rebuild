"use client";

import { motion, useMotionValue } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ChevronRight } from "lucide-react";
import { EASING, ANIMATION_DURATION } from "@/lib/animations";

/**
 * Horizontal scrolling carousel showcasing workshop types
 * Features drag-to-scroll, snap scrolling, and responsive cards
 */

export interface Workshop {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
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
    image: "/images/workshops/kookworkshop.jpg",
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
    image: "/images/workshops/stadsspel.jpg",
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
}

export function WorkshopCarousel({
  workshops = DEFAULT_WORKSHOPS,
  title = "Onze workshops",
  subtitle = "Kies jouw ideale uitje",
}: WorkshopCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);

  return (
    <section className="bg-background section-md relative overflow-hidden">
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

        {/* Carousel Container */}
        <ScrollReveal animation="slideUp" delay={0.2}>
          <div className="relative -mx-6 px-6 sm:-mx-8 sm:px-8">
            <motion.div
              ref={containerRef}
              className="flex cursor-grab gap-6 overflow-x-auto pb-8 active:cursor-grabbing"
              style={{ x }}
              drag="x"
              dragConstraints={containerRef}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              whileTap={{ cursor: "grabbing" }}
            >
              {workshops.map((workshop, index) => (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  isDragging={isDragging}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        </ScrollReveal>

        {/* View All CTA */}
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
      </div>

      {/* Gradient overlays for scroll hint */}
      <div className="from-background pointer-events-none absolute top-0 left-0 h-full w-32 bg-gradient-to-r to-transparent" />
      <div className="from-background pointer-events-none absolute top-0 right-0 h-full w-32 bg-gradient-to-l to-transparent" />
    </section>
  );
}

/**
 * Individual workshop card component
 */
interface WorkshopCardProps {
  workshop: Workshop;
  isDragging: boolean;
  index: number;
}

function WorkshopCard({ workshop, isDragging, index }: WorkshopCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: ANIMATION_DURATION.slow,
        ease: EASING.editorial,
      }}
      whileHover={{ y: -4 }}
      className="group relative min-w-[320px] flex-shrink-0 sm:min-w-[380px]"
    >
      <Link
        href={`/onze-uitjes/${workshop.slug}`}
        className={`block ${isDragging ? "pointer-events-none" : ""}`}
      >
        <div className="bg-card border-border shadow-editorial hover:shadow-editorial-hover overflow-hidden border transition-all duration-500">
          {/* Image */}
          <div className="bg-muted relative aspect-[4/3] overflow-hidden">
            <Image
              src={workshop.image}
              alt={workshop.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 320px, 380px"
            />
            {/* Sophisticated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-50" />

            {/* Refined price badge */}
            <div className="bg-primary shadow-editorial-sm absolute top-4 right-4 rounded-full px-4 py-1.5">
              <span className="text-primary-foreground text-sm font-semibold tracking-wide">
                {workshop.price}
              </span>
            </div>
          </div>

          {/* Content - More generous spacing */}
          <div className="p-8">
            <h3 className="text-foreground mb-2 text-2xl font-semibold tracking-tight">
              {workshop.title}
            </h3>
            <p className="text-primary mb-4 text-lg font-medium tracking-tight">
              {workshop.subtitle}
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed tracking-wide">
              {workshop.description}
            </p>

            {/* Meta info - refined borders */}
            <div className="border-border text-muted-foreground space-y-2 border-t pt-4 text-sm tracking-wide">
              <div className="flex items-center justify-between">
                <span className="font-medium">Duur:</span>
                <span>{workshop.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Groepsgrootte:</span>
                <span>{workshop.groupSize}</span>
              </div>
            </div>

            {/* CTA Arrow - refined animation */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-primary font-semibold tracking-wide">
                Meer info
              </span>
              <ChevronRight className="text-primary h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
