"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
} from "framer-motion";
import { useEffect, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  EASING,
} from "@/lib/animations";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Hero section with video background and CTA overlays
 * Features animated headline and two primary action buttons
 */

interface HeroVideoProps {
  headline?: string;
  subheadline?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  heroActivitiesCount?: number;
  heroParticipantsCount?: number;
  uspBadges?: string[];
}

export function HeroVideo({
  headline = "Samen een geweldige ervaring creëren",
  subheadline = "Boek een uitje dat impact maakt",
  primaryCta = {
    text: "Stel je uitje samen",
    href: "#configurator",
  },
  heroActivitiesCount = 41,
  heroParticipantsCount = 516,
  uspBadges = ["Maak sociale impact", "Op locatie naar keuze", "Op maat"],
}: HeroVideoProps) {
  // Detect mobile devices
  const isMobile = useIsMobile();

  // Video ref and state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEnded, setHasEnded] = useState(false);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 500], [0, 150]);

  // Determine poster image (mobile or desktop)
  const posterImage = isMobile
    ? "/images/hero/hero-poster-mobile.jpg"
    : "/images/hero/hero-poster.jpg";

  // Handle video end - return to first frame and stay there
  const handleVideoEnded = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
      setHasEnded(true);
    }
  }, []);

  // Start video playback once on mount (no loop, no restart)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasEnded) return;

    // Attempt to play video once
    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        // Autoplay might be blocked by browser - that's okay
        console.warn("Video autoplay blocked:", error);
      }
    };

    playVideo();
  }, [hasEnded]);

  return (
    <section className="relative flex h-dvh min-h-[550px] w-full items-center overflow-hidden sm:min-h-[600px]">
      {/* Parallax Video Background */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          muted
          playsInline
          poster={posterImage}
          className="h-full w-full object-cover"
          preload="auto"
          onEnded={handleVideoEnded}
        >
          {/* Mobile video sources (portrait 1080x1920) */}
          <source
            src="/videos/hero/hero-background-mobile.webm"
            type="video/webm"
            media="(max-width: 768px)"
          />
          <source
            src="/videos/hero/hero-background-mobile.mp4"
            type="video/mp4"
            media="(max-width: 768px)"
          />

          {/* Desktop video sources (landscape 1920x1080) */}
          <source
            src="/videos/hero/hero-background.webm"
            type="video/webm"
            media="(min-width: 769px)"
          />
          <source
            src="/videos/hero/hero-background.mp4"
            type="video/mp4"
            media="(min-width: 769px)"
          />

          {/* Fallback background image */}
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${posterImage})` }}
          />
        </video>

        {/* Sophisticated gradient overlay - not flat black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
      </motion.div>

      {/* Content Overlay - Centered Layout */}
      <div className="relative z-10 h-full w-full pt-20">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-center px-6 lg:px-8">
          {/* Centered content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-4xl text-center"
          >
            {/* Headline - Refined Typography */}
            <motion.h1
              variants={staggerItem}
              className="leading-tight tracking-tight text-white"
            >
              {headline}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={staggerItem}
              className="mx-auto mt-3 max-w-2xl text-base leading-relaxed tracking-wide text-white/90 sm:mt-6 sm:text-2xl"
            >
              {subheadline}
            </motion.p>

            {/* CTA - Two Primary Buttons */}
            <motion.div
              variants={staggerItem}
              className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground shadow-editorial-lg hover:bg-primary/90 hover:shadow-editorial-hover h-12 min-w-[220px] px-6 text-base font-semibold tracking-wide transition-all duration-300 sm:h-14 sm:min-w-[240px] sm:px-8 sm:text-lg"
                >
                  <Link href={primaryCta.href}>{primaryCta.text}</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="shadow-editorial-lg hover:shadow-editorial-hover h-12 min-w-[220px] border-white/30 bg-white/10 px-6 text-base font-semibold tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:text-white sm:h-14 sm:min-w-[240px] sm:px-8 sm:text-lg"
                >
                  <Link href="/open-kookworkshops">
                    Open kookworkshops voor individuen / kleine groepen
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Impact Stats - KPI Numbers */}
            <motion.div
              variants={fadeInUp}
              className="mx-auto mt-5 grid max-w-2xl grid-cols-2 gap-4 border-t border-white/20 pt-5 sm:mt-16 sm:gap-12 sm:pt-12"
            >
              <div className="text-center">
                <AnimatedKPI target={heroActivitiesCount} />
                <div className="mt-1 text-xs tracking-wide text-white/80 sm:mt-2 sm:text-sm">
                  Aantal uitjes
                </div>
              </div>
              <div className="text-center">
                <AnimatedKPI target={heroParticipantsCount} />
                <div className="mt-1 text-xs tracking-wide text-white/80 sm:mt-2 sm:text-sm">
                  Aantal deelnemers
                </div>
              </div>
            </motion.div>

            {/* USP Pills - Social Impact Focus */}
            <motion.div
              variants={fadeInUp}
              className="mt-3 flex flex-wrap justify-center gap-1.5 sm:mt-12 sm:gap-4"
            >
              {uspBadges.map((badge) => (
                <USPBadge key={badge} text={badge} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Refined Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1.2,
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: EASING.gentle,
        }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 sm:bottom-8"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm tracking-wide text-white/70">
            Scroll voor meer
          </span>
          <svg
            className="h-5 w-5 text-white/70"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}

/**
 * USP Badge component - Social impact focused
 * Non-interactive badges with subtle appearance
 */
function USPBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-3 py-1.5 backdrop-blur-md sm:px-6 sm:py-3">
      <span className="text-xs font-semibold tracking-wide text-white sm:text-sm">
        {text}
      </span>
    </div>
  );
}

/**
 * Animated KPI counter component using Framer Motion
 * Animates from 0 to target value on mount
 */
function AnimatedKPI({ target }: { target: number }) {
  const count = useMotionValue(0);

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 2,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, target]);

  const rounded = useTransform(count, (latest) => Math.round(latest));
  const formatted = useTransform(rounded, (latest) =>
    latest.toLocaleString("nl-NL")
  );

  return (
    <motion.div className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
      {formatted}
    </motion.div>
  );
}
