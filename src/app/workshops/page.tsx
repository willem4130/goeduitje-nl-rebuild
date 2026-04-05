import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  ArrowRight,
  Heart,
  Star,
  Calendar,
  Sparkles,
  ChefHat,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Workshops met Sociale Impact | Goeduitje.nl",
  description:
    "Ontdek onze unieke workshops: kookworkshops, koffie & thee workshops en meer. Hands-on ervaringen begeleid door statushouders en nieuwkomers.",
  keywords: [
    "workshops",
    "workshop boeken",
    "kookworkshop",
    "koffie workshop",
    "thee workshop",
    "creatieve workshop",
    "workshop teambuilding",
    "workshop bedrijfsuitje",
    "sociale impact workshop",
  ],
  openGraph: {
    title: "Workshops met Sociale Impact | Goeduitje.nl",
    description:
      "Ontdek onze unieke workshops: kookworkshops, koffie & thee workshops en meer. Hands-on ervaringen begeleid door statushouders en nieuwkomers.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workshops met Sociale Impact | Goeduitje.nl",
    description:
      "Ontdek onze unieke workshops: kookworkshops, koffie & thee workshops en meer. Hands-on ervaringen begeleid door statushouders en nieuwkomers.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

function formatLowestPrice(priceTiers: { priceExclBtw: number }[]): string {
  if (priceTiers.length === 0) return "Op aanvraag";
  const lowest = Math.min(...priceTiers.map((t) => t.priceExclBtw));
  return `vanaf €${lowest % 1 === 0 ? lowest : lowest.toFixed(2).replace(".", ",")} p.p.`;
}

export const revalidate = 300; // Revalidate every 5 minutes

export default async function WorkshopsPage() {
  // Fetch all published workshops from DB
  const allWorkshops = await prisma.workshop.findMany({
    where: { isPublished: true },
    include: {
      priceTiers: {
        where: { variantId: null },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  // Split into featured (first 3) and other activities
  const featuredWorkshops = allWorkshops.slice(0, 3);
  const otherActivities = allWorkshops.slice(3);

  // Fetch average Google rating from DB (same source as social-proof-stats)
  const reviewStats = await prisma.googleReview.aggregate({
    where: { isVisible: true },
    _avg: { rating: true },
  });
  const avgRating = reviewStats._avg.rating?.toFixed(1) || "4.9";
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-white py-16 lg:py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
              <Sparkles className="mr-1 h-3 w-3" />
              Workshops
            </Badge>

            <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Workshops met een verhaal
            </h1>

            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Onze workshops gaan verder dan alleen leren. Onder begeleiding van
              statushouders en nieuwkomers ontdek je nieuwe vaardigheden, smaken
              en culturen. Van koken tot koffie, van sport tot spel.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Link href="/onze-uitjes#configurator">
                  <Calendar className="mr-2 h-5 w-5" />
                  Boek een workshop
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  Offerte aanvragen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Onze workshops
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Hands-on ervaringen waarbij je actief meedoet. Leer, ontdek en
              geniet samen.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {featuredWorkshops.map((workshop, index) => (
              <Link
                key={workshop.slug}
                href={
                  workshop.slug === "kookworkshop"
                    ? "/kookworkshop"
                    : `/onze-uitjes/${workshop.slug}`
                }
                className={`group overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
                  index === 0 ? "ring-2 ring-amber-500 ring-offset-2" : ""
                }`}
              >
                {workshop.image && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={workshop.image}
                      alt={workshop.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {index === 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-amber-600 text-white">
                          <ChefHat className="mr-1 h-3 w-3" />
                          Populairst
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold group-hover:text-amber-600">
                    {workshop.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {workshop.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="font-semibold text-amber-600">
                      {formatLowestPrice(workshop.priceTiers)}
                    </span>
                    <span className="text-muted-foreground">
                      {workshop.duration}
                    </span>
                    <span className="text-muted-foreground">
                      {workshop.groupSize}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Other Activities */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Meer activiteiten
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Naast workshops bieden we ook andere activiteiten aan. Combineer
              ze voor een complete dag.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {otherActivities.map((activity) => (
              <Link
                key={activity.slug}
                href={
                  activity.slug === "kookworkshop"
                    ? "/kookworkshop"
                    : `/onze-uitjes/${activity.slug}`
                }
                className="group flex gap-4 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                {activity.image && (
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <h3 className="mb-1 font-bold group-hover:text-amber-600">
                    {activity.title}
                  </h3>
                  <p className="text-muted-foreground mb-2 text-sm">
                    {activity.description}
                  </p>
                  <span className="text-sm font-semibold text-amber-600">
                    {formatLowestPrice(activity.priceTiers)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social Impact Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
                <Heart className="mr-1 h-3 w-3" />
                Sociale impact
              </Badge>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Workshops die het verschil maken
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Bij Goeduitje zijn workshops meer dan een activiteit. Onze
                workshops worden begeleid door statushouders en nieuwkomers die
                hun talent, passie en cultuur met jullie delen. Zo ontstaat een
                unieke ervaring met echte maatschappelijke impact.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>
                    Leer van gepassioneerde begeleiders met unieke achtergronden
                    en vaardigheden
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>
                    Draag bij aan integratie en arbeidsparticipatie van
                    statushouders
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>
                    Alle workshops op maat: afgestemd op jullie wensen,
                    groepsgrootte en budget
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/images/workshops/wat-uniek-maakt.jpg"
                alt="Workshop bij Goeduitje met sociale impact"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute right-6 bottom-6 left-6">
                <div className="flex items-center gap-2 text-white">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {avgRating}/5 op Google
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links Section */}
      <section className="bg-muted/30 py-12 lg:py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Meer ontdekken?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Bekijk ook onze teambuilding activiteiten en bedrijfsuitjes voor
              een complete ervaring.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/teambuilding"
                className="group hover:border-secondary/30 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="group-hover:text-secondary mb-2 font-bold">
                  Teambuilding activiteiten
                </h3>
                <p className="text-muted-foreground text-sm">
                  Versterk je team met unieke activiteiten begeleid door
                  statushouders.
                </p>
                <span className="text-secondary mt-3 inline-flex items-center gap-1 text-sm font-medium">
                  Bekijk teambuilding
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/bedrijfsuitjes"
                className="group rounded-xl border bg-white p-6 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
              >
                <h3 className="mb-2 font-bold group-hover:text-emerald-600">
                  Bedrijfsuitjes
                </h3>
                <p className="text-muted-foreground text-sm">
                  Organiseer een bedrijfsuitje dat indruk maakt én impact heeft.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                  Bekijk bedrijfsuitjes
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-600 py-16 text-white lg:py-20">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Boek jullie workshop
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Configureer jullie ideale workshop of neem contact op voor een
            vrijblijvende offerte.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-amber-600 hover:bg-white/90"
            >
              <Link href="/onze-uitjes#configurator">
                <Calendar className="mr-2 h-5 w-5" />
                Boek een workshop
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/contact">Offerte aanvragen</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
