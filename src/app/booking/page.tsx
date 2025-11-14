"use client";

import { useState } from "react";
import { toast } from "sonner";
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
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { STRIPE_PRODUCTS } from "@/lib/stripe-products";

/**
 * Open cooking workshop booking page
 * Compact calendar-style view with integrated booking form and Stripe payment
 */

interface Workshop {
  id: string;
  date: string;
  dateDisplay: string;
  dayName: string;
  dayNumber: string;
  month: string;
  time: string;
  availableSeats: number;
}

// Exact dates from the Goeduitje booking form
const OPEN_WORKSHOPS: Workshop[] = [
  {
    id: "nov-30",
    date: "2024-11-30",
    dateDisplay: "Zondag 30 november",
    dayName: "ZO",
    dayNumber: "30",
    month: "NOV",
    time: "10:00 - 12:30",
    availableSeats: 12,
  },
  {
    id: "jan-25",
    date: "2025-01-25",
    dateDisplay: "Zondag 25 januari",
    dayName: "ZO",
    dayNumber: "25",
    month: "JAN",
    time: "14:00 - 16:30",
    availableSeats: 8,
  },
  {
    id: "feb-22",
    date: "2025-02-22",
    dateDisplay: "Zondag 22 februari",
    dayName: "ZO",
    dayNumber: "22",
    month: "FEB",
    time: "10:00 - 12:30",
    availableSeats: 12,
  },
  {
    id: "mrt-08",
    date: "2025-03-08",
    dateDisplay: "Zondag 8 maart",
    dayName: "ZO",
    dayNumber: "08",
    month: "MRT",
    time: "14:00 - 16:30",
    availableSeats: 10,
  },
  {
    id: "mrt-29",
    date: "2025-03-29",
    dateDisplay: "Zondag 29 maart",
    dayName: "ZO",
    dayNumber: "29",
    month: "MRT",
    time: "14:00 - 16:30",
    availableSeats: 12,
  },
  {
    id: "apr-19",
    date: "2025-04-19",
    dateDisplay: "Zondag 19 april",
    dayName: "ZO",
    dayNumber: "19",
    month: "APR",
    time: "14:00 - 16:30",
    availableSeats: 12,
  },
  {
    id: "mei-31",
    date: "2025-05-31",
    dateDisplay: "Zondag 31 mei",
    dayName: "ZO",
    dayNumber: "31",
    month: "MEI",
    time: "14:00 - 16:30",
    availableSeats: 12,
  },
];

const PRICE_PER_PERSON = 50; // €50 per person

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
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto max-w-5xl px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <IconChefHat className="text-primary size-12" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Schrijf je in voor de open kookworkshop
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
              Ik schrijf me in voor de open kookworkshop in Nijmegen op
            </p>
          </div>

          {/* Calendar Grid - Compact View */}
          <Card>
            <CardHeader>
              <CardTitle>Datum *</CardTitle>
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
                        "group hover:border-primary relative flex flex-col items-center gap-3 rounded-lg border-2 p-4 text-center transition-all duration-200 hover:shadow-md",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:bg-accent/50"
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
                        <span className="text-3xl font-bold tracking-tight">
                          {workshop.dayNumber}
                        </span>
                        <span className="text-muted-foreground text-sm font-medium">
                          {workshop.dayName}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="text-sm font-medium">{workshop.time}</div>

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

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Jouw gegevens</CardTitle>
              <CardDescription>
                Vul je naam en e-mailadres in om je aan te melden
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
                        <RadioGroupItem value="vegetarisch" id="vegetarisch" />
                        <Label htmlFor="vegetarisch" className="font-normal">
                          Vegetarisch
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="veganistisch"
                          id="veganistisch"
                        />
                        <Label htmlFor="veganistisch" className="font-normal">
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
                <div className="border-border bg-muted/30 space-y-4 rounded-lg border p-4">
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
                    <div className="bg-background space-y-2 rounded-md p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Totaal:</span>
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
                          <div className="border-border flex items-center justify-between border-t pt-2 text-base font-semibold">
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
                  className="w-full"
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
                        Betaal €{totalPrice.toFixed(2)} en rond aanmelding af
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

          {/* Contact */}
          <Card className="mx-auto max-w-2xl text-center">
            <CardHeader>
              <CardTitle className="text-lg">Vragen?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Heb je vragen over de workshop?{" "}
                <a
                  href="/contact"
                  className="text-primary font-semibold underline"
                >
                  Neem contact op
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
