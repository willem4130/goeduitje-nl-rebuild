"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconLoader2, IconSend } from "@tabler/icons-react";
import Link from "next/link";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/forms";

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      voornaam: "",
      achternaam: "",
      email: "",
      bericht: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsLoading(true);

    try {
      // Send confirmation email
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "contact-confirmation",
          to: data.email,
          data: {
            name: `${data.voornaam} ${data.achternaam}`,
            subject: "Contact formulier",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send confirmation email");
      }

      console.log("Form data:", data);
      toast.success("Bericht verzonden!", {
        description: "Controleer je e-mail voor een bevestiging.",
      });

      form.reset();
    } catch {
      toast.error("Er ging iets mis!", {
        description: "Probeer het later opnieuw.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Neem contact op</CardTitle>
        <CardDescription className="space-y-2">
          <span>
            Wil je een uitje boeken? Gebruik dan onze{" "}
            <Link
              href="/onze-uitjes#configurator"
              className="text-primary font-medium underline underline-offset-4 hover:no-underline"
            >
              uitjes configurator
            </Link>
            . Bekijk de{" "}
            <Link
              href="/open-kookworkshops"
              className="text-primary font-medium underline underline-offset-4 hover:no-underline"
            >
              agenda voor open workshops
            </Link>
            .
          </span>
          <span className="block">
            Voor andere vragen kun je onderstaand formulier invullen.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="voornaam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voornaam</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="achternaam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achternaam</FormLabel>
                    <FormControl>
                      <Input placeholder="Jansen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jan@voorbeeld.nl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bericht"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bericht</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Schrijf hier je bericht..."
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <IconLoader2 className="mr-2 size-4 animate-spin" />
                  Verzenden...
                </>
              ) : (
                <>
                  <IconSend className="mr-2 size-4" />
                  Verstuur bericht
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
