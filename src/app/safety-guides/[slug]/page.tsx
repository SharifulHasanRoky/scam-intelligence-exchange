import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { SAFETY_GUIDES, getGuideBySlug } from "@/data/safety-guides";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SAFETY_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Safety guide not found" };
  return {
    title: guide.title,
    description: guide.summary,
  };
}

export default async function SafetyGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const blocks: Array<{ key: string; title: string; items: string[] }> = [
    { key: "how_it_works", title: "How it works", items: guide.how_it_works },
    { key: "warning_signs", title: "Warning signs", items: guide.warning_signs },
    { key: "how_to_avoid", title: "How to avoid", items: guide.how_to_avoid },
    { key: "if_affected", title: "If you are affected", items: guide.if_affected },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.summary,
    dateModified: "2026-01-01",
    articleBody: [
      guide.how_it_works,
      guide.warning_signs,
      guide.how_to_avoid,
      guide.if_affected,
    ]
      .flat()
      .join(" "),
    author: { "@type": "Organization", name: "Scam Intelligence Exchange" },
    publisher: { "@type": "Organization", name: "Scam Intelligence Exchange" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/safety-guides/${guide.slug}`,
    },
  };

  return (
    <PageShell
      eyebrow="Safety guide"
      title={guide.title}
      subtitle={guide.summary}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-6">
          {blocks.map((b) => (
            <section
              key={b.key}
              className="rounded-xl border border-border bg-background p-5 sm:p-6"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {b.title}
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {b.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--trust-teal)" }}
                    />
                    <span className="text-foreground/90">{it}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {guide.official_resources.length > 0 && (
            <section className="rounded-xl border border-border bg-background p-5 sm:p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Official reporting resources
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {guide.official_resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:underline"
                      style={{ color: "var(--trust-teal)" }}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Always verify the destination URL before submitting personal
                information to any external service.
              </p>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              <BookOpen
                className="h-4 w-4"
                style={{ color: "var(--trust-teal)" }}
              />
              <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
                About this guide
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This guide is non-alarmist, plain-language safety advice. It is
              maintained by the platform editors and reviewed periodically.
              Reporting figures shown on individual identifiers come from
              approved community reports — not from this guide.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Have you been targeted?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              File a community report so others can find the same identifier
              before they engage. Submissions are anonymous.
            </p>
            <Link
              href="/report"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              Report a scam
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-xl border border-dashed border-border bg-background p-5">
            <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Search the community index
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Check a phone number, website, email or social profile against
              approved reports.
            </p>
            <Link
              href="/search"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              Open search
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
