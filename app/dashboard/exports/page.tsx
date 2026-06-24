import Link from "next/link";
import { Download } from "lucide-react";
import { createClient, getUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dictionary, getLanguage } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import type { Search } from "@/types/database";

type ExportSearch = Search & { leads?: { count: number }[] };

export default async function ExportsPage() {
  const language = await getLanguage();
  const copy = dictionary[language];
  const user = await getUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("searches")
    .select("*, leads(count)")
    .eq("user_id", user!.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false });
  const searches = (data ?? []) as ExportSearch[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">{copy.dashboard.exportsTitle}</h1>
        <p className="text-muted-foreground">{copy.dashboard.exportsDescription}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{copy.dashboard.exportsTitle}</CardTitle>
          <CardDescription>{copy.dashboard.exportsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{copy.dashboard.search}</TableHead>
                  <TableHead>{copy.dashboard.date}</TableHead>
                  <TableHead>{copy.dashboard.leadsFound}</TableHead>
                  <TableHead>{copy.dashboard.status}</TableHead>
                  <TableHead className="text-right">{copy.results.exportCsv}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searches.map((search) => (
                  <TableRow key={search.id}>
                    <TableCell>{search.niche} in {search.city}</TableCell>
                    <TableCell>{formatDate(search.created_at)}</TableCell>
                    <TableCell>{search.leads?.[0]?.count ?? 0}</TableCell>
                    <TableCell>
                      <Badge>{search.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <a href={`/api/searches/${search.id}/csv`}>
                          <Download className="h-4 w-4" />
                          CSV
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {searches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      {copy.dashboard.noExports}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
