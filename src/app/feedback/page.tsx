"use client";

import { api } from "@/trpc/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const feedbackSchema = z.object({
  firstName: z.string().min(2, "Voornaam is verplicht"),
  lastName: z.string().min(2, "Achternaam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  date: z.string().min(1, "Datum is verplicht"),
  location: z.string().min(2, "Locatie is verplicht"),
  rating: z.number().min(1).max(5).optional(),
  whatWasBest: z.string().min(10, "Minimaal 10 karakters"),
  whatToImprove: z.string().min(10, "Minimaal 10 karakters"),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export default function FeedbackPage() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
  });

  const submitFeedback = api.feedback.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      reset();
      setSelectedRating(null);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: FeedbackForm) => {
    // Combine first name and last name into name field for backend
    submitFeedback.mutate({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: undefined,
      subject: `Feedback voor uitje op ${data.date} in ${data.location}`,
      message: `Datum: ${data.date}\nLocatie: ${data.location}\n\nWat vond je het beste: ${data.whatWasBest}\n\nWat kunnen we verbeteren: ${data.whatToImprove}`,
      rating: selectedRating ?? undefined,
      firstName: data.firstName,
      lastName: data.lastName,
      eventDate: data.date,
      eventLocation: data.location,
      whatWasBest: data.whatWasBest,
      whatToImprove: data.whatToImprove,
    });
  };

  if (submitted) {
    return (
      <main className="flex min-h-screen flex-col pt-20">
        <section className="section-lg">
          <div className="container mx-auto max-w-2xl px-6 lg:px-8">
            <ScrollReveal animation="fade" amount={0.1}>
              <Card className="text-center">
                <CardContent className="space-y-6 pt-12 pb-12">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h2 className="mb-3 text-2xl font-semibold tracking-tight">
                      Bedankt voor je feedback!
                    </h2>
                    <p className="text-muted-foreground mx-auto max-w-md">
                      We hebben je bericht ontvangen en nemen zo snel mogelijk
                      contact met je op.
                    </p>
                  </div>
                  <Button onClick={() => setSubmitted(false)} size="lg">
                    Nog een bericht versturen
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col pt-20">
      {/* Feedback Form */}
      <section className="section-lg">
        <div className="container mx-auto max-w-3xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp" amount={0.2}>
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Geef ons feedback
              </h1>
              <p className="text-muted-foreground text-lg sm:text-xl">
                We horen graag wat je van ons vond.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* First Name and Last Name - Side by Side */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName" className="text-base">
                    Voornaam
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder=""
                    className="mt-2"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-base">
                    Achternaam
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder=""
                    className="mt-2"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-base">
                  E-mailadres
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder=""
                  className="mt-2"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Date and Location - Side by Side */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="date" className="text-base">
                    Datum van uitje
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    className="mt-2"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location" className="text-base">
                    Locatie van uitje
                  </Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder=""
                    className="mt-2"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div>
                <Label className="text-base">Beoordeel ons uitje</Label>
                <div className="mt-3 flex gap-3">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setSelectedRating(rating)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          selectedRating && rating <= selectedRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* What was best */}
              <div>
                <Label htmlFor="whatWasBest" className="text-base">
                  Wat vond je het beste?
                </Label>
                <textarea
                  id="whatWasBest"
                  {...register("whatWasBest")}
                  placeholder=""
                  rows={4}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-2 flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.whatWasBest && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.whatWasBest.message}
                  </p>
                )}
              </div>

              {/* What can we improve */}
              <div>
                <Label htmlFor="whatToImprove" className="text-base">
                  Wat kunnen we verbeteren?
                </Label>
                <textarea
                  id="whatToImprove"
                  {...register("whatToImprove")}
                  placeholder=""
                  rows={4}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-2 flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.whatToImprove && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.whatToImprove.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="min-w-[200px] bg-[#B85C7C] hover:bg-[#A04B6B]"
                  disabled={submitFeedback.isPending}
                >
                  {submitFeedback.isPending ? "Versturen..." : "Verzenden"}
                </Button>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
