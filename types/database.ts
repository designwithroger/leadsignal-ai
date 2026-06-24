export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type OfferType = "website_audit" | "seo" | "ads" | "social_media" | "automation" | "custom";
export type SearchStatus = "queued" | "running" | "completed" | "failed";
export type LeadStatus = "new" | "analyzed" | "failed";

export type WebsiteSignals = {
  hasWebsite: boolean;
  isReachable: boolean;
  fetchStatus?: number;
  fetchError?: string;
  hasHttps: boolean;
  hasTitle: boolean;
  title?: string;
  hasMetaDescription: boolean;
  metaDescription?: string;
  hasH1: boolean;
  h1?: string;
  ctaWords: string[];
  hasForm: boolean;
  hasWhatsApp: boolean;
  socialLinks: string[];
  hasGoogleAnalytics: boolean;
  hasMetaPixel: boolean;
  hasSchemaOrg: boolean;
  hasJsonLd: boolean;
  hasBookingLink: boolean;
  bookingLinks: string[];
};

export type OutreachOpeners =
  | string[]
  | {
      email: string;
      linkedin: string;
      instagram: string;
      whatsapp: string;
    };

export type Lead = {
  id: string;
  search_id: string;
  user_id: string;
  place_id: string | null;
  name: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  google_rating: number | null;
  google_reviews: number | null;
  status: LeadStatus;
  website_signals: WebsiteSignals;
  opportunity_score: number;
  ai_summary: string | null;
  ai_main_problems?: string[] | null;
  recommended_offer: string | null;
  reason_to_contact: string | null;
  outreach_openers: OutreachOpeners;
  error_message: string | null;
  created_at: string;
  analyzed_at: string | null;
};

export type Search = {
  id: string;
  user_id: string;
  niche: string;
  city: string;
  country: string;
  quantity: number;
  offer_type: OfferType;
  language: string;
  tone: string;
  status: SearchStatus;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

export type Profile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
};
