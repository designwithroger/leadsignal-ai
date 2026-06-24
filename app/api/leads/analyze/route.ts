import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { leadAnalysisSchema } from "@/lib/validation";
import { analyzeAndStoreLead, analyzeLead } from "@/services/leadAnalysisEngine";
import { generateAiLeadOutput } from "@/services/openai";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = leadAnalysisSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { leadId, offerType, language, tone, ...input } = parsed.data;

  try {
    const analysis = leadId
      ? await analyzeAndStoreLead({
          supabase: createAdminClient(),
          userId: user.id,
          leadId,
          input,
          ai: { offerType, language, tone }
        })
      : await analyzeLead(input).then(async (analysis) => ({
          ...analysis,
          aiOutput: await generateAiLeadOutput({
            business: {
              name: input.businessName,
              category: input.category,
              websiteUrl: input.websiteUrl,
              city: input.city,
              country: input.country,
              rating: input.rating,
              reviewsCount: input.reviewsCount
            },
            websiteSignals: analysis.websiteSignals,
            opportunityScore: analysis.opportunityScore,
            offerType,
            language,
            tone
          })
        }));

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lead analysis failed." },
      { status: 500 }
    );
  }
}
