import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { createClient, getUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Profile, Search } from "@/types/database";

type RecentSearch = Search & { leads?: { count: number }[] };

export default async function DashboardPage() {
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
          <h1 className="text-2xl font-semibold tracking-normal">Dashboard</h1>
          <p className="text-muted-foreground">Track searches, credits, and generated opportunities.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new-search">
            <Plus className="h-4 w-4" />
            New search
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric title="Credits" value={profile?.credits ?? 0} note="1 credit per analyzed lead" />
        <Metric title="Searches" value={searches.length} note="Recent saved searches" />
        <Metric title="Leads" value={leads?.length ?? 0} note="Analyzed and pending leads" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent searches</CardTitle>
          <CardDescription>Open a search to review scored leads and export CSV.</CardDescription>
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
                <div className="text-sm text-muted-foreground">{formatDate(search.created_at)} · {search.quantity} requested</div>
              </div>
              <Badge>{search.status}</Badge>
              <ArrowRight className="h-4 w-4 self-center text-muted-foreground" />
            </Link>
          ))}
          {searches.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
              No searches yet.
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
