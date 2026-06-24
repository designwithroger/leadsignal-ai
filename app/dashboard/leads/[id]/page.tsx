import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { createClient, getUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dictionary, getLanguage, type Copy } from "@/lib/i18n";
import type { Lead, WebsiteSignals } from "@/types/database";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const language = await getLanguage();
  const copy = dictionary[language];
  const user = await getUser();
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).eq("user_id", user!.id).single();

  if (!data) return <div className="rounded-lg border bg-card p-8">{copy.lead.notFound}</div>;
  const lead = data as Lead;
  const signals = lead.website_signals as WebsiteSignals;
  const socialLinks = signals.socialLinks ?? [];
  const openers = normalizeOpeners(lead.outreach_openers);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">{lead.name}</h1>
          <p className="text-muted-foreground">{lead.address}</p>
        </div>
        <Badge className="text-sm">{copy.results.score} {lead.opportunity_score}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{copy.lead.aiRecommendation}</CardTitle>
              <CardDescription>{lead.reason_to_contact}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-7">{lead.ai_summary}</p>
              <div className="rounded-md border bg-muted/40 p-4">
                <div className="text-sm font-medium">{copy.lead.recommendedOffer}</div>
                <p className="mt-1 text-sm text-muted-foreground">{lead.recommended_offer}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{copy.lead.outreachOpeners}</CardTitle>
              <CardDescription>{copy.lead.openersDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {openers.map(([channel, opener]) => (
                <div key={channel} className="rounded-md border p-4 text-sm leading-6">
                  <span className="font-medium capitalize">{channel}</span> {opener}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{copy.lead.business}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Info label={copy.lead.phone} value={lead.phone} unknown={copy.lead.unknown} />
              <Info label={copy.lead.rating} value={lead.google_rating ? `${lead.google_rating} (${lead.google_reviews ?? 0})` : null} unknown={copy.lead.unknown} />
              {lead.website ? (
                <Button asChild variant="outline" className="w-full">
                  <a href={lead.website} target="_blank" rel="noreferrer">
                    {copy.lead.website}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}
              <Button asChild variant="ghost" className="w-full">
                <Link href={`/dashboard/searches/${lead.search_id}`}>{copy.lead.backToResults}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{copy.lead.websiteSignals}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <Signal label={copy.lead.signals[0]} active={signals.hasHttps} copy={copy.lead} />
              <Signal label={copy.lead.signals[1]} active={signals.hasTitle} copy={copy.lead} />
              <Signal label={copy.lead.signals[2]} active={signals.hasMetaDescription} copy={copy.lead} />
              <Signal label={copy.lead.signals[3]} active={signals.hasH1} copy={copy.lead} />
              <Signal label={copy.lead.signals[4]} active={signals.hasForm} copy={copy.lead} />
              <Signal label={copy.lead.signals[5]} active={signals.hasWhatsApp} copy={copy.lead} />
              <Signal label={copy.lead.signals[6]} active={socialLinks.length > 0} copy={copy.lead} />
              <Signal label={copy.lead.signals[7]} active={signals.hasGoogleAnalytics} copy={copy.lead} />
              <Signal label={copy.lead.signals[8]} active={signals.hasMetaPixel} copy={copy.lead} />
              <Signal label={copy.lead.signals[9]} active={signals.hasSchemaOrg} copy={copy.lead} />
              <Signal label={copy.lead.signals[10]} active={Boolean(signals.hasBookingLink)} copy={copy.lead} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function normalizeOpeners(openers: Lead["outreach_openers"]) {
  if (Array.isArray(openers)) {
    return openers.map((opener, index) => [`#${index + 1}`, opener] as const);
  }

  if (openers && typeof openers === "object") {
    return Object.entries(openers);
  }

  return [];
}

function Info({ label, value, unknown }: { label: string; value: string | null | undefined; unknown: string }) {
  return (
    <div className="flex justify-between gap-4 border-b pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value ?? unknown}</span>
    </div>
  );
}

function Signal({ label, active, copy }: { label: string; active: boolean; copy: Copy["lead"] }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <span>{label}</span>
      <Badge className={active ? "border-primary/30 bg-primary/10 text-primary" : "border-accent/30 bg-accent/10 text-accent"}>
        {active ? copy.found : copy.gap}
      </Badge>
    </div>
  );
}
