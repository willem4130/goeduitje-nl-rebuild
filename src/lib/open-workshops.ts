/**
 * Open Kookworkshops - Shared workshop dates
 * Used by both /booking page and kookworkshop detail page
 * Update this file to change the agenda across the entire site
 */

export interface OpenWorkshop {
  id: string;
  date: string;
  dateDisplay: string;
  dayName: string;
  dayNumber: string;
  month: string;
  time: string;
  availableSeats: number;
  location: string;
}

// Open kookworkshop dates - update here to sync across all pages
export const OPEN_WORKSHOPS: OpenWorkshop[] = [
  {
    id: "jan-25",
    date: "2025-01-25",
    dateDisplay: "Zaterdag 25 januari",
    dayName: "ZA",
    dayNumber: "25",
    month: "JAN",
    time: "14:00 - 16:30",
    availableSeats: 8,
    location: "Nijmegen",
  },
  {
    id: "feb-22",
    date: "2025-02-22",
    dateDisplay: "Zaterdag 22 februari",
    dayName: "ZA",
    dayNumber: "22",
    month: "FEB",
    time: "10:00 - 12:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "mrt-08",
    date: "2025-03-08",
    dateDisplay: "Zaterdag 8 maart",
    dayName: "ZA",
    dayNumber: "08",
    month: "MRT",
    time: "14:00 - 16:30",
    availableSeats: 10,
    location: "Nijmegen",
  },
  {
    id: "mrt-29",
    date: "2025-03-29",
    dateDisplay: "Zaterdag 29 maart",
    dayName: "ZA",
    dayNumber: "29",
    month: "MRT",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "apr-19",
    date: "2025-04-19",
    dateDisplay: "Zaterdag 19 april",
    dayName: "ZA",
    dayNumber: "19",
    month: "APR",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "mei-31",
    date: "2025-05-31",
    dateDisplay: "Zaterdag 31 mei",
    dayName: "ZA",
    dayNumber: "31",
    month: "MEI",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
];

// Price per person for open workshops (€50 incl BTW)
export const OPEN_WORKSHOP_PRICE = 50;

// Get upcoming workshops (filter out past dates)
export function getUpcomingWorkshops(): OpenWorkshop[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return OPEN_WORKSHOPS.filter((workshop) => {
    const workshopDate = new Date(workshop.date);
    return workshopDate >= now;
  });
}

// Get next available workshop
export function getNextWorkshop(): OpenWorkshop | null {
  const upcoming = getUpcomingWorkshops();
  return upcoming.length > 0 ? upcoming[0] : null;
}
