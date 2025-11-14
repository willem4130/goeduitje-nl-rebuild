"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star, Building2, Users, Calendar } from "lucide-react";
import Link from "next/link";

// Testimonials data
const testimonials = [
  {
    id: 1,
    quote:
      "Een onvergetelijke ervaring! Niet alleen hebben we als team geleerd beter samen te werken, maar we hebben ook direct bijgedragen aan een goed doel. Dat gevoel is onbetaalbaar.",
    author: "Lisa van der Meer",
    role: "HR Manager",
    company: "TechNova Solutions",
    workshopType: "Kookworkshop",
    date: "December 2024",
    image: "/images/testimonials/lisa.jpg",
    featured: true,
  },
  {
    id: 2,
    quote:
      "De perfecte combinatie van plezier, teambuilding en sociale impact. Onze collega's praten er nog steeds over. Absoluut een aanrader!",
    author: "Mark Janssen",
    role: "CEO",
    company: "GreenEnergy NL",
    workshopType: "The Game",
    date: "November 2024",
    image: "/images/testimonials/mark.jpg",
    featured: true,
  },
  {
    id: 3,
    quote:
      "We waren op zoek naar een bedrijfsuitje met betekenis. Goeduitje.nl leverde precies dat. De organisatie was top en het voelde goed om iets terug te geven.",
    author: "Sophie de Wit",
    role: "Team Lead Marketing",
    company: "Creative Minds",
    workshopType: "Stadsspel",
    date: "Oktober 2024",
    image: "/images/testimonials/sophie.jpg",
    featured: false,
  },
  {
    id: 4,
    quote:
      "Als financieel directeur let ik op waar we ons budget aan besteden. Dit was elke euro waard. De ROI in teamspirit en goodwill was buitengewoon.",
    author: "Robert Bakker",
    role: "CFO",
    company: "FinanceFirst",
    workshopType: "Kookworkshop",
    date: "September 2024",
    image: "/images/testimonials/robert.jpg",
    featured: false,
  },
  {
    id: 5,
    quote:
      "Onze remote team had echt behoefte aan een moment samen. De koffie & thee workshop bracht ons dichter bij elkaar en we leerden ook nog wat nieuws!",
    author: "Emma Vermeulen",
    role: "Product Owner",
    company: "Digital Dynamics",
    workshopType: "Koffie & Thee",
    date: "Augustus 2024",
    image: "/images/testimonials/emma.jpg",
    featured: false,
  },
  {
    id: 6,
    quote:
      "Sportief, leuk en betekenisvol. De beachvolleybal workshop was precies wat ons sales team nodig had. Geweldige energie!",
    author: "Tim de Jong",
    role: "Sales Director",
    company: "SalesBoost",
    workshopType: "Beachvolleybal",
    date: "Juli 2024",
    image: "/images/testimonials/tim.jpg",
    featured: false,
  },
  {
    id: 7,
    quote:
      "Ik ben onder de indruk van de professionaliteit en de warme begeleiding. Het team van Goeduitje.nl denkt echt met je mee.",
    author: "Nina Vermeer",
    role: "Operations Manager",
    company: "LogiTech Partners",
    workshopType: "The Game",
    date: "Juni 2024",
    image: "/images/testimonials/nina.jpg",
    featured: false,
  },
  {
    id: 8,
    quote:
      "We hebben al meerdere workshops gedaan en elke keer is het weer een succes. Onze medewerkers waarderen de sociale impact enorm.",
    author: "Frank Peters",
    role: "HR Director",
    company: "MegaCorp Industries",
    workshopType: "Kookworkshop",
    date: "Mei 2024",
    image: "/images/testimonials/frank.jpg",
    featured: false,
  },
];

const workshopTypes = [
  "Alle Workshops",
  "Kookworkshop",
  "The Game",
  "Stadsspel",
  "Koffie & Thee",
  "Beachvolleybal",
];

export default function JullieErvaringenPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const [selectedFilter, setSelectedFilter] = useState("Alle Workshops");

  // Filter testimonials
  const filteredTestimonials =
    selectedFilter === "Alle Workshops"
      ? testimonials
      : testimonials.filter((t) => t.workshopType === selectedFilter);

  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Hero Section - Parallax with Editorial Typography */}
      <section className="relative min-h-[70vh] overflow-hidden">
        {/* Parallax background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 -z-10">
          <div className="from-primary/20 via-secondary/20 to-primary/10 absolute inset-0 bg-gradient-to-br" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </motion.div>

        {/* Sophisticated gradient overlay */}
        <div className="via-background/50 to-background absolute inset-0 bg-gradient-to-b from-transparent" />

        <div className="section-md relative flex items-center">
          <div className="container">
            <ScrollReveal animation="slideUp">
              <div className="max-w-4xl">
                <h1 className="mb-8 text-[64px] leading-[1.1] tracking-tight sm:text-[72px]">
                  Jullie Ervaringen
                </h1>
                <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed tracking-wide">
                  Lees wat andere teams zeggen over hun ervaring met
                  Goeduitje.nl. Echte verhalen van echte mensen.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Overview - Editorial */}
      <section className="section-md border-b">
        <div className="container">
          <StaggerChildren
            staggerDelay={0.1}
            className="grid gap-8 md:grid-cols-4"
          >
            {[
              { icon: Users, value: "150+", label: "Teams" },
              { icon: Star, value: "4.9/5", label: "Gemiddelde Rating" },
              { icon: Building2, value: "80+", label: "Bedrijven" },
              { icon: Calendar, value: "200+", label: "Workshops" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                    <Icon className="text-primary h-8 w-8" />
                  </div>
                  <div className="mb-2 text-[48px] leading-none font-light tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm tracking-wide">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Filters - Editorial Treatment */}
      <section className="section-md">
        <div className="container">
          <ScrollReveal animation="slideUp">
            <div className="mb-12 flex flex-wrap items-center gap-3">
              <span className="text-muted-foreground text-sm font-medium tracking-wide">
                Filter op workshop:
              </span>
              {workshopTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedFilter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(type)}
                  className="shadow-editorial-sm hover:shadow-editorial transition-all duration-300"
                >
                  {type}
                </Button>
              ))}
            </div>
          </ScrollReveal>

          {/* Featured Testimonials - Large Editorial Pull Quotes */}
          <div className="mb-20">
            <ScrollReveal animation="slideUp">
              <h2 className="mb-12 text-[32px] font-semibold tracking-tight">
                Uitgelichte Ervaringen
              </h2>
            </ScrollReveal>

            <div className="space-y-16">
              {filteredTestimonials
                .filter((t) => t.featured)
                .map((testimonial) => (
                  <ScrollReveal
                    key={testimonial.id}
                    animation="slideUp"
                    delay={0.1}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="shadow-editorial-lg hover:shadow-editorial-hover group border transition-all duration-300"
                    >
                      <div className="grid md:grid-cols-12 md:items-center">
                        {/* Quote Content - Editorial Pull Quote */}
                        <div className="p-12 md:col-span-8 md:p-16">
                          <div className="grid grid-cols-12 items-start gap-6">
                            {/* Large decorative quote */}
                            <div className="col-span-2">
                              <Quote className="text-primary/20 h-16 w-16" />
                            </div>

                            {/* Quote text */}
                            <div className="col-span-10">
                              <blockquote className="mb-8 text-[28px] leading-[1.5] font-light tracking-wide italic sm:text-[32px]">
                                {testimonial.quote}
                              </blockquote>

                              {/* Attribution */}
                              <div className="border-border border-t pt-6">
                                <p className="mb-1 text-lg font-semibold tracking-tight">
                                  {testimonial.author}
                                </p>
                                <p className="text-muted-foreground text-sm tracking-wide">
                                  {testimonial.role} · {testimonial.company}
                                </p>
                                <div className="mt-3 flex items-center gap-4 text-xs">
                                  <span className="text-primary font-medium">
                                    {testimonial.workshopType}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {testimonial.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Image */}
                        <div className="bg-muted relative aspect-square overflow-hidden md:col-span-4 md:aspect-[3/4]">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                          <div className="flex h-full items-center justify-center">
                            <span className="text-muted-foreground/50 text-sm">
                              Foto {testimonial.author.split(" ")[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
            </div>
          </div>

          {/* All Testimonials Grid - Editorial Cards */}
          <div>
            <ScrollReveal animation="slideUp">
              <h2 className="mb-12 text-[32px] font-semibold tracking-tight">
                Alle Ervaringen
              </h2>
            </ScrollReveal>

            <StaggerChildren
              staggerDelay={0.1}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredTestimonials
                .filter((t) => !t.featured)
                .map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="shadow-editorial hover:shadow-editorial-hover h-full overflow-hidden border transition-all duration-300">
                      <CardContent className="stack-normal p-0">
                        {/* Image */}
                        <div className="bg-muted group relative aspect-square overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                          <div className="flex h-full items-center justify-center">
                            <span className="text-muted-foreground/50 text-sm">
                              Foto {testimonial.author.split(" ")[0]}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="stack-normal p-6">
                          {/* Quote icon */}
                          <Quote className="text-primary/30 h-8 w-8" />

                          {/* Quote */}
                          <blockquote className="text-base leading-relaxed tracking-wide italic">
                            {testimonial.quote}
                          </blockquote>

                          {/* Attribution */}
                          <div className="border-border border-t pt-4">
                            <p className="mb-1 font-semibold tracking-tight">
                              {testimonial.author}
                            </p>
                            <p className="text-muted-foreground text-xs tracking-wide">
                              {testimonial.role}
                            </p>
                            <p className="text-muted-foreground text-xs tracking-wide">
                              {testimonial.company}
                            </p>
                            <div className="mt-3 flex items-center gap-3 text-xs">
                              <span className="text-primary font-medium">
                                {testimonial.workshopType}
                              </span>
                              <span className="text-muted-foreground">
                                {testimonial.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </StaggerChildren>
          </div>

          {/* No results message */}
          {filteredTestimonials.length === 0 && (
            <div className="text-muted-foreground py-20 text-center">
              <p className="text-lg">
                Geen ervaringen gevonden voor {selectedFilter}.
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedFilter("Alle Workshops")}
                className="mt-4"
              >
                Toon alle ervaringen
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Video Testimonials Section - Placeholder */}
      <section className="section-md relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="bg-muted/50 absolute inset-0" />
        </div>

        <div className="relative container">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Video Getuigenissen
              </h2>
              <p className="text-muted-foreground mb-12 text-lg leading-relaxed tracking-wide">
                Binnenkort beschikbaar: video&apos;s van teams die hun ervaring
                delen
              </p>
              <div className="bg-muted aspect-video w-full">
                <div className="flex h-full items-center justify-center">
                  <span className="text-muted-foreground/50">
                    Video testimonials coming soon
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section - Editorial Treatment */}
      <section className="bg-primary text-primary-foreground section-md relative overflow-hidden">
        {/* Sophisticated gradient overlay */}
        <div className="from-primary/50 absolute inset-0 bg-gradient-to-br to-transparent" />

        <div className="relative container">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Wordt Het Volgende Succesverhaal
              </h2>
              <p className="mb-12 text-xl leading-relaxed tracking-wide opacity-90">
                Organiseer een workshop die jullie team samenbrengt en impact
                maakt die telt.
              </p>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="shadow-editorial hover:shadow-editorial-lg px-8 py-6 font-semibold tracking-wide transition-all duration-300"
                  asChild
                >
                  <Link href="/onze-uitjes">Bekijk Onze Workshops</Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
