import type { SupabaseClient } from "@supabase/supabase-js";
import type { SearchInput } from "@/lib/validation";
import { analyzeAndStoreLead } from "@/services/leadAnalysisEngine";
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
        await analyzeAndStoreLead({
          supabase,
          userId,
          leadId: lead.id,
          input: {
            businessName: place.name,
            category: input.niche,
            websiteUrl: place.website,
            city: input.city,
            country: input.country,
            rating: place.rating ?? null,
            reviewsCount: place.reviews ?? null
          },
          ai: {
            offerType: input.offerType,
            language: input.language,
            tone: input.tone
          }
        });
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
