"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { FEATURED_CITIES, OTHER_CITIES } from "@/lib/city-data";

interface CityGalleryProps {
  title?: string;
  description?: string;
}

/**
 * City gallery component for displaying kookworkshop locations
 *
 * Features:
 * - Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
 * - City cards with background images and name overlay
 * - Links to /kookworkshop-[city] landing pages
 * - "Andere populaire steden" section with text links
 *
 * Used on: /onze-uitjes/kookworkshop
 */
export function CityGallery({
  title = "Locaties",
  description = "Onze kookworkshops kunnen op een locatie naar keuze worden ingepland. Bekijk hieronder de populairste steden waar we actief zijn.",
}: CityGalleryProps) {
  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <ScrollReveal animation="slideUp">
          <div className="mb-10 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5 text-amber-600" />
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h2>
            </div>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              {description}
            </p>
          </div>
        </ScrollReveal>

        {/* Featured cities grid */}
        <StaggerChildren
          staggerDelay={0.05}
          childAnimation="scale"
          className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURED_CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/kookworkshop-${city.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl"
            >
              <Image
                src={city.image}
                alt={`Kookworkshop ${city.name}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

              {/* City name */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-lg font-bold text-white transition-transform group-hover:translate-y-[-2px]">
                  {city.name}
                </h3>
                <p className="text-sm text-white/80">Kookworkshop →</p>
              </div>
            </Link>
          ))}
        </StaggerChildren>

        {/* Other cities - text links */}
        <ScrollReveal animation="fade" delay={0.3}>
          <div className="rounded-xl border bg-amber-50/50 p-6">
            <h3 className="mb-4 font-semibold text-gray-900">
              Andere populaire steden:
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {OTHER_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/kookworkshop-${city.slug}`}
                  className="text-sm text-amber-700 underline-offset-2 transition-colors hover:text-amber-900 hover:underline"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
