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

// Workshop data - in a real app this would come from a database
const WORKSHOPS = [
  {
    id: "kookworkshop",
    slug: "kookworkshop",
    title: "Kookworkshop",
    subtitle: "Samen koken, samen genieten",
    description:
      "Bereid samen een heerlijke maaltijd en leer nieuwe recepten terwijl je impact maakt",
    longDescription: `
      Onze kookworkshops zijn de perfecte combinatie van lekker eten, samenwerken en plezier maken.
      Onder begeleiding van een professionele chef bereid je samen met je team een heerlijke maaltijd.

      Van Italiaanse pasta tot Aziatische fusion - er is voor elk team een passende culinaire uitdaging.
      Terwijl je snijdt, roert en proeft, werk je ongemerkt aan teambuilding en communicatie.

      Na afloop geniet je samen van het door jullie bereide diner, inclusief bijpassende wijnen of andere dranken.
    `,
    video: "/images/workshops/workshop 1.mp4",
    image: "/images/workshops/kookworkshop.jpg",
    duration: "3-4 uur",
    groupSize: "8-30 personen",
    price: "Vanaf €45 p.p.",
    priceFrom: 45,
    location: "Diverse locaties door heel Nederland",
    includes: [
      "Professionele chef-kok begeleiding",
      "Alle ingrediënten en materialen",
      "Recepten om mee naar huis te nemen",
      "Drie-gangen diner",
      "Drankpakket (wijn, bier, fris)",
      "Persoonlijke aandenken",
    ],
    categories: ["Koken", "Teambuilding", "Indoor"],
  },
  {
    id: "stadsspel",
    slug: "stadsspel",
    title: "Stadsspel",
    subtitle: "Ontdek de stad op een nieuwe manier",
    description:
      "Een interactieve speurtocht door de stad met uitdagende opdrachten en verrassende ontdekkingen",
    longDescription: `
      Ontdek de stad op een manier die je nooit eerder hebt meegemaakt! Ons stadsspel combineert
      sightseeing met spannende challenges en teamopdrachten.

      Met een tablet of smartphone in de hand los je puzzels op, voer je opdrachten uit en
      ontdek je verborgen plekjes die zelfs locals niet kennen.

      Perfect voor teams die op zoek zijn naar een actieve, leerzame en vooral leuke ervaring
      in het hart van de stad.
    `,
    video: "/images/workshops/workshop 2.mp4",
    image: "/images/workshops/stadsspel.jpg",
    duration: "2-3 uur",
    groupSize: "8-40 personen",
    price: "Vanaf €35 p.p.",
    priceFrom: 35,
    location: "Amsterdam, Rotterdam, Utrecht, Den Haag en meer",
    includes: [
      "Tablets/app voor het spel",
      "Professionele begeleiding",
      "Spannende challenges en puzzels",
      "Prijzen voor het winnende team",
      "Optioneel: lunch of borrel achteraf",
      "Foto's van de dag",
    ],
    categories: ["Outdoor", "Teambuilding", "Actief"],
  },
  {
    id: "the-game",
    slug: "the-game",
    title: "The Game",
    subtitle: "Teamwork onder druk",
    description:
      "Een intense team challenge waarbij samenwerking en strategie centraal staan",
    longDescription: `
      The Game is onze meest intensieve teambuilding ervaring. In dit spannende spel
      wordt je team uitgedaagd om onder tijdsdruk samen te werken en strategische beslissingen te nemen.

      Communicatie, leiderschap en probleemoplossend denken worden op de proef gesteld
      terwijl jullie puzzels oplossen en obstakels overwinnen.

      Een onvergetelijke ervaring die je team dichter bij elkaar brengt en verborgen talenten naar boven haalt.
    `,
    image: "/images/workshops/the-game.jpg",
    duration: "2-3 uur",
    groupSize: "10-50 personen",
    price: "Vanaf €40 p.p.",
    priceFrom: 40,
    location: "Diverse indoor locaties",
    includes: [
      "Professionele game masters",
      "Alle benodigde materialen",
      "Introductie en uitleg",
      "Teamevaluatie achteraf",
      "Drankjes tijdens het spel",
      "Winnaarsprijzen",
    ],
    categories: ["Indoor", "Teambuilding", "Strategie"],
  },
  {
    id: "koffie-thee-workshop",
    slug: "koffie-thee-workshop",
    title: "Koffie & Thee Workshop",
    subtitle: "De kunst van brouwen",
    description:
      "Leer alles over koffiebonen en thee, van herkomst tot perfecte bereiding",
    longDescription: `
      Duik in de fascinerende wereld van koffie en thee! In deze workshop leer je alles
      over de herkomst, het brandproces en de perfecte bereidingswijzen.

      Proef verschillende soorten koffie en thee uit alle hoeken van de wereld en
      ontdek welke smaken het beste bij jou passen.

      Ga naar huis met kennis die je elke dag kunt toepassen en een nieuwe waardering
      voor je dagelijkse bakje koffie of thee.
    `,
    image: "/images/workshops/koffie-thee.jpg",
    duration: "2-3 uur",
    groupSize: "8-25 personen",
    price: "Vanaf €40 p.p.",
    priceFrom: 40,
    location: "Amsterdam, Utrecht, Rotterdam",
    includes: [
      "Expert barista begeleiding",
      "Proeverij diverse koffie- en theesoorten",
      "Theorie over herkomst en bereiding",
      "Praktische oefening",
      "Pakketje koffie/thee voor thuis",
      "Bijpassend gebak",
    ],
    categories: ["Workshop", "Indoor", "Culinair"],
  },
  {
    id: "beachvolleybal-workshop",
    slug: "beachvolleybal-workshop",
    title: "Beachvolleybal Workshop",
    subtitle: "Sport, zon en strand",
    description:
      "Actieve teambuilding op het strand met professionele coaching en leuke challenges",
    longDescription: `
      Combineer teambuilding met beweging en plezier op het strand! Onze beachvolleybal
      workshop is perfect voor teams die van een actieve uitdaging houden.

      Onder begeleiding van ervaren coaches leer je de basistechnieken of verbeter je
      je bestaande skills. Daarna is het tijd voor een spannend toernooi!

      Met de zon op je gezicht en zand tussen je tenen creëer je herinneringen die
      je team nog lang zal bijblijven.
    `,
    image: "/images/workshops/beachvolleybal.jpg",
    duration: "2-3 uur",
    groupSize: "12-40 personen",
    price: "Vanaf €35 p.p.",
    priceFrom: 35,
    location: "Beachclubs in heel Nederland",
    includes: [
      "Professionele volleybalcoaches",
      "Gebruik van velden en materiaal",
      "Warming-up en techniektraining",
      "Toernooi met prijzen",
      "Drankjes en hapjes",
      "Kleedkamers en douches",
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
                  <Link href="/booking">
                    <Calendar className="mr-2 h-5 w-5" />
                    Direct boeken
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
                <Button asChild className="w-full">
                  <Link href="/booking">Nu boeken</Link>
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
              <Link href="/booking">Direct boeken</Link>
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
