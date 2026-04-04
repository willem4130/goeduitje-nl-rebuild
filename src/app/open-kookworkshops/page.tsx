"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  IconChefHat,
  IconCheck,
  IconUsers,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/client";
import { OPEN_WORKSHOP_PRICE } from "@/lib/open-workshops";
import { ScrollReveal } from "@/components/scroll-reveal";

/**
 * Open cooking workshop booking page
 * Consistent with site-wide design patterns
 */

export default function BookingPage() {
  const createBooking = api.booking.create.useMutation();
  const { data: workshops = [], isLoading: isLoadingWorkshops } =
    api.openSessions.getUpcoming.useQuery();
  const PRICE_PER_PERSON = workshops[0]?.pricePerPerson ?? OPEN_WORKSHOP_PRICE;
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [dietaryRequirement, setDietaryRequirement] = useState("geen");
  const [allergies, setAllergies] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateCollapsed, setDateCollapsed] = useState(false);
  const dateCardRef = useRef<HTMLDivElement>(null);

  const handleSelectDate = useCallback((id: string) => {
    setSelectedWorkshop(id);
    setDateCollapsed(true);
    // Scroll so the collapsed date card + form are visible together
    setTimeout(() => {
      dateCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }, []);

  // Calculate total price (informational only — payment handled offline by admin)
  const totalPrice = numberOfPeople
    ? parseInt(numberOfPeople) * PRICE_PER_PERSON
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWorkshop) {
      toast.error("Selecteer een datum", {
        description: "Kies eerst een datum voor de workshop.",
      });
      return;
    }

    if (!firstName || !lastName || !email || !numberOfPeople) {
      toast.error("Vul alle verplichte velden in", {
        description: "Naam, e-mail en aantal personen zijn verplicht.",
      });
      return;
    }

    const numPeople = parseInt(numberOfPeople);
    if (numPeople < 1 || numPeople > 15) {
      toast.error("Ongeldig aantal personen", {
        description: "Kies tussen 1 en 15 personen.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const workshop = workshops.find((w) => w.id === selectedWorkshop);

      // Save booking (for capacity tracking) + creates WorkshopRequest (for CRM pipeline)
      await createBooking.mutateAsync({
        sessionId: selectedWorkshop,
        workshopId: selectedWorkshop,
        workshopDate: workshop?.dateDisplay || "",
        firstName,
        lastName,
        email,
        numberOfPeople: numPeople,
        dietaryRequirement,
        allergies: allergies || undefined,
        totalPrice,
        remainingAmount: totalPrice,
        paymentStatus: "pending",
        paymentMethod: "overschrijving per bank",
      });

      // Send confirmation email
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "booking-confirmation",
            to: email,
            data: {
              firstName,
              lastName,
              workshopDate: workshop?.dateDisplay || "",
              numberOfPeople: numPeople,
              totalPrice,
              paymentMethod: "overschrijving per bank",
              location: workshop?.location || "Nijmegen",
              dietaryRequirement,
              allergies: allergies || undefined,
            },
          }),
        });
      } catch {
        // Email failed but booking was saved
      }

      toast.success("Aanmelding ontvangen!", {
        description:
          "Je ontvangt een bevestigingsmail. We nemen contact op over de betaling.",
      });

      // Reset form
      setSelectedWorkshop(null);
      setDateCollapsed(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setNumberOfPeople("");
      setDietaryRequirement("geen");
      setAllergies("");
      setIsSubmitting(false);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Er is iets misgegaan", {
        description:
          "We konden de aanmelding niet verwerken. Probeer het opnieuw.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col pt-20">
      {/* Hero Section - Same as onze-uitjes */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="from-primary/10 via-primary/5 absolute inset-0 bg-gradient-to-br to-transparent" />
        </div>

        <div className="relative py-8">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal animation="slideUp" amount={0.3}>
              <div className="mx-auto max-w-4xl space-y-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="bg-primary/10 rounded-full p-3">
                    <IconChefHat className="text-primary size-8" />
                  </div>
                </div>
                <h1 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">
                  Open Kookworkshop Inschrijving
                </h1>
                <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
                  Schrijf je in voor een van onze open kookworkshops in
                  Nijmegen. Perfect voor individuelen, koppels of kleine
                  groepjes!
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    €{PRICE_PER_PERSON} p.p.
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    Inclusief diner
                  </Badge>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* USP Cards - Same styling as onze-uitjes */}
      <section className="py-6">
        <div className="container mx-auto max-w-5xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp" delay={0.1} amount={0.3}>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: IconUsers,
                  title: "Kleine Groepen",
                  description:
                    "t/m 15 deelnemers voor persoonlijke begeleiding",
                },
                {
                  icon: IconMapPin,
                  title: "Locatie Nijmegen",
                  description: "Gezellige kookstudio in het centrum",
                },
                {
                  icon: IconClock,
                  title: "2,5 uur koken",
                  description: "Inclusief eten van je eigen creaties",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border-primary/10 bg-primary/5 rounded-xl border p-4 text-center"
                >
                  <item.icon className="text-primary mx-auto mb-2 size-6" />
                  <h3 className="text-primary mb-1 font-bold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-snug">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mobile-only: compact included items */}
      <div className="container mx-auto max-w-7xl px-6 py-4 lg:hidden">
        <div className="flex flex-wrap gap-2">
          {["Begeleiding", "Ingrediënten", "Recepten", "Diner", "Drankjes"].map(
            (item) => (
              <span
                key={item}
                className="bg-primary/5 text-primary rounded-full px-3 py-1 text-xs font-medium"
              >
                ✓ {item}
              </span>
            )
          )}
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <section className="bg-muted/30 py-8">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Date Selection */}
              <div ref={dateCardRef} className="scroll-mt-24" />
              <ScrollReveal animation="slideUp" delay={0.1} amount={0.2}>
                <Card className="shadow-editorial">
                  <CardHeader>
                    <CardTitle className="text-primary">
                      Kies een datum *
                    </CardTitle>
                    {!dateCollapsed && (
                      <CardDescription>
                        Selecteer een datum voor de kookworkshop
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isLoadingWorkshops ? (
                      <div className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground text-sm">
                          Data laden...
                        </p>
                      </div>
                    ) : dateCollapsed && selectedWorkshop ? (
                      /* Collapsed: show selected date summary */
                      (() => {
                        const selected = workshops.find(
                          (w) => w.id === selectedWorkshop
                        );
                        if (!selected) return null;
                        return (
                          <button
                            onClick={() => setDateCollapsed(false)}
                            className="border-primary bg-primary/5 hover:bg-primary/10 flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all duration-200"
                          >
                            <div className="bg-primary flex size-5 shrink-0 items-center justify-center rounded-full">
                              <IconCheck className="text-primary-foreground size-3" />
                            </div>
                            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                              <div className="flex items-baseline gap-2">
                                <span className="text-primary text-sm font-semibold">
                                  {selected.dateDisplay}{" "}
                                  {selected.date.split("-")[0]}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  {selected.time}
                                </span>
                              </div>
                              <span className="text-primary text-xs font-medium">
                                Wijzig
                              </span>
                            </div>
                          </button>
                        );
                      })()
                    ) : (
                      /* Expanded: show full date list grouped by month */
                      <div className="space-y-6">
                        {(() => {
                          const MONTH_NAMES_FULL: Record<string, string> = {
                            JAN: "Januari",
                            FEB: "Februari",
                            MRT: "Maart",
                            APR: "April",
                            MEI: "Mei",
                            JUN: "Juni",
                            JUL: "Juli",
                            AUG: "Augustus",
                            SEP: "September",
                            OKT: "Oktober",
                            NOV: "November",
                            DEC: "December",
                          };
                          const grouped: {
                            label: string;
                            items: typeof workshops;
                          }[] = [];
                          for (const w of workshops) {
                            const year = w.date.split("-")[0];
                            const label = `${MONTH_NAMES_FULL[w.month] ?? w.month} ${year}`;
                            const existing = grouped.find(
                              (g) => g.label === label
                            );
                            if (existing) {
                              existing.items.push(w);
                            } else {
                              grouped.push({ label, items: [w] });
                            }
                          }
                          return grouped.map((group) => (
                            <div key={group.label}>
                              <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                                {group.label}
                              </h3>
                              <div className="space-y-2">
                                {group.items.map((workshop) => {
                                  const isSelected =
                                    selectedWorkshop === workshop.id;
                                  const isFull =
                                    workshop.isFull ||
                                    workshop.availableSeats === 0;
                                  const isLowSeats =
                                    !isFull &&
                                    workshop.availableSeats > 0 &&
                                    workshop.availableSeats <= 3;

                                  return (
                                    <button
                                      key={workshop.id}
                                      onClick={() =>
                                        !isFull && handleSelectDate(workshop.id)
                                      }
                                      disabled={isFull}
                                      className={cn(
                                        "flex w-full items-center gap-4 rounded-lg border-2 px-4 py-3 text-left transition-all duration-200",
                                        isFull
                                          ? "border-border bg-muted/50 cursor-not-allowed opacity-60"
                                          : isSelected
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                                      )}
                                    >
                                      {/* Radio indicator */}
                                      <div
                                        className={cn(
                                          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                          isFull
                                            ? "border-muted-foreground/30"
                                            : isSelected
                                              ? "border-primary bg-primary"
                                              : "border-muted-foreground/40"
                                        )}
                                      >
                                        {isSelected && !isFull && (
                                          <IconCheck className="text-primary-foreground size-3" />
                                        )}
                                      </div>

                                      {/* Date + time */}
                                      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                                        <div className="flex items-baseline gap-2">
                                          <span
                                            className={cn(
                                              "text-sm font-semibold",
                                              isFull
                                                ? "text-muted-foreground"
                                                : isSelected
                                                  ? "text-primary"
                                                  : "text-foreground"
                                            )}
                                          >
                                            {workshop.dateDisplay}{" "}
                                            {workshop.date.split("-")[0]}
                                          </span>
                                          <span className="text-muted-foreground text-sm">
                                            {workshop.time}
                                          </span>
                                        </div>

                                        {/* Status badges */}
                                        <div className="flex shrink-0 items-center gap-2">
                                          {isFull && (
                                            <Badge
                                              variant="destructive"
                                              className="text-xs"
                                            >
                                              Volgeboekt
                                            </Badge>
                                          )}
                                          {isLowSeats && (
                                            <Badge
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              Nog {workshop.availableSeats}{" "}
                                              plekken
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Booking Form */}
              <ScrollReveal animation="slideUp" delay={0.2} amount={0.2}>
                <Card className="shadow-editorial">
                  <CardHeader>
                    <CardTitle className="text-primary">
                      Jouw gegevens
                    </CardTitle>
                    <CardDescription>
                      Vul je gegevens in om je aan te melden
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name Fields */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Voornaam *</Label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Voornaam"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Achternaam *</Label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Achternaam"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mailadres *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="je@email.nl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      {/* Number of People */}
                      <div className="space-y-2">
                        <Label htmlFor="numberOfPeople">
                          Aantal personen *
                        </Label>
                        <Input
                          id="numberOfPeople"
                          type="number"
                          min="1"
                          max="15"
                          placeholder="Bijvoorbeeld: 2"
                          value={numberOfPeople}
                          onChange={(e) => setNumberOfPeople(e.target.value)}
                          required
                        />
                      </div>

                      {/* Dietary Requirements and Allergies */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Dietary Requirements */}
                        <div className="space-y-3">
                          <Label>Dieetwensen *</Label>
                          <RadioGroup
                            value={dietaryRequirement}
                            onValueChange={setDietaryRequirement}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="geen" id="geen" />
                              <Label htmlFor="geen" className="font-normal">
                                Geen
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="vegetarisch"
                                id="vegetarisch"
                              />
                              <Label
                                htmlFor="vegetarisch"
                                className="font-normal"
                              >
                                Vegetarisch
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="veganistisch"
                                id="veganistisch"
                              />
                              <Label
                                htmlFor="veganistisch"
                                className="font-normal"
                              >
                                Veganistisch
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Allergies */}
                        <div className="space-y-2">
                          <Label htmlFor="allergies">Allergieën</Label>
                          <Textarea
                            id="allergies"
                            placeholder="Bijvoorbeeld: noten, gluten, lactose..."
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>

                      {/* Price Info */}
                      {totalPrice > 0 && (
                        <div className="bg-muted/50 border-border rounded-lg border p-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {numberOfPeople}{" "}
                              {parseInt(numberOfPeople) === 1
                                ? "persoon"
                                : "personen"}{" "}
                              x €{PRICE_PER_PERSON}
                            </span>
                            <span className="text-lg font-semibold">
                              €{totalPrice.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-1 text-xs">
                            Betaling wordt na aanmelding geregeld via Guus.
                          </p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={!selectedWorkshop || isSubmitting}
                      >
                        {isSubmitting ? (
                          "Laden..."
                        ) : selectedWorkshop && totalPrice > 0 ? (
                          <>
                            <IconCheck className="mr-2 size-5" />
                            Aanmelden voor open kookworkshop
                          </>
                        ) : (
                          "Selecteer eerst een datum en aantal personen"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Right Column - Sidebar */}
            <ScrollReveal animation="slideUp" delay={0.2} amount={0.2}>
              <div className="space-y-6 lg:sticky lg:top-24">
                {/* Workshop Preview Image */}
                <Card className="shadow-editorial overflow-hidden">
                  <div className="bg-muted relative aspect-[4/3]">
                    <Image
                      src="/images/workshops/open-kookworkshop.jpg"
                      alt="Open Kookworkshop"
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute right-4 bottom-4 left-4 text-white">
                      <h3 className="mb-1 text-lg font-bold">
                        Open Kookworkshop
                      </h3>
                      <p className="text-sm opacity-90">
                        Kook samen met andere enthousiastelingen
                      </p>
                    </div>
                  </div>
                </Card>

                {/* What's Included */}
                <Card className="shadow-editorial">
                  <CardHeader>
                    <CardTitle className="text-primary text-lg">
                      Wat krijg je?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Professionele begeleiding door ervaren kok",
                      "Alle ingrediënten en materialen",
                      "Recepten om mee naar huis te nemen",
                      "Diner van je eigen creaties",
                      "Drankjes tijdens het koken",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <IconCheck className="text-primary mt-0.5 size-4 shrink-0" />
                        <span className="text-muted-foreground text-sm">
                          {item}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Questions CTA */}
                <Card className="border-primary/10 bg-primary/5 shadow-editorial">
                  <CardContent className="p-4 text-center">
                    <h3 className="text-primary mb-2 font-semibold">Vragen?</h3>
                    <p className="text-muted-foreground mb-3 text-sm">
                      Neem gerust contact met ons op.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/contact">Contact opnemen</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/kookworkshop">Meer info</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
