import { z } from "zod";

// Price tier schema (used by both workshop and variant)
export const priceTierSchema = z.object({
  id: z.string().optional(),
  groupSize: z.string().min(1, "Groepsgrootte is verplicht"),
  minParticipants: z.number().int().positive().nullable(),
  maxParticipants: z.number().int().positive().nullable(),
  priceExclBtw: z.number().min(0, "Prijs moet 0 of hoger zijn"),
  priceInclBtw: z.number().min(0, "Prijs moet 0 of hoger zijn"),
  sortOrder: z.number().int(),
});

export type PriceTierInput = z.infer<typeof priceTierSchema>;

// Workshop variant schema
export const workshopVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Naam is verplicht"),
  description: z.string().min(1, "Beschrijving is verplicht"),
  duration: z.string().min(1, "Duur is verplicht"),
  includes: z.array(z.string()),
  sortOrder: z.number().int(),
  priceTiers: z.array(priceTierSchema),
});

export type WorkshopVariantInput = z.infer<typeof workshopVariantSchema>;

// Full workshop form schema - explicit types without defaults for react-hook-form compatibility
export const workshopFormSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug moet minimaal 2 karakters zijn")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug mag alleen kleine letters, cijfers en koppeltekens bevatten"
    ),
  title: z.string().min(2, "Titel moet minimaal 2 karakters zijn"),
  subtitle: z.string().min(2, "Ondertitel moet minimaal 2 karakters zijn"),
  description: z
    .string()
    .min(10, "Beschrijving moet minimaal 10 karakters zijn"),
  longDescription: z.string().nullable(),
  image: z.string().nullable(),
  video: z.string().nullable(),
  duration: z.string().min(1, "Duur is verplicht"),
  groupSize: z.string().min(1, "Groepsgrootte is verplicht"),
  location: z.string().min(1, "Locatie is verplicht"),
  categories: z.array(z.string()),
  includes: z.array(z.string()),
  isPublished: z.boolean(),
  sortOrder: z.number().int(),
  priceTiers: z.array(priceTierSchema),
  variants: z.array(workshopVariantSchema),
});

export type WorkshopFormValues = z.infer<typeof workshopFormSchema>;

// Schema for creating a new workshop (id not required)
export const createWorkshopSchema = workshopFormSchema;
export type CreateWorkshopInput = z.infer<typeof createWorkshopSchema>;

// Schema for updating a workshop (id required)
export const updateWorkshopSchema = workshopFormSchema.extend({
  id: z.string(),
});
export type UpdateWorkshopInput = z.infer<typeof updateWorkshopSchema>;
