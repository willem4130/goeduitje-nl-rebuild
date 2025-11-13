"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  EASING,
} from "@/lib/animations";

/**
 * Hero section with video background and CTA overlays
 * Features animated headline and two primary action buttons
 */

interface HeroVideoProps {
  videoSrc?: string;
  videoPoster?: string;
  headline?: string;
  subheadline?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
}

export function HeroVideo({
  videoSrc = "/videos/hero-background.mp4",
  videoPoster = "/images/hero-poster.jpg",
  headline = "Samen iets goeds doen, dat is pas een goed uitje",
  subheadline = "Boek een workshop die impact maakt",
  primaryCta = {
    text: "Stel je uitje samen",
    href: "#configurator",
  },
  secondaryCta = {
    text: "Schrijf je in voor open workshop",
    href: "/booking",
  },
}: HeroVideoProps) {
  // Parallax scroll effect
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative flex h-screen min-h-[600px] w-full items-center overflow-hidden">
      {/* Parallax Video Background */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={videoPoster}
          className="h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
          {/* Fallback background image */}
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${videoPoster})` }}
          />
        </video>

        {/* Sophisticated gradient overlay - not flat black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
      </motion.div>

      {/* Content Overlay - Asymmetric Layout */}
      <div className="relative z-10 h-full w-full">
        <div className="mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
          {/* Left-aligned content, not centered */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
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
              className="mt-6 text-xl leading-relaxed tracking-wide text-white/90 sm:text-2xl"
            >
              {subheadline}
            </motion.p>

            {/* CTAs - Refined Hover States */}
            <motion.div
              variants={staggerItem}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6"
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
                  className="shadow-editorial-lg hover:shadow-editorial-hover h-14 min-w-[240px] border border-white/30 bg-white/10 px-8 text-lg font-semibold tracking-wide text-white backdrop-blur-xl transition-all duration-300 hover:border-white/50 hover:bg-white/20"
                >
                  <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* USP Pills - Refined Glassmorphism */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 flex flex-wrap gap-3"
            >
              <USPBadge text="100% sociale impact" />
              <USPBadge text="Voor elk team" />
              <USPBadge text="Op elke locatie" />
              <USPBadge text="Direct boeken" />
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
 * USP Badge component - Refined glassmorphism
 */
function USPBadge({ text }: { text: string }) {
  return (
    <div className="rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/15">
      <span className="text-sm font-medium tracking-wide text-white/95">
        {text}
      </span>
    </div>
  );
}
