"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { IconLoader2, IconSend } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/client";

// Simplified schema for compact form
const compactContactSchema = z.object({
  naam: z.string().min(2, {
    message: "Naam moet minimaal 2 karakters zijn.",
  }),
  email: z.string().email({
    message: "Voer een geldig e-mailadres in.",
  }),
  bericht: z.string().min(10, {
    message: "Bericht moet minimaal 10 karakters zijn.",
  }),
});

type CompactContactValues = z.infer<typeof compactContactSchema>;

export function CompactContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompactContactValues>({
    resolver: zodResolver(compactContactSchema),
    defaultValues: {
      naam: "",
      email: "",
      bericht: "",
    },
  });

  const submitFeedback = api.feedback.submit.useMutation({
    onSuccess: async (_, variables) => {
      // Send confirmation email (non-blocking)
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "contact-confirmation",
            to: variables.email,
            data: {
              name: variables.name,
              subject: "Contact formulier (footer)",
              message: variables.message,
            },
          }),
        });
      } catch {
        // Email failed but feedback was saved - still show success
      }

      toast.success("Bericht verzonden!", {
        description: "We nemen zo snel mogelijk contact met je op.",
      });
      reset();
    },
    onError: () => {
      toast.error("Er ging iets mis!", {
        description: "Probeer het later opnieuw.",
      });
    },
  });

  async function onSubmit(data: CompactContactValues) {
    submitFeedback.mutate({
      name: data.naam,
      email: data.email,
      message: data.bericht,
      subject: "Contact formulier (footer)",
      source: "contact",
    });
  }

  const isLoading = submitFeedback.isPending;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold tracking-wider uppercase">
        Stel een vraag
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Input
            placeholder="Je naam"
            {...register("naam")}
            className="bg-background/50 text-sm"
          />
          {errors.naam && (
            <p className="mt-1 text-xs text-red-500">{errors.naam.message}</p>
          )}
        </div>
        <div>
          <Input
            type="email"
            placeholder="Je e-mailadres"
            {...register("email")}
            className="bg-background/50 text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Textarea
            placeholder="Je vraag of bericht..."
            {...register("bericht")}
            className="bg-background/50 min-h-[80px] resize-none text-sm"
          />
          {errors.bericht && (
            <p className="mt-1 text-xs text-red-500">
              {errors.bericht.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isLoading} size="sm" className="w-full">
          {isLoading ? (
            <>
              <IconLoader2 className="mr-2 size-3 animate-spin" />
              Verzenden...
            </>
          ) : (
            <>
              <IconSend className="mr-2 size-3" />
              Verstuur
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
