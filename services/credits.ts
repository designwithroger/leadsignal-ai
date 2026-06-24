import type { SupabaseClient } from "@supabase/supabase-js";

export async function spendCredit(supabase: SupabaseClient, userId: string, leadId: string) {
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();
  const profile = profileData as { credits: number } | null;

  if (profileError) throw profileError;
  if (!profile || profile.credits < 1) throw new Error("Not enough credits to analyze this lead.");

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ credits: profile.credits - 1, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (updateError) throw updateError;

  const { error: ledgerError } = await supabase.from("credit_ledger").insert({
    user_id: userId,
    lead_id: leadId,
    delta: -1,
    reason: "lead_analyzed"
  });

  if (ledgerError) throw ledgerError;
}
