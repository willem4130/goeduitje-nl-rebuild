import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Heart,
  Star,
  Calendar,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Teambuilding Activiteiten | Goeduitje.nl",
  description:
    "Organiseer een onvergetelijke teambuilding met sociale impact. Van kookworkshops tot stadsspellen en sportieve uitjes. Begeleid door statushouders en nieuwkomers.",
  keywords: [
    "teambuilding",
    "teambuilding activiteiten",
    "teambuilding workshop",
    "teamuitje",
    "team activiteit",
    "teambuilding kookworkshop",
    "teambuilding stadsspel",
    "bedrijfsuitje teambuilding",
    "sociale impact teambuilding",
  ],
  openGraph: {
    title: "Teambuilding Activiteiten | Goeduitje.nl",
    description:
      "Organiseer een onvergetelijke teambuilding met sociale impact. Van kookworkshops tot stadsspellen en sportieve uitjes.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
};

function formatLowestPrice(
  priceTiers: { priceExclBtw: number }[]
): string {
  if (priceTiers.length === 0) return "Op aanvraag";
  const lowest = Math.min(...priceTiers.map((t) => t.priceExclBtw));
  return `vanaf €${lowest % 1 === 0 ? lowest : lowest.toFixed(2).replace(".", ",")} p.p.`;
}

export const revalidate = 300; // Revalidate every 5 minutes

export default async function TeambuildingPage() {
  // Fetch workshops from DB filtered by teambuilding category
  const dbWorkshops = await prisma.workshop.findMany({
    where: { isPublished: true },
    include: {
      priceTiers: {
        where: { variantId: null },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  // Fetch average Google rating from DB (same source as social-proof-stats)
  const reviewStats = await prisma.googleReview.aggregate({
    where: { isVisible: true },
    _avg: { rating: true },
  });
  const avgRating = reviewStats._avg.rating?.toFixed(1) || "4.9";
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-16 lg:py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              <Users className="mr-1 h-3 w-3" />
              Teambuilding
            </Badge>

            <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Teambuilding activiteiten met sociale impact
            </h1>

            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Bij Goeduitje organiseren we teambuildingactiviteiten die verder
              gaan dan alleen een leuk uitje. Onze activiteiten worden begeleid
              door statushouders en nieuwkomers, waardoor je team niet alleen
              samenwerkt maar ook bijdraagt aan een betere samenleving.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/onze-uitjes#configurator">
                  <Calendar className="mr-2 h-5 w-5" />
                  Configureer je teambuilding
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

      {/* USP Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
              <Heart className="mx-auto mb-3 h-8 w-8 text-blue-600" />
              <h3 className="mb-2 font-bold">Sociale impact</h3>
              <p className="text-muted-foreground text-sm">
                Onze activiteiten worden begeleid door statushouders en
                nieuwkomers. Zo draag je bij aan hun integratie.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
              <MapPin className="mx-auto mb-3 h-8 w-8 text-blue-600" />
              <h3 className="mb-2 font-bold">Op locatie naar keuze</h3>
              <p className="text-muted-foreground text-sm">
                Wij komen naar jullie toe of organiseren op een van onze
                locaties door heel Nederland.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
              <Star className="mx-auto mb-3 h-8 w-8 text-blue-600" />
              <h3 className="mb-2 font-bold">Op maat gemaakt</h3>
              <p className="text-muted-foreground text-sm">
                Elk programma wordt aangepast aan jullie wensen, groepsgrootte
                en budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Onze teambuilding activiteiten
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Kies uit verschillende activiteiten of combineer ze voor een
              complete teamdag.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {dbWorkshops.map((workshop) => (
              <Link
                key={workshop.slug}
                href={
                  workshop.slug === "kookworkshop"
                    ? "/kookworkshop"
                    : `/onze-uitjes/${workshop.slug}`
                }
                className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {workshop.image && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={workshop.image}
                      alt={workshop.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {workshop.categories.map((cat) => (
                        <Badge
                          key={cat}
                          className="bg-white/90 text-gray-800 backdrop-blur-sm"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold group-hover:text-blue-600">
                    {workshop.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {workshop.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="font-semibold text-blue-600">
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

      {/* Why Teambuilding Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Waarom teambuilding bij Goeduitje?
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Onze teambuildingactiviteiten zijn niet zomaar uitjes. Ze
                combineren plezier, samenwerking en maatschappelijke impact.
                Door samen te werken met statushouders en nieuwkomers ontstaat
                er een unieke dynamiek die je team versterkt.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span>
                    Verbeter teamcommunicatie en samenwerking op een
                    laagdrempelige manier
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span>
                    Maak kennis met andere culturen en verbreed je perspectief
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span>
                    Draag bij aan de integratie en arbeidsparticipatie van
                    statushouders
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span>
                    Kies uit actieve, culinaire of creatieve activiteiten voor
                    elk type team
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/images/workshops/wat-uniek-maakt.jpg"
                alt="Teambuilding activiteit bij Goeduitje"
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
                  <span className="text-sm font-medium">{avgRating}/5 op Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* City Landing Pages Section */}
      <section className="bg-muted/30 py-12 lg:py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Teambuilding bij jou in de buurt
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              We organiseren teambuilding activiteiten door heel Nederland.
              Bekijk de mogelijkheden in jouw regio.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/teambuilding-nijmegen"
                className="inline-flex items-center gap-2 rounded-lg border bg-white px-5 py-3 font-medium shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
              >
                <MapPin className="h-4 w-4 text-blue-600" />
                Teambuilding Nijmegen
              </Link>
              <Link
                href="/teambuilding-arnhem"
                className="inline-flex items-center gap-2 rounded-lg border bg-white px-5 py-3 font-medium shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
              >
                <MapPin className="h-4 w-4 text-blue-600" />
                Teambuilding Arnhem
              </Link>
            </div>
            <p className="text-muted-foreground mt-6 text-sm">
              Niet in de buurt? Geen probleem — we komen door heel Nederland.{" "}
              <Link
                href="/contact"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Neem contact op
              </Link>{" "}
              voor de mogelijkheden.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 text-white lg:py-20">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Klaar voor jullie teambuilding?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Configureer jullie ideale teambuilding of neem contact op voor een
            vrijblijvende offerte. We denken graag mee!
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-white/90"
            >
              <Link href="/onze-uitjes#configurator">
                <Calendar className="mr-2 h-5 w-5" />
                Configureer je teambuilding
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
