import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const createBookingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  numberOfPeople: z.number().min(1).max(15),
  workshopId: z.string().optional(),
  workshopDate: z.string().optional(),
  sessionId: z.string().optional(),
  dietaryRequirement: z.string().optional(),
  allergies: z.string().optional(),
  hasGiftCard: z.boolean().default(false),
  giftCardId: z.string().optional(),
  giftCardValue: z.number().optional(),
  totalPrice: z.number(),
  remainingAmount: z.number(),
  amountPaid: z.number().optional(),
  currency: z.string().default("eur"),
  paymentMethod: z.string().optional(),
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
        const bookingData = {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          numberOfPeople: input.numberOfPeople,
          workshopId: input.workshopId,
          workshopDate: input.workshopDate,
          sessionId: input.sessionId,
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
        };

        // Use transaction with capacity check when booking a session
        if (input.sessionId) {
          const booking = await prisma.$transaction(async (tx) => {
            const session = await tx.openWorkshopSession.findUnique({
              where: { id: input.sessionId! },
            });
            if (!session) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Sessie niet gevonden",
              });
            }

            if (session.isFull) {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message: "Deze sessie is volgeboekt.",
              });
            }

            const bookedCount = await tx.booking.aggregate({
              where: {
                sessionId: input.sessionId,
                paymentStatus: { in: ["paid", "pending"] },
              },
              _sum: { numberOfPeople: true },
            });
            const currentBooked = bookedCount._sum.numberOfPeople || 0;
            const available = session.maxCapacity - currentBooked;

            if (input.numberOfPeople > available) {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message: `Er zijn nog maar ${available} plekken beschikbaar.`,
              });
            }

            const created = await tx.booking.create({ data: bookingData });

            // Also create a WorkshopRequest for the CRM pipeline
            await tx.workshopRequest.create({
              data: {
                contactName: `${input.firstName} ${input.lastName}`,
                email: input.email,
                participants: input.numberOfPeople,
                activityType: "Open Kookworkshop",
                preferredDate: input.workshopDate || null,
                source: "open_kookworkshop",
                status: "leeg",
                specialRequirements:
                  [
                    input.dietaryRequirement &&
                    input.dietaryRequirement !== "geen"
                      ? `Dieet: ${input.dietaryRequirement}`
                      : null,
                    input.allergies ? `Allergieën: ${input.allergies}` : null,
                  ]
                    .filter(Boolean)
                    .join("\n") || null,
                notes: `Open kookworkshop aanmelding — ${input.numberOfPeople} personen, €${input.totalPrice}`,
                updatedAt: new Date(),
              },
            });

            return created;
          });

          return { success: true, booking };
        }

        const booking = await prisma.$transaction(async (tx) => {
          const created = await tx.booking.create({ data: bookingData });

          await tx.workshopRequest.create({
            data: {
              contactName: `${input.firstName} ${input.lastName}`,
              email: input.email,
              participants: input.numberOfPeople,
              activityType: "Open Kookworkshop",
              preferredDate: input.workshopDate || null,
              source: "open_kookworkshop",
              status: "leeg",
              specialRequirements:
                [
                  input.dietaryRequirement &&
                  input.dietaryRequirement !== "geen"
                    ? `Dieet: ${input.dietaryRequirement}`
                    : null,
                  input.allergies ? `Allergieën: ${input.allergies}` : null,
                ]
                  .filter(Boolean)
                  .join("\n") || null,
              notes: `Open kookworkshop aanmelding — ${input.numberOfPeople} personen, €${input.totalPrice}`,
              updatedAt: new Date(),
            },
          });

          return created;
        });

        return { success: true, booking };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
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
