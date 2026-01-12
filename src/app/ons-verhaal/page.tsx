"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Utensils,
  GraduationCap,
  Globe,
  Eye,
  Target,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Heart,
  Sparkles,
  HandHeart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OnsVerhaalPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Hero Section - Magazine Style */}
      <section className="relative overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 -z-10">
          <div className="from-primary/15 via-primary/5 absolute inset-0 bg-gradient-to-br to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </motion.div>

        <div className="container mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-4xl text-center">
              <span className="bg-primary/10 text-primary mb-6 inline-block rounded-full px-4 py-1.5 text-sm font-medium tracking-wide">
                Sociale Onderneming
              </span>
              <h1 className="text-primary mb-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Ons Verhaal
              </h1>
              <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed sm:text-2xl">
                Wij zijn een sociale onderneming waar statushouders* en
                asielzoekers uw bedrijfsuitjes organiseren en u een
                onvergetelijke dag bezorgen.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Magazine Content - Two Column Layout */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column */}
            <div className="space-y-12">
              {/* Doen én bijzonder eten */}
              <ScrollReveal animation="slideUp">
                <div className="group">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="bg-primary/10 rounded-xl p-3 transition-transform group-hover:scale-110">
                      <Utensils className="text-primary h-6 w-6" />
                    </div>
                    <h2 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">
                      Doen én bijzonder eten
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Onze bedrijfsuitjes bestaan uit een mix van actieve en
                    minder actieve Uitjes met vaak een cultureel tintje al dan
                    niet gecombineerd met heerlijk eten uit de Arabische of
                    Perzische keuken.
                  </p>
                </div>
              </ScrollReveal>

              {/* Ervaring opdoen */}
              <ScrollReveal animation="slideUp" delay={0.1}>
                <div className="group">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="bg-primary/10 rounded-xl p-3 transition-transform group-hover:scale-110">
                      <GraduationCap className="text-primary h-6 w-6" />
                    </div>
                    <h2 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">
                      Ervaring opdoen
                    </h2>
                  </div>
                  <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                    Onze medewerkers organiseren en begeleiden de workshops en
                    activiteiten, waardoor zij kennismaken met de Nederlandse
                    werkcultuur en gewoonten en contact hebben met deelnemers.
                  </p>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    Dit biedt een praktische omgeving om de taal te oefenen,
                    vaardigheden te ontwikkelen voor de arbeidsmarkt, hun
                    netwerk te vergroten en een waardevolle referentie op te
                    bouwen voor een toekomstige baan bij een Nederlandse
                    organisatie.
                  </p>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href="/onze-medewerkers"
                      className="text-primary hover:text-primary/80 group/link inline-flex items-center gap-2 font-semibold underline decoration-2 underline-offset-4 transition-colors"
                    >
                      Benieuwd naar onze medewerkers?
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>
              </ScrollReveal>

              {/* Nieuwe culturen leren kennen */}
              <ScrollReveal animation="slideUp" delay={0.2}>
                <div className="group">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="bg-primary/10 rounded-xl p-3 transition-transform group-hover:scale-110">
                      <Globe className="text-primary h-6 w-6" />
                    </div>
                    <h2 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">
                      Nieuwe culturen leren kennen
                    </h2>
                  </div>
                  <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                    Tijdens onze workshops en activiteiten stimuleren wij
                    interactie tussen deelnemers en medewerkers om zodoende
                    deelnemers kennis te laten maken met onze medewerkers, hun
                    cultuur en hun achtergrond.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Daarmee vergroten wij de kennis van deelnemers over de
                    achtergrond en cultuur van onze medewerkers waardoor zij
                    meer openstaan voor statushouders en asielzoekers en we onze
                    samenleving inclusiever maken.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Onze Visie Card */}
              <ScrollReveal animation="slideUp">
                <Card className="shadow-editorial hover:shadow-editorial-hover border-primary/10 overflow-hidden border-l-4 transition-all duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="bg-primary/10 rounded-xl p-3">
                        <Eye className="text-primary h-6 w-6" />
                      </div>
                      <h2 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">
                        Onze visie
                      </h2>
                    </div>
                    <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                      <p>
                        Wij streven naar een samenleving waarin diversiteit
                        wordt gevierd en iedereen gelijke kansen heeft op de
                        arbeidsmarkt.
                      </p>
                      <p>
                        Door het potentieel van statushouders en asielzoekers te
                        erkennen en te benutten, bouwen we bruggen tussen
                        culturen en versterken we de sociale cohesie.
                      </p>
                      <p>
                        We zien een toekomst voor ons waarin onze organisatie
                        een toonaangevende rol speelt in het creëren van
                        inclusieve werkplekken, waar talenten uit alle hoeken
                        van de wereld samenkomen en bijdragen aan gezamenlijke
                        groei en welvaart.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Onze Missie Card */}
              <ScrollReveal animation="slideUp" delay={0.1}>
                <Card className="shadow-editorial hover:shadow-editorial-hover border-primary/10 overflow-hidden border-l-4 transition-all duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="bg-primary/10 rounded-xl p-3">
                        <Target className="text-primary h-6 w-6" />
                      </div>
                      <h2 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">
                        Onze missie
                      </h2>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Het is onze missie om statushouders en asielzoekers in hun
                      baan bij Goeduitje voor te bereiden op een baan die
                      aansluit bij hun kennis, ervaring en interesses en
                      Nederlanders kennis te laten maken met onze medewerkers en
                      hun cultuur zodat zij statushouders en asielzoekers
                      waarderen om hun kennis en kwaliteiten.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Onze Impact Card */}
              <ScrollReveal animation="slideUp" delay={0.2}>
                <Card className="shadow-editorial hover:shadow-editorial-hover border-primary/10 bg-muted/30 overflow-hidden border-l-4 transition-all duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="bg-primary/10 rounded-xl p-3">
                        <TrendingUp className="text-primary h-6 w-6" />
                      </div>
                      <h2 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">
                        Onze impact
                      </h2>
                    </div>
                    <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                      Wil je meer weten over de impact die we gemaakt hebben en
                      willen gaan maken? Over onze Theory of Change of onze
                      jaarcijfers? Check deze dan op{" "}
                      <Link
                        href="/onze-impact"
                        className="text-primary hover:text-primary/80 font-semibold underline decoration-2 underline-offset-4"
                      >
                        onze impact
                      </Link>
                      .
                    </p>
                    <p className="text-muted-foreground mb-6 text-base">
                      Goeduitje is geregistreerd in de Code Sociale
                      Ondernemingen.
                    </p>

                    {/* Logos */}
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="bg-background flex h-16 items-center justify-center rounded-lg px-4 shadow-sm">
                        <Image
                          src="/images/logo/logo-nav.png"
                          alt="Goeduitje"
                          width={120}
                          height={40}
                          className="h-10 w-auto object-contain"
                        />
                      </div>
                      <div className="bg-background flex h-16 items-center justify-center rounded-lg px-4 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Award className="text-primary h-8 w-8" />
                          <div className="text-xs leading-tight">
                            <span className="text-primary block font-bold">
                              CODE SOCIALE
                            </span>
                            <span className="text-muted-foreground">
                              ONDERNEMINGEN
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Pull Quote Section */}
      <section className="bg-primary/5 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="scale">
            <div className="mx-auto max-w-4xl text-center">
              <span className="text-primary/20 mb-4 block font-serif text-7xl leading-none sm:text-8xl">
                &ldquo;
              </span>
              <blockquote className="text-foreground -mt-8 text-2xl leading-relaxed font-light tracking-wide italic sm:text-3xl lg:text-4xl">
                Samen bouwen we bruggen tussen culturen en creëren we
                onvergetelijke ervaringen
              </blockquote>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Heart className="text-primary h-5 w-5" />
                <span className="text-primary font-semibold tracking-wide">
                  Goeduitje Team
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Team & Impact Teasers */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-12 text-center">
              <h2 className="text-primary mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Meer Ontdekken
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
                Leer meer over onze impact en ontmoet het team
              </p>
            </div>
          </ScrollReveal>

          <StaggerChildren
            staggerDelay={0.15}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Impact Teaser */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="shadow-editorial hover:shadow-editorial-hover group h-full border transition-all duration-300">
                <CardContent className="flex h-full flex-col p-8">
                  <div className="bg-primary/10 group-hover:bg-primary/20 mb-6 w-fit rounded-2xl p-4 transition-colors">
                    <Sparkles className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold tracking-tight">
                    Onze Impact
                  </h3>
                  <p className="text-muted-foreground mb-6 flex-grow text-lg leading-relaxed">
                    Ontdek hoe we samen met statushouders en asielzoekers een
                    positieve impact maken op de samenleving. Bekijk onze Theory
                    of Change en jaarcijfers.
                  </p>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="default"
                      className="group/btn w-full tracking-wide sm:w-auto"
                      asChild
                    >
                      <Link href="/onze-impact">
                        Bekijk onze impact
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Teaser */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="shadow-editorial hover:shadow-editorial-hover group h-full border transition-all duration-300">
                <CardContent className="flex h-full flex-col p-8">
                  <div className="bg-primary/10 group-hover:bg-primary/20 mb-6 w-fit rounded-2xl p-4 transition-colors">
                    <Users className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold tracking-tight">
                    Onze Medewerkers
                  </h3>
                  <p className="text-muted-foreground mb-6 flex-grow text-lg leading-relaxed">
                    Ontmoet de mensen achter Goeduitje. Leer meer over hun
                    achtergrond, cultuur en de unieke vaardigheden die zij
                    meebrengen naar uw bedrijfsuitje.
                  </p>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="default"
                      className="group/btn w-full tracking-wide sm:w-auto"
                      asChild
                    >
                      <Link href="/onze-medewerkers">
                        Ontmoet het team
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerChildren>
        </div>
      </section>

      {/* CTA Section */}
      <ScrollReveal animation="slideUp" amount={0.4}>
        <section className="bg-primary text-primary-foreground py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-6 text-center lg:px-8">
            <HandHeart className="mx-auto mb-6 h-12 w-12 text-white/80" />
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Klaar voor een uitje met impact?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
              Ontdek onze unieke bedrijfsuitjes en maak samen met ons het
              verschil.
            </p>
            <motion.div
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ y: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                variant="secondary"
                className="text-primary shadow-editorial-lg hover:shadow-editorial-hover bg-white px-8 tracking-wide transition-all duration-300 hover:bg-white/90"
                asChild
              >
                <Link href="/onze-uitjes">Bekijk onze uitjes</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </ScrollReveal>

      {/* Footnote Section */}
      <section className="border-t py-8">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-muted-foreground text-sm leading-relaxed italic">
            *statushouder: Asielzoeker die een verblijfsvergunning heeft en in
            Nederland mag blijven.
          </p>
        </div>
      </section>
    </div>
  );
}
