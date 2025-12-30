import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Euro,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Calendar,
} from "lucide-react";

// Workshop data - content from goeduitje.nl
const WORKSHOPS = [
  {
    id: "kookworkshop",
    slug: "kookworkshop",
    title: "Arabische Kookworkshop",
    subtitle: "Samen koken, samen genieten",
    description:
      "Bereid samen een heerlijke maaltijd onder begeleiding van gepassioneerde koks uit de Arabische keuken",
    longDescription: `
      Onder begeleiding van gepassioneerde koks (asielzoekers en statushouders) leer je de geheimen van de Arabische keuken.
      Je wordt begeleid door enthousiaste en ervaren koks die graag hun liefde voor koken en hun cultuur delen.

      In teams van 2-3 personen bereid je heerlijke Arabische gerechten. De samenwerking wordt op een speelse manier beoordeeld,
      met een optionele prijsuitreiking als leuke afsluiter.

      Na afloop geniet je samen van het door jullie bereide diner. Keuze uit vlees, vegetarisch en veganistisch.
      Ook beschikbaar: Oogsten, Koken & Genieten waarbij je eerst ingrediënten oogst in de pluktuin.
    `,
    video: "/images/workshops/workshop 1.mp4",
    image: "/images/workshops/kookworkshop.jpg",
    duration: "vanaf 2,5 uur",
    groupSize: "8-30 personen",
    price: "Vanaf €55 p.p.",
    priceFrom: 55,
    priceTiers: [
      { groupSize: "8-10 personen", price: "€70 excl btw (€85 incl btw) p.p." },
      {
        groupSize: "11-15 personen",
        price: "€60 excl btw (€73 incl btw) p.p.",
      },
      { groupSize: "16+ personen", price: "€55 excl btw (€67 incl btw) p.p." },
    ],
    location: "Op locatie naar keuze of bij u op locatie",
    includes: [
      "Begeleiding door gepassioneerde koks",
      "Alle ingrediënten en materialen",
      "Recepten om mee naar huis te nemen",
      "Complete maaltijd",
      "Keuze uit vlees, vegetarisch of veganistisch",
      "Sociale impact - draag bij aan arbeidsparticipatie",
    ],
    categories: ["Koken", "Teambuilding", "Cultureel"],
  },
  {
    id: "stadsspel",
    slug: "stadsspel",
    title: "Stadsspel / Citygame",
    subtitle: "Ontdek de stad op een nieuwe manier",
    description:
      "Een interactieve speurtocht door de stad met culturele uitdagingen en verrassende ontmoetingen",
    longDescription: `
      Ons culture stadsspel is uniek door de integratie van statushouders en asielzoekers in het spel.
      Het spel kan zich afspelen in de stad, in de natuur of zelfs binnen.

      Kies uit twee varianten:
      - Teamspel: Competitief spel waar je strijdt tegen andere teams
      - "Team up and crack it!" (Koffer): Als één team op zoek naar de code om de koffer te openen

      Perfect voor teams die op zoek zijn naar een actieve, culturele en vooral leuke ervaring.
    `,
    video: "/images/workshops/workshop 2.mp4",
    image: "/images/workshops/stadsspel.jpg",
    duration: "2-3 uur",
    groupSize: "10-20 personen",
    price: "Vanaf €22,50 p.p.",
    priceFrom: 22.5,
    priceTiers: [
      { groupSize: "Teamspel", price: "vanaf €22,50 excl btw p.p." },
      { groupSize: "Koffer teambuilding", price: "vanaf €32,50 excl btw p.p." },
    ],
    location: "Nijmegen, Arnhem en andere steden",
    includes: [
      "Professionele begeleiding",
      "Spannende challenges en puzzels",
      "Culturele ontmoetingen",
      "Prijzen voor het winnende team",
      "Optioneel: lunch of borrel achteraf",
      "Sociale impact - ontmoet statushouders",
    ],
    categories: ["Outdoor", "Teambuilding", "Cultureel"],
  },
  {
    id: "the-game",
    slug: "the-game",
    title: "The Game - Koffer Challenge",
    subtitle: "Team up and crack it!",
    description:
      "Zoek samen de code om de koffer te openen. Vereist afstemming, communicatie en samenwerking",
    longDescription: `
      "Team up and crack it!" - Als één team ga je op zoek naar de code om de koffer te openen.
      Dit vereist afstemming, communicatie en samenwerking tussen alle teamleden.

      Uniek door de integratie van statushouders en asielzoekers in het spel. Zij begeleiden
      de activiteit en maken het tot een bijzondere culturele ervaring.

      Communicatie, leiderschap en probleemoplossend denken worden op de proef gesteld
      terwijl jullie samen de puzzel oplossen.
    `,
    image: "/images/workshops/the-game.jpg",
    duration: "2-3 uur",
    groupSize: "10-20 personen",
    price: "Vanaf €32,50 p.p.",
    priceFrom: 32.5,
    priceTiers: [
      { groupSize: "Koffer teambuilding", price: "vanaf €32,50 excl btw p.p." },
    ],
    location: "Diverse locaties in overleg",
    includes: [
      "Professionele begeleiding",
      "Alle benodigde materialen",
      "Culturele uitwisseling",
      "Teamevaluatie achteraf",
      "Drankjes tijdens het spel",
      "Sociale impact - werk samen met statushouders",
    ],
    categories: ["Indoor", "Teambuilding", "Cultureel"],
  },
  {
    id: "koffie-thee-workshop",
    slug: "koffie-thee-workshop",
    title: "Koffie & Thee Workshop",
    subtitle: "De kunst van Arabische koffie en thee",
    description:
      "Leer hoe Arabische koffie en thee gemaakt worden en experimenteer met kruiden en specerijen",
    longDescription: `
      Onze medewerkers laten zien hoe Arabische koffie gemaakt wordt. Daarna maakt u in groepjes zelf koffie
      en experimenteert u met verschillende kruiden en specerijen om de perfecte smaak te ontdekken.

      U kunt de koffie van collega's of teamgenoten proeven en samen bepalen hoe de lekkerste Arabische koffie te maken.
      Theeliefhebbers kunnen ook aan de slag met diverse kruiden en specerijen.

      Tijdens de workshop serveren ze heerlijke Arabische lekkernijen. Optioneel te combineren met een maaltijd
      uit de Arabische keuken.
    `,
    image: "/images/workshops/koffie-thee.jpg",
    duration: "in overleg",
    groupSize: "8-25 personen",
    price: "Vanaf €32,50 p.p.",
    priceFrom: 32.5,
    priceTiers: [
      { groupSize: "Workshop", price: "vanaf €32,50 excl btw p.p." },
      { groupSize: "Met maaltijd", price: "prijs in overleg" },
    ],
    location:
      "Bij u op locatie (binnen of buiten) of gezamenlijk gekozen locatie",
    includes: [
      "Begeleiding door onze medewerkers",
      "Diverse koffie- en theesoorten",
      "Kruiden en specerijen om mee te experimenteren",
      "Arabische lekkernijen",
      "Culturele uitwisseling",
      "Optioneel: maaltijd uit de Arabische keuken",
    ],
    categories: ["Workshop", "Cultureel", "Culinair"],
  },
  {
    id: "beachvolleybal-workshop",
    slug: "beachvolleybal-workshop",
    title: "Beachvolleybal Workshop",
    subtitle: "Sport, zon en strand",
    description:
      "Actieve teambuilding met gecertificeerde trainers. Clinic, toernooi of combinatie van beide",
    longDescription: `
      Onder leiding van gecertificeerde beachvolleybaltrainers leer je de beginselen van het beachvolleybal
      of breid je je volleybalskills uit. Serveren, passen, duiken en aanvallen komen allemaal aan bod.

      Kies uit verschillende opties:
      - Dynamische clinic door gecertificeerde trainer
      - Spannend toernooi
      - Combinatie van beide

      Geschikt voor beginners én gevorderden. Met de zon op je gezicht en zand tussen je tenen
      creëer je herinneringen die je team nog lang zal bijblijven.
    `,
    image: "/images/workshops/beachvolleybal.jpg",
    duration: "2-4 uur",
    groupSize: "12-40 personen",
    price: "Vanaf €25 p.p.",
    priceFrom: 25,
    priceTiers: [
      { groupSize: "Per persoon", price: "vanaf €25 excl btw p.p." },
    ],
    location: "Beachclubs in heel Nederland",
    includes: [
      "Gecertificeerde volleybalcoaches",
      "Gebruik van velden en materiaal",
      "Warming-up en techniektraining",
      "Toernooi met prijzen",
      "Geschikt voor beginners én gevorderden",
      "Optioneel: drankjes en hapjes",
    ],
    categories: ["Outdoor", "Sport", "Teambuilding"],
  },
];

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workshop = WORKSHOPS.find((w) => w.slug === slug);

  if (!workshop) {
    return {
      title: "Workshop niet gevonden | Goeduitje.nl",
    };
  }

  return {
    title: `${workshop.title} | Goeduitje.nl`,
    description: workshop.description,
  };
}

export function generateStaticParams() {
  return WORKSHOPS.map((workshop) => ({
    slug: workshop.slug,
  }));
}

export default async function WorkshopDetailPage({ params }: Props) {
  const { slug } = await params;
  const workshop = WORKSHOPS.find((w) => w.slug === slug);

  if (!workshop) {
    notFound();
  }

  return (
    <main className="min-h-screen">
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
              ) : (
                <Image
                  src={workshop.image}
                  alt={workshop.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
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
                    <p className="font-semibold">{workshop.price}</p>
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
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Description */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold">Over dit uitje</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {workshop.longDescription.split("\n\n").map((paragraph, i) => (
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
                  €{workshop.priceFrom}{" "}
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
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {tier.groupSize}
                        </span>
                        <span className="font-medium">{tier.price}</span>
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
        </div>
      </section>

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
