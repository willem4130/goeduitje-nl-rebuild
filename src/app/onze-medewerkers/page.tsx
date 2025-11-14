"use client";

import { motion } from "framer-motion";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

// Team member data
const teamMembers = [
  {
    id: 1,
    name: "Sarah van den Berg",
    role: "Oprichter & Creative Director",
    bio: "Sarah startte Goeduitje.nl vanuit de overtuiging dat bedrijfsuitjes meer kunnen zijn dan alleen plezier maken. Met haar achtergrond in event management en passie voor sociale impact, legt ze de brug tussen bedrijven en goede doelen.",
    image: "/team/sarah.jpg", // Placeholder
    instagram: "https://instagram.com/sarahvdberg",
    linkedin: "https://linkedin.com/in/sarahvdberg",
    email: "sarah@goeduitje.nl",
  },
  {
    id: 2,
    name: "Michael Janssen",
    role: "Workshop Coördinator",
    bio: "Michael zorgt ervoor dat elke workshop perfect verloopt. Met zijn oog voor detail en enthousiasme creëert hij onvergetelijke ervaringen voor teams.",
    image: "/team/michael.jpg", // Placeholder
    linkedin: "https://linkedin.com/in/michaeljanssen",
    email: "michael@goeduitje.nl",
  },
  {
    id: 3,
    name: "Emma de Vries",
    role: "Impact Manager",
    bio: "Emma beheert de relaties met onze partnerorganisaties in Jemen, Syrië en Palestina. Ze zorgt ervoor dat elke euro impact maakt waar het nodig is.",
    image: "/team/emma.jpg", // Placeholder
    linkedin: "https://linkedin.com/in/emmadevries",
    email: "emma@goeduitje.nl",
  },
  {
    id: 4,
    name: "David Bakker",
    role: "Kookworkshop Specialist",
    bio: "David is chef-kok en teambuilding expert. Zijn kookworkshops combineren culinaire vaardigheden met teamwerk en lachen.",
    image: "/team/david.jpg", // Placeholder
    instagram: "https://instagram.com/chefbakker",
    email: "david@goeduitje.nl",
  },
];

export default function OnzeMedewerkersPage() {
  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Hero Section - Editorial */}
      <section className="relative overflow-hidden border-b">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="from-primary/10 via-secondary/5 absolute inset-0 bg-gradient-to-br to-transparent" />
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
              <div className="max-w-4xl">
                <h1 className="mb-8 text-[56px] leading-[1.1] tracking-tight sm:text-[64px]">
                  Ons Team
                </h1>
                <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed tracking-wide">
                  Ontmoet de mensen achter Goeduitje.nl. Een diverse groep
                  professionals die geloven in de kracht van samenkomen en
                  sociale verandering.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Team Grid Section - Asymmetric Editorial Layout */}
      <section className="section-md">
        <div className="container">
          <StaggerChildren
            staggerDelay={0.15}
            className="grid auto-rows-fr gap-8 md:grid-cols-12"
          >
            {teamMembers.map((member, index) => {
              // Editorial grid pattern: vary column spans for asymmetry
              const gridSpan =
                index % 3 === 0
                  ? "md:col-span-6"
                  : index % 3 === 1
                    ? "md:col-span-6"
                    : "md:col-span-12";

              return (
                <motion.div
                  key={member.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className={gridSpan}
                >
                  <Card className="group shadow-editorial hover:shadow-editorial-hover h-full overflow-hidden border transition-all duration-300">
                    <CardContent className="p-0">
                      {/* Layout varies: first two side-by-side, third full-width horizontal */}
                      {index % 3 === 2 ? (
                        // Horizontal layout for every third card
                        <div className="grid md:grid-cols-2">
                          {/* Image */}
                          <div className="bg-muted relative aspect-[4/3] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                            <div className="flex h-full items-center justify-center">
                              <span className="text-muted-foreground/50 text-sm">
                                Foto volgt
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="stack-normal p-8">
                            <div>
                              <h3 className="mb-2 text-2xl font-semibold tracking-tight">
                                {member.name}
                              </h3>
                              <p className="text-primary mb-4 text-sm font-medium tracking-wide">
                                {member.role}
                              </p>
                            </div>

                            <p className="text-muted-foreground leading-relaxed tracking-wide">
                              {member.bio}
                            </p>

                            {/* Social Links */}
                            <div className="flex gap-3 pt-4">
                              {member.instagram && (
                                <a
                                  href={member.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-[2px]"
                                  aria-label="Instagram"
                                >
                                  <Instagram className="h-5 w-5" />
                                </a>
                              )}
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-[2px]"
                                  aria-label="LinkedIn"
                                >
                                  <Linkedin className="h-5 w-5" />
                                </a>
                              )}
                              {member.email && (
                                <a
                                  href={`mailto:${member.email}`}
                                  className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-[2px]"
                                  aria-label="Email"
                                >
                                  <Mail className="h-5 w-5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Vertical layout for first two cards
                        <>
                          {/* Image */}
                          <div className="bg-muted relative aspect-[3/4] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                            <div className="flex h-full items-center justify-center">
                              <span className="text-muted-foreground/50 text-sm">
                                Foto volgt
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="stack-normal p-8">
                            <div>
                              <h3 className="mb-2 text-2xl font-semibold tracking-tight">
                                {member.name}
                              </h3>
                              <p className="text-primary mb-4 text-sm font-medium tracking-wide">
                                {member.role}
                              </p>
                            </div>

                            <p className="text-muted-foreground leading-relaxed tracking-wide">
                              {member.bio}
                            </p>

                            {/* Social Links */}
                            <div className="flex gap-3 pt-4">
                              {member.instagram && (
                                <a
                                  href={member.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-[2px]"
                                  aria-label="Instagram"
                                >
                                  <Instagram className="h-5 w-5" />
                                </a>
                              )}
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-[2px]"
                                  aria-label="LinkedIn"
                                >
                                  <Linkedin className="h-5 w-5" />
                                </a>
                              )}
                              {member.email && (
                                <a
                                  href={`mailto:${member.email}`}
                                  className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-[2px]"
                                  aria-label="Email"
                                >
                                  <Mail className="h-5 w-5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Join Team Section */}
      <section className="section-md relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="bg-muted/50 absolute inset-0" />
          <div className="from-background/80 absolute inset-0 bg-gradient-to-b to-transparent" />
        </div>

        <div className="relative container">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Wordt Onderdeel van Ons Team
              </h2>
              <p className="text-muted-foreground mb-12 text-xl leading-relaxed tracking-wide">
                We zijn altijd op zoek naar gepassioneerde mensen die geloven in
                de kracht van samenkomen en sociale impact. Heb jij een
                bijzondere vaardigheid of passie die je wilt delen?
              </p>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  size="lg"
                  className="shadow-editorial hover:shadow-editorial-lg px-8 py-6 font-semibold tracking-wide transition-all duration-300"
                  asChild
                >
                  <a href="mailto:team@goeduitje.nl">Neem Contact Op</a>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground section-md relative overflow-hidden">
        {/* Sophisticated gradient overlay */}
        <div className="from-primary/50 absolute inset-0 bg-gradient-to-br to-transparent" />

        <div className="relative container">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Klaar Voor Een Onvergetelijk Teamuitje?
              </h2>
              <p className="mb-12 text-xl leading-relaxed tracking-wide opacity-90">
                Laat ons team voor jullie een workshop organiseren die niet
                alleen jullie team versterkt, maar ook levens verandert.
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
