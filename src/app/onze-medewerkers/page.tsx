"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Quote, ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/trpc/client";

// Masonry grid pattern - varying heights for visual interest
const gridPatterns = [
  {
    colSpan: "md:col-span-4",
    rowSpan: "md:row-span-2",
    aspect: "aspect-[3/4]",
  },
  {
    colSpan: "md:col-span-4",
    rowSpan: "md:row-span-1",
    aspect: "aspect-[4/3]",
  },
  {
    colSpan: "md:col-span-4",
    rowSpan: "md:row-span-1",
    aspect: "aspect-[4/3]",
  },
  {
    colSpan: "md:col-span-4",
    rowSpan: "md:row-span-2",
    aspect: "aspect-[3/4]",
  },
  {
    colSpan: "md:col-span-8",
    rowSpan: "md:row-span-1",
    aspect: "aspect-[16/9]",
  },
  {
    colSpan: "md:col-span-4",
    rowSpan: "md:row-span-1",
    aspect: "aspect-[4/3]",
  },
];

export default function OnzeMedewerkersPage() {
  const { data: teamMembers, isLoading } = api.team.getAll.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col pt-20">
        <div className="flex flex-1 items-center justify-center py-32">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

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
                <h1 className="text-primary mb-8 tracking-tight">
                  Onze Medewerkers
                </h1>
                <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed tracking-wide sm:text-xl">
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
            <div className="grid gap-6 md:grid-cols-3">
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
                  className="border-primary/10 bg-primary/5 rounded-2xl border p-6 text-center"
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

      {/* Team Gallery - Masonry Grid */}
      <section className="section-md bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mb-12 text-center">
              <h2 className="text-primary mb-4 tracking-tight">
                Maak Kennis Met Ons Team
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
                De mensen die jullie workshops begeleiden en hun cultuur met
                jullie delen
              </p>
            </div>
          </ScrollReveal>

          <StaggerChildren
            staggerDelay={0.1}
            className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-12 md:gap-4"
          >
            {teamMembers.map((member, index) => {
              const pattern = gridPatterns[index % gridPatterns.length];

              return (
                <motion.div
                  key={member.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`${pattern.colSpan} ${pattern.rowSpan}`}
                >
                  <Card className="group shadow-editorial hover:shadow-editorial-hover h-full overflow-hidden border transition-all duration-500">
                    <CardContent className="relative h-full p-0">
                      {/* Image with placeholder */}
                      <div className="bg-muted relative h-full w-full overflow-hidden">
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90 md:opacity-70" />

                        {/* Placeholder pattern - warm earth tones */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(135deg,
                              hsl(${25 + index * 15}, 40%, ${65 - index * 3}%) 0%,
                              hsl(${35 + index * 10}, 35%, ${55 - index * 2}%) 100%)`,
                          }}
                        />

                        {/* Decorative pattern overlay */}
                        <div
                          className="absolute inset-0 opacity-10"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                          }}
                        />

                        {/* User icon placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-white/20 p-6 backdrop-blur-sm">
                            <Users className="h-12 w-12 text-white/80" />
                          </div>
                        </div>

                        {/* Content overlay */}
                        <div className="absolute right-0 bottom-0 left-0 z-20 p-6 text-white">
                          <div className="translate-y-2 transform transition-transform duration-300 group-hover:translate-y-0">
                            <p className="mb-1 text-xs font-medium tracking-wider text-white/70 uppercase">
                              {member.origin}
                            </p>
                            <h3 className="mb-1 text-sm font-bold tracking-tight sm:text-xl">
                              {member.name}
                            </h3>
                            <p className="text-xs font-medium text-white/90 sm:text-sm">
                              {member.role}
                            </p>

                            {/* Quote - shows on hover for larger cards */}
                            {(index === 0 || index === 3 || index === 4) && (
                              <p className="mt-3 max-h-0 overflow-hidden text-sm leading-relaxed text-white/80 italic opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100">
                                &ldquo;{member.quote}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Quote Section */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-4xl text-center">
              <span className="text-primary/30 mb-4 block font-serif text-6xl leading-none">
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
            <div className="mb-8 text-center">
              <h2 className="text-primary mb-4 tracking-tight">
                Wat Maakt Ons Team Bijzonder
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
                Ontdek waarom een workshop met ons team zo&apos;n unieke
                ervaring is
              </p>
            </div>
          </ScrollReveal>

          <StaggerChildren
            staggerDelay={0.15}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                <CardContent className="flex h-full flex-col p-8">
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
                <CardContent className="flex h-full flex-col p-8">
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
                <CardContent className="flex h-full flex-col p-8">
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
                <CardContent className="flex h-full flex-col p-8">
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
              <CardContent className="flex flex-col items-center gap-6 p-8 md:flex-row md:justify-between">
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
            <h2 className="mb-6 tracking-tight text-white">
              Wil je ons team ontmoeten?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed tracking-wide text-white/90 sm:text-xl">
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
