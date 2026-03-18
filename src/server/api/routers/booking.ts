import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const createBookingSchema = z.object({
  workshopId: z.string(),
  workshopDate: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  numberOfPeople: z.number().min(1).max(15),
  dietaryRequirement: z.string().default("geen"),
  allergies: z.string().optional(),
  totalPrice: z.number(),
  paymentMethod: z.enum(["gift_card", "stripe", "gift_card_partial"]),
  paymentStatus: z.string().default("paid"),
  giftCardId: z.string().optional(),
  giftCardValue: z.number().optional(),
  remainingAmount: z.number().optional(),
  stripeSessionId: z.string().optional(),
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
            workshopId: input.workshopId,
            workshopDate: input.workshopDate,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            numberOfPeople: input.numberOfPeople,
            dietaryRequirement: input.dietaryRequirement,
            allergies: input.allergies,
            totalPrice: input.totalPrice,
            paymentMethod: input.paymentMethod,
            paymentStatus: input.paymentStatus,
            giftCardId: input.giftCardId,
            giftCardValue: input.giftCardValue,
            remainingAmount: input.remainingAmount,
            stripeSessionId: input.stripeSessionId,
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
