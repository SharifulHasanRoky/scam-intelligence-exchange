import Link from "next/link";
import { MapPin, MessageCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import {
  CATEGORY_LABELS,
  CHANNEL_LABELS,
  IDENTIFIER_TYPE_LABELS,
  formatDate,
} from "@/lib/labels";

interface ReportCardProps {
  report: {
    id: string;
    category: string;
    country: string;
    channel: string;
    identifier_type?: string;
    identifier_display: string;
    incident_date: string;
    created_at?: string;
    evidence_status: string;
    corroboration_count: number;
    disputed?: boolean;
    description_preview?: string;
  };
  /** Render as a link to the report's public page (default true). */
  linkable?: boolean;
}

/** Compact card used to summarize a single report in lists & search results. */
export function ReportCard({ report, linkable = true }: ReportCardProps) {
  const categoryLabel =
    CATEGORY_LABELS[report.category as keyof typeof CATEGORY_LABELS] || report.category;
  const channelLabel =
    CHANNEL_LABELS[report.channel as keyof typeof CHANNEL_LABELS] || report.channel;
  const typeLabel = report.identifier_type
    ? IDENTIFIER_TYPE_LABELS[report.identifier_type as keyof typeof IDENTIFIER_TYPE_LABELS]
    : null;

  const inner = (
    <Card className="h-full transition-colors hover:border-foreground/20 hover:bg-accent/30">
      <CardContent className="p-4 flex flex-col h-full gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">
              {report.id}
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              {categoryLabel}
            </span>
          </div>
          <StatusBadge
            status={
              report.disputed
                ? "disputed"
                : (report.evidence_status as any)
            }
          />
        </div>

        {typeLabel && (
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="font-medium text-foreground/70">{typeLabel}:</span>
              <span className="font-mono">{report.identifier_display}</span>
            </span>
          </div>
        )}

        {report.description_preview && (
          <p className="text-sm text-foreground/80 line-clamp-2">{report.description_preview}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {report.country}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {channelLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(report.incident_date)}
          </span>
          {report.corroboration_count > 1 && (
            <span className="inline-flex items-center gap-1 font-medium" style={{ color: "var(--trust-teal)" }}>
              {report.corroboration_count} reports
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!linkable) return inner;
  return (
    <Link href={`/#report-${report.id}`} aria-label={`View report ${report.id}`}>
      {inner}
    </Link>
  );
}
