"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, Download } from "lucide-react";
import type { Lead } from "@/types/database";
import { scoreTone } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SortKey = "score" | "name" | "rating";

export function ResultsTable({ leads, searchId }: { leads: Lead[]; searchId: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("score");

  const sorted = useMemo(() => {
    return [...leads].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "rating") return Number(b.google_rating ?? 0) - Number(a.google_rating ?? 0);
      return b.opportunity_score - a.opportunity_score;
    });
  }, [leads, sortKey]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <SortButton active={sortKey === "score"} onClick={() => setSortKey("score")}>
            Score
          </SortButton>
          <SortButton active={sortKey === "name"} onClick={() => setSortKey("name")}>
            Name
          </SortButton>
          <SortButton active={sortKey === "rating"} onClick={() => setSortKey("rating")}>
            Rating
          </SortButton>
        </div>
        <Button asChild variant="outline">
          <a href={`/api/searches/${searchId}/csv`}>
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Signals</TableHead>
                <TableHead>Recommended offer</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="min-w-56">
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.address}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={lead.opportunity_score >= 75 ? "border-accent/30 bg-accent/10 text-accent" : ""}>
                      {lead.opportunity_score} - {scoreTone(lead.opportunity_score)}
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-48 text-xs text-muted-foreground">
                    {lead.status === "failed" ? lead.error_message : signalSummary(lead)}
                  </TableCell>
                  <TableCell className="min-w-64">{lead.recommended_offer ?? "Analysis pending"}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/leads/${lead.id}`}>Open</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No leads yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function SortButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <Button variant={active ? "secondary" : "outline"} size="sm" onClick={onClick}>
      <ArrowDownUp className="h-4 w-4" />
      {children}
    </Button>
  );
}

function signalSummary(lead: Lead) {
  const signals = lead.website_signals;
  const gaps = [
    !lead.website && "No website",
    !signals.hasMetaDescription && "No meta",
    !signals.hasForm && !signals.hasWhatsApp && "No clear capture",
    !signals.hasSchemaOrg && "No schema"
  ].filter(Boolean);

  return gaps.join(" - ") || "Core signals present";
}
