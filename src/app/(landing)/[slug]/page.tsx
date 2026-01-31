import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  MapPin,
  ChefHat,
  CheckCircle2,
  ArrowRight,
  Heart,
  Star,
  Phone,
  Mail,
} from "lucide-react";
import { getCityImage } from "@/lib/city-data";

// All cities for kookworkshop landing pages - complete list from goeduitje.nl
const KOOKWORKSHOP_CITIES: CityData[] = [
  {
    slug: "kookworkshop-achterhoek",
    city: "Achterhoek",
    region: "de Achterhoek",
    tagline: "Unieke kookervaring",
  },
  {
    slug: "kookworkshop-andelst",
    city: "Andelst",
    region: "Andelst",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-apeldoorn",
    city: "Apeldoorn",
    region: "Apeldoorn",
    tagline: "Unieke kookervaring",
  },
  {
    slug: "kookworkshop-arnhem",
    city: "Arnhem",
    region: "Arnhem",
    tagline: "Dé culinaire ervaring",
  },
  {
    slug: "kookworkshop-bemmel",
    city: "Bemmel",
    region: "Bemmel",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-bennekom",
    city: "Bennekom",
    region: "Bennekom",
    tagline: "Unieke kookervaring",
  },
  {
    slug: "kookworkshop-best",
    city: "Best",
    region: "Best",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-beuningen",
    city: "Beuningen",
    region: "Beuningen",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-bij-je-thuis",
    city: "bij je thuis",
    region: "bij jou thuis",
    tagline: "Op locatie",
  },
  {
    slug: "kookworkshop-boxtel",
    city: "Boxtel",
    region: "Boxtel",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-cuijk",
    city: "Cuijk",
    region: "Cuijk",
    tagline: "Echte Arabische koks",
  },
  {
    slug: "kookworkshop-den-bosch",
    city: "Den Bosch",
    region: "Den Bosch",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-didam",
    city: "Didam",
    region: "Didam",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-doetinchem",
    city: "Doetinchem",
    region: "Doetinchem",
    tagline: "Unieke kookervaring",
  },
  {
    slug: "kookworkshop-druten",
    city: "Druten",
    region: "Druten",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-duiven",
    city: "Duiven",
    region: "Duiven",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-ede",
    city: "Ede",
    region: "Ede",
    tagline: "Unieke kookervaring",
  },
  {
    slug: "kookworkshop-eindhoven",
    city: "Eindhoven",
    region: "Eindhoven",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-elst",
    city: "Elst",
    region: "Elst",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-ewijk",
    city: "Ewijk",
    region: "Ewijk",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-geldermalsen",
    city: "Geldermalsen",
    region: "Geldermalsen",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-gendt",
    city: "Gendt",
    region: "Gendt",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-gennep",
    city: "Gennep",
    region: "Gennep",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-grave",
    city: "Grave",
    region: "Grave",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-groesbeek",
    city: "Groesbeek",
    region: "Groesbeek",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-helmond",
    city: "Helmond",
    region: "Helmond",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-huissen",
    city: "Huissen",
    region: "Huissen",
    tagline: "Het culinaire uitje",
  },
  {
    slug: "kookworkshop-malden",
    city: "Malden",
    region: "Malden",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-nijmegen",
    city: "Nijmegen",
    region: "de regio Nijmegen",
    tagline: "Unieke ervaring",
  },
  {
    slug: "kookworkshop-oss",
    city: "Oss",
    region: "Oss",
    tagline: "Een unieke culinaire ervaring",
  },
  {
    slug: "kookworkshop-tiel",
    city: "Tiel",
    region: "Tiel",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-uden",
    city: "Uden",
    region: "Uden",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-veenendaal",
    city: "Veenendaal",
    region: "Veenendaal",
    tagline: "Unieke kookcursus",
  },
  {
    slug: "kookworkshop-veghel",
    city: "Veghel",
    region: "Veghel",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-venray",
    city: "Venray",
    region: "Venray",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-wageningen",
    city: "Wageningen",
    region: "Wageningen",
    tagline: "Leer koken op een unieke manier",
  },
  {
    slug: "kookworkshop-wijchen",
    city: "Wijchen",
    region: "Wijchen",
    tagline: "Voor een culinaire ervaring",
  },
  {
    slug: "kookworkshop-zaltbommel",
    city: "Zaltbommel",
    region: "Zaltbommel",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-zetten",
    city: "Zetten",
    region: "Zetten",
    tagline: "Culinaire ervaring",
  },
  {
    slug: "kookworkshop-zevenaar",
    city: "Zevenaar",
    region: "Zevenaar",
    tagline: "Talentvolle Arabische koks",
  },
  {
    slug: "kookworkshop-zutphen",
    city: "Zutphen",
    region: "Zutphen",
    tagline: "Een unieke kookcursus",
  },
];

// Also add vegetarische-kookworkshop-nijmegen
const ALL_LANDING_PAGES: LandingPageData[] = [
  ...KOOKWORKSHOP_CITIES,
  {
    slug: "vegetarische-kookworkshop-nijmegen",
    city: "Nijmegen",
    region: "Nijmegen",
    tagline: "Vegetarische kookervaring",
    isVegetarian: true,
  },
];

interface CityData {
  slug: string;
  city: string;
  region: string;
  tagline: string;
}

interface LandingPageData extends CityData {
  isVegetarian?: boolean;
}

type Props = {
  params: Promise<{ slug: string }>;
};

function getLandingPage(slug: string): LandingPageData | undefined {
  return ALL_LANDING_PAGES.find((page) => page.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const landing = getLandingPage(slug);

  if (!landing) {
    return {
      title: "Pagina niet gevonden | Goeduitje.nl",
    };
  }

  const isVegetarian = landing.isVegetarian;
  const workshopType = isVegetarian
    ? "Vegetarische Kookworkshop"
    : "Kookworkshop";

  // Exact meta description from original pages
  const metaDescription = `Bij onze sociale onderneming organiseren statushouders en asielzoekers unieke kookworkshops in ${landing.region}, waar u onder begeleiding van onze medewerkers aan de slag gaat.`;

  return {
    title: `${workshopType} ${landing.city} | ${landing.tagline} | Goed Uitje`,
    description: metaDescription,
    keywords: [
      `kookworkshop ${landing.city.toLowerCase()}`,
      `teambuilding ${landing.city.toLowerCase()}`,
      `bedrijfsuitje ${landing.city.toLowerCase()}`,
      `koken ${landing.city.toLowerCase()}`,
      "kookworkshop",
      "teambuilding",
      "bedrijfsuitje",
      "sociale impact",
      "statushouders",
      "arabische keuken",
    ],
    openGraph: {
      title: `${workshopType} ${landing.city} | ${landing.tagline} | Goed Uitje`,
      description: metaDescription,
      type: "website",
      locale: "nl_NL",
      siteName: "Goeduitje.nl",
    },
  };
}

export async function generateStaticParams() {
  return ALL_LANDING_PAGES.map((page) => ({
    slug: page.slug,
  }));
}

export default async function KookworkshopLandingPage({ params }: Props) {
  const { slug } = await params;
  const landing = getLandingPage(slug);

  if (!landing) {
    notFound();
  }

  const isVegetarian = landing.isVegetarian;
  const workshopType = isVegetarian
    ? "Vegetarische Kookworkshop"
    : "Kookworkshop";

  // Extract city slug from landing page slug (e.g., "nijmegen" from "kookworkshop-nijmegen")
  const citySlug = slug
    .replace("kookworkshop-", "")
    .replace("vegetarische-kookworkshop-", "");

  // Use city-specific image if available, otherwise fall back to generic kookworkshop images
  const genericHeroImages = [
    "/images/workshops/kookworkshop.avif",
    "/images/workshops/kookworkshop-2.avif",
    "/images/workshops/kookworkshop-3.avif",
  ];
  const imageIndex =
    slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    genericHeroImages.length;
  const heroImage = getCityImage(citySlug) || genericHeroImages[imageIndex];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-white py-16 lg:py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div className="flex flex-col justify-center">
              <Badge className="mb-4 w-fit bg-amber-100 text-amber-800 hover:bg-amber-100">
                <MapPin className="mr-1 h-3 w-3" />
                {landing.region}
              </Badge>

              <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {workshopType} {landing.city}
              </h1>

              {/* Exact intro text from original pages */}
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Bij onze sociale onderneming organiseren statushouders en
                asielzoekers unieke kookworkshops in {landing.region}, waar je
                onder begeleiding van onze medewerkers aan de slag gaat. Deze
                workshops bieden niet alleen een culinaire reis door de
                Arabische keuken, maar ook een waardevolle kans om nieuwe
                talenten te ontdekken en met elkaar beter te leren kennen.
              </p>

              {/* USPs from original pages */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span className="text-gray-700">
                    Unieke kookervaring met statushouders en asielzoekers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span className="text-gray-700">
                    Op eigen- of af te spreken locatie in {landing.city}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span className="text-gray-700">
                    Professionele begeleiding van Arabische koks
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Link href="/onze-uitjes/kookworkshop">
                    <ChefHat className="mr-2 h-5 w-5" />
                    Bekijk onze kookworkshops
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

            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl lg:aspect-square">
              <Image
                src={heroImage}
                alt={`Kookworkshop in ${landing.city}`}
                fill
                className="object-cover"
                priority
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
          </div>
        </div>
      </section>

      {/* About Our Workshops Section - Exact text from original */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
              Onze kookworkshops in {landing.city}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Onze kookworkshops worden geleid door Arabische koks, die niet
              alleen de fijne kneepjes van hun keuken delen, maar je vooral
              laten ervaren hoe authentieke Arabische gerechten worden bereid.
              Onder hun begeleiding leer je, in kleine teams van twee of drie,
              diverse hoofdgerechten en desserts maken. Na het koken kun je
              genieten van je eigen culinaire creaties, aangevuld met gerechten
              die de koks speciaal voor jullie bereiden.
            </p>
          </div>
        </div>
      </section>

      {/* Workshop Types Section - Exact text from original */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Populaire kookworkshops in {landing.city}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              We stemmen onze kookworkshop graag af op jouw wensen. Ook hebben
              wij een aantal standaard kookworkshops op een rijtje gezet als je
              gewoon makkelijk wilt kiezen:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Arabische kookworkshop */}
            <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <ChefHat className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Arabische kookworkshop</h3>
              <p className="text-muted-foreground">
                Leer met je team diverse Arabische gerechten bereiden.
                Afhankelijk van de gewenste lengte maken we samen een keuze uit
                vele voor- en hoofdgerechten, salades en toetjes. Wij koken met
                vlees, vegetarisch en veganistisch. En daarna gezellig genieten
                van de bereide gerechten.
              </p>
            </div>

            {/* Dessert workshop */}
            <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <Heart className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Dessert workshop</h3>
              <p className="text-muted-foreground">
                Uitermate geschikt als opwarmertje of kennismakingsactiviteit
                tijdens een teamdag, maar ook als onderbreking tijdens een
                congres of strategiedag.
              </p>
            </div>

            {/* Oogsten, koken & genieten */}
            <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">
                Oogsten, koken &amp; genieten
              </h3>
              <p className="text-muted-foreground">
                Eerst lekker ontspannen je eigen groenten oogsten en kruiden
                verzamelen in de pluktuin en het voedselbos. En deze dan onder
                leiding van onze koks met aanvulling van Oosterse kruiden en
                ingrediënten om te toveren tot verrukkelijke gerechten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact Section - Exact text from original */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
                <Heart className="mr-1 h-3 w-3" />
                Maatschappelijke Impact
              </Badge>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Wat Goeduitje echt uniek maakt
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Wat Goeduitje echt uniek maakt, is de combinatie van culinair
                genieten en maatschappelijke impact. Onze kookworkshops in{" "}
                {landing.city} worden verzorgd door statushouders en
                asielzoekers die hun talent, passie en cultuur met jou delen. Zo
                beleef je niet alleen een smakelijke kookervaring, maar draag je
                ook bij aan hun integratie en kansen op de arbeidsmarkt. Elke
                workshop is daarmee een bijzondere ontmoeting tussen culturen,
                waarin koken, leren en verbinden centraal staan.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>
                    Onder leiding van onze getalenteerde Arabische chefs ontdek
                    je traditionele recepten en bijzondere kooktechnieken, van
                    hartige hoofdgerechten tot zoete desserts.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>
                    Alle ingrediënten, materialen en keukengerei zijn
                    inbegrepen. Je kookt samen in kleine teams en geniet daarna
                    van de gerechten die je zelf en onze chefs hebben bereid.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>
                    De workshops vinden plaats op een gezellige locatie in{" "}
                    {landing.city} of in overleg op een plek die je zelf kiest.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>
                    Of je nu beginner bent of ervaren kookliefhebber, een
                    kookworkshop in {landing.city} is de perfecte gelegenheid om
                    nieuwe smaken te ontdekken, technieken te leren en samen een
                    bijzondere tijd te beleven.
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/images/workshops/kookworkshop-2.avif"
                alt={`Kookworkshop ${landing.city} met sociale impact`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Practical Info Section */}
      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left - Info */}
            <div>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Praktische informatie
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Hoe lang duurt een kookworkshop bij jullie?
                    </h3>
                    <p className="text-muted-foreground">
                      Onze kookworkshops zijn volledig naar wens te plannen. Een
                      standaard workshop duurt 3 uur. Dit geeft voldoende tijd
                      om de gerechten grondig uit te leggen, samen te bereiden
                      en daarna te genieten van wat we hebben gemaakt.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Heb ik kookervaring nodig om mee te doen?
                    </h3>
                    <p className="text-muted-foreground">
                      Nee, iedereen is welkom, of je nu een beginner bent of al
                      ervaring hebt in de keuken! Onze chefs begeleiden je stap
                      voor stap, zodat iedereen op zijn eigen tempo mee kan doen
                      en kan leren.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Waar worden de kookworkshops gehouden in {landing.city}?
                    </h3>
                    <p className="text-muted-foreground">
                      Onze kookworkshops worden georganiseerd bij jou op locatie
                      of we huren een locatie naar keuze.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - CTA Card */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h3 className="mb-2 text-xl font-bold">
                  Boek je kookworkshop in {landing.city}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Wil je samen met vrienden, familie of collega&apos;s een
                  unieke kookervaring beleven? Neem dan vandaag nog contact op
                  voor een kookworkshop in {landing.city}
                  en ontdek de geheimen van authentieke gerechten!
                </p>

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    <Link href="/onze-uitjes#configurator">
                      Configureer je uitje
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact opnemen
                    </Link>
                  </Button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4 border-t pt-6">
                  <a
                    href="tel:+31612345678"
                    className="text-muted-foreground hover:text-amber-600"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                  <a
                    href="mailto:info@goeduitje.nl"
                    className="text-muted-foreground hover:text-amber-600"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-4xl px-6">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Veelgestelde vragen over kookworkshops in {landing.city}
          </h2>

          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">
                Moeten we zelf iets meenemen naar de kookworkshop?
              </h3>
              <p className="text-muted-foreground">
                Nee, alle benodigde ingrediënten en kookmaterialen worden door
                ons verzorgd. Het enige dat je mee hoeft te nemen, is een goede
                dosis enthousiasme en zin om te leren!
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">
                Kunnen jullie rekening houden met dieetwensen of allergieën?
              </h3>
              <p className="text-muted-foreground">
                Ja, wij houden graag rekening met dieetwensen en allergieën.
                Geef dit bij je boeking aan, zodat we de nodige aanpassingen
                kunnen maken. Op basis van jullie wensen stellen wij de
                gerechten die we samen gaan koken voor. We werken veel met verse
                ingrediënten en in veel van onze gerechten kunnen we variëren
                met de ingrediënten.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">
                Wat voor soort gerechten maken we tijdens de kookworkshop?
              </h3>
              <p className="text-muted-foreground">
                De gerechten variëren per type workshop en stemmen we volledig
                naar wens af. We bieden workshops aan waarin je gerechten uit de
                Arabische keuken leert maken. Dit is een combinatie van hoofd-
                en bijgerechten met meestal als afsluiter een lekker dessert.
                Elke workshop is gericht op authentieke, smaakvolle gerechten
                die je stap voor stap leert bereiden.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">
                Kan ik een kookworkshop boeken als bedrijfsuitje of teamuitje?
              </h3>
              <p className="text-muted-foreground">
                Absoluut! Onze kookworkshops zijn erg geschikt als
                bedrijfsuitje, teambuilding-activiteit of voor een gezellig
                teamuitje. We kunnen zelfs workshops op maat maken, afgestemd op
                de behoeften en wensen van jouw team.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">
                Krijgen we de recepten na afloop?
              </h3>
              <p className="text-muted-foreground">
                Na de workshop krijgen jullie een link naar de recepten op onze
                website. En stel dat er nog eten over is, dan zorgen wij voor
                een bakje zodat je familie en vrienden ook kunt laten genieten
                van de smaakvolle Arabische keuken en jouw kooktalenten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-amber-600 py-16 text-white lg:py-20">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Benieuwd wat we voor elkaar kunnen betekenen?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Neem dan snel contact met ons op en boek snel jouw kookworkshop in{" "}
            {landing.city}! Samen zorgen we ervoor dat jouw kookworkshop een
            onvergetelijke culinaire reis wordt!
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-amber-600 hover:bg-white/90"
            >
              <Link href="/onze-uitjes/kookworkshop">
                <ChefHat className="mr-2 h-5 w-5" />
                Bekijk kookworkshops
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

      {/* Footer info */}
      <section className="border-t py-8">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <p className="text-muted-foreground text-sm">
            Goeduitje B.V. | Groenestraat 48 | 6531 HS Nijmegen
          </p>
        </div>
      </section>
    </main>
  );
}
