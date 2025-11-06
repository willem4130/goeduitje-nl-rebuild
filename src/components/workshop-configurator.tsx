"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  IconLoader2,
  IconSend,
  IconUsers,
  IconMapPin,
  IconCalendar,
  IconClock,
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

export function WorkshopConfigurator() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const createWorkshop = api.workshop.create.useMutation();

  const form = useForm({
    resolver: zodResolver(workshopConfigSchema),
    defaultValues: {
      type: "zakelijk",
      participantCount: 10,
      workshops: [],
      location: "Nijmegen",
      customCity: "",
      date: "",
      dateTbd: false,
      time: "",
      timeTbd: false,
      duration: 2,
      name: "",
      email: "",
    },
  });

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
        toast.info("Sommige workshops zijn verwijderd", {
          description:
            "Deze workshops vereisen minimaal 6 deelnemers en zijn daarom verwijderd uit je selectie.",
        });
      }
    }
  }, [participantCount, selectedWorkshops, form]);

  // Clear date/time when TBD is checked
  useEffect(() => {
    if (dateTbd) {
      form.setValue("date", "");
    }
  }, [dateTbd, form]);

  useEffect(() => {
    if (timeTbd) {
      form.setValue("time", "");
    }
  }, [timeTbd, form]);

  async function onSubmit(data: WorkshopConfigValues) {
    setIsLoading(true);

    try {
      // Create workshop configuration in database
      const workshopConfig = await createWorkshop.mutateAsync(data);

      // Send confirmation email
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

      // Redirect to booking page with config ID
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
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Workshop Configurator</CardTitle>
        <CardDescription>
          Configureer je workshop en ontvang direct een bevestiging
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Type Selection */}
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
                      className="justify-start"
                    >
                      <ToggleGroupItem value="zakelijk">
                        Zakelijk
                      </ToggleGroupItem>
                      <ToggleGroupItem value="particulier">
                        Particulier
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Participant Count */}
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

            {/* Workshops Selection */}
            <FormField
              control={form.control}
              name="workshops"
              render={() => (
                <FormItem>
                  <FormLabel>Workshops</FormLabel>
                  <FormDescription>
                    {participantCount < 6
                      ? "Let op: Sommige workshops vereisen minimaal 6 deelnemers"
                      : "Selecteer één of meerdere workshops"}
                  </FormDescription>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {WORKSHOPS.map((workshop) => {
                      const available = isWorkshopAvailable(workshop.id);
                      return (
                        <FormField
                          key={workshop.id}
                          control={form.control}
                          name="workshops"
                          render={({ field }) => (
                            <FormItem
                              className={`flex items-center space-y-0 space-x-3 rounded-md border p-4 ${
                                !available
                                  ? "border-muted bg-muted/20 opacity-60"
                                  : "border-border"
                              }`}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(workshop.id)}
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
                                      (min. {workshop.minParticipants} pers.)
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
                      <SelectItem value="Nijmegen">Nijmegen</SelectItem>
                      <SelectItem value="Arnhem">Arnhem</SelectItem>
                      <SelectItem value="Amersfoort">Amersfoort</SelectItem>
                      <SelectItem value="other">Anders...</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom City (shown when location is "other") */}
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

            {/* Date */}
            <div className="grid gap-4 sm:grid-cols-2">
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

            {/* Time */}
            <div className="grid gap-4 sm:grid-cols-2">
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
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer aantal uren" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hours) => (
                        <SelectItem key={hours} value={hours.toString()}>
                          {hours} {hours === 1 ? "uur" : "uren"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecteer de verwachte duur van de workshop
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Information */}
            <div className="grid gap-4 sm:grid-cols-2">
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

            <Button type="submit" disabled={isLoading} className="w-full">
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
