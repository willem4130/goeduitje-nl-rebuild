import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

// Dutch date formatting helpers
const DUTCH_DAYS = ["ZO", "MA", "DI", "WO", "DO", "VR", "ZA"];
const DUTCH_DAY_NAMES_FULL = [
  "Zondag",
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
];
const DUTCH_MONTHS = [
  "JAN",
  "FEB",
  "MRT",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OKT",
  "NOV",
  "DEC",
];
const DUTCH_MONTHS_FULL = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

export const openSessionsRouter = createTRPCRouter({
  getUpcoming: publicProcedure.query(async () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const sessions = await prisma.openWorkshopSession.findMany({
      where: {
        isActive: true,
        date: { gte: now },
      },
      include: {
        bookings: {
          where: { paymentStatus: "paid" },
          select: { numberOfPeople: true },
        },
      },
      orderBy: { date: "asc" },
    });

    return sessions.map((session) => {
      const bookedSeats = session.bookings.reduce(
        (sum, b) => sum + b.numberOfPeople,
        0
      );
      const dayOfWeek = session.date.getUTCDay();
      const monthIndex = session.date.getUTCMonth();

      return {
        id: session.id,
        date: session.date.toISOString().split("T")[0],
        dateDisplay: `${DUTCH_DAY_NAMES_FULL[dayOfWeek]} ${session.date.getUTCDate()} ${DUTCH_MONTHS_FULL[monthIndex]}`,
        dayName: DUTCH_DAYS[dayOfWeek],
        dayNumber: session.date.getUTCDate().toString(),
        month: DUTCH_MONTHS[monthIndex],
        time: `${session.startTime} - ${session.endTime}`,
        location: session.location,
        maxCapacity: session.maxCapacity,
        availableSeats: session.isFull ? 0 : session.maxCapacity - bookedSeats,
        pricePerPerson: session.pricePerPerson,
        isFull: session.isFull,
      };
    });
  }),
});
