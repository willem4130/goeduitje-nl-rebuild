"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconUsers,
  IconChefHat,
} from "@tabler/icons-react";

// Open cooking workshops data based on typical Goeduitje offerings
const OPEN_WORKSHOPS = [
  {
    id: "kw-dec-14",
    title: "Kerstmenu Kookworkshop",
    date: "2025-12-14",
    dateDisplay: "Zaterdag 14 December 2025",
    time: "18:00 - 21:00",
    duration: "3 uur",
    location: "Nijmegen Centrum",
    address: "Molenstraat 45, 6511 HE Nijmegen",
    price: 67.5,
    totalSeats: 12,
    bookedSeats: 8,
    description:
      "Leer een heerlijk 3-gangen kerstmenu bereiden met seasonal ingrediënten. Perfect voor de feestdagen!",
    menu: [
      "Voorgerecht: Carpaccio van biet met geitenkaas",
      "Hoofdgerecht: Hertenbiefstuk met rode wijn saus",
      "Nagerecht: Chocolade fondant met vanille-ijs",
    ],
  },
  {
    id: "kw-dec-21",
    title: "Italiaanse Kookworkshop",
    date: "2025-12-21",
    dateDisplay: "Zaterdag 21 December 2025",
    time: "14:00 - 17:00",
    duration: "3 uur",
    location: "Arnhem",
    address: "Bakkerstraat 12, 6811 EE Arnhem",
    price: 62.5,
    totalSeats: 15,
    bookedSeats: 4,
    description:
      "Duik in de Italiaanse keuken en maak verse pasta, risotto en tiramisu van scratch!",
    menu: [
      "Verse pasta maken (tagliatelle)",
      "Risotto ai funghi",
      "Klassieke tiramisu",
    ],
  },
  {
    id: "kw-jan-11",
    title: "Nieuwjaars Brunch Workshop",
    date: "2025-01-11",
    dateDisplay: "Zaterdag 11 Januari 2025",
    time: "10:00 - 13:00",
    duration: "3 uur",
    location: "Nijmegen Centrum",
    address: "Molenstraat 45, 6511 HE Nijmegen",
    price: 59.0,
    totalSeats: 12,
    bookedSeats: 2,
    description:
      "Start het nieuwe jaar goed met een uitgebreide brunch workshop. Leer heerlijke brunch gerechten maken!",
    menu: [
      "Huisgebakken broodjes en croissants",
      "Eggs Benedict met hollandaise",
      "Smoothie bowls en granola",
    ],
  },
  {
    id: "kw-jan-25",
    title: "Aziatische Streetfood",
    date: "2025-01-25",
    dateDisplay: "Zaterdag 25 Januari 2025",
    time: "18:00 - 21:00",
    duration: "3 uur",
    location: "Amersfoort",
    address: "Langestraat 89, 3811 AC Amersfoort",
    price: 65.0,
    totalSeats: 15,
    bookedSeats: 0,
    description:
      "Ontdek de smaken van Aziatische streetfood: dumplings, bao buns, en meer!",
    menu: [
      "Handgemaakte dumplings (gyoza)",
      "Fluffy bao buns met pulled pork",
      "Pad Thai noodles",
    ],
  },
];

export default function BookingPage() {
  const router = useRouter();

  const handleBooking = (workshopId: string) => {
    const workshop = OPEN_WORKSHOPS.find((w) => w.id === workshopId);
    if (!workshop) return;

    const availableSeats = workshop.totalSeats - workshop.bookedSeats;
    if (availableSeats <= 0) {
      toast.error("Workshop vol", {
        description: "Deze workshop is helaas al volgeboekt.",
      });
      return;
    }

    // Redirect to contact page with workshop pre-filled
    toast.success("Doorverwijzen naar aanmeldformulier...");
    router.push(`/contact?workshop=${workshopId}`);
  };

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto max-w-6xl px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <IconChefHat className="text-primary size-16" />
            </div>
            <h1 className="text-5xl leading-tight font-bold tracking-tight">
              Open Kookworkshops
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed">
              Doe mee aan één van onze open kookworkshops in Nijmegen, Arnhem of
              Amersfoort. Leer nieuwe gerechten maken in een gezellige groep!
            </p>
          </div>

          {/* Info Cards - Centered */}
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="mb-2 flex justify-center">
                  <IconUsers className="text-primary size-8" />
                </div>
                <CardTitle className="text-lg">Kleine Groepen</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Maximaal 12-15 personen per workshop voor persoonlijke
                  begeleiding
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mb-2 flex justify-center">
                  <IconClock className="text-primary size-8" />
                </div>
                <CardTitle className="text-lg">3 Uur Koken</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Hands-on kookervaring met professionele begeleiding en alle
                  ingrediënten
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mb-2 flex justify-center">
                  <IconChefHat className="text-primary size-8" />
                </div>
                <CardTitle className="text-lg">Alles Inclusief</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Ingrediënten, recepten, schort en natuurlijk het eten dat je
                  maakt!
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Workshops List */}
          <div className="space-y-8">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Aankomende Workshops
            </h2>

            <div className="grid gap-8">
              {OPEN_WORKSHOPS.map((workshop) => {
                const availableSeats =
                  workshop.totalSeats - workshop.bookedSeats;
                const isAlmostFull = availableSeats <= 3 && availableSeats > 0;
                const isFull = availableSeats <= 0;

                return (
                  <Card key={workshop.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">
                            {workshop.title}
                          </CardTitle>
                          <CardDescription>
                            {workshop.description}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            €{workshop.price.toFixed(2)}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            per persoon
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Workshop Details */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                          <IconCalendar className="text-muted-foreground size-4" />
                          <span>{workshop.dateDisplay}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IconClock className="text-muted-foreground size-4" />
                          <span>
                            {workshop.time} ({workshop.duration})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IconMapPin className="text-muted-foreground size-4" />
                          <span>{workshop.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IconUsers className="text-muted-foreground size-4" />
                          <span>
                            {availableSeats} van {workshop.totalSeats} plaatsen
                            beschikbaar
                          </span>
                          {isAlmostFull && (
                            <Badge variant="secondary" className="ml-auto">
                              Bijna vol
                            </Badge>
                          )}
                          {isFull && (
                            <Badge variant="destructive" className="ml-auto">
                              Volgeboekt
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Menu */}
                      <div className="space-y-2">
                        <h4 className="font-semibold">Wat ga je maken:</h4>
                        <ul className="text-muted-foreground space-y-1 text-sm">
                          {workshop.menu.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Address */}
                      <div className="border-t pt-4">
                        <p className="text-muted-foreground text-sm">
                          <strong>Locatie:</strong> {workshop.address}
                        </p>
                      </div>

                      {/* Booking Button */}
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => handleBooking(workshop.id)}
                        disabled={isFull}
                      >
                        {isFull ? "Volgeboekt" : "Aanmelden voor deze workshop"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Help Section */}
          <Card className="mx-auto max-w-3xl text-center">
            <CardHeader>
              <CardTitle className="text-xl">Vragen?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-base">
                Heb je vragen over een workshop of wil je een privé kookworkshop
                organiseren?{" "}
                <a
                  href="/contact"
                  className="text-primary font-semibold underline"
                >
                  Neem contact op
                </a>{" "}
                of bel ons op 024-1234567.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
