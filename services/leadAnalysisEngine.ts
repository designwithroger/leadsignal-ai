import type { SupabaseClient } from "@supabase/supabase-js";
import { analyzeWebsite, fetchWebsiteHtml } from "@/services/websiteAnalyzer";
import { scoreOpportunity } from "@/services/scoring";
import { generateAiLeadOutput, type AiLeadOutput } from "@/services/openai";
import type { OfferType, WebsiteSignals } from "@/types/database";

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

export type AiGenerationInput = {
  offerType: OfferType;
  language: string;
  tone: string;
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
  ai?: AiGenerationInput;
}) {
  const analysis = await analyzeLead(params.input);
  let aiOutput: AiLeadOutput | null = null;
  let errorMessage = analysis.errorMessage;

  if (params.ai) {
    try {
      aiOutput = await generateAiLeadOutput({
        business: {
          name: params.input.businessName,
          category: params.input.category,
          websiteUrl: params.input.websiteUrl,
          city: params.input.city,
          country: params.input.country,
          rating: params.input.rating,
          reviewsCount: params.input.reviewsCount
        },
        websiteSignals: analysis.websiteSignals,
        opportunityScore: analysis.opportunityScore,
        offerType: params.ai.offerType,
        language: params.ai.language,
        tone: params.ai.tone
      });
    } catch (error) {
      errorMessage = [errorMessage, error instanceof Error ? `AI generation failed: ${error.message}` : "AI generation failed."]
        .filter(Boolean)
        .join(" ");
    }
  }

  const { error } = await params.supabase
    .from("leads")
    .update({
      status: "analyzed",
      website_signals: analysis.websiteSignals,
      opportunity_score: analysis.opportunityScore,
      ai_summary: aiOutput?.summary ?? null,
      ai_main_problems: aiOutput?.mainProblems ?? [],
      recommended_offer: aiOutput?.recommendedOffer ?? null,
      reason_to_contact: aiOutput?.reasonToContact ?? null,
      outreach_openers: aiOutput?.openers ?? {},
      error_message: errorMessage || null,
      analyzed_at: new Date().toISOString()
    })
    .eq("id", params.leadId)
    .eq("user_id", params.userId);

  if (error) throw error;

  return { ...analysis, aiOutput };
}
