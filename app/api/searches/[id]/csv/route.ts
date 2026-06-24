import { NextResponse } from "next/server";
import { createClient, getUser } from "@/lib/supabase/server";
import { leadsToCsv } from "@/services/csv";
import type { Lead } from "@/types/database";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("search_id", id)
    .eq("user_id", user.id)
    .order("opportunity_score", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return new NextResponse(leadsToCsv((leads ?? []) as Lead[]), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leadsignal-${id}.csv"`
    }
  });
}
