import { z } from "zod";

// ==================== REGEX PATTERNS ====================

// Téléphone sénégalais: +22177XXXXXXX, 77XXXXXXX, 0022177XXXXXXX
const PHONE_REGEX = /^(?:\+221|00221)?(77|78|76|70|75|33)[0-9]{7}$/;

// Slug pour URLs: minuscules, chiffres, tirets
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Mot de passe fort: min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// ==================== AUTH SCHEMAS ====================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      STRONG_PASSWORD_REGEX,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  confirmPassword: z.string(),
  displayName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// ==================== CONTACT SCHEMAS ====================

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne doit pas dépasser 100 caractères")
    .regex(/^[\p{L}\s\-'’]+$/u, "Le nom contient des caractères invalides"),
  email: z
    .string()
    .email("Adresse email invalide")
    .max(255, "Email trop long"),
  phone: z
    .string()
    .regex(PHONE_REGEX, "Format de téléphone sénégalais invalide (ex: 77XXXXXXX)")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .min(3, "Le sujet doit contenir au moins 3 caractères")
    .max(200, "Le sujet ne doit pas dépasser 200 caractères"),
  message: z
    .string()
    .min(20, "Le message doit contenir au moins 20 caractères")
    .max(5000, "Le message ne doit pas dépasser 5000 caractères"),
  type: z.string().optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ==================== BOOKING SCHEMAS ====================

export const bookingSchema = z.object({
  clientName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Nom trop long"),
  clientEmail: z.string().email("Email invalide").max(255),
  clientPhone: z.string().regex(PHONE_REGEX, "Téléphone invalide"),
  serviceType: z.enum([
    "vehicle",
    "training",
    "property",
    "hygiene",
    "agrobusiness",
    "marketing",
  ]),
  startDate: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed >= new Date(new Date().setHours(0, 0, 0, 0));
  }, "Date invalide ou dans le passé"),
  endDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, "Date de fin invalide"),
  notes: z
    .string()
    .max(2000, "Les notes ne doivent pas dépasser 2000 caractères")
    .optional(),
  pickup: z.string().optional().or(z.literal("")),
  destination: z.string().optional().or(z.literal("")),
  vehicleId: z.string().optional().or(z.literal("")),
  vehicleName: z.string().optional().or(z.literal("")),
  totalPrice: z.number().optional().or(z.literal(0)),
}).refine(
  (data) => {
    if (!data.endDate) return true;
    return new Date(data.endDate) > new Date(data.startDate);
  },
  {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"],
  }
);

export type BookingInput = z.infer<typeof bookingSchema>;

// ==================== QUOTE SCHEMAS ====================

export const quoteSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Nom trop long"),
  email: z.string().email("Email invalide").max(255),
  phone: z.string().regex(PHONE_REGEX, "Téléphone invalide"),
  company: z.string().max(100, "Nom d'entreprise trop long").optional().or(z.literal("")),
  service: z.string().min(1, "Veuillez sélectionner un service").max(100),
  message: z
    .string()
    .min(20, "Veuillez décrire votre besoin (min 20 caractères)")
    .max(10000, "Description trop longue"),
  budget: z
    .string()
    .max(50, "Budget trop long")
    .optional()
    .or(z.literal("")),
  deadline: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, "Date butoir invalide"),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

// ==================== NEWSLETTER SCHEMAS ====================

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Adresse email invalide")
    .max(255, "Email trop long"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

// ==================== PROPERTY SCHEMAS ====================

export const propertySchema = z.object({
  title: z.string().min(5, "Le titre doit faire au moins 5 caractères").max(200),
  description: z.string().min(20, "La description doit faire au moins 20 caractères").max(10000),
  price: z.number().nonnegative("Le prix doit être positif").max(1000000000000),
  location: z.string().min(2, "La localisation est requise").max(200),
  city: z.string().min(2, "La ville est requise").max(100).default("Dakar"),
  category: z.string().min(1, "La catégorie est requise").max(50).default("Villa"),
  type: z.enum(["sale", "rent"], {
    errorMap: () => ({ message: "Veuillez choisir Vente ou Location" }),
  }),
  area: z.number().nonnegative().optional().default(0),
  beds: z.number().min(0).optional().default(0),
  baths: z.number().min(0).optional().default(0),
  images: z
    .array(z.string().url("URL d'image invalide"))
    .min(1, "Au moins une image est requise")
    .max(20, "Maximum 20 images"),
  status: z.enum(["available", "sold", "rented", "reserved"]).default("available"),
  featured: z.boolean().default(false),
  amenities: z.array(z.string()).max(50).optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;

// ==================== VEHICLE SCHEMAS ====================

export const vehicleSchema = z.object({
  brand: z.string().min(2, "La marque est requise").max(50),
  model: z.string().min(1, "Le modèle est requis").max(50),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  type: z.string().min(1, "Le type est requis"),
  capacity: z.number().positive().max(100),
  mode: z.enum(["rent", "sale", "both"]).default("rent"),
  pricePerDay: z.number().nonnegative().optional().default(0),
  price: z.number().nonnegative().optional().default(0),
  images: z.array(z.string().url()).min(1),
  features: z.string().optional().or(z.literal("")),
  available: z.boolean().default(true),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;

// ==================== TRAINING SCHEMAS ====================

export const trainingSchema = z.object({
  title: z.string().min(5, "Le titre est requis").max(200),
  description: z.string().min(20, "La description est requise").max(5000),
  duration: z.string().min(1, "La durée est requise").max(100),
  price: z.number().nonnegative("Le prix doit être positif ou zéro").max(10000000),
  instructor: z.string().min(2, "Le formateur est requis").max(100).optional().or(z.literal("")),
  sessionDate: z.string().optional().or(z.literal("")),
  totalPlaces: z.number().positive("Le nombre de places doit être positif").max(1000).default(20),
  enrolled: z.number().min(0).max(1000).default(0),
  category: z.string().min(1, "La catégorie est requise").max(50),
  program: z.string().optional().or(z.literal("")),
  images: z.array(z.string().url("URL d'image invalide")).min(1, "Au moins une image est requise"),
  status: z.enum(["active", "inactive", "full", "cancelled"]).default("active"),
});

export type TrainingInput = z.infer<typeof trainingSchema>;

// ==================== BLOG SCHEMAS ====================

export const blogSchema = z.object({
  title: z.string().min(5, "Le titre est requis").max(200),
  slug: z
    .string()
    .min(5, "Le slug est requis")
    .max(200)
    .regex(SLUG_REGEX, "Le slug ne doit contenir que des minuscules, chiffres et tirets"),
  excerpt: z.string().min(20, "Le résumé est requis").max(500),
  content: z.string().min(50, "Le contenu est requis").max(50000),
  coverImage: z.string().url("URL d'image invalide"),
  category: z.string().min(1, "La catégorie est requise").max(50),
  tags: z.array(z.string().max(30)).max(10),
  published: z.boolean().default(false),
  publishedAt: z.string().optional(),
  author: z.string().min(2, "L'auteur est requis").max(100),
  authorId: z.string().optional(),
  featured: z.boolean().default(false),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export type BlogInput = z.infer<typeof blogSchema>;

// ==================== ADMIN SCHEMAS ====================

export const adminSchema = z.object({
  email: z.string().email("Email invalide"),
  displayName: z.string().min(2, "Le nom est requis").max(100),
  role: z.enum(["admin", "superadmin", "editor"]),
  permissions: z.array(z.string()).optional(),
});

export type AdminInput = z.infer<typeof adminSchema>;

// ==================== UPLOAD SCHEMAS ====================

export const uploadSchema = z.object({
  file: z
    .any()
    .refine((file) => file && file.size <= 5 * 1024 * 1024, "Fichier trop volumineux (max 5MB)")
    .refine(
      (file) => file && ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
      "Format d'image non supporté (JPEG, PNG, WebP, GIF)"
    ),
});

export type UploadInput = z.infer<typeof uploadSchema>;

// ==================== SITE SETTINGS SCHEMAS ====================

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(100),
  siteDescription: z.string().max(500),
  contactEmail: z.string().email(),
  contactPhone: z.string().regex(PHONE_REGEX),
  address: z.string().max(500),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
    whatsapp: z.string().optional().or(z.literal("")),
  }),
  seo: z.object({
    defaultTitle: z.string().max(70),
    defaultDescription: z.string().max(160),
    defaultImage: z.string().url(),
    googleAnalyticsId: z.string().optional().or(z.literal("")),
  }),
  maintenance: z.object({
    enabled: z.boolean(),
    message: z.string().max(500).optional(),
  }),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

// ==================== HELPER FUNCTIONS ====================

/**
 * Valide et retourne les erreurs formatées
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });
  return errors;
}

/**
 * Crée un slug à partir d'une chaîne
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .replace(/[^a-z0-9\s-]/g, "") // Enlever les caractères spéciaux
    .trim()
    .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
    .replace(/-+/g, "-"); // Éviter les tirets multiples
}
