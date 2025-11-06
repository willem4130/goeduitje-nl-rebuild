import { WorkshopConfigurator } from "@/components/workshop-configurator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WORKSHOPS } from "@/lib/constants/cities";
import {
  IconUsers,
  IconMapPin,
  IconCalendar,
  IconStar,
} from "@tabler/icons-react";

export const metadata = {
  title: "Onze Uitjes - Workshop Configurator | Goeduitje.nl",
  description:
    "Configureer je ideale teamuitje. Kies uit verschillende workshops en locaties in Nederland.",
};

export default function OnzeUitjesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="from-primary/5 border-b bg-gradient-to-b to-transparent">
        <div className="container flex min-h-[40vh] flex-col items-center justify-center gap-6 py-20 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Onze Uitjes
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl">
              Configureer je perfecte teamuitje. Kies uit verschillende
              workshops, locaties en activiteiten voor een onvergetelijke
              ervaring.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#configurator">Start Configureren</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#workshops">Bekijk Workshops</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Waarom Kiezen Voor Ons?
            </h2>
            <p className="text-muted-foreground mt-2">
              Wat maakt onze uitjes speciaal
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <IconUsers className="text-primary mb-2 size-10" />
                <CardTitle>Flexibele Groepsgrootte</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Van kleine teams tot grote groepen, wij hebben de perfecte
                  workshop voor jullie.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <IconMapPin className="text-primary mb-2 size-10" />
                <CardTitle>Meerdere Locaties</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Workshops beschikbaar in Nijmegen, Arnhem, Amersfoort en meer
                  steden in Nederland.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <IconCalendar className="text-primary mb-2 size-10" />
                <CardTitle>Flexibele Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Kies je datum en tijd, of laat het nog te bepalen voor
                  maximale flexibiliteit.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <IconStar className="text-primary mb-2 size-10" />
                <CardTitle>Professionele Begeleiding</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ervaren begeleiders zorgen voor een onvergetelijke en leerzame
                  ervaring.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Workshops Section */}
      <section id="workshops" className="bg-muted/30 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Beschikbare Workshops
            </h2>
            <p className="text-muted-foreground mt-2">
              Onze selectie van team-building activiteiten
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WORKSHOPS.map((workshop) => (
              <Card key={workshop.id}>
                <CardHeader>
                  <CardTitle>{workshop.name}</CardTitle>
                  <CardDescription>
                    Minimaal {workshop.minParticipants} deelnemers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {workshop.id === "kookworkshop" &&
                      "Leer samen koken en geniet van een heerlijke maaltijd die jullie zelf hebben bereid."}
                    {workshop.id === "stadsspel" &&
                      "Ontdek de stad op een interactieve manier met uitdagende opdrachten en vragen."}
                    {workshop.id === "the-game" &&
                      "Spannende team-building activiteit waarbij samenwerking centraal staat."}
                    {workshop.id === "beachvolleybal" &&
                      "Actieve teambuilding op het strand met professionele begeleiding."}
                    {workshop.id === "koffie-thee" &&
                      "Ontdek de wereld van koffie en thee tijdens deze proeverij workshop."}
                    {workshop.id === "design-tshirt" &&
                      "Ontwerp en creëer je eigen unieke team t-shirts."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Configurator Section */}
      <section id="configurator" className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Configureer Je Uitje
            </h2>
            <p className="text-muted-foreground mt-2">
              Vul het formulier in en ontvang direct een bevestiging
            </p>
          </div>
          <div className="flex justify-center">
            <WorkshopConfigurator />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Klaar om te Beginnen?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            Configureer nu je workshop en ontvang binnen 24 uur een reactie van
            ons team.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="#configurator">Start Configuratie</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
