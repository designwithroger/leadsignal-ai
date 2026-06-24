import type { Json } from "./database";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          company_name: string | null;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          company_name?: string | null;
          credits?: number;
        };
        Update: {
          full_name?: string | null;
          company_name?: string | null;
          credits?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      searches: {
        Row: {
          id: string;
          user_id: string;
          niche: string;
          city: string;
          country: string;
          quantity: number;
          offer_type: "website_audit" | "seo" | "ads" | "social_media" | "automation" | "custom";
          language: string;
          tone: string;
          status: "queued" | "running" | "completed" | "failed";
          error_message: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["searches"]["Row"]> & {
          user_id: string;
          niche: string;
          city: string;
          country: string;
          quantity: number;
          offer_type: "website_audit" | "seo" | "ads" | "social_media" | "automation" | "custom";
        };
        Update: Partial<Database["public"]["Tables"]["searches"]["Row"]>;
        Relationships: [];
      };
      leads: {
        Row: {
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
          status: "new" | "analyzed" | "failed";
          website_signals: Json;
          opportunity_score: number;
          ai_summary: string | null;
          recommended_offer: string | null;
          reason_to_contact: string | null;
          outreach_openers: Json;
          error_message: string | null;
          created_at: string;
          analyzed_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["leads"]["Row"]> & {
          search_id: string;
          user_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Row"]>;
        Relationships: [];
      };
      credit_ledger: {
        Row: {
          id: string;
          user_id: string;
          lead_id: string | null;
          delta: number;
          reason: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          lead_id?: string | null;
          delta: number;
          reason: string;
        };
        Update: never;
        Relationships: [];
      };
      customer_accounts: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          subscription_status: "free" | "trialing" | "active" | "past_due" | "canceled";
          plan_key: string;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: { user_id: string };
        Update: {
          stripe_customer_id?: string | null;
          subscription_status?: "free" | "trialing" | "active" | "past_due" | "canceled";
          plan_key?: string;
          current_period_end?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      offer_type: "website_audit" | "seo" | "ads" | "social_media" | "automation" | "custom";
      search_status: "queued" | "running" | "completed" | "failed";
      lead_status: "new" | "analyzed" | "failed";
      subscription_status: "free" | "trialing" | "active" | "past_due" | "canceled";
    };
    CompositeTypes: {};
  };
};
