"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconLoader2,
  IconSend,
  IconUsers,
  IconMapPin,
  IconCalendar,
  IconClock,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  workshopConfigSchema,
  type WorkshopConfigValues,
} from "@/lib/validations/forms";
import {
  WORKSHOPS,
  getWorkshopPrice,
  calculateEstimatedPrice,
} from "@/lib/constants/cities";
import { api } from "@/trpc/client";

const STEPS = [
  { number: 1, title: "Configureren", description: "Uitje details" },
  { number: 2, title: "Afronden", description: "Contact & bevestiging" },
];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function WorkshopConfigurator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const createWorkshop = api.workshop.create.useMutation();

  const form = useForm({
    resolver: zodResolver(workshopConfigSchema),
    defaultValues: {
      type: "particulier" as const,
      participantCount: 10,
      workshops: [] as string[],
      location: "Nijmegen" as const,
      customCity: "",
      date: "",
      dateTbd: false,
      time: "",
      timeTbd: false,
      duration: 2,
      companyName: "",
      btwNumber: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const type = form.watch("type");
  const participantCount = form.watch("participantCount");
  const selectedWorkshops = form.watch("workshops");
  const location = form.watch("location");
  const dateTbd = form.watch("dateTbd");
  const timeTbd = form.watch("timeTbd");

  // Filter out workshops that don't meet participant requirements
  useEffect(() => {
    if (participantCount && selectedWorkshops.length > 0) {
      const validWorkshops = selectedWorkshops.filter((workshopId) => {
        const workshop = WORKSHOPS.find((w) => w.id === workshopId);
        return workshop && participantCount >= workshop.minParticipants;
      });

      if (validWorkshops.length !== selectedWorkshops.length) {
        form.setValue("workshops", validWorkshops);
        toast.info("Sommige uitjes zijn verwijderd", {
          description:
            "Deze uitjes vereisen minimaal 6 deelnemers en zijn daarom verwijderd uit je selectie.",
        });
      }
    }
  }, [participantCount, selectedWorkshops, form]);

  // Clear date/time when TBD is checked
  useEffect(() => {
    if (dateTbd) form.setValue("date", "");
  }, [dateTbd, form]);

  useEffect(() => {
    if (timeTbd) form.setValue("time", "");
  }, [timeTbd, form]);

  // Validate current step before proceeding
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof WorkshopConfigValues)[] = [];

    switch (step) {
      case 1:
        // Validate all configuration fields
        fieldsToValidate = [
          "type",
          "participantCount",
          "workshops",
          "location",
          "duration",
        ];
        if (type === "zakelijk") {
          fieldsToValidate.push("companyName");
        }
        if (location === "other") fieldsToValidate.push("customCity");
        if (!dateTbd) fieldsToValidate.push("date");
        if (!timeTbd) fieldsToValidate.push("time");
        break;
      case 2:
        // Validate contact fields
        fieldsToValidate = ["name", "email"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  async function onSubmit(data: WorkshopConfigValues) {
    setIsLoading(true);

    try {
      const workshopConfig = await createWorkshop.mutateAsync(data);

      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "workshop-confirmation",
          to: data.email,
          data: {
            name: data.name,
            workshopId: workshopConfig.id,
            workshops: data.workshops,
            participantCount: data.participantCount,
            location:
              data.location === "other" ? data.customCity : data.location,
            date: data.dateTbd ? "Nog te bepalen" : data.date,
            time: data.timeTbd ? "Nog te bepalen" : data.time,
            duration: data.duration,
          },
        }),
      });

      toast.success("Configuratie verzonden!", {
        description: "Controleer je e-mail voor bevestiging.",
      });

      router.push(`/booking?config_id=${workshopConfig.id}`);
    } catch (error) {
      console.error("Workshop configuration error:", error);
      toast.error("Er is iets misgegaan!", {
        description: "Probeer het later opnieuw.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const isWorkshopAvailable = (workshopId: string) => {
    const workshop = WORKSHOPS.find((w) => w.id === workshopId);
    if (!workshop) return false;
    return participantCount >= workshop.minParticipants;
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="space-y-0.5 p-2 pb-1 sm:p-3">
        <CardTitle className="text-lg sm:text-xl">Uitje Configurator</CardTitle>
        <CardDescription className="text-xs">
          Configureer je uitje en ontvang direct een bevestiging
        </CardDescription>
      </CardHeader>

      <CardContent className="p-2 sm:p-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="min-h-[280px] overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="w-full"
                >
                  {/* Step 1: Configure Uitje - All related fields together */}
                  {currentStep === 1 && (
                    <div className="space-y-2">
                      {/* Zakelijk checkbox - shows business fields when checked */}
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-y-0 space-x-2 rounded-md border p-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "zakelijk"}
                                onCheckedChange={(checked) =>
                                  field.onChange(
                                    checked ? "zakelijk" : "particulier"
                                  )
                                }
                              />
                            </FormControl>
                            <div className="space-y-0.5 leading-none">
                              <FormLabel className="cursor-pointer text-sm">
                                Zakelijke aanvraag
                              </FormLabel>
                              <FormDescription className="text-[11px]">
                                Vink aan voor bedrijfsuitjes en teambuilding
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {type === "zakelijk" && (
                        <div className="grid items-start gap-2 sm:grid-cols-2 sm:gap-3">
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bedrijfsnaam *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Bijv. Goeduitje B.V."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="btwNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>BTW-nummer (optioneel)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="NL123456789B01"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Voor factuur
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="participantCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              <IconUsers className="mr-1.5 inline size-3.5" />
                              Aantal Personen
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={100}
                                className="h-8"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormDescription className="text-[11px]">
                              1-100 personen
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Uitjes Selection */}
                      <FormField
                        control={form.control}
                        name="workshops"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-sm">Uitjes</FormLabel>
                            <FormDescription className="text-[11px]">
                              {participantCount < 6
                                ? "Let op: Sommige vereisen min. 6 deelnemers"
                                : "Selecteer één of meerdere uitjes"}
                            </FormDescription>
                            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                              {WORKSHOPS.map((workshop) => {
                                const available = isWorkshopAvailable(
                                  workshop.id
                                );
                                return (
                                  <FormField
                                    key={workshop.id}
                                    control={form.control}
                                    name="workshops"
                                    render={({ field }) => (
                                      <FormItem
                                        className={`flex items-center space-y-0 space-x-2 rounded-md border p-1.5 ${
                                          !available
                                            ? "border-muted bg-muted/20 opacity-60"
                                            : "border-border"
                                        }`}
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              workshop.id
                                            )}
                                            disabled={!available}
                                            onCheckedChange={(checked) => {
                                              const updatedValue = checked
                                                ? [...field.value, workshop.id]
                                                : field.value?.filter(
                                                    (val) => val !== workshop.id
                                                  );
                                              field.onChange(updatedValue);
                                            }}
                                          />
                                        </FormControl>
                                        <div className="min-w-0 flex-1">
                                          <FormLabel className="cursor-pointer text-sm leading-tight font-normal">
                                            {workshop.name}
                                            {!available ? (
                                              <span className="text-muted-foreground ml-1 text-[10px]">
                                                (min. {workshop.minParticipants}
                                                )
                                              </span>
                                            ) : (
                                              <span className="text-primary ml-1 text-[10px] font-medium">
                                                €{workshop.basePrice} p.p.
                                              </span>
                                            )}
                                          </FormLabel>
                                        </div>
                                      </FormItem>
                                    )}
                                  />
                                );
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Location */}
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              <IconMapPin className="mr-1.5 inline size-3.5" />
                              Locatie
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Selecteer locatie" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Nijmegen">
                                  Nijmegen
                                </SelectItem>
                                <SelectItem value="Arnhem">Arnhem</SelectItem>
                                <SelectItem value="Amersfoort">
                                  Amersfoort
                                </SelectItem>
                                <SelectItem value="other">Anders...</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Custom City */}
                      {location === "other" && (
                        <FormField
                          control={form.control}
                          name="customCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">
                                Plaatsnaam
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Bijv. Amsterdam"
                                  className="h-8"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Date and Time - compact row */}
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">
                                <IconCalendar className="mr-1 inline size-3.5" />
                                Datum
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  disabled={dateTbd}
                                  className="h-8"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dateTbd"
                          render={({ field }) => (
                            <FormItem className="flex items-end space-y-0 space-x-2 pb-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-xs font-normal">
                                Nog te bepalen
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">
                                <IconClock className="mr-1 inline size-3.5" />
                                Tijd
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                                disabled={timeTbd}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Tijd" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 57 }, (_, i) => {
                                    const hour = Math.floor(i / 4) + 8;
                                    const minute = (i % 4) * 15;
                                    if (hour > 22) return null;
                                    const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                                    return (
                                      <SelectItem key={timeStr} value={timeStr}>
                                        {timeStr}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="timeTbd"
                          render={({ field }) => (
                            <FormItem className="flex items-end space-y-0 space-x-2 pb-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-xs font-normal">
                                Nog te bepalen
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Duration */}
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              <IconClock className="mr-1 inline size-3.5" />
                              Tijdsduur
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseFloat(value))
                              }
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Duur" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8].map(
                                  (hours) => (
                                    <SelectItem
                                      key={hours}
                                      value={hours.toString()}
                                    >
                                      {hours === 1
                                        ? "1 uur"
                                        : hours % 1 === 0.5
                                          ? `${Math.floor(hours)}u30`
                                          : `${hours} uur`}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Contact & Review */}
                  {currentStep === 2 && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Naam</FormLabel>
                              <FormControl>
                                <Input placeholder="Jan Jansen" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="jan@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefoonnummer</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="06 12345678"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Review Summary */}
                      <div className="bg-muted/50 mt-6 rounded-lg border p-4">
                        <h3 className="text-foreground mb-3 font-semibold">
                          Samenvatting
                        </h3>
                        <div className="text-muted-foreground space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Type:</span>{" "}
                            {type === "zakelijk" ? "Zakelijk" : "Particulier"}
                          </div>
                          <div>
                            <span className="font-medium">Deelnemers:</span>{" "}
                            {participantCount}
                          </div>
                          <div>
                            <span className="font-medium">Uitjes:</span>{" "}
                            {selectedWorkshops.length > 0
                              ? selectedWorkshops
                                  .map(
                                    (id) =>
                                      WORKSHOPS.find((w) => w.id === id)?.name
                                  )
                                  .join(", ")
                              : "Geen"}
                          </div>
                          <div>
                            <span className="font-medium">Locatie:</span>{" "}
                            {location === "other"
                              ? form.watch("customCity")
                              : location}
                          </div>
                        </div>

                        {/* Price Estimate */}
                        {selectedWorkshops.length > 0 &&
                          participantCount >= 8 && (
                            <div className="mt-4 border-t pt-4">
                              <h4 className="text-foreground mb-2 text-sm font-semibold">
                                Geschatte prijs
                              </h4>
                              <div className="space-y-1 text-sm">
                                {selectedWorkshops.map((workshopId) => {
                                  const workshop = WORKSHOPS.find(
                                    (w) => w.id === workshopId
                                  );
                                  const tier = getWorkshopPrice(
                                    workshopId,
                                    participantCount
                                  );
                                  if (!workshop || !tier) return null;
                                  return (
                                    <div
                                      key={workshopId}
                                      className="flex justify-between"
                                    >
                                      <span className="text-muted-foreground">
                                        {workshop.name}:
                                      </span>
                                      <span>
                                        €{tier.priceExclBtw} p.p. excl btw
                                      </span>
                                    </div>
                                  );
                                })}
                                <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
                                  <span>
                                    Totaal ({participantCount} pers.):
                                  </span>
                                  <span className="text-primary">
                                    €
                                    {calculateEstimatedPrice(
                                      selectedWorkshops,
                                      participantCount
                                    ).toFixed(2)}{" "}
                                    excl btw
                                  </span>
                                </div>
                                <p className="text-muted-foreground mt-1 text-xs">
                                  * Indicatieve prijs. Definitieve offerte volgt
                                  na aanvraag.
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="w-full sm:w-auto"
              >
                <IconArrowLeft className="mr-2 size-4" />
                Vorige
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto"
                >
                  Volgende
                  <IconArrowRight className="ml-2 size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <IconLoader2 className="mr-2 size-4 animate-spin" />
                      Verzenden...
                    </>
                  ) : (
                    <>
                      <IconSend className="mr-2 size-4" />
                      Configuratie Verzenden
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
