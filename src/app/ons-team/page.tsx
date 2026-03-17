"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";

export default function OnsTeamPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] overflow-hidden">
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

        <div className="via-background/50 to-background absolute inset-0 bg-gradient-to-b from-transparent" />

        <div className="section-md relative flex items-center">
          <div className="container">
            <ScrollReveal animation="slideUp">
              <Link
                href="/ons-verhaal"
                className="text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Terug naar Ons Verhaal
              </Link>
              <div className="max-w-4xl">
                <h1 className="mb-8 text-3xl leading-[1.1] tracking-tight sm:text-5xl lg:text-[64px]">
                  Onze Medewerkers
                </h1>
                <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed tracking-wide">
                  Ontmoet het team dat jullie bedrijfsuitjes tot een
                  onvergetelijke ervaring maakt.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="section-lg">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <Card className="shadow-editorial mx-auto max-w-2xl border">
              <CardContent className="p-12 text-center">
                <div className="bg-primary/10 mx-auto mb-8 w-fit rounded-full p-6">
                  <Users className="text-primary h-12 w-12" />
                </div>
                <h2 className="mb-4 text-3xl font-semibold tracking-tight">
                  Binnenkort Beschikbaar
                </h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  We werken aan een mooie presentatie van ons team. Hier vind je
                  binnenkort informatie over onze medewerkers, hun achtergrond,
                  cultuur en de verhalen die zij met jullie delen tijdens de
                  workshops.
                </p>
                <div className="border-border flex items-center justify-center gap-3 border-t pt-8">
                  <Heart className="text-primary h-6 w-6" />
                  <span className="text-muted-foreground">
                    Onze medewerkers maken het verschil
                  </span>
                </div>
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
              Boek een workshop en maak persoonlijk kennis met onze medewerkers
              en hun cultuur.
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
