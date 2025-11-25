"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Target,
  Users,
  TrendingUp,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// Theory of Change data - Medewerker
const tocMedewerker = {
  activiteiten: [
    "Oriëntatiegesprek met werknemer",
    "Aannameproces met selectiecriteria",
    "Bezoek van gemeente",
    "Uitvoeren intake tijdens sollicitatie",
    "Leiden van workshops",
    "Evaluatie van workshops",
    "Samenwerken met coördinatoren",
    "Social media planning & uitvoering",
    "Administratie en boekhouding",
  ],
  outputs: [
    "Medewerkers: stage, freelance & loondienstverband",
    "Bronnen ongeacht tot: con van Goeduitje",
    "Professionele referentie",
    "Sociale netwerking",
    "Feedback deelnemers & teambuilding",
    "Evaluatiegesprek",
    "Content creatie & content",
    "Verkoopdoelen & planning",
  ],
  directeEffecten: [
    "Ontwikkeld werkproces: vaardigheden (vb. teamwork, professionele communicatie)",
    "Vergroten netwerk en positieve contactmomenten",
    "Indruk en gevoel op de werkvloer",
    "Eigenaar maken Nederlandse culturele normen",
    "Ontwikkelen persoonlijke en beroepsmatige kwaliteiten",
    "Inzichtelijk en goede ervaring van Nederlandse waarden",
  ],
  indirecteEffecten: [
    "Medewerkers vinden positie binnen bedrijfsleven die aansluit bij hun kennis, ervaring en interesseert",
  ],
};

// Theory of Change data - Klant/Deelnemer
const tocDeelnemer = {
  activiteiten: [
    "Opdracht en workshops",
    "Leiderschapsspel met medewerkers",
    "Locatiebezoek met inspectie",
  ],
  outputs: [
    "Sociale interactie met stagehouden en asielzoekers",
    "Kennismaken met culturen, ervaringen en achtergronden",
    "Informatie over achtergrond",
  ],
  directeEffecten: [
    "Positieve ervaring op de dag zelf/goede sfeer en uitkomst van de activiteiten",
    "Positieve en goede reactie naar medewerkers als teamgebouw",
    "Open staan om zulke initiatieven vaker te steunen en meedoen",
  ],
  indirecteEffecten: [
    "Organisaties rusten beter statushouders als sollicitanten de verbreed bij hun niveau van opleidingen",
    "Meer inclusieve samenleving",
  ],
};

// Documents data
const impactDocuments = [
  {
    title: "Impactmeting en -rapportage Goeduitje",
    url: "/documents/impactmeting-rapportage-goeduitje.pdf",
  },
  {
    title: "Impactrapportage 2024 Goeduitje",
    url: "/documents/impactrapportage-2024-goeduitje.pdf",
  },
];

const multiYearPlan = {
  title: "Meerjarenplan 2025 - 2029",
  url: "/documents/meerjarenplan-2025-2029.pdf",
};

const otherDocuments = [
  {
    title: "Eigendomsverhoudingen Goeduitje",
    url: "/documents/eigendomsverhoudingen-goeduitje.pdf",
  },
  {
    title: "Statuten Goeduitje",
    url: "/documents/statuten-goeduitje.pdf",
  },
  {
    title: "Stakeholdersbepaling",
    url: "/documents/stakeholdersbepaling.pdf",
  },
  {
    title: "Financieel beleid Goeduitje",
    url: "/documents/financieel-beleid-goeduitje.pdf",
  },
];

// Photo gallery images
const galleryImages = [
  {
    id: 1,
    alt: "Team aan het werk in de keuken",
    aspect: "portrait",
  },
  {
    id: 2,
    alt: "Workshop koken met deelnemers",
    aspect: "landscape",
  },
  {
    id: 3,
    alt: "Gezellige sfeer tijdens uitje",
    aspect: "landscape",
  },
  {
    id: 4,
    alt: "Team samen aan het koken",
    aspect: "portrait",
  },
];

export default function OnzeImpactPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Hero Section */}
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
                  Onze Impact
                </h1>
                <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed tracking-wide sm:text-xl">
                  Ontdek hoe wij impact maken voor onze medewerkers, klanten en
                  de samenleving.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Theory of Change Introduction */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8">
              <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3 sm:mx-0">
                <Lightbulb className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-primary mb-4 tracking-tight">
                Onze Theory of Change
              </h2>
              <div className="text-muted-foreground max-w-4xl space-y-4 text-lg leading-relaxed tracking-wide">
                <p>
                  Theory of Change (ToC) is een model dat helpt om te begrijpen
                  hoe en waarom een bepaalde verandering plaatsvindt. Het
                  beschrijft de stappen die nodig zijn om een doel te bereiken,
                  inclusief de middelen, activiteiten en verwachte resultaten.
                  ToC maakt duidelijk welke aannames er zijn en hoe deze
                  bijdragen aan de gewenste impact.
                </p>
                <p>
                  Hieronder zie je onze Theory of Change voor onze medewerkers
                  en deelnemers aan onze workshops en activiteiten.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Theory of Change - Medewerker */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8">
              <h3 className="text-primary mb-6 text-2xl font-bold tracking-tight">
                Theory of Change medewerker
              </h3>

              {/* ToC Flow Diagram - Medewerker */}
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-4 gap-4">
                    {/* Column Headers */}
                    <div className="bg-primary rounded-lg p-3 text-center">
                      <span className="text-sm font-semibold text-white">
                        Activiteiten
                      </span>
                    </div>
                    <div className="rounded-lg bg-yellow-500 p-3 text-center">
                      <span className="text-sm font-semibold text-white">
                        Outputs
                      </span>
                    </div>
                    <div className="rounded-lg bg-orange-500 p-3 text-center">
                      <span className="text-sm font-semibold text-white">
                        Directe effecten
                      </span>
                    </div>
                    <div className="rounded-lg bg-red-600 p-3 text-center">
                      <span className="text-sm font-semibold text-white">
                        Indirecte effecten
                      </span>
                    </div>

                    {/* Content Columns */}
                    <div className="space-y-2">
                      {tocMedewerker.activiteiten.map((item, idx) => (
                        <div
                          key={idx}
                          className="border-primary/20 bg-primary/5 rounded-lg border p-2 text-xs"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {tocMedewerker.outputs.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-yellow-500/20 bg-yellow-50 p-2 text-xs dark:bg-yellow-950/20"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {tocMedewerker.directeEffecten.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-orange-500/20 bg-orange-50 p-2 text-xs dark:bg-orange-950/20"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {tocMedewerker.indirecteEffecten.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-red-600/20 bg-red-50 p-2 text-xs dark:bg-red-950/20"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow indicators */}
                  <div className="mt-4 flex justify-center gap-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>Flow:</span>
                      <ChevronRight className="h-4 w-4" />
                      <span>Activiteiten naar Indirecte effecten</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Theory of Change - Klant/Deelnemer */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8">
              <h3 className="text-primary mb-6 text-2xl font-bold tracking-tight">
                Theory of Change klant / deelnemer
              </h3>

              {/* ToC Flow Diagram - Deelnemer */}
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-4 gap-4">
                    {/* Column Headers */}
                    <div className="bg-primary rounded-lg p-3 text-center">
                      <span className="text-sm font-semibold text-white">
                        Activiteiten
                      </span>
                    </div>
                    <div className="rounded-lg bg-yellow-500 p-3 text-center">
                      <span className="text-sm font-semibold text-white">
                        Outputs
                      </span>
                    </div>
                    <div className="rounded-lg bg-orange-500 p-3 text-center">
                      <span className="text-sm font-semibold text-white">
                        Directe effecten
                      </span>
                    </div>
                    <div className="rounded-lg bg-red-600 p-3 text-center">
                      <span className="text-sm font-semibold text-white">
                        Indirecte effecten
                      </span>
                    </div>

                    {/* Content Columns */}
                    <div className="space-y-2">
                      {tocDeelnemer.activiteiten.map((item, idx) => (
                        <div
                          key={idx}
                          className="border-primary/20 bg-primary/5 rounded-lg border p-2 text-xs"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {tocDeelnemer.outputs.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-yellow-500/20 bg-yellow-50 p-2 text-xs dark:bg-yellow-950/20"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {tocDeelnemer.directeEffecten.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-orange-500/20 bg-orange-50 p-2 text-xs dark:bg-orange-950/20"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {tocDeelnemer.indirecteEffecten.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-red-600/20 bg-red-50 p-2 text-xs dark:bg-red-950/20"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow indicators */}
                  <div className="mt-4 flex justify-center gap-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>Flow:</span>
                      <ChevronRight className="h-4 w-4" />
                      <span>Activiteiten naar Indirecte effecten</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Impact Measurement and Reports Section */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8">
              <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3 sm:mx-0">
                <TrendingUp className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-primary mb-4 tracking-tight">
                Impactmeting en rapportage
              </h2>
              <p className="text-muted-foreground max-w-4xl text-lg leading-relaxed tracking-wide">
                Jaarlijks willen wij impact meten op 4 gebieden:
                arbeidsparticipatie, opleiding, impact op medewerkers,
                stagiaires en trainees en impact op de samenleving. Daarnaast
                plaatsen wij onze jaarrekeningen hieronder.
              </p>
            </div>
          </ScrollReveal>

          {/* Download Links - Impact Reports */}
          <ScrollReveal animation="slideUp" delay={0.1}>
            <Card className="shadow-editorial hover:shadow-editorial-hover mb-6 border transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold tracking-tight">
                  Download
                </h3>
                <div className="space-y-3">
                  {impactDocuments.map((doc, idx) => (
                    <motion.a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm underline underline-offset-4 transition-colors"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FileText className="h-4 w-4" />
                      {doc.title}
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Multi-Year Plan Section */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8">
              <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3 sm:mx-0">
                <Target className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-primary mb-4 tracking-tight">
                Meerjarenplan 2025 - 2029
              </h2>
              <p className="text-muted-foreground max-w-4xl text-lg leading-relaxed tracking-wide">
                De komende jaren willen wij meer impact maken. Lees ons
                meerjarenplan 2025 - 2029 om te zien hoe we dat willen doen.
              </p>
            </div>
          </ScrollReveal>

          {/* Download Link - Multi-Year Plan */}
          <ScrollReveal animation="slideUp" delay={0.1}>
            <Card className="shadow-editorial hover:shadow-editorial-hover mb-6 border transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold tracking-tight">
                  Download
                </h3>
                <motion.a
                  href={multiYearPlan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm underline underline-offset-4 transition-colors"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <FileText className="h-4 w-4" />
                  {multiYearPlan.title}
                </motion.a>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Other Documents Section */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8">
              <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3 sm:mx-0">
                <FileText className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-primary mb-4 tracking-tight">
                Overige documenten
              </h2>
              <p className="text-muted-foreground max-w-4xl text-lg leading-relaxed tracking-wide">
                Hieronder vind je de eigendomsverhoudingen, statuten en
                stakeholdersbepaling van Goeduitje B.V.
              </p>
            </div>
          </ScrollReveal>

          {/* Download Links - Other Documents */}
          <ScrollReveal animation="slideUp" delay={0.1}>
            <Card className="shadow-editorial hover:shadow-editorial-hover mb-6 border transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold tracking-tight">
                  Download
                </h3>
                <div className="space-y-3">
                  {otherDocuments.map((doc, idx) => (
                    <motion.a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm underline underline-offset-4 transition-colors"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FileText className="h-4 w-4" />
                      {doc.title}
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8 text-center">
              <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
                <Users className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-primary mb-4 tracking-tight">
                Ons Team in Actie
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed tracking-wide">
                Bekijk onze medewerkers tijdens workshops en activiteiten
              </p>
            </div>
          </ScrollReveal>

          {/* Photo Grid */}
          <StaggerChildren
            staggerDelay={0.1}
            className="grid gap-4 md:grid-cols-4"
          >
            {galleryImages.map((image, idx) => (
              <motion.div
                key={image.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`relative overflow-hidden rounded-xl ${
                  idx === 0 || idx === 3
                    ? "aspect-[3/4] md:row-span-2"
                    : "aspect-[4/3]"
                }`}
              >
                {/* Placeholder with gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg,
                      hsl(${25 + idx * 20}, 40%, ${60 - idx * 5}%) 0%,
                      hsl(${35 + idx * 15}, 35%, ${50 - idx * 3}%) 100%)`,
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Decorative pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />

                {/* Image placeholder icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                    <Users className="h-8 w-8 text-white/80" />
                  </div>
                </div>

                {/* Caption */}
                <div className="absolute right-0 bottom-0 left-0 p-4">
                  <p className="text-sm font-medium text-white/90">
                    {image.alt}
                  </p>
                </div>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Quote Section */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-4xl text-center">
              <span className="text-primary/30 mb-4 block font-serif text-6xl leading-none">
                &ldquo;
              </span>
              <blockquote className="text-foreground mb-6 text-xl leading-relaxed font-light tracking-wide italic sm:text-2xl">
                Met getalenteerde asielzoekers en statushouders geweldige
                activiteiten en evenementen organiseren.
              </blockquote>
              <div className="border-border inline-block border-t pt-4">
                <p className="font-semibold tracking-tight">Goeduitje</p>
                <p className="text-muted-foreground text-sm tracking-wide">
                  Onze missie
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <ScrollReveal animation="slideUp" amount={0.4}>
        <section className="section-md bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h2 className="mb-6 tracking-tight text-white">
              Wil je bijdragen aan onze impact?
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
    </div>
  );
}
