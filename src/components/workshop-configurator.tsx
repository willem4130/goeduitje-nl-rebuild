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
import { WORKSHOPS } from "@/lib/constants/cities";
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
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-xl sm:text-2xl">
          Uitje Configurator
        </CardTitle>
        <CardDescription className="text-sm">
          Configureer je uitje en ontvang direct een bevestiging
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 sm:p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="min-h-[350px] overflow-hidden">
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
                    <div className="space-y-3 sm:space-y-4">
                      {/* Zakelijk checkbox - shows business fields when checked */}
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-y-0 space-x-3 rounded-md border p-3">
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
                            <div className="space-y-1 leading-none">
                              <FormLabel className="cursor-pointer">
                                Zakelijke aanvraag
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Vink aan voor bedrijfsuitjes en teambuilding
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {type === "zakelijk" && (
                        <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
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
                            <FormLabel>
                              <IconUsers className="mr-2 inline size-4" />
                              Aantal Personen
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={100}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Minimaal 1, maximaal 100 personen
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
                            <FormLabel>Uitjes</FormLabel>
                            <FormDescription>
                              {participantCount < 6
                                ? "Let op: Sommige uitjes vereisen minimaal 6 deelnemers"
                                : "Selecteer één of meerdere uitjes"}
                            </FormDescription>
                            <div className="grid gap-2 sm:grid-cols-2">
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
                                        className={`flex items-center space-y-0 space-x-3 rounded-md border p-2 sm:p-3 ${
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
                                        <div className="flex-1">
                                          <FormLabel className="cursor-pointer font-normal">
                                            {workshop.name}
                                            {!available && (
                                              <span className="text-muted-foreground ml-2 text-xs">
                                                (min. {workshop.minParticipants}{" "}
                                                pers.)
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
                            <FormLabel>
                              <IconMapPin className="mr-2 inline size-4" />
                              Locatie
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecteer een locatie" />
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
                              <FormLabel>Plaatsnaam</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Bijv. Amsterdam"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormDescription>
                                Voer de gewenste plaatsnaam in
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Date and Time */}
                      <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <IconCalendar className="mr-2 inline size-4" />
                                Datum
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  disabled={dateTbd}
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
                            <FormItem className="flex items-end space-y-0 space-x-3 pb-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Datum nog te bepalen
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <IconClock className="mr-2 inline size-4" />
                                Aanvangstijd
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                                disabled={timeTbd}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecteer tijd" />
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
                            <FormItem className="flex items-end space-y-0 space-x-3 pb-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Tijd nog te bepalen
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Duration - 30 minute steps */}
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <IconClock className="mr-2 inline size-4" />
                              Tijdsduur
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseFloat(value))
                              }
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecteer duur" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[
                                  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5,
                                  6, 6.5, 7, 7.5, 8,
                                ].map((hours) => (
                                  <SelectItem
                                    key={hours}
                                    value={hours.toString()}
                                  >
                                    {hours === 0.5
                                      ? "30 minuten"
                                      : hours === 1
                                        ? "1 uur"
                                        : hours % 1 === 0.5
                                          ? `${Math.floor(hours)} uur 30 min`
                                          : `${hours} uur`}
                                  </SelectItem>
                                ))}
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
