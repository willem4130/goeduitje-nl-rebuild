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
    <section className="bg-secondary relative overflow-hidden py-16 sm:py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="slideUp">
          <div className="mb-16 text-center">
            <h2 className="text-white">{title}</h2>
            <p className="mt-4 text-lg text-white/90 sm:text-xl">{subtitle}</p>
          </div>
        </ScrollReveal>

        {/* Stats Grid */}
        <StaggerChildren
          staggerDelay={0.2}
          className="grid gap-8 md:grid-cols-3"
        >
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </StaggerChildren>

        {/* Impact Locations */}
        <ScrollReveal animation="slideUp" delay={0.6}>
          <div className="mt-16 text-center">
            <p className="mb-6 text-lg text-white/90">
              Met jouw bedrijfsuitje steun je projecten in:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <LocationBadge name="Jemen" />
              <LocationBadge name="Syrië" />
              <LocationBadge name="Palestina" />
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        {showCta && (
          <ScrollReveal animation="slideUp" delay={0.8}>
            <div className="mt-12 text-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group hover:text-secondary border-2 border-white bg-white/10 text-white backdrop-blur-sm hover:bg-white"
              >
                <Link href="/onze-impact">
                  Lees meer over onze impact
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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
 * Individual stat card with animated counter
 */
function StatCard({ stat }: { stat: ImpactStat }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const IconComponent =
    stat.icon === "heart" ? Heart : stat.icon === "users" ? Users : Globe;

  return (
    <motion.div
      ref={ref}
      className="rounded-lg border-2 border-white/20 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
    >
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-white/10 p-4">
          <IconComponent className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Animated Counter */}
      <div className="mb-4">
        <AnimatedCounter
          from={0}
          to={stat.value}
          isInView={isInView}
          className="text-5xl font-bold text-white"
        />
      </div>

      {/* Label */}
      <h3 className="mb-2 text-xl font-semibold text-white">{stat.label}</h3>

      {/* Description */}
      <p className="text-sm text-white/80">{stat.description}</p>

      {/* Location badge */}
      {stat.location && (
        <div className="mt-4">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            {stat.location}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Animated counter component using Framer Motion
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
    stiffness: 50,
    damping: 30,
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
 * Location badge component
 */
function LocationBadge({ name }: { name: string }) {
  return (
    <div className="group relative overflow-hidden rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20">
      <span className="relative z-10 text-base font-semibold text-white">
        {name}
      </span>
      <div className="absolute inset-0 -z-0 translate-y-full bg-white transition-transform group-hover:translate-y-0" />
      <span className="text-secondary absolute inset-0 z-10 flex items-center justify-center text-base font-semibold opacity-0 transition-opacity group-hover:opacity-100">
        {name}
      </span>
    </div>
  );
}
