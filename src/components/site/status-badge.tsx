import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SEARCH_STATUS_LABELS, STATUS_BADGE_CLASS } from "@/lib/labels";
import type { SearchStatus, EvidenceStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: SearchStatus | EvidenceStatus;
  className?: string;
}

/**
 * Renders a status badge. Accepts either a SearchStatus (used on the search
 * result page) or an EvidenceStatus (used on individual report cards).
 *
 * The visual color communicates caution level, never guilt.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label =
    status in SEARCH_STATUS_LABELS
      ? SEARCH_STATUS_LABELS[status as SearchStatus]
      : status;
  const cls =
    status in STATUS_BADGE_CLASS
      ? STATUS_BADGE_CLASS[status as SearchStatus]
      : "bg-muted text-muted-foreground border-border";
  return (
    <Badge variant="outline" className={cn("font-medium", cls, className)}>
      {label}
    </Badge>
  );
}
