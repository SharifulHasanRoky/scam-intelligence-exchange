"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ShieldAlert, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { ReportCard } from "@/components/site/report-card";
import { Button } from "@/components/ui/button";

interface LatestReport {
  id: string;
  category: string;
  country: string;
  channel: string;
  identifier_type: string;
  identifier_display: string;
  incident_date: string;
  created_at: string;
  evidence_status: string;
  corroboration_count: number;
  description_preview: string;
  disputed: boolean;
}

/**
 * Client-side latest reports view. Fetches /api/latest-reports on mount and
 * renders a grid of ReportCard. Wrapped in PageShell for layout consistency.
 */
export function LatestReportsView() {
  return (
    <PageShell
      eyebrow="Recently reviewed"
      title="Latest community reports"
      subtitle="Approved reports from community members, ordered by submission date. Identifiers are masked to protect privacy."
    >
      <LatestReportsGrid />
    </PageShell>
  );
}

function LatestReportsGrid() {
  const [reports, setReports] = useState<LatestReport[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/latest-reports", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (Array.isArray(d.reports)) {
          setReports(d.reports);
          setTotal(d.total ?? d.reports.length);
        } else {
          setError(true);
        }
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!reports) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground text-center">
        Could not load reports. Please try again later.
      </div>
    );
  }
  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground text-center">
        <ShieldAlert
          className="mx-auto h-5 w-5"
          style={{ color: "var(--trust-teal)" }}
        />
        <p className="mt-2">
          No published reports yet. Be the first to{" "}
          <Link href="/report" className="underline">
            submit one
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Showing the {reports.length} most recent of{" "}
        <span className="font-medium text-foreground">{total}</span> published
        reports.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <ReportCard key={r.id} report={r} linkable={false} />
        ))}
      </div>
      <div className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
        <p>
          Looking for a specific identifier? Use the{" "}
          <Link href="/search" className="underline">
            search page
          </Link>{" "}
          to look up phone numbers, websites, emails and social profiles.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/report">
              Submit a report
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/search">Open search</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
