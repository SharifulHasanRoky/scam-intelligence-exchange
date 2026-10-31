import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { SAFETY_GUIDES } from "@/data/safety-guides";

/** "Scam prevention guides" grid on the homepage. */
export function GuidesGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {SAFETY_GUIDES.map((g) => (
        <Link
          key={g.slug}
          href={`/#guide-${g.slug}`}
          className="group flex flex-col rounded-xl border border-border bg-background p-4 transition-colors hover:border-foreground/20 hover:bg-accent/30"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent" style={{ color: "var(--trust-teal)" }}>
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Guide</span>
          </div>
          <p className="mt-3 text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>{g.title}</p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 flex-1">{g.summary}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--trust-teal)" }}>
            Read guide
            <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      ))}
    </div>
  );
}
