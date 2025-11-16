"use client";

import { motion } from "framer-motion";
import { WorkshopConfigurator } from "@/components/workshop-configurator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WORKSHOPS } from "@/lib/constants/cities";
import Image from "next/image";
import { WORKSHOP_BLUR_PLACEHOLDERS } from "@/lib/image-placeholders";
import {
  IconUsers,
  IconMapPin,
  IconCalendar,
  IconStar,
} from "@tabler/icons-react";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";

// Metadata should be in layout.tsx for client components
// Or use generateMetadata in a separate server component

export default function OnzeUitjesPage() {
  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Hero Section - Editorial Treatment */}
      <section className="relative overflow-hidden border-b">
        {/* Sophisticated background layering */}
        <div className="absolute inset-0">
          <div className="from-primary/10 via-primary/5 absolute inset-0 bg-gradient-to-br to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="section-md relative">
          <div className="container">
            <ScrollReveal animation="slideUp">
              <div className="mx-auto max-w-4xl">
                <h1 className="mb-8 text-[56px] leading-[1.1] tracking-tight sm:text-[64px]">
                  Onze Uitjes
                </h1>
                <p className="text-muted-foreground mb-12 max-w-2xl text-xl leading-relaxed tracking-wide">
                  Configureer je perfecte teamuitje. Kies uit verschillende
                  workshops, locaties en activiteiten voor een onvergetelijke
                  ervaring.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                    <Button
                      size="lg"
                      className="shadow-editorial hover:shadow-editorial-lg px-8 py-6 font-semibold tracking-wide transition-all duration-300"
                      asChild
                    >
                      <a href="#configurator">Start Configureren</a>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-6 font-semibold tracking-wide transition-all duration-300"
                      asChild
                    >
                      <a href="#workshops">Bekijk Workshops</a>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section - Editorial Grid */}
      <section className="section-md">
        <div className="container">
          <ScrollReveal animation="slideUp">
            <div className="mb-20 max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Waarom Kiezen Voor Ons?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed tracking-wide">
                Wat maakt onze uitjes speciaal
              </p>
            </div>
          </ScrollReveal>

          <StaggerChildren
            staggerDelay={0.1}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: IconUsers,
                title: "Flexibele Groepsgrootte",
                description:
                  "Van kleine teams tot grote groepen, wij hebben de perfecte workshop voor jullie.",
              },
              {
                icon: IconMapPin,
                title: "Meerdere Locaties",
                description:
                  "Workshops beschikbaar in Nijmegen, Arnhem, Amersfoort en meer steden in Nederland.",
              },
              {
                icon: IconCalendar,
                title: "Flexibele Planning",
                description:
                  "Kies je datum en tijd, of laat het nog te bepalen voor maximale flexibiliteit.",
              },
              {
                icon: IconStar,
                title: "Professionele Begeleiding",
                description:
                  "Ervaren begeleiders zorgen voor een onvergetelijke en leerzame ervaring.",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                  <CardHeader>
                    <feature.icon className="text-primary mb-4 size-8" />
                    <CardTitle className="text-xl tracking-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed tracking-wide">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Available Workshops Section - Editorial Grid */}
      <section id="workshops" className="section-md relative overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0">
          <div className="bg-muted/50 absolute inset-0" />
          <div className="from-background/50 absolute inset-0 bg-gradient-to-b to-transparent" />
        </div>

        <div className="relative container">
          <ScrollReveal animation="slideUp">
            <div className="mb-20 max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Beschikbare Workshops
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed tracking-wide">
                Onze selectie van team-building activiteiten
              </p>
            </div>
          </ScrollReveal>

          {/* Asymmetric editorial grid with videos */}
          <StaggerChildren
            staggerDelay={0.1}
            className="grid auto-rows-fr gap-6 md:grid-cols-12"
          >
            {WORKSHOPS.map((workshop, index) => {
              const workshopData: Record<
                string,
                { description: string; video?: string; image?: string }
              > = {
                kookworkshop: {
                  description:
                    "Leer samen koken en geniet van een heerlijke maaltijd die jullie zelf hebben bereid.",
                  video: "/images/workshops/workshop 1.mp4",
                },
                stadsspel: {
                  description:
                    "Ontdek de stad op een interactieve manier met uitdagende opdrachten en vragen.",
                  video: "/images/workshops/workshop 2.mp4",
                },
                "the-game": {
                  description:
                    "Spannende team-building activiteit waarbij samenwerking centraal staat.",
                  image: "/images/workshops/the-game.jpg",
                },
                beachvolleybal: {
                  description:
                    "Actieve teambuilding op het strand met professionele begeleiding.",
                  image: "/images/workshops/beachvolleybal.jpg",
                },
                "koffie-thee": {
                  description:
                    "Ontdek de wereld van koffie en thee tijdens deze proeverij workshop.",
                  image: "/images/workshops/koffie-thee.jpg",
                },
                "design-tshirt": {
                  description:
                    "Ontwerp en creëer je eigen unieke team t-shirts.",
                  image: "/images/workshops/design-tshirt.jpg",
                },
              };

              const data = workshopData[workshop.id];

              // Editorial grid pattern: vary column spans
              const gridSpan =
                index % 3 === 0
                  ? "md:col-span-5"
                  : index % 3 === 1
                    ? "md:col-span-4"
                    : "md:col-span-3";

              return (
                <motion.div
                  key={workshop.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className={gridSpan}
                >
                  <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                    {/* Media - Video or Image */}
                    {(data?.video || data?.image) && (
                      <div className="bg-muted relative aspect-video overflow-hidden">
                        {data.video ? (
                          <video
                            src={data.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          data.image && (
                            <Image
                              src={data.image}
                              alt={workshop.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              placeholder="blur"
                              blurDataURL={
                                WORKSHOP_BLUR_PLACEHOLDERS[
                                  workshop.id as keyof typeof WORKSHOP_BLUR_PLACEHOLDERS
                                ]
                              }
                            />
                          )
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-2xl tracking-tight">
                        {workshop.name}
                      </CardTitle>
                      <CardDescription className="text-base tracking-wide">
                        Minimaal {workshop.minParticipants} deelnemers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed tracking-wide">
                        {data?.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Workshop Configurator Section - Editorial */}
      <section id="configurator" className="section-md">
        <div className="container">
          <ScrollReveal animation="slideUp">
            <div className="mb-20 max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Configureer Je Uitje
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed tracking-wide">
                Vul het formulier in en ontvang direct een bevestiging
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="slideUp" delay={0.2}>
            <div className="flex justify-center">
              <WorkshopConfigurator />
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
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Klaar om te Beginnen?
              </h2>
              <p className="mb-12 text-xl leading-relaxed tracking-wide opacity-90">
                Configureer nu je workshop en ontvang binnen 24 uur een reactie
                van ons team.
              </p>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="shadow-editorial hover:shadow-editorial-lg px-8 py-6 font-semibold tracking-wide transition-all duration-300"
                  asChild
                >
                  <a href="#configurator">Start Configuratie</a>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
