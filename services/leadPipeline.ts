import type { SupabaseClient } from "@supabase/supabase-js";
import type { SearchInput } from "@/lib/validation";
import { analyzeWebsite, fetchWebsiteHtml } from "@/services/websiteAnalyzer";
import { scoreOpportunity } from "@/services/scoring";
import { fallbackLeadCopy, generateLeadCopy } from "@/services/openai";
import { searchPlaces } from "@/services/googlePlaces";
import { spendCredit } from "@/services/credits";

export async function runSearchPipeline(params: {
  supabase: SupabaseClient;
  searchId: string;
  userId: string;
  input: SearchInput;
}) {
  const { supabase, searchId, userId, input } = params;

  await supabase.from("searches").update({ status: "running" }).eq("id", searchId).eq("user_id", userId);

  try {
    const places = await searchPlaces(`${input.niche} in ${input.city}, ${input.country}`, input.quantity);

    for (const place of places) {
      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          search_id: searchId,
          user_id: userId,
          place_id: place.placeId,
          name: place.name,
          address: place.address ?? null,
          phone: place.phone ?? null,
          website: place.website ?? null,
          google_rating: place.rating ?? null,
          google_reviews: place.reviews ?? null,
          status: "new"
        })
        .select()
        .single();

      if (error || !lead) throw error ?? new Error("Could not create lead.");

      try {
        await spendCredit(supabase, userId, lead.id);
        const html = await fetchWebsiteHtml(place.website);
        const signals = analyzeWebsite(place.website, html);
        const score = scoreOpportunity(signals, Boolean(place.website));

        let copy;
        try {
          copy = await generateLeadCopy({
            businessName: place.name,
            address: place.address,
            website: place.website,
            signals,
            score,
            search: input
          });
        } catch {
          copy = fallbackLeadCopy({
            businessName: place.name,
            website: place.website,
            signals,
            score,
            search: input
          });
        }

        await supabase
          .from("leads")
          .update({
            status: "analyzed",
            website_signals: signals,
            opportunity_score: score,
            ai_summary: copy.summary,
            recommended_offer: copy.recommendedOffer,
            reason_to_contact: copy.reasonToContact,
            outreach_openers: copy.outreachOpeners,
            analyzed_at: new Date().toISOString()
          })
          .eq("id", lead.id)
          .eq("user_id", userId);
      } catch (leadError) {
        await supabase
          .from("leads")
          .update({
            status: "failed",
            error_message: leadError instanceof Error ? leadError.message : "Lead analysis failed"
          })
          .eq("id", lead.id)
          .eq("user_id", userId);
      }
    }

    await supabase
      .from("searches")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", searchId)
      .eq("user_id", userId);
  } catch (error) {
    await supabase
      .from("searches")
      .update({
        status: "failed",
        error_message: error instanceof Error ? error.message : "Search failed"
      })
      .eq("id", searchId)
      .eq("user_id", userId);
    throw error;
  }
}
