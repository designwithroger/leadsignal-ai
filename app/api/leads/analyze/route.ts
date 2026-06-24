import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { leadAnalysisSchema } from "@/lib/validation";
import { analyzeAndStoreLead, analyzeLead } from "@/services/leadAnalysisEngine";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = leadAnalysisSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { leadId, ...input } = parsed.data;

  try {
    const analysis = leadId
      ? await analyzeAndStoreLead({
          supabase: createAdminClient(),
          userId: user.id,
          leadId,
          input
        })
      : await analyzeLead(input);

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lead analysis failed." },
      { status: 500 }
    );
  }
}
