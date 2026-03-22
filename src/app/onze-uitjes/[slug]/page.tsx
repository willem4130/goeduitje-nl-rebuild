import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Users,
  Euro,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUpcomingWorkshops } from "@/lib/open-workshops";
import { SITE_URL } from "@/lib/site-config";
import { CityGallery } from "@/components/city-gallery";

// Helper to format price display
function formatPrice(priceExcl: number, priceIncl: number): string {
  return `€${priceExcl % 1 === 0 ? priceExcl : priceExcl.toFixed(2).replace(".", ",")} excl btw (€${priceIncl % 1 === 0 ? priceIncl : priceIncl.toFixed(2).replace(".", ",")} incl btw) p.p.`;
}

// Get lowest price from tiers
function getLowestPrice(
  priceTiers: { priceExclBtw: number }[],
  variants?: { priceTiers: { priceExclBtw: number }[] }[]
): number {
  let lowest = Infinity;

  // Check main price tiers
  for (const tier of priceTiers) {
    if (tier.priceExclBtw < lowest) lowest = tier.priceExclBtw;
  }

  // Check variant price tiers
  if (variants) {
    for (const variant of variants) {
      for (const tier of variant.priceTiers) {
        if (tier.priceExclBtw < lowest) lowest = tier.priceExclBtw;
      }
    }
  }

  return lowest === Infinity ? 0 : lowest;
}

type Props = {
  params: Promise<{ slug: string }>;
};

async function getWorkshop(slug: string) {
  return prisma.workshop.findUnique({
    where: { slug, isPublished: true },
    include: {
      priceTiers: {
        where: { variantId: null },
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        orderBy: { sortOrder: "asc" },
        include: {
          priceTiers: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await getWorkshop(slug);

  if (!workshop) {
    return {
      title: "Workshop niet gevonden | Goeduitje.nl",
    };
  }

  const imageUrl = workshop.image
    ? workshop.image.startsWith("http")
      ? workshop.image
      : `${SITE_URL}${workshop.image}`
    : null;

  return {
    title: `${workshop.title} | Goeduitje.nl`,
    description: workshop.description,
    openGraph: {
      title: `${workshop.title} | Goeduitje.nl`,
      description: workshop.description,
      type: "website",
      locale: "nl_NL",
      siteName: "Goeduitje.nl",
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${workshop.title} | Goeduitje.nl`,
      description: workshop.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export async function generateStaticParams() {
  const workshops = await prisma.workshop.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });

  return workshops.map((workshop) => ({
    slug: workshop.slug,
  }));
}

export default async function WorkshopDetailPage({ params }: Props) {
  const { slug } = await params;
  const [workshop, reviewCache] = await Promise.all([
    getWorkshop(slug),
    prisma.google_reviews_cache.findUnique({ where: { id: "singleton" } }),
  ]);

  if (!workshop) {
    notFound();
  }

  const workshopJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: workshop.title,
    description: workshop.description,
    provider: {
      "@type": "Organization",
      name: "Goeduitje",
      url: SITE_URL,
    },
    areaServed: "Netherlands",
    ...(workshop.image && { image: workshop.image }),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviewCache?.averageRating?.toString() || "5",
      reviewCount: reviewCache?.totalReviewCount?.toString() || "49",
    },
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(workshopJsonLd),
        }}
      />
      {/* Hero Section */}
      <section className="bg-muted/30 relative py-12 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          {/* Back button */}
          <Link
            href="/onze-uitjes"
            className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug naar alle uitjes
          </Link>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Media */}
            <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-lg">
              {workshop.video ? (
                <video
                  src={workshop.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : workshop.image ? (
                <Image
                  src={workshop.image}
                  alt={workshop.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : null}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-4 flex flex-wrap gap-2">
                {workshop.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>

              <h1 className="mb-2 text-3xl font-bold tracking-tight lg:text-4xl">
                {workshop.title}
              </h1>
              <p className="text-primary mb-4 text-lg font-semibold">
                {workshop.subtitle}
              </p>
              <p className="text-muted-foreground mb-6 text-lg">
                {workshop.description}
              </p>

              {/* Quick info */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">Duur</p>
                    <p className="font-semibold">{workshop.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Groepsgrootte
                    </p>
                    <p className="font-semibold">{workshop.groupSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Euro className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">Prijs</p>
                    <p className="font-semibold">
                      Vanaf €
                      {getLowestPrice(workshop.priceTiers, workshop.variants)}{" "}
                      p.p.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">Locatie</p>
                    <p className="line-clamp-1 font-semibold">
                      {workshop.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="flex-1">
                  <Link href="/onze-uitjes#configurator">
                    <Calendar className="mr-2 h-5 w-5" />
                    Configureer uitje
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <Link href="/contact">Offerte aanvragen</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          {/* Variants Section - if workshop has variants */}
          {workshop.variants && workshop.variants.length > 0 ? (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">Kies je variant</h2>
              <Tabs defaultValue={workshop.variants[0]?.id} className="w-full">
                <TabsList className="mb-6 flex h-auto flex-wrap gap-2 bg-transparent p-0">
                  {workshop.variants.map((variant) => (
                    <TabsTrigger
                      key={variant.id}
                      value={variant.id}
                      className={
                        variant.name === "Open Kookworkshops"
                          ? "relative rounded-full border-2 border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 text-sm font-semibold text-amber-900 transition-all data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                          : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border px-4 py-2 text-sm font-medium transition-all"
                      }
                    >
                      {variant.name === "Open Kookworkshops" && (
                        <Sparkles className="mr-1.5 inline h-4 w-4" />
                      )}
                      {variant.name}
                      {variant.name === "Open Kookworkshops" && (
                        <Badge className="ml-2 hidden bg-amber-600 text-[10px] text-white hover:bg-amber-600 sm:inline-flex">
                          Particulieren
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {workshop.variants.map((variant) => (
                  <TabsContent key={variant.id} value={variant.id}>
                    <div className="grid gap-8 lg:grid-cols-3">
                      {/* Variant Description */}
                      <div className="lg:col-span-2">
                        <h3 className="text-primary mb-4 text-xl font-bold">
                          {variant.name}
                        </h3>
                        <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                          {variant.description}
                        </p>

                        <div className="mb-6 flex items-center gap-3">
                          <Clock className="text-primary h-5 w-5" />
                          <div>
                            <span className="text-muted-foreground text-sm">
                              Duur:{" "}
                            </span>
                            <span className="font-semibold">
                              {variant.duration}
                            </span>
                          </div>
                        </div>

                        {/* Variant includes */}
                        <h4 className="mb-3 font-semibold">
                          Wat is inbegrepen?
                        </h4>
                        <ul className="space-y-2">
                          {variant.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Sidebar - Pricing or Agenda */}
                      <div>
                        {variant.name === "Open Kookworkshops" ? (
                          /* Agenda for Open Kookworkshops */
                          <div className="rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                            <h4 className="mb-4 flex items-center gap-2 font-semibold text-amber-900">
                              <Calendar className="h-5 w-5 text-amber-600" />
                              Agenda
                            </h4>
                            <p className="text-muted-foreground mb-4 text-sm">
                              Meld je aan voor een datum die jou past!
                            </p>
                            <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
                              {getUpcomingWorkshops().length > 0 ? (
                                getUpcomingWorkshops().map((ws) => (
                                  <div
                                    key={ws.id}
                                    className="flex items-center gap-3 rounded-md border border-amber-200 bg-white p-3 transition-colors hover:border-amber-400"
                                  >
                                    <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded bg-amber-100 text-amber-900">
                                      <span className="text-[10px] font-semibold uppercase">
                                        {ws.month}
                                      </span>
                                      <span className="text-lg leading-none font-bold">
                                        {ws.dayNumber}
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-medium">
                                        {ws.dateDisplay}
                                      </p>
                                      <p className="text-muted-foreground text-xs">
                                        {ws.time} • {ws.location}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="rounded-md border bg-white p-3 text-center">
                                  <p className="text-muted-foreground text-sm">
                                    Nieuwe data volgen binnenkort
                                  </p>
                                </div>
                              )}
                            </div>
                            <Button
                              asChild
                              className="mt-4 w-full bg-amber-600 hover:bg-amber-700"
                            >
                              <Link href="/open-kookworkshops">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Direct inschrijven
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          /* Standard Pricing */
                          <div className="bg-muted/50 rounded-lg p-6">
                            <h4 className="mb-4 font-semibold">Prijzen</h4>
                            <div className="space-y-2">
                              {variant.priceTiers.map((tier, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between text-xs sm:text-sm"
                                >
                                  <span className="text-muted-foreground">
                                    {tier.groupSize}
                                  </span>
                                  <span className="font-medium">
                                    {formatPrice(
                                      tier.priceExclBtw,
                                      tier.priceInclBtw
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {workshop.slug === "kookworkshop" && (
                              <p className="text-muted-foreground mt-3 text-xs italic">
                                Prijzen zijn exclusief locatiekosten en drankjes
                              </p>
                            )}
                            <Button asChild className="mt-6 w-full">
                              <Link href="/onze-uitjes#configurator">
                                Configureer dit uitje
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          ) : (
            /* Standard layout for workshops without variants */
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Description */}
              <div className="lg:col-span-2">
                <h2 className="mb-6 text-2xl font-bold">Over dit uitje</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {(workshop.longDescription ?? workshop.description)
                    .split("\n\n")
                    .map((paragraph, i) => (
                      <p key={i} className="text-muted-foreground mb-4">
                        {paragraph.trim()}
                      </p>
                    ))}
                </div>
              </div>

              {/* What's included */}
              <div>
                <h2 className="mb-6 text-2xl font-bold">Wat is inbegrepen?</h2>
                <ul className="space-y-3">
                  {workshop.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Price card */}
                <div className="bg-muted/50 mt-8 rounded-lg p-6">
                  <p className="text-muted-foreground mb-1 text-sm">Vanaf</p>
                  <p className="text-primary mb-4 text-3xl font-bold">
                    €{getLowestPrice(workshop.priceTiers, workshop.variants)}{" "}
                    <span className="text-muted-foreground text-base font-normal">
                      per persoon
                    </span>
                  </p>

                  {/* Price tiers */}
                  {workshop.priceTiers && workshop.priceTiers.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <p className="text-sm font-semibold">
                        Prijzen per groepsgrootte:
                      </p>
                      {workshop.priceTiers.map((tier, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs sm:text-sm"
                        >
                          <span className="text-muted-foreground">
                            {tier.groupSize}
                          </span>
                          <span className="font-medium">
                            {formatPrice(tier.priceExclBtw, tier.priceInclBtw)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button asChild className="w-full">
                    <Link href="/onze-uitjes#configurator">Nu boeken</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Locaties Section - Only for kookworkshop */}
      {workshop.slug === "kookworkshop" && (
        <CityGallery
          title="Locaties"
          description="Onze kookworkshops kunnen op een locatie naar keuze worden ingepland. Bekijk hieronder de populairste steden waar we actief zijn."
        />
      )}

      {/* CTA Section */}
      <section className="bg-muted/30 py-12 lg:py-20">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
            Klaar om te boeken?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Heb je vragen of wil je een uitje op maat? Neem gerust contact met
            ons op voor een vrijblijvende offerte.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/onze-uitjes#configurator">Configureer je uitje</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact opnemen</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
