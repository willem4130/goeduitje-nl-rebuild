"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { EASING, ANIMATION_DURATION } from "@/lib/animations";
import { WORKSHOP_BLUR_PLACEHOLDERS } from "@/lib/image-placeholders";

/**
 * Modern carousel showcasing workshop types with Embla
 * Features autoplay, navigation arrows, and responsive design showing 4-5 items
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
}

export function WorkshopCarousel({
  workshops = DEFAULT_WORKSHOPS,
  title = "Onze uitjes",
  subtitle = "Kies jouw ideale uitje",
}: WorkshopCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 640px)": { slidesToScroll: 2 },
        "(min-width: 1024px)": { slidesToScroll: 3 },
      },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

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
          <div className="relative">
            {/* Embla Viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 md:gap-6">
                {workshops.map((workshop, index) => (
                  <WorkshopCard
                    key={workshop.id}
                    workshop={workshop}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 right-0 left-0 z-10 flex -translate-y-1/2 justify-between px-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="bg-background/90 shadow-editorial hover:shadow-editorial-lg flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="bg-background/90 shadow-editorial hover:shadow-editorial-lg flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </div>
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
    </section>
  );
}

/**
 * Individual workshop card component with video support
 */
interface WorkshopCardProps {
  workshop: Workshop;
  index: number;
}

function WorkshopCard({ workshop, index }: WorkshopCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: ANIMATION_DURATION.slow,
        ease: EASING.editorial,
      }}
      className="group relative min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_23%]"
    >
      <Link href={`/onze-uitjes/${workshop.slug}`} className="block">
        <div className="bg-card border-border shadow-editorial hover:shadow-editorial-hover overflow-hidden border transition-all duration-500">
          {/* Media - Video or Image */}
          <div className="bg-muted relative aspect-[4/3] overflow-hidden">
            {workshop.video ? (
              <video
                src={workshop.video}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <Image
                src={workshop.image || ""}
                alt={workshop.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 23vw"
                placeholder="blur"
                blurDataURL={
                  WORKSHOP_BLUR_PLACEHOLDERS[
                    workshop.id as keyof typeof WORKSHOP_BLUR_PLACEHOLDERS
                  ]
                }
              />
            )}
            {/* Sophisticated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />

            {/* Refined price badge */}
            <div className="bg-primary shadow-editorial-sm absolute top-3 right-3 rounded-full px-3 py-1">
              <span className="text-primary-foreground text-xs font-semibold tracking-wide">
                {workshop.price}
              </span>
            </div>
          </div>

          {/* Content - Compact spacing for smaller cards */}
          <div className="p-4">
            <h3 className="text-foreground mb-1 line-clamp-1 text-lg font-semibold tracking-tight">
              {workshop.title}
            </h3>
            <p className="text-primary mb-2 line-clamp-1 text-sm font-medium tracking-tight">
              {workshop.subtitle}
            </p>
            <p className="text-muted-foreground mb-3 line-clamp-2 text-sm leading-relaxed tracking-wide">
              {workshop.description}
            </p>

            {/* Meta info - refined borders */}
            <div className="border-border text-muted-foreground space-y-1 border-t pt-3 text-xs tracking-wide">
              <div className="flex items-center justify-between">
                <span className="font-medium">Duur:</span>
                <span>{workshop.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Groepsgrootte:</span>
                <span className="line-clamp-1">{workshop.groupSize}</span>
              </div>
            </div>

            {/* CTA - refined animation */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-primary text-sm font-semibold tracking-wide">
                Meer info
              </span>
              <ChevronRight className="text-primary h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
