/**
 * Open Kookworkshops - Types and constants
 * Workshop session data is now stored in the database (OpenWorkshopSession model)
 * and managed via the admin backend at /sessions
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
  maxCapacity: number;
  location: string;
  pricePerPerson: number;
}

// Default price per person (fallback if no sessions in DB)
export const OPEN_WORKSHOP_PRICE = 60;
