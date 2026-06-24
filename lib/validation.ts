import { z } from "zod";

export const searchSchema = z.object({
  niche: z.string().min(2).max(80),
  city: z.string().min(2).max(80),
  country: z.string().min(2).max(80),
  quantity: z.coerce.number().int().min(1).max(25),
  offerType: z.enum(["website_audit", "seo", "ads", "social_media", "automation", "custom"]),
  language: z.string().min(2).max(40).default("English"),
  tone: z.string().min(2).max(40).default("friendly")
});

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const settingsSchema = z.object({
  fullName: z.string().max(120).optional(),
  companyName: z.string().max(120).optional()
});

export type SearchInput = z.infer<typeof searchSchema>;
