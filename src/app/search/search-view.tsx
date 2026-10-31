"use client";

import { useState, useTransition, FormEvent, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search, Loader2, ShieldAlert, X, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/site/status-badge";
import { ReportCard } from "@/components/site/report-card";
import {
  CATEGORY_LABELS, IDENTIFIER_TYPE_LABELS, formatDate,
} from "@/lib/labels";
import type { SearchResult } from "@/lib/types";

const SUGGESTIONS = [
  "+60123456789",
  "luxurydeals-2026.shop",
  "fx_pro_signals_99",
  "support@bkash-verify-secure.com",
];

/**
 * Client-side search view. Reads the `?q=` param on mount so links with a
 * pre-filled query work, and updates the URL when the user submits a new
 * search. Talks to /api/search.
 */
export function SearchView() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, startTransition] = useTransition();

  // If a query is present in the URL on mount, run the search automatically.
  useEffect(() => {
    if (initialQ.trim().length >= 3) {
      void runSearch(initialQ);
    }
    // Run only on mount.
  }, []);

  async function runSearch(q: string) {
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

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 3) {
      setError("Please enter at least 3 characters.");
      return;
    }
    // Update the URL so the result is shareable.
    const url = new URL(window.location.href);
    url.searchParams.set("q", q);
    router.replace(url.pathname + "?" + url.searchParams.toString(), { scroll: false });
    void runSearch(q);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2" role="search">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a phone number, website, email or social profile"
            className="pl-10 h-12 text-base"
            aria-label="Search query"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-6" disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          <span className="ml-2">Search</span>
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQuery(s)}
            className="rounded-full border border-border bg-background px-2.5 py-1 hover:bg-accent/60 transition-colors font-mono"
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">{error}</p>
      )}

      {result && (
        <SearchResultPanel
          result={result}
          onClear={() => {
            setResult(null);
            setQuery("");
            router.replace("/search", { scroll: false });
          }}
        />
      )}

      {!result && !loading && !error && (
        <div className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          <p>
            Enter any suspicious identifier above. Searches are matched against
            approved community reports — raw identifiers are never returned, only
            their masked form.
          </p>
        </div>
      )}
    </div>
  );
}

function SearchResultPanel({ result, onClear }: { result: SearchResult; onClear: () => void }) {
  const typeLabel =
    result.identifier_type !== "unknown"
      ? IDENTIFIER_TYPE_LABELS[result.identifier_type as keyof typeof IDENTIFIER_TYPE_LABELS]
      : "Identifier";

  return (
    <div className="rounded-xl border border-border bg-background p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Result for {typeLabel}
          </p>
          {result.identifier_display && (
            <p className="mt-0.5 font-mono text-lg font-semibold" style={{ color: "var(--trust-navy)" }}>
              {result.identifier_display}
            </p>
          )}
        </div>
        <button
          onClick={onClear}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={result.status} />
        {result.total_reports > 0 && (
          <span className="text-xs text-muted-foreground">
            {result.total_reports} community {result.total_reports === 1 ? "report" : "reports"}
          </span>
        )}
      </div>

      <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-sm text-foreground/80">
        <p>{result.safety_advice}</p>
      </div>

      {result.total_reports > 0 ? (
        <div className="mt-5 space-y-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
            Community reports
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.reports.map((r) => (
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
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-2">
            {result.categories.length > 0 && (
              <span>
                <span className="font-medium">Categories:</span>{" "}
                {result.categories.map((c) => CATEGORY_LABELS[c as keyof typeof CATEGORY_LABELS] || c).join(", ")}
              </span>
            )}
            {result.countries.length > 0 && (
              <span>
                <span className="font-medium">Countries:</span>{" "}
                {result.countries.join(", ")}
              </span>
            )}
          </div>
          <p className="pt-2 text-xs text-muted-foreground">
            Latest report date: {formatDate(result.reports[0]?.incident_date || "")}
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--trust-teal)" }} />
            <span>
              No community reports were found for this identifier. The absence of
              reports does not guarantee safety — scammers constantly create new
              phone numbers, websites and accounts. Always verify independently
              before sending money or sharing personal information.
            </span>
          </p>
        </div>
      )}

      <div className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
        Community reports represent submitted experiences and do not automatically
        establish criminal wrongdoing.{" "}
        <a
          href="/correction-request"
          className="font-medium underline-offset-4 hover:underline inline-flex items-center gap-1"
          style={{ color: "var(--trust-teal)" }}
        >
          Submit a correction
          <ArrowRight className="h-3 w-3" />
        </a>{" "}
        if you believe a report is inaccurate.
      </div>
    </div>
  );
}
