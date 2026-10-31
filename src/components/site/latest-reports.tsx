"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ReportCard } from "./report-card";

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

/** "Recently reviewed community reports" section on the homepage. */
export function LatestReports() {
  const [reports, setReports] = useState<LatestReport[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/latest-reports")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && Array.isArray(d.reports)) setReports(d.reports);
        if (!cancelled && !Array.isArray(d.reports)) setError(true);
      })
      .catch(() => !cancelled && setError(true));
    return () => { cancelled = true; };
  }, []);

  if (!reports) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }
  if (error || reports.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No published reports yet. Be the first to{" "}
        <a href="/#report" className="underline">submit one</a>.
      </p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((r) => (
        <ReportCard key={r.id} report={r} linkable={false} />
      ))}
    </div>
  );
}
