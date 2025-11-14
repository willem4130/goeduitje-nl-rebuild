"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Globe, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function OnsVerhaalPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

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
                  Ons Verhaal
                </h1>
                <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed tracking-wide">
                  Van een simpel idee tot een beweging die bedrijfsuitjes
                  combineert met sociale impact. Ontdek hoe Goeduitje.nl
                  ontstond en wat ons drijft.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission Section - Asymmetric Layout */}
      <section className="section-md">
        <div className="container">
          <div className="grid gap-16 md:grid-cols-12 md:items-start">
            <ScrollReveal animation="slideUp" className="md:col-span-5">
              <h2 className="text-[48px] leading-[1.2] tracking-tight">
                Onze Missie
              </h2>
            </ScrollReveal>
            <ScrollReveal
              animation="slideUp"
              delay={0.2}
              className="md:col-span-7"
            >
              <div className="stack-normal">
                <p className="text-muted-foreground text-xl leading-relaxed tracking-wide">
                  Wij geloven dat bedrijfsuitjes meer kunnen zijn dan alleen een
                  leuke dag uit. Ze kunnen een krachtig middel zijn om sociale
                  verandering te bewerkstelligen.
                </p>
                <p className="text-muted-foreground text-xl leading-relaxed tracking-wide">
                  Door workshops te organiseren die niet alleen teams dichter
                  bij elkaar brengen, maar ook bijdragen aan projecten in Jemen,
                  Syrië en Palestina, creëren we een win-win situatie. Jullie
                  team groeit, en families in nood krijgen hulp.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pull Quote - Editorial Layout */}
      <section className="section-md relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="bg-muted/50 absolute inset-0" />
          <div className="from-background/80 absolute inset-0 bg-gradient-to-b to-transparent" />
        </div>

        <div className="relative container">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-12 items-start gap-8">
                {/* Large typographic quote mark */}
                <div className="col-span-2 md:col-span-2">
                  <span className="text-primary/20 font-serif text-[120px] leading-none">
                    &ldquo;
                  </span>
                </div>

                {/* Quote content */}
                <div className="col-span-10">
                  <blockquote className="text-foreground mb-8 text-[32px] leading-[1.5] font-light tracking-wide italic sm:text-[36px]">
                    Een bedrijfsuitje dat niet alleen jullie team versterkt,
                    maar ook levens verandert aan de andere kant van de wereld.
                  </blockquote>

                  {/* Attribution */}
                  <div className="border-border flex items-center gap-4 border-t pt-6">
                    <div>
                      <p className="font-semibold tracking-tight">Het Team</p>
                      <p className="text-muted-foreground text-sm tracking-wide">
                        Goeduitje.nl
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values Section - Editorial Grid */}
      <section className="section-md">
        <div className="container">
          <ScrollReveal animation="slideUp">
            <div className="mb-20 max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Onze Waarden
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed tracking-wide">
                De principes die ons werk vormgeven
              </p>
            </div>
          </ScrollReveal>

          <StaggerChildren
            staggerDelay={0.15}
            className="grid gap-8 md:grid-cols-2"
          >
            {[
              {
                icon: Heart,
                title: "Sociale Impact",
                description:
                  "Elk bedrijfsuitje draagt direct bij aan hulpprojecten voor families in nood. We geloven in business met een hart.",
              },
              {
                icon: Users,
                title: "Teambuilding",
                description:
                  "We creëren ervaringen die teams samenbrengen, vertrouwen opbouwen en blijvende herinneringen creëren.",
              },
              {
                icon: Globe,
                title: "Transparantie",
                description:
                  "We delen openlijk hoe elke euro wordt besteed en welke projecten worden ondersteund. Geen verborgen kosten.",
              },
              {
                icon: TrendingUp,
                title: "Kwaliteit",
                description:
                  "Professionele begeleiding, zorgvuldig geselecteerde locaties en activiteiten die bijblijven.",
              },
            ].map((value) => (
              <motion.div
                key={value.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                  <CardContent className="stack-normal p-8">
                    <div className="bg-primary/10 w-fit rounded-full p-4">
                      <value.icon className="text-primary h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed tracking-wide">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Timeline Section - Staggered Content */}
      <section className="section-md relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="bg-muted/30 absolute inset-0" />
          <div className="from-background/50 absolute inset-0 bg-gradient-to-b to-transparent" />
        </div>

        <div className="relative container">
          <ScrollReveal animation="slideUp">
            <div className="mb-20 max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Onze Reis
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed tracking-wide">
                Belangrijke mijlpalen in ons verhaal
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-16">
            {[
              {
                year: "2023",
                title: "De Start",
                description:
                  "Het idee ontstond: bedrijfsuitjes die ook sociale impact maken. De eerste workshops werden georganiseerd in Nijmegen.",
              },
              {
                year: "2024",
                title: "Groei & Uitbreiding",
                description:
                  "Uitbreiding naar meerdere steden in Nederland. Meer dan 100 teams werkten samen aan een betere wereld.",
              },
              {
                year: "2025",
                title: "Impact die Telt",
                description:
                  "Meer dan 15.000 maaltijden gedoneerd, 8.750 mensen geholpen, en 42 projecten ondersteund. En dit is pas het begin.",
              },
            ].map((milestone, index) => (
              <ScrollReveal
                key={milestone.year}
                animation="slideUp"
                delay={index * 0.1}
              >
                <div className="grid gap-12 md:grid-cols-12 md:items-start">
                  {/* Year - Large Typography */}
                  <div className="md:col-span-3">
                    <span className="text-primary/20 text-[80px] leading-none font-light tracking-tight">
                      {milestone.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-9">
                    <h3 className="mb-4 text-3xl font-semibold tracking-tight">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed tracking-wide">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Editorial Treatment */}
      <section className="bg-primary text-primary-foreground section-md relative overflow-hidden">
        {/* Sophisticated gradient overlay */}
        <div className="from-primary/50 absolute inset-0 bg-gradient-to-br to-transparent" />

        <div className="relative container">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Wordt Deel van Ons Verhaal
              </h2>
              <p className="mb-12 text-xl leading-relaxed tracking-wide opacity-90">
                Organiseer een bedrijfsuitje dat verder gaat dan teambuilding.
                Maak impact die telt.
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
