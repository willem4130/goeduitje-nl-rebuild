"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Quote, ArrowRight } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  origin: string | null;
  bio: string;
  quote: string | null;
  image: string | null;
  sortOrder: number;
}

interface OnzeMedewerkersContentProps {
  teamMembers: TeamMember[];
}

export function OnzeMedewerkersContent({
  teamMembers,
}: OnzeMedewerkersContentProps) {
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="flex min-h-screen flex-col pt-20">
        <div className="text-muted-foreground py-32 text-center">
          Geen teamleden gevonden.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Hero Section - Editorial Style matching other pages */}
      <section className="relative overflow-hidden border-b">
        {/* Background */}
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
                <h1 className="text-primary mb-4 tracking-tight sm:mb-8">
                  Onze Medewerkers
                </h1>
                <p className="text-muted-foreground mx-auto mb-4 max-w-2xl text-base leading-relaxed tracking-wide sm:mb-8 sm:text-lg md:text-xl">
                  Ontmoet het team dat jullie bedrijfsuitjes tot een
                  onvergetelijke ervaring maakt. Onze medewerkers zijn
                  statushouders en asielzoekers die met passie hun cultuur en
                  vaardigheden delen.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              {[
                {
                  icon: Heart,
                  title: "Met Passie",
                  description:
                    "Onze medewerkers delen met enthousiasme hun cultuur, tradities en vaardigheden met jullie team.",
                },
                {
                  icon: Users,
                  title: "Verbinding",
                  description:
                    "Door samen te koken, spelen en leren ontstaan echte verbindingen tussen culturen.",
                },
                {
                  icon: Quote,
                  title: "Verhalen",
                  description:
                    "Elk teamlid heeft een uniek verhaal dat inspireert en nieuwe perspectieven biedt.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="border-primary/10 bg-primary/5 rounded-2xl border p-4 text-center sm:p-6"
                >
                  <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-3">
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

      {/* Team Gallery - 3×2 Grid */}
      <section className="bg-muted/30 py-8 md:py-10 lg:py-12">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-6 text-center md:mb-8">
              <h2 className="text-primary mb-4 tracking-tight">
                Maak Kennis Met Ons Team
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
                De mensen die jullie workshops begeleiden en hun cultuur met
                jullie delen
              </p>
            </div>
          </ScrollReveal>

          {/* 3×2 on desktop, 2×3 on tablet, 2×3 on mobile */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="group shadow-editorial hover:shadow-editorial-hover overflow-hidden border transition-all duration-500">
                  <CardContent className="relative p-0">
                    {/* Photo container — portrait ratio, shorter on desktop */}
                    <div className="bg-muted relative aspect-[3/4] w-full overflow-hidden md:aspect-[4/5]">
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />

                      {/* Photo or placeholder */}
                      {member.image &&
                      !member.image.includes("placeholder") ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <>
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/40"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white/60 sm:text-5xl">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Name overlay */}
                      <div className="absolute right-0 bottom-0 left-0 z-20 p-4 text-white sm:p-5">
                        <h3 className="text-base font-bold tracking-tight sm:text-lg">
                          {member.name}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-4xl text-center">
              <span className="text-primary/30 mb-2 block font-serif text-4xl leading-none sm:mb-4 sm:text-6xl">
                &ldquo;
              </span>
              <blockquote className="text-foreground mb-6 text-xl leading-relaxed font-light tracking-wide italic sm:text-2xl">
                Onze medewerkers brengen niet alleen hun vaardigheden, maar ook
                hun verhalen, cultuur en warmte. Samen creëren we ervaringen die
                verder gaan dan een gewoon bedrijfsuitje.
              </blockquote>
              <div className="border-border inline-block border-t pt-4">
                <p className="font-semibold tracking-tight">Goeduitje Team</p>
                <p className="text-muted-foreground text-sm tracking-wide">
                  Verbinden door samen te doen
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Behind the Scenes - What Makes Our Team Special */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-6 text-center sm:mb-8">
              <h2 className="text-primary mb-3 tracking-tight sm:mb-4">
                Wat Maakt Ons Team Bijzonder
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
                Ontdek waarom een workshop met ons team zo&apos;n unieke
                ervaring is
              </p>
            </div>
          </ScrollReveal>

          <StaggerChildren
            staggerDelay={0.15}
            className="grid gap-4 sm:gap-6 md:grid-cols-2"
          >
            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                <CardContent className="flex h-full flex-col p-5 sm:p-8">
                  <h3 className="mb-4 text-xl font-semibold tracking-tight">
                    Authentieke Cultuur
                  </h3>
                  <p className="text-muted-foreground flex-grow leading-relaxed tracking-wide">
                    Onze medewerkers delen de authentieke tradities uit hun
                    thuislanden. Van Arabische kookkunst tot Perzische
                    gastvrijheid - elke workshop is een culturele
                    ontdekkingsreis.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                <CardContent className="flex h-full flex-col p-5 sm:p-8">
                  <h3 className="mb-4 text-xl font-semibold tracking-tight">
                    Persoonlijke Verhalen
                  </h3>
                  <p className="text-muted-foreground flex-grow leading-relaxed tracking-wide">
                    Achter elke medewerker schuilt een inspirerend verhaal.
                    Tijdens de workshops delen zij hun ervaringen, waardoor
                    deelnemers nieuwe perspectieven krijgen.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                <CardContent className="flex h-full flex-col p-5 sm:p-8">
                  <h3 className="mb-4 text-xl font-semibold tracking-tight">
                    Werkervaring & Integratie
                  </h3>
                  <p className="text-muted-foreground flex-grow leading-relaxed tracking-wide">
                    Door te werken bij Goeduitje doen onze medewerkers
                    waardevolle werkervaring op. Zij oefenen de taal, vergroten
                    hun netwerk en bouwen aan hun toekomst in Nederland.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                <CardContent className="flex h-full flex-col p-5 sm:p-8">
                  <h3 className="mb-4 text-xl font-semibold tracking-tight">
                    Sociale Impact
                  </h3>
                  <p className="text-muted-foreground flex-grow leading-relaxed tracking-wide">
                    Door te kiezen voor een workshop bij ons draag je direct bij
                    aan de integratie van nieuwkomers en het vergroten van
                    wederzijds begrip in onze samenleving.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerChildren>
        </div>
      </section>

      {/* Link to Ons Verhaal */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <Card className="shadow-editorial hover:shadow-editorial-hover border transition-all duration-300">
              <CardContent className="flex flex-col items-center gap-4 p-5 sm:gap-6 sm:p-8 md:flex-row md:justify-between">
                <div>
                  <h3 className="mb-2 text-xl font-semibold tracking-tight">
                    Meer Weten Over Onze Missie?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ontdek het verhaal achter Goeduitje en onze sociale impact.
                  </p>
                </div>
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="outline"
                    className="group tracking-wide"
                    asChild
                  >
                    <Link href="/ons-verhaal">
                      Lees Ons Verhaal
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <ScrollReveal animation="slideUp" amount={0.4}>
        <section className="section-md bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h2 className="mb-4 tracking-tight text-white sm:mb-6">
              Wil je ons team ontmoeten?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed tracking-wide text-white/90 sm:mb-8 sm:text-lg md:text-xl">
              Boek een workshop en maak persoonlijk kennis met onze medewerkers.
              Ervaar hun gastvrijheid, leer over hun cultuur en creëer samen
              onvergetelijke herinneringen.
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
                <Link href="/onze-uitjes">Bekijk Onze Workshops</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
