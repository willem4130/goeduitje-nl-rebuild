"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Heart, Users, Globe, ArrowRight } from "lucide-react";

/**
 * Impact statistics section with animated counters
 * Shows social impact in Yemen, Syria, and Palestine
 * Numbers animate when scrolled into view
 */

export interface ImpactStat {
  id: string;
  value: number;
  label: string;
  description: string;
  icon: "heart" | "users" | "globe";
  location?: string;
}

const DEFAULT_STATS: ImpactStat[] = [
  {
    id: "meals",
    value: 15420,
    label: "Maaltijden gedoneerd",
    description: "Warme maaltijden voor gezinnen in nood",
    icon: "heart",
    location: "Jemen",
  },
  {
    id: "people",
    value: 8750,
    label: "Mensen geholpen",
    description: "Directe hulp aan mensen in crisissituaties",
    icon: "users",
    location: "Syrië",
  },
  {
    id: "projects",
    value: 42,
    label: "Projecten ondersteund",
    description: "Lokale initiatieven die gemeenschappen versterken",
    icon: "globe",
    location: "Palestina",
  },
];

interface ImpactStatsProps {
  stats?: ImpactStat[];
  title?: string;
  subtitle?: string;
  showCta?: boolean;
}

export function ImpactStats({
  stats = DEFAULT_STATS,
  title = "Onze impact",
  subtitle = "Samen maken we het verschil",
  showCta = true,
}: ImpactStatsProps) {
  return (
    <section className="bg-secondary section-md relative overflow-hidden">
      {/* Sophisticated background layering */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="from-secondary/50 to-secondary absolute inset-0 bg-gradient-to-b" />
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header - Editorial Typography */}
        <ScrollReveal animation="slideUp">
          <div className="mb-20 max-w-3xl">
            <h2 className="text-[56px] leading-[1.1] tracking-tight text-white">
              {title}
            </h2>
            <p className="mt-6 text-xl leading-relaxed tracking-wide text-white/90">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Grid - Asymmetric Editorial Layout */}
        <StaggerChildren
          staggerDelay={0.15}
          className="grid gap-8 md:grid-cols-12"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={
                index === 0
                  ? "md:col-span-5"
                  : index === 1
                    ? "md:col-span-4"
                    : "md:col-span-3"
              }
            >
              <StatCard stat={stat} />
            </div>
          ))}
        </StaggerChildren>

        {/* Impact Locations - Refined Spacing */}
        <ScrollReveal animation="slideUp" delay={0.5}>
          <div className="mt-24">
            <p className="mb-8 text-lg tracking-wide text-white/90">
              Met jouw bedrijfsuitje steun je projecten in:
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <LocationBadge name="Jemen" />
              <LocationBadge name="Syrië" />
              <LocationBadge name="Palestina" />
            </div>
          </div>
        </ScrollReveal>

        {/* CTA - Editorial Button Treatment */}
        {showCta && (
          <ScrollReveal animation="slideUp" delay={0.7}>
            <div className="mt-16">
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="group hover:text-secondary hover:shadow-editorial-lg border-white bg-white/10 px-8 py-6 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white"
                >
                  <Link
                    href="/onze-impact"
                    className="font-semibold tracking-wide"
                  >
                    Lees meer over onze impact
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

/**
 * Individual stat card with animated counter - Editorial Treatment
 */
function StatCard({ stat }: { stat: ImpactStat }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const IconComponent =
    stat.icon === "heart" ? Heart : stat.icon === "users" ? Users : Globe;

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group hover:shadow-editorial-hover rounded-lg border border-white/20 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
    >
      {/* Icon - Subtle Size */}
      <div className="mb-8 flex">
        <div className="rounded-full bg-white/10 p-3 transition-colors duration-300 group-hover:bg-white/20">
          <IconComponent className="h-6 w-6 text-white/80" />
        </div>
      </div>

      {/* Animated Counter - Large, Light Weight */}
      <div className="mb-6">
        <AnimatedCounter
          from={0}
          to={stat.value}
          isInView={isInView}
          className="text-[72px] leading-none font-light tracking-tight text-white"
        />
      </div>

      {/* Label - Refined Typography */}
      <h3 className="mb-3 text-xl font-semibold tracking-tight text-white">
        {stat.label}
      </h3>

      {/* Description - Generous Line Height */}
      <p className="text-sm leading-relaxed tracking-wide text-white/80">
        {stat.description}
      </p>

      {/* Location badge - Subtle */}
      {stat.location && (
        <div className="mt-6">
          <span className="inline-block border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-wider text-white/90">
            {stat.location}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Animated counter component using Framer Motion - Editorial Easing
 */
interface AnimatedCounterProps {
  from: number;
  to: number;
  isInView: boolean;
  className?: string;
}

function AnimatedCounter({
  from,
  to,
  isInView,
  className,
}: AnimatedCounterProps) {
  const count = useSpring(from, {
    stiffness: 40,
    damping: 35,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (isInView) {
      count.set(to);
    }
  }, [isInView, count, to]);

  const rounded = useTransform(count, (latest) => Math.round(latest));
  const formatted = useTransform(rounded, (latest) =>
    latest.toLocaleString("nl-NL")
  );

  return <motion.span className={className}>{formatted}</motion.span>;
}

/**
 * Location badge component - Editorial Refinement
 */
function LocationBadge({ name }: { name: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="group hover:shadow-editorial relative overflow-hidden border border-white/30 bg-white/10 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20"
    >
      <span className="relative z-10 text-base font-semibold tracking-wide text-white">
        {name}
      </span>
      <div className="absolute inset-0 -z-0 translate-y-full bg-white transition-transform duration-300 group-hover:translate-y-0" />
      <span className="text-secondary absolute inset-0 z-10 flex items-center justify-center text-base font-semibold tracking-wide opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {name}
      </span>
    </motion.div>
  );
}
