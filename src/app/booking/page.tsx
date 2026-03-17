"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  IconChefHat,
  IconCheck,
  IconCreditCard,
  IconGift,
  IconUsers,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { STRIPE_PRODUCTS } from "@/lib/stripe-products";
import {
  getUpcomingWorkshops,
  OPEN_WORKSHOP_PRICE,
} from "@/lib/open-workshops";
import { ScrollReveal } from "@/components/scroll-reveal";

/**
 * Open cooking workshop booking page
 * Consistent with site-wide design patterns
 */

// Get upcoming workshops from shared data source
const OPEN_WORKSHOPS = getUpcomingWorkshops();
const PRICE_PER_PERSON = OPEN_WORKSHOP_PRICE;

export default function BookingPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [dietaryRequirement, setDietaryRequirement] = useState("geen");
  const [allergies, setAllergies] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gift card state
  const [hasGiftCard, setHasGiftCard] = useState(false);
  const [giftCardId, setGiftCardId] = useState("");
  const [giftCardValue, setGiftCardValue] = useState("");

  // Calculate total price
  const totalPrice = numberOfPeople
    ? parseInt(numberOfPeople) * PRICE_PER_PERSON
    : 0;

  // Calculate remaining amount after gift card
  const giftCardAmount =
    hasGiftCard && giftCardValue ? parseFloat(giftCardValue) : 0;
  const remainingAmount = Math.max(0, totalPrice - giftCardAmount);

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

    // Validate gift card fields if gift card is selected
    if (hasGiftCard) {
      if (!giftCardId || !giftCardValue) {
        toast.error("Vul de cadeaubon gegevens in", {
          description: "Zowel de cadeaubon code als de waarde zijn verplicht.",
        });
        return;
      }

      const giftValue = parseFloat(giftCardValue);
      if (isNaN(giftValue) || giftValue <= 0) {
        toast.error("Ongeldige cadeaubon waarde", {
          description: "Voer een geldige waarde in (bijv. 25 of 50).",
        });
        return;
      }
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
      const workshop = OPEN_WORKSHOPS.find((w) => w.id === selectedWorkshop);

      // If gift card covers full amount, skip Stripe
      if (hasGiftCard && remainingAmount <= 0) {
        toast.success("Boeking succesvol!", {
          description:
            "Je cadeaubon dekt de volledige kosten. Je ontvangt een bevestigingsmail.",
        });
        console.log("Full gift card payment:", {
          workshopId: selectedWorkshop,
          workshopDate: workshop?.dateDisplay,
          firstName,
          lastName,
          email,
          numberOfPeople: numPeople,
          dietaryRequirement,
          allergies,
          giftCardId,
          giftCardValue: giftCardAmount,
          totalPrice,
        });
        setIsSubmitting(false);
        return;
      }

      // Create Stripe checkout session for remaining amount
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: STRIPE_PRODUCTS.COOKING_WORKSHOP.priceId,
          quantity: numPeople,
          metadata: {
            workshopId: selectedWorkshop,
            workshopDate: workshop?.dateDisplay,
            firstName,
            lastName,
            email,
            numberOfPeople: numPeople,
            dietaryRequirement,
            allergies,
            hasGiftCard,
            giftCardId: hasGiftCard ? giftCardId : undefined,
            giftCardValue: hasGiftCard ? giftCardAmount : undefined,
            totalPrice,
            remainingAmount,
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Er is iets misgegaan", {
        description: "We konden de betaling niet starten. Probeer het opnieuw.",
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
              {/* Calendar Grid */}
              <ScrollReveal animation="slideUp" delay={0.1} amount={0.2}>
                <Card className="shadow-editorial">
                  <CardHeader>
                    <CardTitle className="text-primary">
                      Kies een datum *
                    </CardTitle>
                    <CardDescription>
                      Selecteer een datum voor de kookworkshop
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {OPEN_WORKSHOPS.map((workshop) => {
                        const isSelected = selectedWorkshop === workshop.id;
                        const isLowSeats = workshop.availableSeats <= 3;

                        return (
                          <button
                            key={workshop.id}
                            onClick={() => setSelectedWorkshop(workshop.id)}
                            className={cn(
                              "group relative flex flex-col items-center gap-3 rounded-lg border-2 p-4 text-center transition-all duration-200 hover:shadow-md",
                              isSelected
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                            )}
                          >
                            {/* Selected Indicator */}
                            {isSelected && (
                              <div className="absolute top-2 right-2">
                                <div className="bg-primary flex size-6 items-center justify-center rounded-full">
                                  <IconCheck className="text-primary-foreground size-4" />
                                </div>
                              </div>
                            )}

                            {/* Date Display */}
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                {workshop.month}
                              </span>
                              <span
                                className={cn(
                                  "text-3xl font-bold tracking-tight",
                                  isSelected
                                    ? "text-primary"
                                    : "text-foreground"
                                )}
                              >
                                {workshop.dayNumber}
                              </span>
                              <span className="text-muted-foreground text-sm font-medium">
                                {workshop.dayName}
                              </span>
                            </div>

                            {/* Time */}
                            <div
                              className={cn(
                                "text-sm font-medium",
                                isSelected
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            >
                              {workshop.time}
                            </div>

                            {/* Availability Badge */}
                            {isLowSeats && (
                              <Badge
                                variant="secondary"
                                className="absolute bottom-2 left-2 text-xs"
                              >
                                Nog {workshop.availableSeats} plekken
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
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

                      {/* Gift Card Section */}
                      <div className="border-border bg-muted/50 space-y-4 rounded-lg border p-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasGiftCard"
                            checked={hasGiftCard}
                            onCheckedChange={(checked) => {
                              setHasGiftCard(checked as boolean);
                              if (!checked) {
                                setGiftCardId("");
                                setGiftCardValue("");
                              }
                            }}
                          />
                          <Label
                            htmlFor="hasGiftCard"
                            className="flex items-center gap-2 text-base leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <IconGift className="text-primary size-5" />
                            Ik heb een cadeaubon
                          </Label>
                        </div>

                        {hasGiftCard && (
                          <div className="grid gap-4 pt-2 pl-6 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="giftCardId">
                                Cadeaubon code *
                              </Label>
                              <Input
                                id="giftCardId"
                                type="text"
                                placeholder="Bijvoorbeeld: GOEDUITJE-2024-ABC"
                                value={giftCardId}
                                onChange={(e) => setGiftCardId(e.target.value)}
                                required={hasGiftCard}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="giftCardValue">
                                Waarde cadeaubon (€) *
                              </Label>
                              <Input
                                id="giftCardValue"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Bijvoorbeeld: 50"
                                value={giftCardValue}
                                onChange={(e) =>
                                  setGiftCardValue(e.target.value)
                                }
                                required={hasGiftCard}
                              />
                            </div>
                          </div>
                        )}

                        {/* Price Summary */}
                        {totalPrice > 0 && (
                          <div className="bg-background space-y-2 rounded-md border p-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Totaal:
                              </span>
                              <span className="font-medium">
                                €{totalPrice.toFixed(2)}
                              </span>
                            </div>
                            {hasGiftCard && giftCardAmount > 0 && (
                              <>
                                <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                                  <span>Cadeaubon:</span>
                                  <span className="font-medium">
                                    -€{giftCardAmount.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
                                  <span>Te betalen:</span>
                                  <span
                                    className={
                                      remainingAmount === 0
                                        ? "text-green-600 dark:text-green-400"
                                        : ""
                                    }
                                  >
                                    €{remainingAmount.toFixed(2)}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>

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
                          remainingAmount === 0 ? (
                            <>
                              <IconCheck className="mr-2 size-5" />
                              Rond aanmelding af (volledig betaald met
                              cadeaubon)
                            </>
                          ) : hasGiftCard && remainingAmount < totalPrice ? (
                            <>
                              <IconCreditCard className="mr-2 size-5" />
                              Betaal restbedrag van €
                              {remainingAmount.toFixed(2)}
                            </>
                          ) : (
                            <>
                              <IconCreditCard className="mr-2 size-5" />
                              Betaal €{totalPrice.toFixed(2)} en rond aanmelding
                              af
                            </>
                          )
                        ) : (
                          "Selecteer eerst een datum en aantal personen"
                        )}
                      </Button>

                      {remainingAmount > 0 && (
                        <p className="text-muted-foreground text-center text-sm">
                          Je wordt doorgestuurd naar een beveiligde Stripe
                          betalingspagina
                        </p>
                      )}
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
                      src="/images/workshops/kookworkshop.jpg"
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
                        <Link href="/onze-uitjes/kookworkshop">Meer info</Link>
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
