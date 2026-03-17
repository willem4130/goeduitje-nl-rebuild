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
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Bedrijfsuitjes met Impact | Goeduitje.nl",
  description:
    "Organiseer een uniek bedrijfsuitje met maatschappelijke impact. Kookworkshops, stadsspellen, sportieve activiteiten en meer. Begeleid door statushouders.",
  keywords: [
    "bedrijfsuitje",
    "bedrijfsuitjes",
    "bedrijfsuitje organiseren",
    "teamuitje bedrijf",
    "personeelsuitje",
    "bedrijfsuitje kookworkshop",
    "bedrijfsuitje teambuilding",
    "zakelijk uitje",
    "bedrijfsactiviteit",
  ],
  openGraph: {
    title: "Bedrijfsuitjes met Impact | Goeduitje.nl",
    description:
      "Organiseer een uniek bedrijfsuitje met maatschappelijke impact. Kookworkshops, stadsspellen, sportieve activiteiten en meer.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
};

const BEDRIJFSUITJE_WORKSHOPS = [
  {
    title: "Kookworkshop",
    slug: "kookworkshop",
    description:
      "Het populairste bedrijfsuitje: samen koken onder begeleiding van Arabische koks. Kies uit Arabische, vegetarische of oogst-kookworkshops.",
    image: "/images/workshops/kookworkshop.jpg",
    price: "vanaf \u20ac55 p.p.",
    duration: "vanaf 2,5 uur",
    highlight: true,
  },
  {
    title: "Stadsspel / Citygame",
    slug: "stadsspel",
    description:
      "Ontdek de stad met je collega\u2019s via een interactieve speurtocht vol culturele uitdagingen en verrassende ontmoetingen.",
    image: "/images/workshops/stadsspel.jpg",
    price: "vanaf \u20ac22,50 p.p.",
    duration: "2-3 uur",
    highlight: false,
  },
  {
    title: "The Game - Koffer Challenge",
    slug: "the-game",
    description:
      "Teamwork op de proef gesteld: zoek samen de code om de koffer te openen. Perfecte test voor communicatie en samenwerking.",
    image: "/images/workshops/the-game.jpg",
    price: "vanaf \u20ac32,50 p.p.",
    duration: "2-3 uur",
    highlight: false,
  },
  {
    title: "Koffie & Thee Workshop",
    slug: "koffie-thee-workshop",
    description:
      "Ontdek de kunst van Arabische koffie en thee. Experimenteer met kruiden en specerijen onder begeleiding van onze medewerkers.",
    image: "/images/workshops/koffie-thee.jpg",
    price: "vanaf \u20ac32,50 p.p.",
    duration: "in overleg",
    highlight: false,
  },
  {
    title: "Beachvolleybal Workshop",
    slug: "beachvolleybal-workshop",
    description:
      "Sportief bedrijfsuitje met gecertificeerde trainers. Van clinic tot toernooi, voor beginners \u00e9n gevorderden.",
    image: "/images/workshops/beachvolleybal.jpg",
    price: "vanaf \u20ac25 p.p.",
    duration: "2-4 uur",
    highlight: false,
  },
  {
    title: "Lunch & Diner Uitjes",
    slug: "lunch-diner",
    description:
      "Culinaire beleving voor je team: van Arabisch buffet tot uitgebreid meergangen diner. Ook te combineren met een kookworkshop.",
    image: "/images/workshops/lunch-diner.jpg",
    price: "vanaf \u20ac22,50 p.p.",
    duration: "1-4 uur",
    highlight: false,
  },
];

export default function BedrijfsuitjesPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white py-16 lg:py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              <Building2 className="mr-1 h-3 w-3" />
              Bedrijfsuitjes
            </Badge>

            <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Bedrijfsuitjes met een verhaal
            </h1>

            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Op zoek naar een bedrijfsuitje dat echt indruk maakt? Bij
              Goeduitje combineren we plezier met maatschappelijke impact. Onze
              activiteiten worden begeleid door statushouders en nieuwkomers,
              waardoor jullie bedrijfsuitje niet alleen leuk is, maar ook
              bijdraagt aan een inclusieve samenleving.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/onze-uitjes#configurator">
                  <Calendar className="mr-2 h-5 w-5" />
                  Stel je bedrijfsuitje samen
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
              <Heart className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
              <h3 className="mb-2 font-bold">Maak samen impact</h3>
              <p className="text-muted-foreground text-sm">
                Jullie bedrijfsuitje draagt direct bij aan de integratie en
                arbeidsparticipatie van statushouders.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
              <MapPin className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
              <h3 className="mb-2 font-bold">Door heel Nederland</h3>
              <p className="text-muted-foreground text-sm">
                Wij organiseren bedrijfsuitjes op locaties door heel Nederland.
                Of we komen naar jullie toe.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
              <Users className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
              <h3 className="mb-2 font-bold">Elk team, elk budget</h3>
              <p className="text-muted-foreground text-sm">
                Van kleine teams tot grote groepen. Elk uitje wordt aangepast
                aan jullie wensen en budget.
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
              Kies jullie bedrijfsuitje
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Van culinair tot sportief, van binnen tot buiten. Combineer
              activiteiten voor een complete bedrijfsdag.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BEDRIJFSUITJE_WORKSHOPS.map((workshop) => (
              <Link
                key={workshop.slug}
                href={`/onze-uitjes/${workshop.slug}`}
                className={`group overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
                  workshop.highlight
                    ? "ring-2 ring-emerald-500 ring-offset-2"
                    : ""
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={workshop.image}
                    alt={workshop.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {workshop.highlight && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-emerald-600 text-white">
                        <Star className="mr-1 h-3 w-3" />
                        Populairst
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold group-hover:text-emerald-600">
                    {workshop.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {workshop.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="font-semibold text-emerald-600">
                      {workshop.price}
                    </span>
                    <span className="text-muted-foreground">
                      {workshop.duration}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/images/workshops/wat-uniek-maakt.jpg"
                alt="Bedrijfsuitje bij Goeduitje"
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
                  <span className="text-sm font-medium">4.9/5 op Google</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Meer dan een bedrijfsuitje
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Een bedrijfsuitje bij Goeduitje is meer dan een dagje uit. Het
                is een ervaring die je team verbindt, je MVO-doelen versterkt en
                een positieve bijdrage levert aan de samenleving.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <span>
                    Versterkt de teamband door samen te werken aan iets
                    bijzonders
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <span>Past bij jullie MVO-beleid en duurzaamheidsdoelen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <span>
                    Unieke culturele ervaring die je nergens anders vindt
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <span>
                    Geschikt voor elk teamtype: van klein team tot hele
                    organisatie
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-16 text-white lg:py-20">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Organiseer jullie bedrijfsuitje
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Stel jullie ideale bedrijfsuitje samen of neem contact op voor een
            vrijblijvende offerte. We denken graag mee over het perfecte
            programma.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-600 hover:bg-white/90"
            >
              <Link href="/onze-uitjes#configurator">
                <Calendar className="mr-2 h-5 w-5" />
                Stel je uitje samen
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
