import { NextResponse } from "next/server";
import { createClient, getUser } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();
  const { data: search, error: searchError } = await supabase
    .from("searches")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (searchError) return NextResponse.json({ error: searchError.message }, { status: 404 });

  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .eq("search_id", id)
    .eq("user_id", user.id)
    .order("opportunity_score", { ascending: false });

  if (leadsError) return NextResponse.json({ error: leadsError.message }, { status: 500 });
  return NextResponse.json({ search, leads });
}
