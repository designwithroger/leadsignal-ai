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

export const leadAnalysisSchema = z.object({
  leadId: z.string().uuid().optional(),
  businessName: z.string().min(1).max(160),
  category: z.string().min(1).max(120),
  websiteUrl: z.string().url().optional().nullable(),
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  rating: z.coerce.number().min(0).max(5).optional().nullable(),
  reviewsCount: z.coerce.number().int().min(0).optional().nullable()
});

export type SearchInput = z.infer<typeof searchSchema>;
