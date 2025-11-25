"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Utensils,
  GraduationCap,
  Globe,
  Eye,
  Target,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";
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
                  Wij zijn een sociale onderneming waar statushouders en
                  asielzoekers uw bedrijfsuitjes organiseren en u een
                  onvergetelijke dag bezorgen.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Sociale Onderneming Section - Asymmetric Layout */}
      <section className="section-md">
        <div className="container">
          <div className="grid gap-16 md:grid-cols-12 md:items-start">
            <ScrollReveal animation="slideUp" className="md:col-span-5">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Heart className="text-primary h-8 w-8" />
                </div>
                <h2 className="text-[48px] leading-[1.2] tracking-tight">
                  Sociale
                  <br />
                  Onderneming
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal
              animation="slideUp"
              delay={0.2}
              className="md:col-span-7"
            >
              <div className="stack-normal">
                <p className="text-muted-foreground text-xl leading-relaxed tracking-wide">
                  Onze bedrijfsuitjes bestaan uit een mix van actieve en minder
                  actieve Uitjes met vaak een cultureel tintje al dan niet
                  gecombineerd met heerlijk eten uit de Arabische of Perzische
                  keuken.
                </p>
                <p className="text-muted-foreground text-xl leading-relaxed tracking-wide">
                  Onze medewerkers organiseren en begeleiden de workshops en
                  activiteiten, waardoor zij kennismaken met de Nederlandse
                  werkcultuur en gewoonten en contact hebben met deelnemers.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Feature Cards Section - 3 Column Grid like onze-uitjes */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Utensils,
                  title: "Doen én Bijzonder Eten",
                  description:
                    "Onze bedrijfsuitjes bestaan uit een mix van actieve en minder actieve uitjes met vaak een cultureel tintje, gecombineerd met heerlijk eten uit de Arabische of Perzische keuken.",
                },
                {
                  icon: GraduationCap,
                  title: "Ervaring op Doen",
                  description:
                    "Dit biedt een praktische omgeving om de taal te oefenen, vaardigheden te ontwikkelen voor de arbeidsmarkt, hun netwerk te vergroten en een waardevolle referentie op te bouwen.",
                },
                {
                  icon: Globe,
                  title: "Nieuwe Culturen Leren Kennen",
                  description:
                    "Tijdens onze workshops stimuleren wij interactie tussen deelnemers en medewerkers om kennis te maken met hun cultuur en achtergrond, waardoor we onze samenleving inclusiever maken.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="border-primary/10 bg-background rounded-2xl border p-6"
                >
                  <div className="bg-primary/10 mb-4 w-fit rounded-full p-3">
                    <item.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-primary mb-2 text-lg font-bold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
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
                    Wij vergroten de kennis van deelnemers over de achtergrond
                    en cultuur van onze medewerkers waardoor zij meer openstaan
                    voor statushouders en asielzoekers.
                  </blockquote>

                  {/* Attribution */}
                  <div className="border-border flex items-center gap-4 border-t pt-6">
                    <div>
                      <p className="font-semibold tracking-tight">
                        Het Goeduitje Team
                      </p>
                      <p className="text-muted-foreground text-sm tracking-wide">
                        Be a part of it!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Visie & Missie Section - 2 Column Layout */}
      <section className="section-md">
        <div className="container">
          <ScrollReveal animation="slideUp">
            <div className="mb-12 max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Visie & Missie
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed tracking-wide">
                Waar we voor staan en wat we willen bereiken
              </p>
            </div>
          </ScrollReveal>

          <StaggerChildren
            staggerDelay={0.15}
            className="grid gap-8 md:grid-cols-2"
          >
            {/* Visie Card */}
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                <CardContent className="stack-normal p-8">
                  <div className="bg-primary/10 w-fit rounded-full p-4">
                    <Eye className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    Onze Visie
                  </h3>
                  <div className="stack-normal">
                    <p className="text-muted-foreground leading-relaxed tracking-wide">
                      Wij streven naar een samenleving waarin diversiteit wordt
                      gevierd en iedereen gelijke kansen heeft op de
                      arbeidsmarkt.
                    </p>
                    <p className="text-muted-foreground leading-relaxed tracking-wide">
                      Door het potentieel van statushouders en asielzoekers te
                      erkennen en te benutten, bouwen we bruggen tussen culturen
                      en versterken we de sociale cohesie.
                    </p>
                    <p className="text-muted-foreground leading-relaxed tracking-wide">
                      We zien een toekomst voor ons waarin onze organisatie een
                      toonaangevende rol speelt in het creëren van inclusieve
                      werkplekken, waar talenten uit alle hoeken van de wereld
                      samenkomen en bijdragen aan gezamenlijke groei en
                      welvaart.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Missie Card */}
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                <CardContent className="stack-normal p-8">
                  <div className="bg-primary/10 w-fit rounded-full p-4">
                    <Target className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    Onze Missie
                  </h3>
                  <p className="text-muted-foreground leading-relaxed tracking-wide">
                    Het is onze missie om statushouders en asielzoekers in hun
                    baan bij Goeduitje voor te bereiden op een baan die aansluit
                    bij hun kennis, ervaring en interesses en Nederlanders
                    kennis te laten maken met onze medewerkers en hun cultuur
                    zodat zij statushouders en asielzoekers waarderen om hun
                    kennis en kwaliteiten.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerChildren>
        </div>
      </section>

      {/* Impact & Team Teaser Section */}
      <section className="section-md bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Impact Teaser */}
            <ScrollReveal animation="slideUp">
              <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                <CardContent className="flex h-full flex-col p-8">
                  <div className="bg-primary/10 mb-6 w-fit rounded-full p-4">
                    <TrendingUp className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-semibold tracking-tight">
                    Onze Impact
                  </h3>
                  <p className="text-muted-foreground mb-6 flex-grow leading-relaxed tracking-wide">
                    Wil je meer weten over de impact die we gemaakt hebben en
                    willen gaan maken? Over onze Theory of Change of onze
                    jaarcijfers?
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Award className="text-primary h-5 w-5" />
                      <span className="text-muted-foreground text-sm">
                        Code Sociale Ondernemingen
                      </span>
                    </div>
                  </div>
                  <motion.div
                    className="mt-6"
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ y: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="outline"
                      className="group w-full tracking-wide"
                      asChild
                    >
                      <Link href="/onze-impact">
                        Bekijk onze impact
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Team Teaser */}
            <ScrollReveal animation="slideUp" delay={0.15}>
              <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                <CardContent className="flex h-full flex-col p-8">
                  <div className="bg-primary/10 mb-6 w-fit rounded-full p-4">
                    <Users className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-semibold tracking-tight">
                    Onze Medewerkers
                  </h3>
                  <p className="text-muted-foreground mb-6 flex-grow leading-relaxed tracking-wide">
                    Benieuwd naar onze medewerkers? Ontmoet het team dat jullie
                    bedrijfsuitjes tot een onvergetelijke ervaring maakt en leer
                    meer over hun achtergrond en cultuur.
                  </p>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ y: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="outline"
                      className="group w-full tracking-wide"
                      asChild
                    >
                      <Link href="/ons-team">
                        Ontmoet het team
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
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
                Word Deel van Ons Verhaal
              </h2>
              <p className="mb-12 text-xl leading-relaxed tracking-wide opacity-90">
                Organiseer een bedrijfsuitje dat verder gaat dan teambuilding.
                Maak impact die telt en draag bij aan een inclusievere
                samenleving.
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
