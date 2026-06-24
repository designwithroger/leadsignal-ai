import { createClient, getUser } from "@/lib/supabase/server";
import { ResultsTable } from "@/components/app/results-table";
import { Badge } from "@/components/ui/badge";
import type { Lead, Search } from "@/types/database";

export default async function SearchResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  const { id } = await params;
  const supabase = await createClient();
  const { data: searchData } = await supabase.from("searches").select("*").eq("id", id).eq("user_id", user!.id).single();
  const search = searchData as Search | null;
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("search_id", id)
    .eq("user_id", user!.id)
    .order("opportunity_score", { ascending: false });

  if (!search) {
    return <div className="rounded-lg border bg-card p-8">Search not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">{search.niche} in {search.city}</h1>
          <p className="text-muted-foreground">{search.country} · {search.language} · {search.tone}</p>
        </div>
        <Badge>{search.status}</Badge>
      </div>
      {search.error_message ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {search.error_message}
        </div>
      ) : null}
      <ResultsTable leads={(leads ?? []) as Lead[]} searchId={id} />
    </div>
  );
}
