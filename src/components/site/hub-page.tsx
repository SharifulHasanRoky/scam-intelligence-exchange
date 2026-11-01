import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, BookOpen, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HubSearch } from "@/components/site/hub-search";
import { HUB_PAGES, type HubPageContent } from "@/data/hub-pages";
import { SAFETY_GUIDES } from "@/data/safety-guides";

/**
 * Shared hub page renderer. Each of the four scam-checker hub pages is a
 * thin wrapper that exports metadata + renders <HubPage content={...} />.
 */
export function HubPage({ content }: { content: HubPageContent }) {
  const relatedGuides = content.relatedGuides
    .map((slug) => SAFETY_GUIDES.find((g) => g.slug === slug))
    .filter(Boolean);
  const relatedHubs = content.relatedHubs
    .map((slug) => HUB_PAGES.find((p) => p.slug === slug))
    .filter(Boolean);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: content.h1, item: content.href },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="surface-soft border-b border-border">
          <div className="container-page py-10 sm:py-14">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to scam checker
            </Link>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: "var(--trust-teal)" }} />
                Free · No sign-up · Anonymous
              </div>
              <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-balance" style={{ color: "var(--trust-navy)" }}>
                {content.h1}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
                {content.subtitle}
              </p>
            </div>
            <div className="mt-8 max-w-3xl">
              <HubSearch
                identifierType={content.identifierType}
                placeholder={content.searchPlaceholder}
                examples={content.examples}
              />
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="container-page py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--trust-teal)" }}>
                How to use
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--trust-navy)" }}>
                How to use this scam checker
              </h2>
              <div className="mt-6 space-y-5">
                {content.howToUse.map((s, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold text-sm" style={{ background: "var(--trust-navy)", color: "var(--trust-teal)" }}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>{s.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* How it works */}
              <div className="mt-10">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--trust-teal)" }}>
                  How it works
                </p>
                <h3 className="mt-1 text-xl font-bold tracking-tight" style={{ color: "var(--trust-navy)" }}>
                  How our scam checker works under the hood
                </h3>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
                  {content.howItWorks.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Warning signs sidebar */}
            <div className="rounded-2xl border border-border bg-muted/30 p-5 sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" style={{ color: "var(--trust-teal)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
                  Warning signs
                </h3>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {content.warningSigns.map((w) => (
                  <li key={w} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                    <span className="text-foreground/80">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* What to do if flagged */}
        <section className="bg-muted/20 border-y border-border">
          <div className="container-page py-12 sm:py-16">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--trust-teal)" }}>
                If flagged
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--trust-navy)" }}>
                What to do if an identifier is flagged
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {content.ifFlagged.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--trust-teal)" }} />
                    <span className="text-sm text-foreground/80">{s}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/#report"
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-background"
                  style={{ background: "var(--trust-navy)" }}
                >
                  Report this scam
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container-page py-12 sm:py-16">
          <div className="max-w-2xl mb-6">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--trust-teal)" }}>
              FAQ
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--trust-navy)" }}>
              Frequently asked questions
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-background divide-y divide-border overflow-hidden">
            {content.faqs.map((f, i) => (
              <details key={i} className="group py-4 px-5 open:pb-5">
                <summary className="flex items-start justify-between gap-3 cursor-pointer list-none">
                  <h3 className="text-sm sm:text-base font-semibold pr-4" style={{ color: "var(--trust-navy)" }}>
                    {f.q}
                  </h3>
                  <span
                    className="mt-0.5 shrink-0 h-6 w-6 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related guides + other checkers */}
        <section className="container-page pb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            {relatedGuides.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--trust-navy)" }}>
                  <BookOpen className="h-4 w-4" style={{ color: "var(--trust-teal)" }} />
                  Related safety guides
                </h3>
                <div className="grid gap-2">
                  {relatedGuides.map((g) => (
                    <Link
                      key={g!.slug}
                      href={`/safety-guides/${g!.slug}`}
                      className="group flex items-center justify-between rounded-lg border border-border bg-background p-3 hover:border-foreground/20 hover:bg-accent/30 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--trust-navy)" }}>{g!.title}</p>
                        <p className="text-xs text-muted-foreground">{g!.summary}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {relatedHubs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--trust-navy)" }}>
                  <ShieldCheck className="h-4 w-4" style={{ color: "var(--trust-teal)" }} />
                  Other scam checkers
                </h3>
                <div className="grid gap-2">
                  {relatedHubs.map((h) => (
                    <Link
                      key={h!.slug}
                      href={h!.href}
                      className="group flex items-center justify-between rounded-lg border border-border bg-background p-3 hover:border-foreground/20 hover:bg-accent/30 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--trust-navy)" }}>{h!.h1}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{h!.subtitle}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
