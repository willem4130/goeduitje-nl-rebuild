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
  cuisine: string;
  pricePerPerson: number;
  isFull: boolean;
}

// Default price per person (fallback if no sessions in DB)
export const OPEN_WORKSHOP_PRICE = 60;

// Allowed values for OpenWorkshopSession.cuisine — extend when a new cuisine is added
// (also update the Select options in goeduitje-backend/src/app/sessions/page.tsx)
export const CUISINE_LABELS: Record<string, string> = {
  arabisch: "Arabische keuken",
  perzisch: "Perzische keuken",
};

// Compact variant for badges in the date picker
export const CUISINE_LABELS_SHORT: Record<string, string> = {
  arabisch: "Arabisch",
  perzisch: "Perzisch",
};

export function cuisineLabel(cuisine: string): string {
  return CUISINE_LABELS[cuisine] ?? cuisine;
}

export function cuisineLabelShort(cuisine: string): string {
  return CUISINE_LABELS_SHORT[cuisine] ?? cuisine;
}
