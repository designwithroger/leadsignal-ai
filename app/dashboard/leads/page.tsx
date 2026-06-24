import Link from "next/link";
import { createClient, getUser } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dictionary, getLanguage } from "@/lib/i18n";
import type { Lead } from "@/types/database";

export default async function LeadsPage() {
  const language = await getLanguage();
  const copy = dictionary[language];
  const user = await getUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user!.id)
    .order("opportunity_score", { ascending: false });
  const leads = (data ?? []) as Lead[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">{copy.dashboard.allLeads}</h1>
        <p className="text-muted-foreground">{copy.dashboard.leadsNote}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{copy.dashboard.allLeads}</CardTitle>
          <CardDescription>{copy.results.recommendedOffer}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.results.business}</TableHead>
                    <TableHead>{copy.results.score}</TableHead>
                    <TableHead>{copy.results.signals}</TableHead>
                    <TableHead>{copy.results.recommendedOffer}</TableHead>
                    <TableHead className="text-right">{copy.results.details}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.address}</div>
                      </TableCell>
                      <TableCell>
                        <Badge>{lead.opportunity_score}</Badge>
                      </TableCell>
                      <TableCell className="max-w-52 text-xs text-muted-foreground">{lead.status}</TableCell>
                      <TableCell className="max-w-64">{lead.recommended_offer ?? copy.results.pending}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/leads/${lead.id}`}>{copy.results.open}</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        {copy.results.noLeads}
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
