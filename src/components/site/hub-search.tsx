"use client";

import { useState, useTransition, FormEvent } from "react";
import { Search, Loader2, ShieldAlert, X, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "./status-badge";
import { ReportCard } from "./report-card";
import { CATEGORY_LABELS } from "@/lib/labels";
import type { SearchResult } from "@/lib/types";

interface HubSearchProps {
  /** Pre-set identifier type hint for the placeholder. */
  identifierType: string;
  placeholder: string;
  examples: string[];
}

/**
 * Compact search box used on hub pages. Reuses the same /api/search endpoint
 * as the homepage. Pre-fills example chips relevant to the hub's identifier
 * type.
 */
export function HubSearch({ identifierType, placeholder, examples }: HubSearchProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, startTransition] = useTransition();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 3) {
      setError("Please enter at least 3 characters.");
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Search failed");
        }
        const data: SearchResult = await res.json();
        setResult(data);
      } catch (e: any) {
        setError(e.message || "Something went wrong.");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-5 sm:p-6">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2" role="search">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 h-12 text-base"
            aria-label={`${identifierType} scam checker search`}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-6" disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          <span className="ml-2 font-semibold">Check Now</span>
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium">Try:</span>
        {examples.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQuery(s)}
            className="rounded-full border border-border bg-background px-2.5 py-1 hover:bg-accent/60 hover:border-foreground/20 transition-all font-mono"
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}

      {result && (
        <div className="mt-5">
          <HubResultPanel result={result} onClear={() => { setResult(null); setQuery(""); }} />
        </div>
      )}
    </div>
  );
}

function HubResultPanel({ result, onClear }: { result: SearchResult; onClear: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {result.total_reports > 0 ? "Match found" : "No matches"}
          </p>
          {result.identifier_display && (
            <p className="mt-0.5 font-mono text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              {result.identifier_display}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={result.status} />
          <button
            onClick={onClear}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-foreground/80">{result.safety_advice}</p>

      {result.total_reports > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Community reports ({result.total_reports})
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {result.reports.slice(0, 4).map((r) => (
              <ReportCard
                key={r.id}
                report={{
                  ...r,
                  identifier_type: result.identifier_type,
                  created_at: r.incident_date,
                }}
                linkable={false}
              />
            ))}
          </div>
          {result.categories.length > 0 && (
            <p className="text-xs text-muted-foreground pt-1">
              <span className="font-medium">Categories:</span>{" "}
              {result.categories.map((c) => CATEGORY_LABELS[c as keyof typeof CATEGORY_LABELS] || c).join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        Community reports represent submitted experiences and do not automatically establish criminal wrongdoing.{" "}
        <Link href="/#correction" className="font-medium underline-offset-4 hover:underline" style={{ color: "var(--trust-teal)" }}>
          Submit a correction
        </Link>{" "}
        if you believe a report is inaccurate.
      </div>
    </div>
  );
}
