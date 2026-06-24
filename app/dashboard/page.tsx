import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { createClient, getUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { dictionary, getLanguage } from "@/lib/i18n";
import type { Profile, Search } from "@/types/database";

type RecentSearch = Search & { leads?: { count: number }[] };

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
    .limit(6);
  const searches = (searchesData ?? []) as RecentSearch[];
  const { data: leads } = await supabase.from("leads").select("id").eq("user_id", user!.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">{copy.dashboard.title}</h1>
          <p className="text-muted-foreground">{copy.dashboard.subtitle}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new-search">
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
            <Link href="/dashboard/new-search">
              {copy.dashboard.quickStartCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric title={copy.settings.credits} value={profile?.credits ?? 0} note={copy.dashboard.creditsNote} />
        <Metric title={copy.dashboard.searches} value={searches.length} note={copy.dashboard.searchesNote} />
        <Metric title={copy.dashboard.leads} value={leads?.length ?? 0} note={copy.dashboard.leadsNote} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{copy.dashboard.recentSearches}</CardTitle>
          <CardDescription>{copy.dashboard.recentDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {searches.map((search) => (
            <Link
              key={search.id}
              href={`/dashboard/searches/${search.id}`}
              className="grid gap-3 rounded-md border p-4 hover:bg-muted/40 sm:grid-cols-[1fr_auto_auto]"
            >
              <div>
                <div className="font-medium">{search.niche} in {search.city}</div>
                <div className="text-sm text-muted-foreground">{formatDate(search.created_at)} - {search.quantity} {copy.dashboard.requested}</div>
              </div>
              <Badge>{search.status}</Badge>
              <ArrowRight className="h-4 w-4 self-center text-muted-foreground" />
            </Link>
          ))}
          {searches.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
              {copy.dashboard.noSearches}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ title, value, note }: { title: string; value: number; note: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{note}</CardContent>
    </Card>
  );
}
