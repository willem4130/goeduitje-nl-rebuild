"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
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
  IconSparkles,
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
 * Compact calendar-style view with integrated booking form and Stripe payment
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
    if (numPeople < 1 || numPeople > 12) {
      toast.error("Ongeldig aantal personen", {
        description: "Kies tussen 1 en 12 personen.",
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
        // TODO: In production, you would send this data to your backend
        // to process the booking without payment
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
      {/* Hero Section with Amber/Orange Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-transparent" />
        </div>

        <div className="relative py-12">
          <div className="container mx-auto max-w-5xl px-6 lg:px-8">
            <ScrollReveal animation="slideUp" amount={0.3}>
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 p-3">
                    <IconChefHat className="size-8 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <IconSparkles className="mr-1 size-3" />
                    Particulieren
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-amber-300 text-amber-700"
                  >
                    €{PRICE_PER_PERSON} p.p.
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-amber-900 sm:text-4xl">
                  Open Kookworkshop Inschrijving
                </h1>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-amber-700">
                  Schrijf je in voor een van onze open kookworkshops in
                  Nijmegen. Perfect voor individuelen, koppels of kleine
                  groepjes!
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* USP Cards */}
      <section className="bg-gradient-to-b from-amber-50/50 to-transparent py-6">
        <div className="container mx-auto max-w-5xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp" delay={0.1} amount={0.3}>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: IconUsers,
                  title: "Kleine Groepen",
                  description: "Max 12 deelnemers voor persoonlijke aandacht",
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
                  className="rounded-xl border border-amber-200 bg-white/80 p-4 text-center shadow-sm"
                >
                  <item.icon className="mx-auto mb-2 size-6 text-amber-600" />
                  <h3 className="font-semibold text-amber-900">{item.title}</h3>
                  <p className="text-sm text-amber-700">{item.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto max-w-5xl px-6 lg:px-8">
          <div className="space-y-8">
            {/* Calendar Grid - Amber Theme */}
            <ScrollReveal animation="slideUp" delay={0.1} amount={0.2}>
              <Card className="border-amber-200 shadow-lg">
                <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="text-amber-900">
                    Kies een datum *
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    Selecteer een datum voor de kookworkshop
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {OPEN_WORKSHOPS.map((workshop) => {
                      const isSelected = selectedWorkshop === workshop.id;
                      const isLowSeats = workshop.availableSeats <= 3;

                      return (
                        <button
                          key={workshop.id}
                          onClick={() => setSelectedWorkshop(workshop.id)}
                          className={cn(
                            "group relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all duration-200 hover:shadow-md",
                            isSelected
                              ? "border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md"
                              : "border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-50/50"
                          )}
                        >
                          {/* Selected Indicator */}
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500">
                                <IconCheck className="size-4 text-white" />
                              </div>
                            </div>
                          )}

                          {/* Date Display */}
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold tracking-wider text-amber-600 uppercase">
                              {workshop.month}
                            </span>
                            <span
                              className={cn(
                                "text-3xl font-bold tracking-tight",
                                isSelected ? "text-amber-700" : "text-gray-900"
                              )}
                            >
                              {workshop.dayNumber}
                            </span>
                            <span className="text-sm font-medium text-amber-600">
                              {workshop.dayName}
                            </span>
                          </div>

                          {/* Time */}
                          <div
                            className={cn(
                              "text-sm font-medium",
                              isSelected ? "text-amber-700" : "text-gray-600"
                            )}
                          >
                            {workshop.time}
                          </div>

                          {/* Availability Badge */}
                          {isLowSeats && (
                            <Badge className="absolute bottom-2 left-2 border-orange-200 bg-orange-100 text-xs text-orange-700">
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
              <Card className="shadow-lg">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle>Jouw gegevens</CardTitle>
                  <CardDescription>
                    Vul je gegevens in om je aan te melden
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
                      <Label htmlFor="numberOfPeople">Aantal personen *</Label>
                      <Input
                        id="numberOfPeople"
                        type="number"
                        min="1"
                        max="12"
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
                    <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
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
                          <IconGift className="size-5 text-amber-600" />
                          Ik heb een cadeaubon
                        </Label>
                      </div>

                      {hasGiftCard && (
                        <div className="grid gap-4 pt-2 pl-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="giftCardId">Cadeaubon code *</Label>
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
                              onChange={(e) => setGiftCardValue(e.target.value)}
                              required={hasGiftCard}
                            />
                          </div>
                        </div>
                      )}

                      {/* Price Summary */}
                      {totalPrice > 0 && (
                        <div className="space-y-2 rounded-md border border-amber-100 bg-white p-3 text-sm">
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
                              <div className="flex items-center justify-between border-t border-amber-200 pt-2 text-base font-semibold">
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

                    {/* Submit Button with Payment */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                      disabled={!selectedWorkshop || isSubmitting}
                    >
                      {isSubmitting ? (
                        "Laden..."
                      ) : selectedWorkshop && totalPrice > 0 ? (
                        remainingAmount === 0 ? (
                          <>
                            <IconCheck className="mr-2 size-5" />
                            Rond aanmelding af (volledig betaald met cadeaubon)
                          </>
                        ) : hasGiftCard && remainingAmount < totalPrice ? (
                          <>
                            <IconCreditCard className="mr-2 size-5" />
                            Betaal restbedrag van €{remainingAmount.toFixed(2)}
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

            {/* Contact CTA */}
            <ScrollReveal animation="slideUp" delay={0.3} amount={0.3}>
              <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100 p-6 text-center">
                <h3 className="mb-2 text-lg font-semibold text-amber-900">
                  Vragen over de workshop?
                </h3>
                <p className="mb-4 text-amber-700">
                  We helpen je graag! Neem gerust contact met ons op.
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    asChild
                  >
                    <Link href="/contact">Contact opnemen</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    asChild
                  >
                    <Link href="/onze-uitjes/kookworkshop">
                      Meer over de workshop
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
