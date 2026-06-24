import type { Lead } from "@/types/database";

function escapeCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function leadsToCsv(leads: Lead[]) {
  const headers = [
    "Name",
    "Website",
    "Phone",
    "Address",
    "Rating",
    "Reviews",
    "Score",
    "Summary",
    "Recommended Offer",
    "Reason",
    "Openers"
  ];

  const rows = leads.map((lead) => [
    lead.name,
    lead.website,
    lead.phone,
    lead.address,
    lead.google_rating,
    lead.google_reviews,
    lead.opportunity_score,
    lead.ai_summary,
    lead.recommended_offer,
    lead.reason_to_contact,
    lead.outreach_openers.join(" | ")
  ]);

  return [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");
}
