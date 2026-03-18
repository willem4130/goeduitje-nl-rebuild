import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const createBookingSchema = z.object({
  stripeSessionId: z.string().optional(),
  stripePaymentId: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  numberOfPeople: z.number().min(1).max(15),
  workshopId: z.string().optional(),
  workshopDate: z.string().optional(),
  dietaryRequirement: z.string().optional(),
  allergies: z.string().optional(),
  hasGiftCard: z.boolean().default(false),
  giftCardId: z.string().optional(),
  giftCardValue: z.number().optional(),
  totalPrice: z.number(),
  remainingAmount: z.number(),
  amountPaid: z.number().optional(),
  currency: z.string().default("eur"),
  paymentMethod: z.enum(["gift_card", "stripe", "gift_card_partial"]).optional(),
  paymentStatus: z.string().default("pending"),
});

export const bookingRouter = createTRPCRouter({
  /**
   * Create a new booking
   */
  create: publicProcedure
    .input(createBookingSchema)
    .mutation(async ({ input }) => {
      try {
        const booking = await prisma.booking.create({
          data: {
            stripeSessionId: input.stripeSessionId,
            stripePaymentId: input.stripePaymentId,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            numberOfPeople: input.numberOfPeople,
            workshopId: input.workshopId,
            workshopDate: input.workshopDate,
            dietaryRequirement: input.dietaryRequirement,
            allergies: input.allergies,
            hasGiftCard: input.hasGiftCard,
            giftCardId: input.giftCardId,
            giftCardValue: input.giftCardValue,
            totalPrice: input.totalPrice,
            remainingAmount: input.remainingAmount,
            amountPaid: input.amountPaid,
            currency: input.currency,
            paymentMethod: input.paymentMethod,
            paymentStatus: input.paymentStatus,
          },
        });

        return {
          success: true,
          booking,
        };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Er is iets misgegaan bij het opslaan van de boeking. Probeer het later opnieuw.",
        });
      }
    }),

  /**
   * Get all bookings (for admin)
   */
  getAll: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(50),
          paymentStatus: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { limit = 50, paymentStatus } = input ?? {};

      const bookings = await prisma.booking.findMany({
        where: {
          ...(paymentStatus !== undefined && { paymentStatus }),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return bookings;
    }),
});
