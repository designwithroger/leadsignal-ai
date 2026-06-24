import Link from "next/link";
import { ArrowRight, BarChart3, FileText, MessageSquareText, Plus, Search, TrendingUp, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dictionary, getLanguage } from "@/lib/i18n";
import { createClient, getUser } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Lead, Profile, Search as SearchType } from "@/types/database";

type RecentSearch = SearchType & {
  leads?: Pick<Lead, "id" | "opportunity_score">[];
};

type DashboardCopy = (typeof dictionary)["en"]["dashboard"] | (typeof dictionary)["es"]["dashboard"];

export default async function DashboardPage() {
  const language = await getLanguage();
  const copy = dictionary[language];
  const user = await getUser();
  const supabase = await createClient();

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const profile = profileData as Profile | null;

  const { data: searchesData } = await supabase
    .from("searches")
    .select("*, leads(id, opportunity_score)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(8);
  const searches = (searchesData ?? []) as RecentSearch[];

  const { data: leadsData } = await supabase
    .from("leads")
    .select("id, status, opportunity_score, outreach_openers")
    .eq("user_id", user!.id);
  const leads = (leadsData ?? []) as Pick<Lead, "id" | "status" | "opportunity_score" | "outreach_openers">[];

  const analyzedLeads = leads.filter((lead) => lead.status === "analyzed");
  const highOpportunityLeads = analyzedLeads.filter((lead) => lead.opportunity_score >= 75);
  const openersGenerated = analyzedLeads.reduce((total, lead) => {
    if (Array.isArray(lead.outreach_openers)) return total + lead.outreach_openers.length;
    if (lead.outreach_openers && typeof lead.outreach_openers === "object") return total + Object.keys(lead.outreach_openers).length;
    return total;
  }, 0);
  const credits = profile?.credits ?? 0;
  const creditProgress = Math.max(0, Math.min(100, (credits / 25) * 100));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge className="mb-3 border-accent/30 bg-accent/10 text-accent">{copy.dashboard.overviewEyebrow}</Badge>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">{copy.dashboard.title}</h1>
          <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">{copy.dashboard.subtitle}</p>
        </div>
        <Button asChild className="bg-primary shadow-sm hover:bg-[#1E40AF]">
          <Link href="/dashboard/searches/new">
            <Plus className="h-4 w-4" />
            {copy.dashboard.newLeadSearch}
          </Link>
        </Button>
      </div>

      {searches.length === 0 ? <EmptyState copy={copy.dashboard} /> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<FileText className="h-4 w-4" />}
          title={copy.dashboard.totalLeadsAnalyzed}
          value={analyzedLeads.length}
          note={copy.dashboard.leadsNote}
        />
        <MetricCard
          icon={<TrendingUp className="h-4 w-4" />}
          title={copy.dashboard.highOpportunityLeads}
          value={highOpportunityLeads.length}
          note={copy.dashboard.highOpportunityNote}
          accent
        />
        <MetricCard
          icon={<MessageSquareText className="h-4 w-4" />}
          title={copy.dashboard.openersGenerated}
          value={openersGenerated}
          note={copy.dashboard.openersNote}
        />
        <Card className="border-primary/15 bg-card shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardDescription>{copy.dashboard.creditsRemaining}</CardDescription>
              <span className="rounded-md border border-primary/20 bg-primary/10 p-2 text-primary">
                <WalletCards className="h-4 w-4" />
              </span>
            </div>
            <CardTitle className="text-3xl">{credits}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={creditProgress} />
            <p className="mt-2 text-sm text-muted-foreground">{copy.dashboard.creditsNote}</p>
          </CardContent>
        </Card>
      </section>

      <RecentSearchesTable searches={searches} copy={copy.dashboard} />
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  note,
  accent = false
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  note: string;
  accent?: boolean;
}) {
  return (
    <Card className="bg-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardDescription>{title}</CardDescription>
          <span className={accent ? "rounded-md border border-accent/25 bg-accent/10 p-2 text-accent" : "rounded-md border bg-background p-2 text-muted-foreground"}>
            {icon}
          </span>
        </div>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-muted-foreground">{note}</CardContent>
    </Card>
  );
}

function EmptyState({ copy }: { copy: DashboardCopy }) {
  return (
    <Card className="overflow-hidden bg-card shadow-sm">
      <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-normal text-foreground">{copy.emptyTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.emptyDescription}</p>
          </div>
        </div>
        <Button asChild className="bg-primary shadow-sm hover:bg-[#1E40AF]">
          <Link href="/dashboard/searches/new">
            {copy.emptyCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function RecentSearchesTable({ searches, copy }: { searches: RecentSearch[]; copy: DashboardCopy }) {
  return (
    <Card className="bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{copy.recentSearchesTable}</CardTitle>
          <CardDescription>{copy.recentSearchesTableDescription}</CardDescription>
        </div>
        <Button asChild variant="outline" className="bg-background">
          <Link href="/dashboard/searches">{copy.allSearches}</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>{copy.searchQuery}</TableHead>
                  <TableHead>{copy.location}</TableHead>
                  <TableHead>{copy.leadsFound}</TableHead>
                  <TableHead>{copy.highOpportunityShort}</TableHead>
                  <TableHead>{copy.date}</TableHead>
                  <TableHead>{copy.status}</TableHead>
                  <TableHead className="text-right">{copy.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searches.map((search) => {
                  const leads = search.leads ?? [];
                  const highOpportunityCount = leads.filter((lead) => lead.opportunity_score >= 75).length;
                  return (
                    <TableRow key={search.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">{search.niche}</div>
                        <div className="text-xs text-muted-foreground">{search.offer_type.replaceAll("_", " ")}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {search.city}, {search.country}
                      </TableCell>
                      <TableCell>{leads.length}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                          {highOpportunityCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(search.created_at)}</TableCell>
                      <TableCell>
                        <Badge className={statusClassName(search.status)}>{search.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/searches/${search.id}`}>{copy.view}</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {searches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                        <div className="font-medium text-foreground">{copy.emptyTitle}</div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.emptyDescription}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function statusClassName(status: string) {
  if (status === "completed") return "border-accent/30 bg-accent/10 text-accent";
  if (status === "failed") return "border-destructive/30 bg-destructive/10 text-destructive";
  return "bg-background text-muted-foreground";
}
