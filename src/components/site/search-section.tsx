"use client";

import { useState, useTransition, FormEvent } from "react";
import { Search, Loader2, ShieldCheck, ShieldAlert, ArrowRight, X, Globe, Phone, Mail, Link2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { ReportCard } from "./report-card";
import {
  CATEGORY_LABELS,
  CHANNEL_LABELS,
  IDENTIFIER_TYPE_LABELS,
  SEARCH_STATUS_LABELS,
  formatDate,
} from "@/lib/labels";
import type { SearchResult } from "@/lib/types";

interface SearchSectionProps {
  /** Optional callback when a search is performed (for analytics). */
  onSearched?: (query: string) => void;
}

const SUGGESTIONS = [
  "+60123456789",
  "luxurydeals-2026.shop",
  "fx_pro_signals_99",
  "support@bkash-verify-secure.com",
];

const TRUST_PILLS = [
  { label: "100% Free", icon: ShieldCheck },
  { label: "No Sign-up", icon: ShieldCheck },
  { label: "Anonymous", icon: ShieldCheck },
  { label: "Community-Powered", icon: ShieldCheck },
];

const SCAM_CHECKER_TOOLS = [
  { href: "/website-scam-checker", label: "Website Scam Checker", desc: "Check if a website is legit", icon: Globe, keywords: "fake website checker · scam website detector · legit check" },
  { href: "/phone-number-scam-checker", label: "Phone Number Scam Checker", desc: "Check a number for scam reports", icon: Phone, keywords: "phone scam check · number scam check" },
  { href: "/email-scam-checker", label: "Email Scam Checker", desc: "Check an email for scam reports", icon: Mail, keywords: "email scam check · email fake check" },
  { href: "/phishing-link-checker", label: "Phishing Link Checker", desc: "Check a link for phishing", icon: Link2, keywords: "check phishing link · spam check" },
];

/**
 * The main search section: input, submit, results, and no-results state.
 *
 * Talks to /api/search which reads from the approved-reports search index.
 * Raw identifiers are sent for matching but only masked values are returned.
 */
export function SearchSection({ onSearched }: SearchSectionProps) {
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
        onSearched?.(q);
      } catch (e: any) {
        setError(e.message || "Something went wrong.");
      }
    });
  }

  return (
    <section id="search" className="scroll-mt-20">
      {/* Premium hero card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-muted/40 via-background to-background">
        {/* Subtle decorative glow — premium but restrained */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[42rem] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--trust-teal-soft), transparent)" }}
        />
        <div className="relative px-6 py-10 sm:px-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            {/* Trust pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {TRUST_PILLS.map((p) => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur-sm"
                >
                  <ShieldCheck className="h-3.5 w-3.5" style={{ color: "var(--trust-teal)" }} />
                  {p.label}
                </span>
              ))}
            </div>

            <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-balance leading-[1.05]" style={{ color: "var(--trust-navy)" }}>
              Free Scam Checker
              <span className="block mt-1 text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: "var(--trust-teal)" }}>
                Check Before You Trust
              </span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Use our free scam checker to search suspicious phone numbers, websites, emails and online profiles against community reports — before you interact or send money.
            </p>

            {/* Premium search box */}
            <form onSubmit={onSubmit} className="mt-8 mx-auto max-w-2xl" role="search">
              <div className="flex flex-col sm:flex-row gap-2 rounded-2xl sm:rounded-full sm:border sm:border-border sm:bg-background sm:p-1.5 sm:shadow-sm sm:focus-within:shadow-md sm:focus-within:border-foreground/20 transition-all">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter a phone number, website, email or profile"
                    className="pl-11 h-13 sm:h-12 text-base border-0 sm:border bg-background rounded-2xl sm:rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
                    aria-label="Scam checker search query"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <Button type="submit" size="lg" className="h-13 sm:h-12 px-7 rounded-2xl sm:rounded-full" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  <span className="ml-2 font-semibold">Check Now</span>
                </Button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">Try:</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-border bg-background/80 px-2.5 py-1 hover:bg-accent/60 hover:border-foreground/20 transition-all font-mono"
                >
                  {s}
                </button>
              ))}
            </div>

            {error && (
              <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="mx-auto mt-10 max-w-3xl">
              <SearchResultPanel result={result} onClear={() => { setResult(null); setQuery(""); }} />
            </div>
          )}
        </div>
      </div>

      {/* Scam checker tools — internal links to hub pages */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SCAM_CHECKER_TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className="group relative flex items-start gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:border-foreground/20 hover:shadow-sm hover:-translate-y-0.5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-muted" style={{ color: "var(--trust-teal)" }}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>{t.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-wide text-muted-foreground/70 line-clamp-1">{t.keywords}</p>
              </div>
              <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>
    </section>
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
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--trust-teal)" }} />
            <span>
              No community reports were found for this identifier. The absence of reports does not guarantee safety — scammers constantly create new phone numbers, websites and accounts. Always verify independently before sending money or sharing personal information.
            </span>
          </p>
        </div>
      )}

      <div className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
        Community reports represent submitted experiences and do not automatically establish criminal wrongdoing.{" "}
        <a href="/#correction" className="font-medium underline-offset-4 hover:underline" style={{ color: "var(--trust-teal)" }}>
          Submit a correction
        </a>{" "}
        if you believe a report is inaccurate.
      </div>
    </div>
  );
}
