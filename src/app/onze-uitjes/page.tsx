"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { WorkshopConfigurator } from "@/components/workshop-configurator";
import { WorkshopCarousel } from "@/components/workshop-carousel";
import { SocialProofStats } from "@/components/social-proof-stats";
import { CompactTestimonials } from "@/components/compact-testimonials";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Users, MapPin, Calendar, Star } from "lucide-react";
import { WORKSHOP_BLUR_PLACEHOLDERS } from "@/lib/image-placeholders";

export default function OnzeUitjesPage() {
  return (
    <main className="flex min-h-screen flex-col pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
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
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal animation="slideUp">
              <div className="mx-auto max-w-4xl text-center">
                <h1 className="text-primary mb-8 tracking-tight">
                  Onze Uitjes
                </h1>
                <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-lg leading-relaxed tracking-wide sm:text-xl">
                  Configureer je perfecte teamuitje. Kies uit verschillende
                  workshops, locaties en activiteiten voor een onvergetelijke
                  ervaring.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <motion.div
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ y: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      size="lg"
                      className="shadow-editorial-lg hover:shadow-editorial-hover px-8 tracking-wide transition-all duration-300"
                      asChild
                    >
                      <a href="#configurator">Start Configureren</a>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ y: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 tracking-wide transition-all duration-300"
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

      {/* Features Section */}
      <section className="section-md">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-8 text-center">
              <h2 className="text-primary tracking-tight">
                Waarom Kiezen Voor Ons?
              </h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed tracking-wide sm:text-xl">
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
                icon: Users,
                title: "Flexibele Groepsgrootte",
                description:
                  "Van kleine teams tot grote groepen, wij hebben de perfecte workshop voor jullie.",
              },
              {
                icon: MapPin,
                title: "Meerdere Locaties",
                description:
                  "Workshops beschikbaar in Nijmegen, Arnhem, Amersfoort en meer steden in Nederland.",
              },
              {
                icon: Calendar,
                title: "Flexibele Planning",
                description:
                  "Kies je datum en tijd, of laat het nog te bepalen voor maximale flexibiliteit.",
              },
              {
                icon: Star,
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

      {/* Available Workshops Section - Reuse WorkshopCarousel */}
      <div id="workshops">
        <ScrollReveal animation="fade" amount={0.1}>
          <WorkshopCarousel
            title="Beschikbare Workshops"
            subtitle="Onze selectie van team-building activiteiten"
          />
        </ScrollReveal>
      </div>

      {/* Workshop Configurator Section */}
      <section id="configurator" className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp" amount={0.2}>
            <div className="mb-8 text-center">
              <h2 className="text-primary tracking-tight">
                Configureer Je Uitje
              </h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed tracking-wide sm:text-xl">
                Vul het formulier in en ontvang direct een bevestiging
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
              <div className="w-full space-y-6 lg:w-[400px] xl:w-[440px]">
                {/* Social Proof Stats */}
                <SocialProofStats />

                {/* Workshop Preview Video */}
                <Card className="shadow-editorial overflow-hidden border">
                  <div className="bg-muted relative aspect-[4/3]">
                    <video
                      src="/images/workshops/workshop 1.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute right-4 bottom-4 left-4 text-white">
                      <h3 className="mb-1 text-lg font-bold">
                        Onze Populairste Workshops
                      </h3>
                      <p className="text-sm opacity-90">
                        Unieke teambuildingservaringen
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Compact Testimonials */}
                <CompactTestimonials />

                {/* Workshop Collage */}
                <Card className="shadow-editorial overflow-hidden border">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="bg-muted relative aspect-square">
                        <Image
                          src="/images/workshops/the-game.jpg"
                          alt="The Game workshop"
                          fill
                          className="object-cover"
                          sizes="220px"
                          placeholder="blur"
                          blurDataURL={WORKSHOP_BLUR_PLACEHOLDERS["the-game"]}
                        />
                      </div>
                      <div className="bg-muted relative aspect-square">
                        <Image
                          src="/images/workshops/beachvolleybal.jpg"
                          alt="Beachvolleybal"
                          fill
                          className="object-cover"
                          sizes="220px"
                          placeholder="blur"
                          blurDataURL={
                            WORKSHOP_BLUR_PLACEHOLDERS["beachvolleybal"]
                          }
                        />
                      </div>
                      <div className="bg-muted relative aspect-square">
                        <Image
                          src="/images/workshops/koffie-thee.jpg"
                          alt="Koffie & Thee workshop"
                          fill
                          className="object-cover"
                          sizes="220px"
                          placeholder="blur"
                          blurDataURL={
                            WORKSHOP_BLUR_PLACEHOLDERS["koffie-thee"]
                          }
                        />
                      </div>
                      <div className="bg-muted relative aspect-square">
                        <Image
                          src="/images/workshops/design-tshirt.jpg"
                          alt="Design Your T-shirt"
                          fill
                          className="object-cover"
                          sizes="220px"
                          placeholder="blur"
                          blurDataURL={
                            WORKSHOP_BLUR_PLACEHOLDERS["design-tshirt"]
                          }
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 font-bold">Kies uit 6+ Workshops</h3>
                      <p className="text-muted-foreground text-sm">
                        Van actief tot creatief - voor elk team wat wils
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <ScrollReveal animation="slideUp" amount={0.4}>
        <section className="section-md bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h2 className="mb-6 tracking-tight text-white">
              Klaar om te Beginnen?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed tracking-wide text-white/90 sm:text-xl">
              Configureer nu je workshop en ontvang binnen 24 uur een reactie
              van ons team.
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
                <a href="#configurator">Start Configuratie</a>
              </Button>
            </motion.div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
