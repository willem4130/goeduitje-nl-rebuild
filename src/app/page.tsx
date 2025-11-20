"use client";

import { HeroVideo } from "@/components/hero-video";
import { WorkshopCarousel } from "@/components/workshop-carousel";
import { WorkshopConfigurator } from "@/components/workshop-configurator";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { CompactTestimonials } from "@/components/compact-testimonials";
import { SocialProofStats } from "@/components/social-proof-stats";
import { InstagramFeed } from "@/components/instagram-feed";
import { ScrollReveal } from "@/components/scroll-reveal";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

/**
 * Goeduitje.nl Homepage
 * Matches Wireframe #1 structure
 */

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Video Background */}
      <HeroVideo
        headline="Samen een geweldige ervaring creëren"
        subheadline="Boek een workshop die impact maakt"
        primaryCta={{
          text: "Stel je uitje samen",
          href: "#configurator",
        }}
      />

      {/* Workshop Types Section - Scroll Animation */}
      <ScrollReveal animation="fade" amount={0.1}>
        <WorkshopCarousel />
      </ScrollReveal>

      {/* Workshop Configurator Section - Two Column Layout */}
      <section id="configurator" className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp" amount={0.2}>
            <div className="mb-8 text-center">
              <h2 className="text-primary tracking-tight">
                Stel je uitje samen
              </h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed tracking-wide sm:text-xl">
                Configureer je ideale teamuitje in een paar simpele stappen
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
            {/* Left Column - Form */}
            <ScrollReveal animation="slideUp" delay={0.1} amount={0.2}>
              <div className="flex justify-center lg:justify-start">
                <WorkshopConfigurator />
              </div>
            </ScrollReveal>

            {/* Right Column - Sidebar */}
            <ScrollReveal animation="slideUp" delay={0.2} amount={0.2}>
              <div className="w-full space-y-6 lg:w-[380px]">
                {/* Social Proof Stats */}
                <SocialProofStats />

                {/* Compact Testimonials */}
                <CompactTestimonials />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Scroll Animation */}
      <ScrollReveal animation="fade" amount={0.1}>
        <TestimonialsCarousel />
      </ScrollReveal>

      {/* Instagram Feed Section */}
      <section className="section-md bg-background">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp" amount={0.3}>
            <div className="mb-10 text-center">
              <h2 className="text-primary tracking-tight">
                Volg ons op Instagram
              </h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed tracking-wide sm:text-xl">
                Bekijk foto&apos;s en verhalen van onze workshops en de impact
                die we samen maken
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="slideUp" delay={0.2} amount={0.2}>
            <InstagramFeed />
          </ScrollReveal>

          {/* Follow Button */}
          <ScrollReveal animation="slideUp" delay={0.3} amount={0.2}>
            <div className="mt-12 flex justify-center">
              <motion.div
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ y: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="default"
                  className="shadow-editorial-lg hover:shadow-editorial-hover gap-2 px-8 tracking-wide transition-all duration-300"
                >
                  <a
                    href="https://instagram.com/goeduitje"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="h-5 w-5" />
                    Volg ons op Instagram
                  </a>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact CTA Section */}
      <ScrollReveal animation="slideUp" amount={0.4}>
        <section className="section-md bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h2 className="mb-6 tracking-tight text-white">Heb je vragen?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed tracking-wide text-white/90 sm:text-xl">
              Neem contact met ons op. We helpen je graag met het samenstellen
              van het perfecte bedrijfsuitje.
            </p>
            <motion.div
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ y: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-primary shadow-editorial-lg hover:shadow-editorial-hover bg-white px-8 tracking-wide transition-all duration-300 hover:bg-white/90"
              >
                <Link href="/contact">Neem contact op</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
