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
// NOTE: Update these dates regularly to show upcoming workshops
export const OPEN_WORKSHOPS: OpenWorkshop[] = [
  {
    id: "mrt-29-2026",
    date: "2026-03-29",
    dateDisplay: "Zondag 29 maart",
    dayName: "ZO",
    dayNumber: "29",
    month: "MRT",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "apr-13-2026",
    date: "2026-04-13",
    dateDisplay: "Maandag 13 april",
    dayName: "MA",
    dayNumber: "13",
    month: "APR",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "apr-19-2026",
    date: "2026-04-19",
    dateDisplay: "Zondag 19 april",
    dayName: "ZO",
    dayNumber: "19",
    month: "APR",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "apr-20-2026",
    date: "2026-04-20",
    dateDisplay: "Maandag 20 april",
    dayName: "MA",
    dayNumber: "20",
    month: "APR",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "apr-26-2026",
    date: "2026-04-26",
    dateDisplay: "Zondag 26 april",
    dayName: "ZO",
    dayNumber: "26",
    month: "APR",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "mei-11-2026",
    date: "2026-05-11",
    dateDisplay: "Maandag 11 mei",
    dayName: "MA",
    dayNumber: "11",
    month: "MEI",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "mei-27-2026",
    date: "2026-05-27",
    dateDisplay: "Woensdag 27 mei",
    dayName: "WO",
    dayNumber: "27",
    month: "MEI",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "mei-31-2026",
    date: "2026-05-31",
    dateDisplay: "Zondag 31 mei",
    dayName: "ZO",
    dayNumber: "31",
    month: "MEI",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "jun-07-2026",
    date: "2026-06-07",
    dateDisplay: "Zondag 7 juni",
    dayName: "ZO",
    dayNumber: "7",
    month: "JUN",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "jun-08-2026",
    date: "2026-06-08",
    dateDisplay: "Maandag 8 juni",
    dayName: "MA",
    dayNumber: "8",
    month: "JUN",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "jun-14-2026",
    date: "2026-06-14",
    dateDisplay: "Zondag 14 juni",
    dayName: "ZO",
    dayNumber: "14",
    month: "JUN",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "jun-17-2026",
    date: "2026-06-17",
    dateDisplay: "Woensdag 17 juni",
    dayName: "WO",
    dayNumber: "17",
    month: "JUN",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "jun-22-2026",
    date: "2026-06-22",
    dateDisplay: "Maandag 22 juni",
    dayName: "MA",
    dayNumber: "22",
    month: "JUN",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "jun-28-2026",
    date: "2026-06-28",
    dateDisplay: "Zondag 28 juni",
    dayName: "ZO",
    dayNumber: "28",
    month: "JUN",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "jul-08-2026",
    date: "2026-07-08",
    dateDisplay: "Woensdag 8 juli",
    dayName: "WO",
    dayNumber: "8",
    month: "JUL",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "jul-19-2026",
    date: "2026-07-19",
    dateDisplay: "Zondag 19 juli",
    dayName: "ZO",
    dayNumber: "19",
    month: "JUL",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "jul-20-2026",
    date: "2026-07-20",
    dateDisplay: "Maandag 20 juli",
    dayName: "MA",
    dayNumber: "20",
    month: "JUL",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "jul-22-2026",
    date: "2026-07-22",
    dateDisplay: "Woensdag 22 juli",
    dayName: "WO",
    dayNumber: "22",
    month: "JUL",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "aug-05-2026",
    date: "2026-08-05",
    dateDisplay: "Woensdag 5 augustus",
    dayName: "WO",
    dayNumber: "5",
    month: "AUG",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "aug-09-2026",
    date: "2026-08-09",
    dateDisplay: "Zondag 9 augustus",
    dayName: "ZO",
    dayNumber: "9",
    month: "AUG",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "sep-06-2026",
    date: "2026-09-06",
    dateDisplay: "Zondag 6 september",
    dayName: "ZO",
    dayNumber: "6",
    month: "SEP",
    time: "14:00 - 16:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "sep-07-2026",
    date: "2026-09-07",
    dateDisplay: "Maandag 7 september",
    dayName: "MA",
    dayNumber: "7",
    month: "SEP",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
  {
    id: "sep-09-2026",
    date: "2026-09-09",
    dateDisplay: "Woensdag 9 september",
    dayName: "WO",
    dayNumber: "9",
    month: "SEP",
    time: "19:00 - 21:30",
    availableSeats: 12,
    location: "Nijmegen",
  },
];

// Price per person for open workshops (€60 incl BTW)
export const OPEN_WORKSHOP_PRICE = 60;

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
