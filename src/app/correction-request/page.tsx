import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail, Scale, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Correction request",
  description:
    "How to request a correction to a community report on the Scam Intelligence Exchange. Free, with a 14 business day response window.",
};

const CORRECTIONS_EMAIL = "corrections@scam-intelligence.example";

export default function CorrectionRequestPage() {
  return (
    <PageShell
      eyebrow="Process"
      title="Correction request process"
      subtitle="If a report about you or your business is inaccurate, you can submit a free correction request."
    >
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <article className="prose prose-sm sm:prose-base max-w-none text-foreground/90 space-y-5">
          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              How to submit a correction request
            </h2>
            <ol className="mt-2 list-decimal pl-5 space-y-2 text-sm">
              <li>
                Email{" "}
                <a
                  href={`mailto:${CORRECTIONS_EMAIL}`}
                  className="font-mono underline-offset-4 hover:underline"
                  style={{ color: "var(--trust-teal)" }}
                >
                  {CORRECTIONS_EMAIL}
                </a>{" "}
                with the report ID (for example, <code>SC-000001</code>) and a
                clear description of the specific inaccuracy.
              </li>
              <li>
                Include any evidence that supports the correction — for
                example, a proof of refund, a shipping confirmation, a
                court order, or correspondence that contradicts the report.
              </li>
              <li>
                Our editors will review the request. We may contact you for
                clarification before making a decision.
              </li>
              <li>
                Depending on the evidence, the editor will update the report,
                label it as <strong>disputed</strong>, or remove it entirely.
              </li>
              <li>
                You will receive a response within <strong>14 business days</strong>.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              What corrections can and cannot do
            </h2>
            <p className="mt-2">
              A correction request can fix factual errors in a report, label a
              report as disputed, or remove a report that should not have been
              published. A correction request cannot be used to silence
              legitimate criticism, to remove a report solely because it is
              unflattering, or to identify the original reporter.
            </p>
          </section>

          <section className="rounded-md border border-border bg-muted/30 p-4 not-prose">
            <p className="flex items-start gap-2 text-sm">
              <CheckCircle2
                className="h-4 w-4 mt-0.5 shrink-0"
                style={{ color: "var(--trust-teal)" }}
              />
              <span>
                <strong>Corrections are free.</strong> We never charge for
                corrections or removals. Anyone who asks you to pay for a
                correction or removal is not affiliated with this platform.
              </span>
            </p>
          </section>
        </article>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-5">
            <Mail
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <h2 className="mt-2 text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Email
            </h2>
            <a
              href={`mailto:${CORRECTIONS_EMAIL}`}
              className="mt-1 inline-block font-mono text-sm hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              {CORRECTIONS_EMAIL}
            </a>
            <p className="mt-2 text-xs text-muted-foreground">
              Include the report ID in the subject line for the fastest
              response.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <Scale
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <h2 className="mt-2 text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Disagree with the decision?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              If your correction is denied, you can appeal. A different editor
              reviews every appeal.
            </p>
            <Link
              href="/report-appeal"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              Read the appeal process
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-background p-5">
            <FileText
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <h2 className="mt-2 text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Related
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "var(--trust-teal)" }}
                >
                  Terms of service
                </Link>
              </li>
              <li>
                <Link
                  href="/community-guidelines"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "var(--trust-teal)" }}
                >
                  Community guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "var(--trust-teal)" }}
                >
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
