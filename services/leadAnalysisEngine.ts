import type { SupabaseClient } from "@supabase/supabase-js";
import { analyzeWebsite, fetchWebsiteHtml } from "@/services/websiteAnalyzer";
import { scoreOpportunity } from "@/services/scoring";
import type { WebsiteSignals } from "@/types/database";

export type LeadAnalysisInput = {
  businessName: string;
  category: string;
  websiteUrl?: string | null;
  city: string;
  country: string;
  rating?: number | null;
  reviewsCount?: number | null;
};

export type LeadAnalysisResult = {
  input: LeadAnalysisInput;
  websiteSignals: WebsiteSignals;
  opportunityScore: number;
  errorMessage: string | null;
};

export async function analyzeLead(input: LeadAnalysisInput): Promise<LeadAnalysisResult> {
  const fetchResult = await fetchWebsiteHtml(input.websiteUrl);
  const websiteSignals = analyzeWebsite(input.websiteUrl, fetchResult);
  const opportunityScore = scoreOpportunity(websiteSignals, Boolean(input.websiteUrl));

  return {
    input,
    websiteSignals,
    opportunityScore,
    errorMessage: websiteSignals.fetchError ?? null
  };
}

export async function analyzeAndStoreLead(params: {
  supabase: SupabaseClient;
  userId: string;
  leadId: string;
  input: LeadAnalysisInput;
}) {
  const analysis = await analyzeLead(params.input);

  const { error } = await params.supabase
    .from("leads")
    .update({
      status: "analyzed",
      website_signals: analysis.websiteSignals,
      opportunity_score: analysis.opportunityScore,
      ai_summary: null,
      recommended_offer: null,
      reason_to_contact: null,
      outreach_openers: [],
      error_message: analysis.errorMessage,
      analyzed_at: new Date().toISOString()
    })
    .eq("id", params.leadId)
    .eq("user_id", params.userId);

  if (error) throw error;

  return analysis;
}
