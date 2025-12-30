// List of Dutch cities for validation
export const DUTCH_CITIES = [
  "Amsterdam",
  "Rotterdam",
  "Den Haag",
  "Utrecht",
  "Eindhoven",
  "Groningen",
  "Tilburg",
  "Almere",
  "Breda",
  "Nijmegen",
  "Enschede",
  "Haarlem",
  "Arnhem",
  "Zaanstad",
  "Amersfoort",
  "Apeldoorn",
  "s-Hertogenbosch",
  "Hoofddorp",
  "Maastricht",
  "Leiden",
  "Dordrecht",
  "Zoetermeer",
  "Zwolle",
  "Deventer",
  "Delft",
  "Alkmaar",
  "Heerlen",
  "Venlo",
  "Leeuwarden",
  "Amsterdam-Zuidoost",
  "Hilversum",
  "Amstelveen",
  "Roosendaal",
  "Purmerend",
  "Oss",
  "Schiedam",
  "Spijkenisse",
  "Helmond",
  "Vlaardingen",
  "Almelo",
  "Nieuwegein",
  "Sittard",
  "Lelystad",
  "Hengelo",
  "Veenendaal",
  "Gouda",
  "Alphen aan den Rijn",
  "Katwijk",
  "Ede",
  "Waddinxveen",
] as const;

// Price tier type
export interface PriceTier {
  minParticipants: number;
  maxParticipants: number | null;
  priceExclBtw: number;
  priceInclBtw: number;
}

// Workshop configuration with pricing
export interface Workshop {
  id: string;
  name: string;
  minParticipants: number;
  maxParticipants: number | null;
  priceTiers: PriceTier[];
  basePrice: number; // Lowest price tier (excl btw)
}

// Workshops configuration with pricing tiers from goeduitje.nl
export const WORKSHOPS: Workshop[] = [
  {
    id: "kookworkshop",
    name: "Kookworkshop",
    minParticipants: 8,
    maxParticipants: null,
    basePrice: 55,
    priceTiers: [
      {
        minParticipants: 8,
        maxParticipants: 10,
        priceExclBtw: 70,
        priceInclBtw: 85,
      },
      {
        minParticipants: 11,
        maxParticipants: 15,
        priceExclBtw: 60,
        priceInclBtw: 73,
      },
      {
        minParticipants: 16,
        maxParticipants: null,
        priceExclBtw: 55,
        priceInclBtw: 67,
      },
    ],
  },
  {
    id: "stadsspel",
    name: "Stadsspel",
    minParticipants: 10,
    maxParticipants: 20,
    basePrice: 22.5,
    priceTiers: [
      {
        minParticipants: 10,
        maxParticipants: null,
        priceExclBtw: 22.5,
        priceInclBtw: 27,
      },
    ],
  },
  {
    id: "the-game",
    name: "The Game (Koffer)",
    minParticipants: 10,
    maxParticipants: 20,
    basePrice: 32.5,
    priceTiers: [
      {
        minParticipants: 10,
        maxParticipants: null,
        priceExclBtw: 32.5,
        priceInclBtw: 39,
      },
    ],
  },
  {
    id: "beachvolleybal",
    name: "Beachvolleybal",
    minParticipants: 12,
    maxParticipants: 40,
    basePrice: 25,
    priceTiers: [
      {
        minParticipants: 12,
        maxParticipants: null,
        priceExclBtw: 25,
        priceInclBtw: 30,
      },
    ],
  },
  {
    id: "koffie-thee",
    name: "Koffie & Thee",
    minParticipants: 8,
    maxParticipants: 25,
    basePrice: 32.5,
    priceTiers: [
      {
        minParticipants: 8,
        maxParticipants: null,
        priceExclBtw: 32.5,
        priceInclBtw: 39,
      },
    ],
  },
  {
    id: "lunch-diner",
    name: "Lunch & Diner",
    minParticipants: 8,
    maxParticipants: 100,
    basePrice: 22.5,
    priceTiers: [
      {
        minParticipants: 8,
        maxParticipants: null,
        priceExclBtw: 22.5,
        priceInclBtw: 27,
      },
    ],
  },
];

// Helper function to get price for a workshop based on participant count
export function getWorkshopPrice(
  workshopId: string,
  participantCount: number
): PriceTier | null {
  const workshop = WORKSHOPS.find((w) => w.id === workshopId);
  if (!workshop) return null;

  // Find the matching price tier
  const tier = workshop.priceTiers.find(
    (t) =>
      participantCount >= t.minParticipants &&
      (t.maxParticipants === null || participantCount <= t.maxParticipants)
  );

  return tier || workshop.priceTiers[workshop.priceTiers.length - 1] || null;
}

// Calculate total estimated price for selected workshops
export function calculateEstimatedPrice(
  workshopIds: string[],
  participantCount: number,
  includeVat: boolean = false
): number {
  let total = 0;

  for (const workshopId of workshopIds) {
    const tier = getWorkshopPrice(workshopId, participantCount);
    if (tier) {
      const pricePerPerson = includeVat ? tier.priceInclBtw : tier.priceExclBtw;
      total += pricePerPerson * participantCount;
    }
  }

  return total;
}

export type WorkshopId = (typeof WORKSHOPS)[number]["id"];
