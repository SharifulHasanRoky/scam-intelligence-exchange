import type { Metadata } from "next";
import Link from "next/link";
import { Scale, Mail, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Report appeal",
  description:
    "How to appeal a moderation decision on the Scam Intelligence Exchange. Free, reviewed by a different editor, with a final decision.",
};

const APPEALS_EMAIL = "appeals@scam-intelligence.example";

export default function ReportAppealPage() {
  return (
    <PageShell
      eyebrow="Process"
      title="Report appeal process"
      subtitle="If your correction request was denied or your submission was rejected, you may appeal."
    >
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <article className="prose prose-sm sm:prose-base max-w-none text-foreground/90 space-y-5">
          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              How to file an appeal
            </h2>
            <ol className="mt-2 list-decimal pl-5 space-y-2 text-sm">
              <li>
                Email{" "}
                <a
                  href={`mailto:${APPEALS_EMAIL}`}
                  className="font-mono underline-offset-4 hover:underline"
                  style={{ color: "var(--trust-teal)" }}
                >
                  {APPEALS_EMAIL}
                </a>{" "}
                within <strong>30 days</strong> of the decision you are
                appealing.
              </li>
              <li>
                Include the reference number (for example, the report ID or
                your original submission reference) and a short explanation of
                why you believe the decision was incorrect.
              </li>
              <li>
                Attach any additional evidence that was not considered in the
                original decision.
              </li>
              <li>
                A <strong>different editor</strong> from the one who made the
                original decision will review the appeal.
              </li>
              <li>
                The reviewing editor will issue a <strong>final decision</strong>.
                Further appeals of the same decision are not provided for, but
                you may contact the platform if you have significant new
                evidence.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              What appeals can review
            </h2>
            <p className="mt-2">
              Appeals can revisit whether a report was correctly rejected, whether
              a correction was correctly denied, and whether a disputed label
              was correctly applied or removed. Appeals cannot be used to
              identify the original reporter, to file a counter-complaint, or
              to relitigate a decision that has already been confirmed on a
              prior appeal.
            </p>
          </section>

          <section className="rounded-md border border-border bg-muted/30 p-4 not-prose">
            <p className="flex items-start gap-2 text-sm">
              <CheckCircle2
                className="h-4 w-4 mt-0.5 shrink-0"
                style={{ color: "var(--trust-teal)" }}
              />
              <span>
                <strong>Appeals are free.</strong> All moderation decisions are
                logged and auditable. We never charge for an appeal.
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
              href={`mailto:${APPEALS_EMAIL}`}
              className="mt-1 inline-block font-mono text-sm hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              {APPEALS_EMAIL}
            </a>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <Clock
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <h2 className="mt-2 text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Timing
            </h2>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>File within 30 days of the decision.</li>
              <li>Editor response within 14 business days.</li>
              <li>Decisions are final but logged.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-background p-5">
            <Scale
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <h2 className="mt-2 text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Related
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link
                  href="/correction-request"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "var(--trust-teal)" }}
                >
                  Correction request process
                </Link>
              </li>
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
                  href="/contact"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "var(--trust-teal)" }}
                >
                  Contact
                  <ArrowRight className="inline h-3 w-3 ml-1" />
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
