import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { createClient, getUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lead, WebsiteSignals } from "@/types/database";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).eq("user_id", user!.id).single();

  if (!data) return <div className="rounded-lg border bg-card p-8">Lead not found.</div>;
  const lead = data as Lead;
  const signals = lead.website_signals as WebsiteSignals;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">{lead.name}</h1>
          <p className="text-muted-foreground">{lead.address}</p>
        </div>
        <Badge className="text-sm">Score {lead.opportunity_score}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI recommendation</CardTitle>
              <CardDescription>{lead.reason_to_contact}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-7">{lead.ai_summary}</p>
              <div className="rounded-md border bg-muted/40 p-4">
                <div className="text-sm font-medium">Recommended offer</div>
                <p className="mt-1 text-sm text-muted-foreground">{lead.recommended_offer}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outreach openers</CardTitle>
              <CardDescription>Personalized starters generated for this business.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(lead.outreach_openers ?? []).map((opener, index) => (
                <div key={opener} className="rounded-md border p-4 text-sm leading-6">
                  <span className="font-medium">#{index + 1}</span> {opener}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Info label="Phone" value={lead.phone} />
              <Info label="Rating" value={lead.google_rating ? `${lead.google_rating} (${lead.google_reviews ?? 0} reviews)` : null} />
              {lead.website ? (
                <Button asChild variant="outline" className="w-full">
                  <a href={lead.website} target="_blank" rel="noreferrer">
                    Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}
              <Button asChild variant="ghost" className="w-full">
                <Link href={`/dashboard/searches/${lead.search_id}`}>Back to results</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website signals</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <Signal label="HTTPS" active={signals.hasHttps} />
              <Signal label="Title tag" active={signals.hasTitle} />
              <Signal label="Meta description" active={signals.hasMetaDescription} />
              <Signal label="H1" active={signals.hasH1} />
              <Signal label="Lead form" active={signals.hasForm} />
              <Signal label="WhatsApp link" active={signals.hasWhatsApp} />
              <Signal label="Social links" active={signals.socialLinks.length > 0} />
              <Signal label="Google Analytics" active={signals.hasGoogleAnalytics} />
              <Signal label="Meta Pixel" active={signals.hasMetaPixel} />
              <Signal label="Schema.org" active={signals.hasSchemaOrg} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-4 border-b pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value ?? "Unknown"}</span>
    </div>
  );
}

function Signal({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <span>{label}</span>
      <Badge className={active ? "border-primary/30 bg-primary/10 text-primary" : "border-accent/30 bg-accent/10 text-accent"}>
        {active ? "Found" : "Gap"}
      </Badge>
    </div>
  );
}
