import OpenAI from "openai";
import { z } from "zod";
import { requireServerEnv } from "@/lib/env";
import type { SearchInput } from "@/lib/validation";
import type { WebsiteSignals } from "@/types/database";

const leadCopySchema = z.object({
  summary: z.string(),
  recommendedOffer: z.string(),
  reasonToContact: z.string(),
  outreachOpeners: z.array(z.string()).min(3).max(5)
});

export type LeadCopy = z.infer<typeof leadCopySchema>;

export async function generateLeadCopy(params: {
  businessName: string;
  address?: string | null;
  website?: string | null;
  signals: WebsiteSignals;
  score: number;
  search: SearchInput;
}): Promise<LeadCopy> {
  const client = new OpenAI({ apiKey: requireServerEnv("OPENAI_API_KEY") });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "lead_outreach",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            summary: { type: "string" },
            recommendedOffer: { type: "string" },
            reasonToContact: { type: "string" },
            outreachOpeners: {
              type: "array",
              minItems: 3,
              maxItems: 5,
              items: { type: "string" }
            }
          },
          required: ["summary", "recommendedOffer", "reasonToContact", "outreachOpeners"]
        }
      }
    },
    messages: [
      {
        role: "system",
        content:
          "You write concise, specific B2B outreach intelligence for local businesses. Avoid fake claims. Use the requested language and tone."
      },
      {
        role: "user",
        content: JSON.stringify({
          business: params.businessName,
          address: params.address,
          website: params.website,
          opportunityScore: params.score,
          desiredOffer: params.search.offerType,
          language: params.search.language,
          tone: params.search.tone,
          websiteSignals: params.signals
        })
      }
    ]
  });

  const raw = completion.choices[0]?.message.content ?? "{}";
  return leadCopySchema.parse(JSON.parse(raw));
}

export function fallbackLeadCopy(params: {
  businessName: string;
  website?: string | null;
  signals: WebsiteSignals;
  score: number;
  search: SearchInput;
}): LeadCopy {
  const missing = [
    !params.website && "no visible website",
    !params.signals.hasMetaDescription && "missing meta description",
    !params.signals.hasForm && "no lead form detected",
    params.signals.ctaWords.length === 0 && "weak calls to action"
  ].filter(Boolean);

  return {
    summary: `${params.businessName} has an opportunity score of ${params.score}. Key gaps: ${missing.join(", ") || "basic optimization opportunities"}.`,
    recommendedOffer: `A ${params.search.offerType.replaceAll("_", " ")} offer focused on fast, visible improvements.`,
    reasonToContact: `Their current online presence shows signals that a practical marketing improvement could help convert more local demand.`,
    outreachOpeners: [
      `I noticed ${params.businessName} while researching ${params.search.niche} businesses in ${params.search.city}.`,
      `Your local presence looks established, and I spotted a few quick website conversion opportunities.`,
      `I put together a short idea that could help more visitors turn into inquiries.`
    ]
  };
}
