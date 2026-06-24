import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient, getUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dictionary, getLanguage } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import type { Search } from "@/types/database";

type SearchWithCount = Search & { leads?: { count: number }[] };

export default async function SearchesPage() {
  const language = await getLanguage();
  const copy = dictionary[language];
  const user = await getUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("searches")
    .select("*, leads(count)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });
  const searches = (data ?? []) as SearchWithCount[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">{copy.dashboard.allSearches}</h1>
          <p className="text-muted-foreground">{copy.dashboard.recentSearchesTableDescription}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/searches/new">
            <Plus className="h-4 w-4" />
            {copy.nav.newSearch}
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{copy.dashboard.allSearches}</CardTitle>
          <CardDescription>{copy.dashboard.recentDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.dashboard.search}</TableHead>
                    <TableHead>{copy.dashboard.date}</TableHead>
                    <TableHead>{copy.dashboard.leadsFound}</TableHead>
                    <TableHead>{copy.dashboard.status}</TableHead>
                    <TableHead className="text-right">{copy.dashboard.action}</TableHead>
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
                      <TableCell>{formatDate(search.created_at)}</TableCell>
                      <TableCell>{search.leads?.[0]?.count ?? 0}</TableCell>
                      <TableCell>
                        <Badge>{search.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/searches/${search.id}`}>{copy.dashboard.view}</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {searches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        {copy.dashboard.noSearches}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
