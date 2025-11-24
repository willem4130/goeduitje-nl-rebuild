"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
} from "framer-motion";
import { useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  EASING,
} from "@/lib/animations";
import { useVideoLazyLoad } from "@/hooks/use-video-lazy-load";
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
}

export function HeroVideo({
  headline = "Samen een geweldige ervaring creëren",
  subheadline = "Boek een workshop die impact maakt",
  primaryCta = {
    text: "Stel je uitje samen",
    href: "#configurator",
  },
}: HeroVideoProps) {
  // Detect mobile devices
  const isMobile = useIsMobile();

  // Lazy load video with Intersection Observer
  const { videoRef, isInView } = useVideoLazyLoad({
    rootMargin: "200px",
    threshold: 0.1,
    pauseOnExit: false,
  });

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 500], [0, 150]);

  // Determine poster image (mobile or desktop)
  const posterImage = isMobile
    ? "/images/hero/hero-poster-mobile.jpg"
    : "/images/hero/hero-poster.jpg";

  // Handle video end - return to first frame
  const handleVideoEnded = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [videoRef]);

  return (
    <section className="relative flex h-screen min-h-[600px] w-full items-center overflow-hidden">
      {/* Parallax Video Background */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          poster={posterImage}
          className="h-full w-full object-cover"
          preload="metadata"
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

        {/* Loading indicator (shown while video is lazy loading) */}
        {!isInView && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        )}

        {/* Sophisticated gradient overlay - not flat black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
      </motion.div>

      {/* Content Overlay - Centered Layout */}
      <div className="relative z-10 h-full w-full">
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
              className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed tracking-wide text-white/90 sm:text-2xl"
            >
              {subheadline}
            </motion.p>

            {/* CTA - Two Primary Buttons */}
            <motion.div
              variants={staggerItem}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground shadow-editorial-lg hover:bg-primary/90 hover:shadow-editorial-hover h-14 min-w-[240px] px-8 text-lg font-semibold tracking-wide transition-all duration-300"
                >
                  <Link href={primaryCta.href}>{primaryCta.text}</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="shadow-editorial-lg hover:shadow-editorial-hover h-14 min-w-[240px] border-white/30 bg-white/10 px-8 text-lg font-semibold tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:text-white"
                >
                  <Link href="/booking">
                    Schrijf je in voor een open kookworkshop
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Impact Stats - KPI Numbers */}
            <motion.div
              variants={fadeInUp}
              className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-12 border-t border-white/20 pt-12"
            >
              <div className="text-center">
                <AnimatedKPI target={41} />
                <div className="mt-2 text-sm tracking-wide text-white/80">
                  Aantal uitjes
                </div>
              </div>
              <div className="text-center">
                <AnimatedKPI target={516} />
                <div className="mt-2 text-sm tracking-wide text-white/80">
                  Aantal deelnemers
                </div>
              </div>
            </motion.div>

            {/* USP Pills - Social Impact Focus */}
            <motion.div
              variants={fadeInUp}
              className="mt-12 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-4"
            >
              <USPBadge text="Maak sociale impact" />
              <USPBadge text="Met statushouders en asielzoekers" />
              <USPBadge text="Op locatie" />
              <USPBadge text="Op maat" />
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
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
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
    <div className="flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 backdrop-blur-md">
      <span className="text-sm font-semibold tracking-wide text-white">
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
    <motion.div className="text-5xl font-bold tracking-tight text-white">
      {formatted}
    </motion.div>
  );
}
