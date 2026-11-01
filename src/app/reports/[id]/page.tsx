import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, MessageCircle, Calendar, ShieldAlert, ArrowRight,
  AlertTriangle, FileText, Hash,
} from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { StatusBadge } from "@/components/site/status-badge";
import { getReportStore } from "@/lib/storage";
import {
  CATEGORY_LABELS,
  CHANNEL_LABELS,
  IDENTIFIER_TYPE_LABELS,
  EVIDENCE_STATUS_LABELS,
  formatDate,
} from "@/lib/labels";
import { COUNTRIES } from "@/data/countries";
import { getCategoryById } from "@/data/categories";
import { getGuideBySlug } from "@/data/safety-guides";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Generate the page title from the report being rendered. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!/^SC-\d{4,}$/.test(id)) return { title: "Report not found" };
  const store = getReportStore();
  const report = await store.getReport(id);
  if (!report) return { title: "Report not found" };
  const cat = getCategoryById(report.category)?.name || report.category;
  return {
    title: `${report.id} — ${cat}`,
    description: report.description.slice(0, 160),
  };
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!/^SC-\d{4,}$/.test(id)) notFound();
  const store = getReportStore();
  const report = await store.getReport(id);
  if (!report) notFound();

  const cat = getCategoryById(report.category);
  const categoryLabel = CATEGORY_LABELS[report.category] || report.category;
  const channelLabel = CHANNEL_LABELS[report.channel] || report.channel;
  const typeLabel = IDENTIFIER_TYPE_LABELS[report.identifier_type];
  const countryMeta = COUNTRIES.find((c) => c.name === report.country);
  const evidenceLabel =
    EVIDENCE_STATUS_LABELS[report.evidence_status] || report.evidence_status;

  // Map the report category to a relevant safety guide for cross-linking.
  const guide = cat
    ? getGuideBySlug(
        cat.id === "online_shopping" ? "fake-online-stores"
        : cat.id === "fake_job" ? "fake-recruitment"
        : cat.id === "investment" ? "investment-scams"
        : cat.id === "romance" ? "romance-scams"
        : cat.id === "phishing" ? "phishing"
        : cat.id === "giveaway" ? "fake-giveaways"
        : cat.id === "impersonation" ? "social-media-impersonation"
        : cat.id === "advance_payment" ? "advance-payment-scams"
        : "what-to-do-after-losing-money"
      )
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${report.id} — ${categoryLabel} report`,
    description: report.description.slice(0, 200),
    datePublished: report.published_at,
    dateModified: report.published_at,
    articleBody: report.description,
    keywords: [categoryLabel, channelLabel, report.country].join(", "),
    author: { "@type": "Organization", name: "Scam Intelligence Exchange" },
    publisher: { "@type": "Organization", name: "Scam Intelligence Exchange" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/reports/${report.id}`,
    },
  };

  return (
    <PageShell
      eyebrow="Community report"
      title={`${report.id}`}
      subtitle={`${categoryLabel} · ${report.country} · ${channelLabel}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        {/* Main column */}
        <div className="space-y-6">
          {/* Status + identifier summary */}
          <div className="rounded-xl border border-border bg-background p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge
                status={report.disputed ? "disputed" : report.evidence_status}
              />
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Hash className="h-3.5 w-3.5" />
                {report.id}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailRow icon={<MessageCircle className="h-4 w-4" />} label="Channel">
                {channelLabel}
              </DetailRow>
              <DetailRow icon={<MapPin className="h-4 w-4" />} label="Country">
                {report.country}
                {countryMeta?.report_url && (
                  <>
                    {" "}
                    <a
                      href={countryMeta.report_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline-offset-4 hover:underline"
                      style={{ color: "var(--trust-teal)" }}
                    >
                      Report locally
                    </a>
                  </>
                )}
              </DetailRow>
              <DetailRow icon={<AlertTriangle className="h-4 w-4" />} label="Identifier type">
                {typeLabel}
              </DetailRow>
              <DetailRow icon={<Hash className="h-4 w-4" />} label="Identifier (masked)">
                <span className="font-mono">{report.identifier_display}</span>
              </DetailRow>
              <DetailRow icon={<Calendar className="h-4 w-4" />} label="Incident date">
                {formatDate(report.incident_date)}
              </DetailRow>
              <DetailRow icon={<Calendar className="h-4 w-4" />} label="Published">
                {formatDate(report.published_at)}
              </DetailRow>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-border bg-background p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              What happened
            </h2>
            <p className="mt-3 text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line">
              {report.description}
            </p>

            {report.risk_indicators && report.risk_indicators.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Risk indicators
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {report.risk_indicators.map((r) => (
                    <span
                      key={r}
                      className="rounded-md border border-border bg-muted/30 px-2 py-1 text-xs font-mono text-foreground/80"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Safety advice */}
          <div className="rounded-xl border border-border bg-muted/30 p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert
                className="h-5 w-5 mt-0.5 shrink-0"
                style={{ color: "var(--trust-teal)" }}
              />
              <div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
                  Safety advice
                </h2>
                <p className="mt-1 text-sm text-foreground/80">
                  {report.safety_advice ||
                    "Treat this identifier with caution. Do not send money or share personal information without independent verification."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Evidence status
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {evidenceLabel}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Corroborated by{" "}
              <span className="font-semibold text-foreground">
                {report.corroboration_count}
              </span>{" "}
              community {report.corroboration_count === 1 ? "report" : "reports"}.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              A community report is a submitted experience. It does not, by
              itself, establish that any person or business committed a crime.
            </p>
          </div>

          {guide && (
            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
                Related safety guide
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{guide.summary}</p>
              <Link
                href={`/safety-guides/${guide.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                style={{ color: "var(--trust-teal)" }}
              >
                Read the guide
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          <div className="rounded-xl border border-dashed border-border bg-background p-5">
            <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Is this report about you?
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              If you believe this report is inaccurate, you can submit a free
              correction request. We respond within 14 business days and never
              charge for corrections or removals.
            </p>
            <Link
              href="/correction-request"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              <FileText className="h-3.5 w-3.5" />
              Request a correction
            </Link>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        <span style={{ color: "var(--trust-teal)" }}>{icon}</span>
        {label}
      </p>
      <p className="mt-0.5 text-sm text-foreground/90">{children}</p>
    </div>
  );
}
