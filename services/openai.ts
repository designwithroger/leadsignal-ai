import OpenAI from "openai";
import { z } from "zod";
import { requireServerEnv } from "@/lib/env";
import type { OfferType, WebsiteSignals } from "@/types/database";

const aiLeadOutputSchema = z.object({
  summary: z.string(),
  mainProblems: z.array(z.string()),
  recommendedOffer: z.string(),
  reasonToContact: z.string(),
  openers: z.object({
    email: z.string(),
    linkedin: z.string(),
    instagram: z.string(),
    whatsapp: z.string()
  })
});

export type AiLeadOutput = z.infer<typeof aiLeadOutputSchema>;

export async function generateAiLeadOutput(params: {
  business: {
    name: string;
    category: string;
    websiteUrl?: string | null;
    city: string;
    country: string;
    rating?: number | null;
    reviewsCount?: number | null;
  };
  websiteSignals: WebsiteSignals;
  opportunityScore: number;
  offerType: OfferType;
  language: string;
  tone: string;
}): Promise<AiLeadOutput> {
  const client = new OpenAI({ apiKey: requireServerEnv("OPENAI_API_KEY") });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.35,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "leadsignal_opener_generation",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            summary: { type: "string" },
            mainProblems: {
              type: "array",
              items: { type: "string" }
            },
            recommendedOffer: { type: "string" },
            reasonToContact: { type: "string" },
            openers: {
              type: "object",
              additionalProperties: false,
              properties: {
                email: { type: "string" },
                linkedin: { type: "string" },
                instagram: { type: "string" },
                whatsapp: { type: "string" }
              },
              required: ["email", "linkedin", "instagram", "whatsapp"]
            }
          },
          required: ["summary", "mainProblems", "recommendedOffer", "reasonToContact", "openers"]
        }
      }
    },
    messages: [
      {
        role: "system",
        content:
          "You generate concise B2B outreach intelligence for agencies, freelancers, SEO consultants, and web designers. Do not invent facts. Only reference detected website signals supplied by the user. Avoid spammy language. Keep all openers natural, specific, and short."
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Generate structured outreach output for a local business lead.",
          rules: [
            "Do not invent facts.",
            "Only reference detected signals.",
            "Keep openers concise and natural.",
            "Avoid sounding spammy.",
            "Make the message useful for agencies and freelancers."
          ],
          business: params.business,
          websiteSignals: params.websiteSignals,
          opportunityScore: params.opportunityScore,
          selectedOfferType: params.offerType,
          selectedLanguage: params.language,
          selectedTone: params.tone
        })
      }
    ]
  });

  const raw = completion.choices[0]?.message.content ?? "{}";
  return aiLeadOutputSchema.parse(JSON.parse(raw));
}
