import Link from "next/link";
import { ArrowRight, FileText, Flame, MessageSquareText, Plus, Search, WalletCards } from "lucide-react";
import { createClient, getUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { dictionary, getLanguage } from "@/lib/i18n";
import type { Lead, Profile, Search as SearchType } from "@/types/database";

type RecentSearch = SearchType & { leads?: { count: number }[] };

export default async function DashboardPage() {
  const language = await getLanguage();
  const copy = dictionary[language];
  const user = await getUser();
  const supabase = await createClient();
  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const profile = profileData as Profile | null;
  const { data: searchesData } = await supabase
    .from("searches")
    .select("*, leads(count)")
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
  const openersGenerated = analyzedLeads.reduce((total, lead) => total + (Array.isArray(lead.outreach_openers) ? lead.outreach_openers.length : 0), 0);
  const credits = profile?.credits ?? 0;
  const creditProgress = Math.max(0, Math.min(100, (credits / 25) * 100));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">{copy.dashboard.title}</h1>
          <p className="text-muted-foreground">{copy.dashboard.subtitle}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/searches/new">
            <Plus className="h-4 w-4" />
            {copy.nav.newSearch}
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-semibold">{copy.dashboard.quickStartTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.dashboard.quickStartBody}</p>
            <p className="mt-2 text-xs text-muted-foreground">{copy.dashboard.quickStartNote}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/searches/new">
              {copy.dashboard.quickStartCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<FileText className="h-4 w-4" />} title={copy.dashboard.totalLeadsAnalyzed} value={analyzedLeads.length} note={copy.dashboard.leadsNote} />
        <Metric icon={<Flame className="h-4 w-4" />} title={copy.dashboard.highOpportunityLeads} value={highOpportunityLeads.length} note={copy.dashboard.highOpportunityNote} />
        <Metric icon={<MessageSquareText className="h-4 w-4" />} title={copy.dashboard.openersGenerated} value={openersGenerated} note={copy.dashboard.openersNote} />
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>{copy.dashboard.creditsRemaining}</CardDescription>
              <WalletCards className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl">{credits}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={creditProgress} />
            <p className="mt-2 text-sm text-muted-foreground">{copy.dashboard.creditProgress}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">{copy.dashboard.recentSearchesTable}</TabsTrigger>
          <TabsTrigger value="high">{copy.dashboard.highOpportunityLeads}</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <RecentSearchesTable searches={searches} copy={copy.dashboard} />
        </TabsContent>
        <TabsContent value="high">
          <Card>
            <CardHeader>
              <CardTitle>{copy.dashboard.highOpportunityLeads}</CardTitle>
              <CardDescription>{copy.dashboard.highOpportunityNote}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                {highOpportunityLeads.length} {copy.dashboard.highOpportunityLeads.toLowerCase()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({ icon, title, value, note }: { icon: React.ReactNode; title: string; value: number; note: string }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          <span className="text-muted-foreground">{icon}</span>
        </div>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{note}</CardContent>
    </Card>
  );
}

function RecentSearchesTable({ searches, copy }: { searches: RecentSearch[]; copy: (typeof dictionary)["en"]["dashboard"] | (typeof dictionary)["es"]["dashboard"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.recentSearchesTable}</CardTitle>
        <CardDescription>{copy.recentSearchesTableDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{copy.search}</TableHead>
                  <TableHead>{copy.date}</TableHead>
                  <TableHead>{copy.leadsFound}</TableHead>
                  <TableHead>{copy.status}</TableHead>
                  <TableHead className="text-right">{copy.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searches.map((search) => (
                  <TableRow key={search.id}>
                    <TableCell>
                      <div className="font-medium">
                        {search.niche} in {search.city}
                      </div>
                      <div className="text-xs text-muted-foreground">{search.country}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(search.created_at)}</TableCell>
                    <TableCell>{search.leads?.[0]?.count ?? 0}</TableCell>
                    <TableCell>
                      <Badge>{search.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/searches/${search.id}`}>{copy.view}</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {searches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      {copy.noSearches}
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
