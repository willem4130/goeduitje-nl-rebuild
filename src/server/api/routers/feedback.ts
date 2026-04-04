import { createTRPCRouter, publicProcedure, protectedProcedure, rateLimitedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";

const submitFeedbackSchema = z.object({
  name: z.string().min(2, "Naam moet minimaal 2 karakters zijn"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Bericht moet minimaal 10 karakters zijn"),
  rating: z.number().min(1).max(5).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  eventDate: z.string().optional(),
  eventLocation: z.string().optional(),
  whatWasBest: z.string().optional(),
  whatToImprove: z.string().optional(),
  source: z.enum(["contact", "feedback"]),
});

export const feedbackRouter = createTRPCRouter({
  /**
   * Submit new feedback
   */
  submit: rateLimitedProcedure
    .input(submitFeedbackSchema)
    .mutation(async ({ input }) => {
      try {
        const feedback = await prisma.feedback.create({
          data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            subject: input.subject,
            message: input.message,
            rating: input.rating,
            isRead: false,
            firstName: input.firstName,
            lastName: input.lastName,
            eventDate: input.eventDate,
            eventLocation: input.eventLocation,
            whatWasBest: input.whatWasBest,
            whatToImprove: input.whatToImprove,
          },
        });

        // Send admin notification for post-event feedback only — contact form
        // has its own admin notification via /api/send-email
        if (input.source !== "contact")
          try {
            const adminEmails = (
              process.env.ADMIN_NOTIFICATION_EMAIL || "guus@goeduitje.nl"
            )
              .split(",")
              .map((e) => e.trim());
            const resend = getResend();
            const ratingText = input.rating
              ? `${"★".repeat(input.rating)}${"☆".repeat(5 - input.rating)}`
              : "Geen rating";
            await resend.emails.send({
              from: `Goeduitje Feedback <${FROM_EMAIL}>`,
              to: adminEmails,
              subject: `Nieuwe feedback van ${input.name}`,
              text: [
                `Nieuwe feedback ontvangen`,
                ``,
                `Van: ${input.name} (${input.email})`,
                `Datum uitje: ${input.eventDate || "-"}`,
                `Locatie: ${input.eventLocation || "-"}`,
                `Rating: ${ratingText}`,
                ``,
                `Wat vond je het beste:`,
                input.whatWasBest || "-",
                ``,
                `Wat kunnen we verbeteren:`,
                input.whatToImprove || "-",
                ``,
                `Bekijk in admin: https://goeduitje-backend.vercel.app/feedback/ervaringen`,
              ].join("\n"),
            });
          } catch {
            // Admin notification failed silently
          }

        return {
          success: true,
          message: "Bedankt voor je feedback! We waarderen het enorm.",
          feedback,
        };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Er is iets misgegaan bij het versturen van je feedback. Probeer het later opnieuw.",
        });
      }
    }),

  /**
   * Get all feedback (for admin)
   */
  getAll: publicProcedure
    .input(
      z
        .object({
          isRead: z.boolean().optional(),
          limit: z.number().min(1).max(100).default(50),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { isRead, limit = 50 } = input ?? {};

      const feedback = await prisma.feedback.findMany({
        where: {
          ...(isRead !== undefined && { isRead }),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return feedback;
    }),

  /**
   * Mark feedback as read/unread
   */
  toggleRead: protectedProcedure
    .input(z.object({ id: z.string(), isRead: z.boolean() }))
    .mutation(async ({ input }) => {
      const feedback = await prisma.feedback.update({
        where: { id: input.id },
        data: { isRead: input.isRead },
      });
      return feedback;
    }),

  /**
   * Delete feedback
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.feedback.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  /**
   * Get feedback stats
   */
  getStats: protectedProcedure.query(async () => {
    const [total, unread, avgRating] = await Promise.all([
      prisma.feedback.count(),
      prisma.feedback.count({ where: { isRead: false } }),
      prisma.feedback.aggregate({
        where: { rating: { not: null } },
        _avg: { rating: true },
      }),
    ]);

    return {
      total,
      unread,
      averageRating: avgRating._avg.rating ?? 0,
    };
  }),
});
