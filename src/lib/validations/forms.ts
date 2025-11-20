import { z } from "zod";

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// User Management Schema
export const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["admin", "user", "moderator"], {
    message: "Please select a role.",
  }),
  bio: z
    .string()
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    })
    .optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

// Admin Settings Schema
export const settingsFormSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  siteDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  maintenanceMode: z.boolean().optional(),
  allowRegistration: z.boolean().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// Newsletter Subscription Schema
export const newsletterSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

// Profile Update Schema
export const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(20, {
      message: "Username must not exceed 20 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z
    .string()
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    })
    .optional(),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Workshop Configuration Schema
export const workshopConfigSchema = z
  .object({
    type: z.enum(["zakelijk", "particulier"], {
      message: "Selecteer zakelijk of particulier.",
    }),
    participantCount: z
      .number()
      .min(1, {
        message: "Er moet minimaal 1 persoon zijn.",
      })
      .max(100, {
        message: "Maximum 100 personen toegestaan.",
      }),
    workshops: z.array(z.string()).min(1, {
      message: "Selecteer minimaal één workshop.",
    }),
    location: z.enum(["Nijmegen", "Arnhem", "Amersfoort", "other"], {
      message: "Selecteer een locatie.",
    }),
    customCity: z.string().optional(),
    date: z.string().optional(),
    dateTbd: z.boolean().default(false),
    time: z.string().optional(),
    timeTbd: z.boolean().default(false),
    duration: z.number().min(1).max(12).optional(),
    companyName: z.string().optional(),
    btwNumber: z.string().optional(),
    name: z.string().min(2, {
      message: "Naam moet minimaal 2 karakters zijn.",
    }),
    email: z.string().email({
      message: "Voer een geldig e-mailadres in.",
    }),
  })
  .refine(
    (data) => {
      // If location is "other", customCity must be provided
      if (data.location === "other") {
        return !!data.customCity && data.customCity.length >= 2;
      }
      return true;
    },
    {
      message: "Voer een plaatsnaam in.",
      path: ["customCity"],
    }
  )
  .refine(
    (data) => {
      // If dateTbd is false, date must be provided
      if (!data.dateTbd) {
        return !!data.date;
      }
      return true;
    },
    {
      message: "Selecteer een datum of kies 'Nog te bepalen'.",
      path: ["date"],
    }
  )
  .refine(
    (data) => {
      // If timeTbd is false, time must be provided
      if (!data.timeTbd) {
        return !!data.time;
      }
      return true;
    },
    {
      message: "Selecteer een tijd of kies 'Nog te bepalen'.",
      path: ["time"],
    }
  )
  .refine(
    (data) => {
      // If type is "zakelijk", companyName must be provided
      if (data.type === "zakelijk") {
        return !!data.companyName && data.companyName.length >= 2;
      }
      return true;
    },
    {
      message: "Bedrijfsnaam is verplicht voor zakelijke boekingen.",
      path: ["companyName"],
    }
  );

export type WorkshopConfigValues = z.infer<typeof workshopConfigSchema>;
