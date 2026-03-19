"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { WorkshopConfigurator } from "@/components/workshop-configurator";
import { WorkshopCarousel } from "@/components/workshop-carousel";
import { SocialProofStats } from "@/components/social-proof-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { WORKSHOP_BLUR_PLACEHOLDERS } from "@/lib/image-placeholders";
import { Users, Building2, Sparkles, ArrowRight } from "lucide-react";

export default function OnzeUitjesPage() {
  return (
    <main className="flex min-h-screen flex-col pt-20">
      {/* Compact Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="from-primary/10 via-primary/5 absolute inset-0 bg-gradient-to-br to-transparent" />
        </div>

        <div className="relative py-4">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-primary mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Onze Uitjes
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
                <Button asChild variant="default" size="sm" className="mr-1">
                  <a href="#configurator">Configureer</a>
                </Button>
                je perfecte teamuitje of kies uit verschillende activiteiten
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Uitjes Section - Immediately visible */}
      <div id="uitjes" className="py-4">
        <WorkshopCarousel
          title="Beschikbare Uitjes"
          subtitle="Onze selectie van team-building activiteiten"
          showViewAllButton={false}
          compact
        />
      </div>

      {/* USP Cards Section */}
      <section className="py-4">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Maak sociale impact",
                description:
                  "Onze uitjes worden begeleid door statushouders en nieuwkomers.",
              },
              {
                title: "Op locatie naar keuze",
                description:
                  "Wij komen naar jullie toe of organiseren op onze locaties.",
              },
              {
                title: "Op maat",
                description:
                  "Elk uitje wordt aangepast aan jullie wensen en budget.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-primary/10 bg-primary/5 rounded-xl border p-4 text-center"
              >
                <h3 className="text-primary mb-1 font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-snug">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Links Section */}
      <section className="py-6">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-primary mb-4 text-center text-xl font-bold tracking-tight sm:text-2xl">
            Ontdek per categorie
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                title: "Teambuilding",
                description:
                  "Activiteiten die je team verbinden én impact maken.",
                href: "/teambuilding",
                icon: Users,
                color: "text-blue-600",
              },
              {
                title: "Bedrijfsuitjes",
                description: "Een bedrijfsuitje met een verhaal.",
                href: "/bedrijfsuitjes",
                icon: Building2,
                color: "text-emerald-600",
              },
              {
                title: "Workshops",
                description: "Hands-on workshops met statushouders.",
                href: "/workshops",
                icon: Sparkles,
                color: "text-amber-600",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group border-primary/10 hover:border-primary/30 flex items-center gap-3 rounded-xl border p-4 transition-all"
                >
                  <Icon className={`h-6 w-6 flex-shrink-0 ${item.color}`} />
                  <div>
                    <h3 className="font-bold tracking-tight">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="text-muted-foreground ml-auto h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Uitje Configurator Section */}
      <section id="configurator" className="bg-muted/30 py-6">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-4 text-center">
            <h2 className="text-primary text-xl font-bold tracking-tight sm:text-2xl">
              Configureer Je Uitje
            </h2>
            <p className="text-muted-foreground mt-2 text-base leading-relaxed">
              Vul het formulier in en ontvang direct een bevestiging
            </p>
          </div>

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

                {/* Uitje Preview Video */}
                <Card className="shadow-editorial overflow-hidden border">
                  <div className="bg-muted relative aspect-[4/3]">
                    <video
                      src="/images/ons-verhaal/impressie-uitjes.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute right-4 bottom-4 left-4 text-white">
                      <h3 className="mb-1 text-lg font-bold">
                        Onze Populairste Uitjes
                      </h3>
                      <p className="text-sm opacity-90">
                        Unieke teambuildingservaringen
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Uitje Collage */}
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
                          src="/images/workshops/lunch-diner.jpg"
                          alt="Lunch & Diner"
                          fill
                          className="object-cover"
                          sizes="220px"
                          placeholder="blur"
                          blurDataURL={
                            WORKSHOP_BLUR_PLACEHOLDERS["lunch-diner"]
                          }
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 font-bold">Kies uit 7+ Uitjes</h3>
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
              Configureer nu je uitje en ontvang binnen 24 uur een reactie van
              ons team.
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
