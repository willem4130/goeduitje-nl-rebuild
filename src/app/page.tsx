"use client";

import { HeroVideo } from "@/components/hero-video";
import { WorkshopCarousel } from "@/components/workshop-carousel";
import { WorkshopConfigurator } from "@/components/workshop-configurator";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { SocialProofStats } from "@/components/social-proof-stats";
import { InstagramFeed } from "@/components/instagram-feed";
import { ScrollReveal } from "@/components/scroll-reveal";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";
import { api } from "@/trpc/client";

// Default content (used while loading or if fetch fails)
const DEFAULTS = {
  hero: {
    title: "Samen een geweldige ervaring creëren",
    subtitle: "Boek een uitje dat impact maakt",
    cta_primary: "Stel je uitje samen",
  },
  configurator: {
    title: "Stel je uitje samen",
    subtitle: "Configureer je ideale teamuitje in een paar simpele stappen",
  },
  instagram: {
    title: "Volg ons op Instagram",
    subtitle:
      "Bekijk foto's en verhalen van onze uitjes en de impact die we samen maken",
    cta: "Volg ons op Instagram",
  },
  contact_cta: {
    title: "Heb je vragen?",
    description:
      "Neem contact met ons op. We helpen je graag met het samenstellen van het perfecte bedrijfsuitje.",
    button: "Neem contact op",
  },
};

/**
 * Goeduitje.nl Homepage
 * Matches Wireframe #1 structure
 */

export default function Home() {
  // Fetch homepage content from database
  const { data: pageContent } = api.content.getByPage.useQuery({
    page: "homepage",
  });

  // Get content from database with fallbacks
  const hero = {
    title: pageContent?.hero?.title || DEFAULTS.hero.title,
    subtitle: pageContent?.hero?.subtitle || DEFAULTS.hero.subtitle,
    cta_primary: pageContent?.hero?.cta_primary || DEFAULTS.hero.cta_primary,
  };
  const configurator = {
    title: pageContent?.configurator?.title || DEFAULTS.configurator.title,
    subtitle:
      pageContent?.configurator?.subtitle || DEFAULTS.configurator.subtitle,
  };
  const instagram = {
    title: pageContent?.instagram?.title || DEFAULTS.instagram.title,
    subtitle: pageContent?.instagram?.subtitle || DEFAULTS.instagram.subtitle,
    cta: pageContent?.instagram?.cta || DEFAULTS.instagram.cta,
  };
  const contact_cta = {
    title: pageContent?.contact_cta?.title || DEFAULTS.contact_cta.title,
    description:
      pageContent?.contact_cta?.description || DEFAULTS.contact_cta.description,
    button: pageContent?.contact_cta?.button || DEFAULTS.contact_cta.button,
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Video Background */}
      <HeroVideo
        headline={hero.title}
        subheadline={hero.subtitle}
        primaryCta={{
          text: hero.cta_primary,
          href: "#configurator",
        }}
      />

      {/* Uitjes Section - Scroll Animation */}
      <ScrollReveal animation="fade" amount={0.1}>
        <WorkshopCarousel />
      </ScrollReveal>

      {/* Uitje Configurator Section - Two Column Layout */}
      <section id="configurator" className="bg-muted/30 py-6 lg:py-8">
        <div className="container mx-auto max-w-7xl px-4 lg:px-6">
          <ScrollReveal animation="slideUp" amount={0.2}>
            <div className="mb-4 text-center">
              <h2 className="text-primary text-2xl tracking-tight lg:text-3xl">
                {configurator.title}
              </h2>
              <p className="text-muted-foreground mt-2 text-base leading-relaxed lg:text-lg">
                {configurator.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:gap-6">
            {/* Left Column - Form */}
            <ScrollReveal animation="slideUp" delay={0.1} amount={0.2}>
              <div className="flex justify-center lg:justify-start">
                <WorkshopConfigurator />
              </div>
            </ScrollReveal>

            {/* Right Column - Sidebar with Visual Content */}
            <ScrollReveal animation="slideUp" delay={0.2} amount={0.2}>
              <div className="w-full space-y-3 lg:w-[320px] xl:w-[360px]">
                {/* Social Proof Stats */}
                <SocialProofStats />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Google Reviews */}
      <ScrollReveal animation="fade" amount={0.1}>
        <TestimonialsCarousel useGoogleReviews />
      </ScrollReveal>

      {/* Instagram Feed Section */}
      <section className="section-md bg-background">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp" amount={0.3}>
            <div className="mb-10 text-center">
              <h2 className="text-primary tracking-tight">{instagram.title}</h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed tracking-wide sm:text-xl">
                {instagram.subtitle}
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
                    {instagram.cta}
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
            <h2 className="mb-6 tracking-tight text-white">
              {contact_cta.title}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed tracking-wide text-white/90 sm:text-xl">
              {contact_cta.description}
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
                <Link href="/contact">{contact_cta.button}</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
