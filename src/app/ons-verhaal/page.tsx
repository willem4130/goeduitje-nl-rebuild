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
} from "lucide-react";
import Link from "next/link";

export default function OnsVerhaalPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Hero Section - Parallax with Editorial Typography */}
      <section className="relative overflow-hidden border-b">
        {/* Parallax background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 -z-10">
          <div className="from-primary/10 via-primary/5 absolute inset-0 bg-gradient-to-br to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </motion.div>

        <div className="section-md relative">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal animation="slideUp">
              <div className="mx-auto max-w-4xl text-center">
                <h1 className="text-primary mb-8 tracking-tight">
                  Ons Verhaal
                </h1>
                <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-lg leading-relaxed tracking-wide sm:text-xl">
                  Wij zijn een sociale onderneming waar statushouders* en
                  asielzoekers uw bedrijfsuitjes organiseren en u een
                  onvergetelijke dag bezorgen.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Doen én bijzonder eten Section */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8 text-center">
              <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
                <Utensils className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-primary tracking-tight">
                Doen én bijzonder eten
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg leading-relaxed tracking-wide sm:text-xl">
                Onze bedrijfsuitjes bestaan uit een mix van actieve en minder
                actieve Uitjes met vaak een cultureel tintje al dan niet
                gecombineerd met heerlijk eten uit de Arabische of Perzische
                keuken.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Ervaring opdoen Section */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8 text-center">
              <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
                <GraduationCap className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-primary tracking-tight">Ervaring opdoen</h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg leading-relaxed tracking-wide sm:text-xl">
                Onze medewerkers organiseren en begeleiden de workshops en
                activiteiten, waardoor zij kennismaken met de Nederlandse
                werkcultuur en gewoonten en contact hebben met deelnemers. Dit
                biedt een praktische omgeving om de taal te oefenen,
                vaardigheden te ontwikkelen voor de arbeidsmarkt, hun netwerk te
                vergroten en een waardevolle referentie op te bouwen voor een
                toekomstige baan bij een Nederlandse organisatie.
              </p>
              <motion.div
                className="mt-6"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  className="group tracking-wide"
                  asChild
                >
                  <Link href="/onze-medewerkers">
                    Benieuwd naar onze medewerkers?
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Nieuwe culturen leren kennen Section */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8 text-center">
              <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
                <Globe className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-primary tracking-tight">
                Nieuwe culturen leren kennen
              </h2>
              <div className="text-muted-foreground mx-auto mt-4 max-w-3xl space-y-4 text-lg leading-relaxed tracking-wide sm:text-xl">
                <p>
                  Tijdens onze workshops en activiteiten stimuleren wij
                  interactie tussen deelnemers en medewerkers om zodoende
                  deelnemers kennis te laten maken met onze medewerkers, hun
                  cultuur en hun achtergrond.
                </p>
                <p>
                  Daarmee vergroten wij de kennis van deelnemers over de
                  achtergrond en cultuur van onze medewerkers waardoor zij meer
                  openstaan voor statushouders en asielzoekers en we onze
                  samenleving inclusiever maken.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pull Quote - Editorial Layout */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-4xl text-center">
              <span className="text-primary/30 mb-4 block font-serif text-6xl leading-none">
                &ldquo;
              </span>
              <blockquote className="text-foreground mb-6 text-xl leading-relaxed font-light tracking-wide italic sm:text-2xl">
                Wij vergroten de kennis van deelnemers over de achtergrond en
                cultuur van onze medewerkers waardoor zij meer openstaan voor
                statushouders en asielzoekers.
              </blockquote>
              <div className="border-border inline-block border-t pt-4">
                <p className="font-semibold tracking-tight">
                  Het Goeduitje Team
                </p>
                <p className="text-muted-foreground text-sm tracking-wide">
                  Be a part of it!
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Visie & Missie Section - 2 Column Layout */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8 text-center">
              <h2 className="text-primary tracking-tight">Visie & Missie</h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed tracking-wide sm:text-xl">
                Waar we voor staan en wat we willen bereiken
              </p>
            </div>
          </ScrollReveal>

          <StaggerChildren
            staggerDelay={0.15}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Visie Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                <CardContent className="flex h-full flex-col p-8">
                  <div className="bg-primary/10 mb-4 w-fit rounded-full p-4">
                    <Eye className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-semibold tracking-tight">
                    Onze Visie
                  </h3>
                  <div className="text-muted-foreground flex-grow space-y-4 leading-relaxed tracking-wide">
                    <p>
                      Wij streven naar een samenleving waarin diversiteit wordt
                      gevierd en iedereen gelijke kansen heeft op de
                      arbeidsmarkt.
                    </p>
                    <p>
                      Door het potentieel van statushouders en asielzoekers te
                      erkennen en te benutten, bouwen we bruggen tussen culturen
                      en versterken we de sociale cohesie.
                    </p>
                    <p>
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
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                <CardContent className="flex h-full flex-col p-8">
                  <div className="bg-primary/10 mb-4 w-fit rounded-full p-4">
                    <Target className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-semibold tracking-tight">
                    Onze Missie
                  </h3>
                  <p className="text-muted-foreground flex-grow leading-relaxed tracking-wide">
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
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8 text-center">
              <h2 className="text-primary tracking-tight">Meer Ontdekken</h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed tracking-wide sm:text-xl">
                Leer meer over onze impact en ontmoet het team
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-2">
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

      {/* CTA Section */}
      <ScrollReveal animation="slideUp" amount={0.4}>
        <section className="section-md bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h2 className="mb-6 tracking-tight text-white">
              Word Deel van Ons Verhaal
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed tracking-wide text-white/90 sm:text-xl">
              Organiseer een bedrijfsuitje dat verder gaat dan teambuilding.
              Maak impact die telt en draag bij aan een inclusievere
              samenleving.
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
                <Link href="/onze-uitjes">Bekijk Onze Workshops</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </ScrollReveal>

      {/* Footnote Section */}
      <section className="border-t py-8">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-muted-foreground text-sm leading-relaxed">
            *statushouder: Asielzoeker die een verblijfsvergunning heeft en in
            Nederland mag blijven.
          </p>
        </div>
      </section>
    </div>
  );
}
