"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Users,
  Globe,
  TrendingUp,
  MapPin,
  Package,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// Impact data
const impactStats = [
  {
    id: "meals",
    value: "15,420",
    label: "Maaltijden Gedoneerd",
    icon: Heart,
    description: "Warme maaltijden voor gezinnen in nood",
    trend: "+2,340 deze maand",
  },
  {
    id: "people",
    value: "8,750",
    label: "Mensen Geholpen",
    icon: Users,
    description: "Directe hulp aan mensen in crisissituaties",
    trend: "+1,120 deze maand",
  },
  {
    id: "projects",
    value: "42",
    label: "Projecten Ondersteund",
    icon: Globe,
    description: "Lokale initiatieven wereldwijd",
    trend: "+3 nieuwe projecten",
  },
  {
    id: "donations",
    value: "€127,500",
    label: "Gedoneerd Bedrag",
    icon: DollarSign,
    description: "Totaal geïnvesteerd in sociale projecten",
    trend: "+€18,200 deze maand",
  },
];

const projects = [
  {
    id: 1,
    location: "Jemen",
    title: "Voedselhulp voor Gezinnen",
    description:
      "In samenwerking met lokale organisaties zorgen we voor warme maaltijden en voedselvoorziening voor families die getroffen zijn door de crisis.",
    impact: "5,680 maaltijden geleverd",
    image: "/images/impact/yemen.jpg",
    stats: [
      { label: "Families geholpen", value: "420" },
      { label: "Maaltijden per maand", value: "1,200" },
      { label: "Lokale partners", value: "3" },
    ],
  },
  {
    id: 2,
    location: "Syrië",
    title: "Onderwijs en Medische Hulp",
    description:
      "We ondersteunen scholen en medische faciliteiten om kinderen en families toegang te geven tot basale voorzieningen en hoop voor de toekomst.",
    impact: "3,200 mensen bereikt",
    image: "/images/impact/syria.jpg",
    stats: [
      { label: "Kinderen in onderwijs", value: "850" },
      { label: "Medische behandelingen", value: "2,100" },
      { label: "Scholen ondersteund", value: "5" },
    ],
  },
  {
    id: 3,
    location: "Palestina",
    title: "Community Development",
    description:
      "Door te investeren in lokale ondernemers en gemeenschapsinitiatieven helpen we families economische zelfredzaamheid te bereiken.",
    impact: "28 ondernemers gestart",
    image: "/images/impact/palestine.jpg",
    stats: [
      { label: "Startende bedrijven", value: "28" },
      { label: "Banen gecreëerd", value: "74" },
      { label: "Families ondersteund", value: "156" },
    ],
  },
];

const transparencyItems = [
  {
    percentage: 70,
    label: "Directe Projecten",
    description: "Gaat rechtstreeks naar hulpprojecten in het veld",
  },
  {
    percentage: 20,
    label: "Operationele Kosten",
    description: "Voor logistiek, transport en coördinatie",
  },
  {
    percentage: 10,
    label: "Toekomstige Projecten",
    description: "Reserve voor noodhulp en nieuwe initiatieven",
  },
];

export default function OnzeImpactPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Hero Section - Parallax with Editorial Typography */}
      <section className="relative min-h-[70vh] overflow-hidden">
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

        {/* Sophisticated gradient overlay */}
        <div className="via-background/50 to-background absolute inset-0 bg-gradient-to-b from-transparent" />

        <div className="section-md relative flex items-center">
          <div className="container">
            <ScrollReveal animation="slideUp">
              <div className="max-w-4xl">
                <h1 className="mb-8 text-[64px] leading-[1.1] tracking-tight sm:text-[72px]">
                  Onze Impact
                </h1>
                <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed tracking-wide">
                  Transparant inzicht in hoe jouw bedrijfsuitje levens verandert
                  wereldwijd. Elke workshop maakt direct impact.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Impact Stats Grid - Editorial Layout */}
      <section className="section-md">
        <div className="container">
          <ScrollReveal animation="slideUp">
            <div className="mb-20 max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Impact in Cijfers
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed tracking-wide">
                Real-time overzicht van onze collectieve impact
              </p>
            </div>
          </ScrollReveal>

          <StaggerChildren
            staggerDelay={0.15}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {impactStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-editorial hover:shadow-editorial-hover h-full border transition-all duration-300">
                    <CardContent className="stack-normal p-8">
                      <div className="bg-primary/10 w-fit rounded-full p-4">
                        <Icon className="text-primary h-8 w-8" />
                      </div>
                      <div>
                        <div className="mb-2 text-[48px] leading-none font-light tracking-tight">
                          {stat.value}
                        </div>
                        <h3 className="mb-2 text-lg font-semibold tracking-tight">
                          {stat.label}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {stat.description}
                        </p>
                        <div className="text-primary mt-4 flex items-center gap-2 text-xs font-medium">
                          <TrendingUp className="h-4 w-4" />
                          {stat.trend}
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

      {/* Projects Section - Asymmetric Editorial Layout */}
      <section className="section-md relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="bg-muted/30 absolute inset-0" />
        </div>

        <div className="relative container">
          <ScrollReveal animation="slideUp">
            <div className="mb-20 max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Projecten in het Veld
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed tracking-wide">
                Waar jouw bijdrage naartoe gaat en welke impact het maakt
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-16">
            {projects.map((project, index) => (
              <ScrollReveal
                key={project.id}
                animation="slideUp"
                delay={index * 0.1}
              >
                <div
                  className={`grid gap-12 md:grid-cols-2 md:items-center ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`${index % 2 === 1 ? "md:order-2" : ""} relative`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.5 }}
                      className="shadow-editorial-lg group relative aspect-[4/3] overflow-hidden"
                    >
                      <div className="bg-muted absolute inset-0">
                        <div className="flex h-full items-center justify-center">
                          <span className="text-muted-foreground/50 text-sm">
                            Projectfoto {project.location}
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <div className="mb-4 flex items-center gap-3">
                      <MapPin className="text-primary h-5 w-5" />
                      <span className="text-primary text-sm font-semibold tracking-wide uppercase">
                        {project.location}
                      </span>
                    </div>
                    <h3 className="mb-4 text-[36px] leading-[1.2] font-semibold tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-lg leading-relaxed tracking-wide">
                      {project.description}
                    </p>
                    <div className="text-primary mb-8 flex items-center gap-2 text-base font-medium">
                      <CheckCircle className="h-5 w-5" />
                      {project.impact}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {project.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="border-border border-t pt-3"
                        >
                          <div className="mb-1 text-2xl font-light tracking-tight">
                            {stat.value}
                          </div>
                          <div className="text-muted-foreground text-xs tracking-wide">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Section - Editorial Pull Quote Style */}
      <section className="section-md">
        <div className="container">
          <ScrollReveal animation="slideUp">
            <div className="mb-20 max-w-3xl">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Transparantie in Donaties
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed tracking-wide">
                Precies hoe elke euro wordt besteed
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-12 md:grid-cols-3">
            {transparencyItems.map((item, index) => (
              <ScrollReveal
                key={item.label}
                animation="slideUp"
                delay={index * 0.1}
              >
                <div className="stack-normal">
                  {/* Percentage Circle */}
                  <div className="relative mb-8 aspect-square w-full max-w-[200px]">
                    <svg
                      className="h-full w-full -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted opacity-20"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${item.percentage * 2.513} ${251.3 - item.percentage * 2.513}`}
                        className="text-primary transition-all duration-1000"
                      />
                    </svg>
                    {/* Percentage text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[40px] leading-none font-light tracking-tight">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-2xl font-semibold tracking-tight">
                    {item.label}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed tracking-wide">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Transparency Note */}
          <ScrollReveal animation="slideUp" delay={0.5}>
            <div className="bg-muted/50 mt-16 border p-8">
              <div className="flex gap-4">
                <Package className="text-primary h-6 w-6 flex-shrink-0" />
                <div>
                  <h4 className="mb-2 text-lg font-semibold tracking-tight">
                    100% Transparantie Gegarandeerd
                  </h4>
                  <p className="text-muted-foreground leading-relaxed tracking-wide">
                    We publiceren elk kwartaal een gedetailleerd rapport met
                    alle inkomsten, uitgaven en impact metrics. Zo weet je
                    precies waar jouw bijdrage naartoe gaat en welke verandering
                    het teweegbrengt.
                  </p>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className="mt-4"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="shadow-editorial-sm hover:shadow-editorial group transition-all duration-300"
                    >
                      Download Q1 2025 Rapport
                      <TrendingUp className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </div>
              </div>
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
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Maak Impact met Jouw Team
              </h2>
              <p className="mb-12 text-xl leading-relaxed tracking-wide opacity-90">
                Organiseer een bedrijfsuitje dat verder gaat dan plezier maken.
                Verander levens wereldwijd.
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
