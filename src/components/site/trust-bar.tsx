"use client";

import { useEffect, useState } from "react";
import { Globe2, FileWarning, Layers, ShieldCheck } from "lucide-react";

interface Stats {
  total_reports: number;
  total_identifiers: number;
  by_category: Record<string, number>;
  by_country: Record<string, number>;
}

/**
 * Trust bar — shows real counts derived from approved JSON data only.
 *
 * Per the product spec we never invent statistics. If the stats endpoint
 * returns zeros, we show zeros. The four metrics here are all real and
 * derived from `/api/stats`.
 */
export function TrustBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => setStats(null));
  }, []);

  const reports = stats?.total_reports ?? 0;
  const identifiers = stats?.total_identifiers ?? 0;
  const categories = stats ? Object.keys(stats.by_category).length : 0;
  const countries = stats ? Object.keys(stats.by_country).length : 0;

  const items = [
    { icon: FileWarning, label: "Community reports", value: reports },
    { icon: Layers, label: "Tracked identifiers", value: identifiers },
    { icon: ShieldCheck, label: "Scam categories", value: categories },
    { icon: Globe2, label: "Countries covered", value: countries },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div
            key={it.label}
            className="flex items-center gap-3 rounded-xl border border-border bg-background/60 backdrop-blur-sm px-4 py-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent" style={{ color: "var(--trust-teal)" }}>
              <Icon className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold leading-none" style={{ color: "var(--trust-navy)" }}>
                {stats ? it.value.toLocaleString() : "—"}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground truncate">
                {it.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
