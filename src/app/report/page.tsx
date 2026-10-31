import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { ReportForm } from "@/components/site/report-form";

export const metadata: Metadata = {
  title: "Report a scam",
  description:
    "Help protect the community by sharing what happened to you. Reports are anonymous and moderated before publication.",
};

export default function ReportPage() {
  return (
    <PageShell
      eyebrow="Community submission"
      title="Report a scam"
      subtitle="Help protect the community by sharing what happened to you. Reports are anonymous and moderated before publication."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "var(--trust-navy)" }}>
            What happens after you submit
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Your report is queued for moderation. It is not published
            immediately. A human editor reviews the submission, redacts any
            private information, and decides whether to publish it as a
            structured, masked public report.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "Anonymous — no account required.",
              "Reviewed by a human moderator before publication.",
              "Private identifiers are masked and hashed before public display.",
              "Free. Always. No paid removal.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: "var(--trust-teal)" }}
                />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-md border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
            <p>
              Please do not include passwords, one-time codes, full card numbers
              or identity document numbers in your report. These will be removed
              during moderation.
            </p>
          </div>
        </div>
        <ReportForm />
      </div>
    </PageShell>
  );
}
