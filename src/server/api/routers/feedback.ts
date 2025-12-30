import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const submitFeedbackSchema = z.object({
  name: z.string().min(2, "Naam moet minimaal 2 karakters zijn"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Bericht moet minimaal 10 karakters zijn"),
  rating: z.number().min(1).max(5).optional(),
});

export const feedbackRouter = createTRPCRouter({
  /**
   * Submit new feedback
   */
  submit: publicProcedure
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
          },
        });

        return {
          success: true,
          message:
            "Bedankt voor je feedback! We nemen zo snel mogelijk contact met je op.",
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
  toggleRead: publicProcedure
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
  delete: publicProcedure
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
  getStats: publicProcedure.query(async () => {
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
