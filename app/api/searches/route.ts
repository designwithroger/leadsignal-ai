import { after, NextResponse } from "next/server";
import { createClient, getUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { searchSchema } from "@/lib/validation";
import { runSearchPipeline } from "@/services/leadPipeline";

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("searches")
    .select("*, leads(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ searches: data });
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = searchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: profileData } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
  const profile = profileData as { credits: number } | null;
  if (!profile || profile.credits < parsed.data.quantity) {
    return NextResponse.json({ error: "Not enough credits for this search." }, { status: 402 });
  }

  const { data: search, error } = await supabase
    .from("searches")
    .insert({
      user_id: user.id,
      niche: parsed.data.niche,
      city: parsed.data.city,
      country: parsed.data.country,
      quantity: parsed.data.quantity,
      offer_type: parsed.data.offerType,
      language: parsed.data.language,
      tone: parsed.data.tone,
      status: "queued"
    })
    .select()
    .single();

  if (error || !search) {
    return NextResponse.json({ error: error?.message ?? "Could not create search." }, { status: 500 });
  }

  after(async () => {
    try {
      await runSearchPipeline({ supabase, searchId: search.id, userId: user.id, input: parsed.data });
    } catch (pipelineError) {
      console.error("Lead search pipeline failed", pipelineError);
    }
  });

  return NextResponse.json({ searchId: search.id, status: "queued" }, { status: 202 });
}
