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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/client";

export default function OnsVerhaalPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  const {
    data: content,
    isLoading,
    error,
  } = api.content.getByPage.useQuery(
    { page: "ons-verhaal" },
    { staleTime: 5 * 60 * 1000 }
  );

  // Helper to get content value
  const get = (section: string, key: string): string => {
    return content?.[section]?.[key] ?? "";
  };

  // Check if required content sections exist
  const hasRequiredContent =
    content && content.hero?.title && content.hero?.description;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !hasRequiredContent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-20">
        <div className="max-w-md px-4 text-center">
          <h1 className="mb-4 text-2xl font-semibold">
            Content niet beschikbaar
          </h1>
          <p className="text-muted-foreground mb-6">
            De pagina-inhoud is nog niet geconfigureerd. Neem contact op met de
            beheerder.
          </p>
          <Button asChild>
            <Link href="/">Terug naar home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
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
                  {get("hero", "title")}
                </h1>
                <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-lg leading-relaxed tracking-wide sm:text-xl">
                  {get("hero", "description")}
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
                {get("doen", "title")}
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg leading-relaxed tracking-wide sm:text-xl">
                {get("doen", "description")}
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
              <h2 className="text-primary tracking-tight">
                {get("ervaring", "title")}
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg leading-relaxed tracking-wide sm:text-xl">
                {get("ervaring", "description")}
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
                {get("culturen", "title")}
              </h2>
              <div className="text-muted-foreground mx-auto mt-4 max-w-3xl space-y-4 text-lg leading-relaxed tracking-wide sm:text-xl">
                <p>{get("culturen", "description1")}</p>
                <p>{get("culturen", "description2")}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pull Quote */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-4xl text-center">
              <span className="text-primary/30 mb-4 block font-serif text-6xl leading-none">
                &ldquo;
              </span>
              <blockquote className="text-foreground mb-6 text-xl leading-relaxed font-light tracking-wide italic sm:text-2xl">
                {get("quote", "text")}
              </blockquote>
              <div className="border-border inline-block border-t pt-4">
                <p className="font-semibold tracking-tight">
                  {get("quote", "author")}
                </p>
                <p className="text-muted-foreground text-sm tracking-wide">
                  {get("quote", "subtitle")}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Visie & Missie Section */}
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
                    {get("visie", "title")}
                  </h3>
                  <div className="text-muted-foreground flex-grow space-y-4 leading-relaxed tracking-wide">
                    <p>{get("visie", "paragraph1")}</p>
                    <p>{get("visie", "paragraph2")}</p>
                    <p>{get("visie", "paragraph3")}</p>
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
                    {get("missie", "title")}
                  </h3>
                  <p className="text-muted-foreground flex-grow leading-relaxed tracking-wide">
                    {get("missie", "description")}
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
              {get("cta", "title")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed tracking-wide text-white/90 sm:text-xl">
              {get("cta", "description")}
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
                <Link href="/onze-uitjes">{get("cta", "buttonText")}</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </ScrollReveal>

      {/* Footnote Section */}
      <section className="border-t py-8">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {get("footnote", "text")}
          </p>
        </div>
      </section>
    </div>
  );
}
