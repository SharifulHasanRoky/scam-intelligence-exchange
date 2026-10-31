import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/site/page-shell";
import { SearchView } from "./search-view";

export const metadata: Metadata = {
  title: "Search scam reports",
  description:
    "Check phone numbers, websites, emails and social profiles against community-submitted reports.",
};

export default function SearchPage() {
  return (
    <PageShell
      eyebrow="Community lookup"
      title="Search scam reports"
      subtitle="Check phone numbers, websites, emails and social profiles against community-submitted reports."
    >
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading search…</div>}>
        <SearchView />
      </Suspense>
    </PageShell>
  );
}
