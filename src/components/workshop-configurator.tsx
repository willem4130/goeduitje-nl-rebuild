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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
      type: "zakelijk" as const,
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
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl sm:text-3xl">
          Uitje Configurator
        </CardTitle>
        <CardDescription className="text-base">
          Configureer je uitje en ontvang direct een bevestiging
        </CardDescription>

        {/* Compact Progress Indicator */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-foreground text-sm font-medium">
              Stap {currentStep} van {STEPS.length}:{" "}
              {STEPS[currentStep - 1]?.title}
            </span>
            <span className="text-muted-foreground text-xs">
              {Math.round((currentStep / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="min-h-[400px] overflow-hidden sm:min-h-[500px]">
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
                  {/* Step 1: Configure Workshop - All related fields together */}
                  {currentStep === 1 && (
                    <div className="space-y-4 sm:space-y-6">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                              <ToggleGroup
                                type="single"
                                value={field.value}
                                onValueChange={field.onChange}
                                className="grid w-full grid-cols-2 gap-2"
                              >
                                <ToggleGroupItem
                                  value="zakelijk"
                                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                >
                                  Zakelijk
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  value="particulier"
                                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                >
                                  Particulier
                                </ToggleGroupItem>
                              </ToggleGroup>
                            </FormControl>
                            <FormDescription>
                              {type === "zakelijk"
                                ? "Voor bedrijfsuitjes en teambuilding"
                                : "Voor vrienden, familie en privé evenementen"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {type === "zakelijk" && (
                        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
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
                            <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
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
                                        className={`flex items-center space-y-0 space-x-3 rounded-md border p-3 sm:p-4 ${
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
                      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
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

                      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <IconClock className="mr-2 inline size-4" />
                                Aanvangsttijd
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  disabled={timeTbd}
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

                      {/* Duration */}
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
                                field.onChange(parseInt(value))
                              }
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecteer aantal uren" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                  (hours) => (
                                    <SelectItem
                                      key={hours}
                                      value={hours.toString()}
                                    >
                                      {hours} {hours === 1 ? "uur" : "uren"}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Selecteer de verwachte duur van het uitje
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Contact & Review */}
                  {currentStep === 2 && (
                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
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
            <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
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
