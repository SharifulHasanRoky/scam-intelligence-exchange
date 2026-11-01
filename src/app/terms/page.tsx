import type { Metadata } from "next";
import Link from "next/link";
import { Scale, ShieldAlert, FileText, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The terms under which the Scam Intelligence Exchange is made available to the public — good faith submissions, moderation, licensing and disclaimer.",
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of service"
      subtitle="The terms under which the Scam Intelligence Exchange is made available to you."
    >
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <article className="prose prose-sm sm:prose-base max-w-none text-foreground/90 space-y-5">
          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              1. Good-faith submissions
            </h2>
            <p className="mt-2">
              You agree to submit information in good faith and not to
              knowingly file false reports. Knowingly false reports harm the
              people they describe and the community that relies on the
              platform. Editors may reject, edit or remove reports that violate
              these terms, and may flag repeat bad-faith submitters for
              rate-limiting.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              2. Moderation
            </h2>
            <p className="mt-2">
              All submissions are reviewed by a human moderator before
              publication. Moderators may edit a submission for clarity, remove
              private information, mark it as disputed, or reject it
              altogether. Publication is at the sole discretion of the
              platform&apos;s editors. A submission is not published the moment
              it is filed.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              3. No private information in submissions
            </h2>
            <p className="mt-2">
              You agree not to include passwords, one-time codes, full card
              numbers, bank account numbers, or identity document numbers in
              your submission. If you do, that information will be removed
              during moderation, but you should not submit it in the first
              place.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              4. Reports are not proof
            </h2>
            <p className="mt-2">
              A community report is a submitted experience. It does not, by
              itself, establish that any specific person or business committed
              a crime. Evidence status labels (unverified, multiple reports,
              evidence reviewed, independently confirmed) describe the volume
              and review of community reports — they are not verdicts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              5. Licence to publish
            </h2>
            <p className="mt-2">
              By submitting a report, you grant the platform a non-exclusive,
              royalty-free licence to publish, edit and redact your submission
              for the purpose of public scam prevention. You retain any
              underlying rights you may have in your submission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              6. No warranty
            </h2>
            <p className="mt-2">
              The platform is provided &quot;as is&quot; and &quot;as
              available&quot; without warranty of any kind. We are not liable
              for decisions you make based on community reports, and we do not
              guarantee that any identifier is safe simply because no reports
              exist for it.
            </p>
          </section>
        </article>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-5">
            <Scale
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              <strong style={{ color: "var(--trust-navy)" }}>
                Right to respond.
              </strong>{" "}
              Anyone named in a report can submit a free correction or appeal.
              Disputed reports are clearly labelled.
            </p>
            <Link
              href="/correction-request"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              Correction process
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <ShieldAlert
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              <strong style={{ color: "var(--trust-navy)" }}>
                Reports ≠ proof.
              </strong>{" "}
              A submitted experience is not a conviction. Always verify
              independently.
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-background p-5">
            <FileText
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Related documents:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "var(--trust-teal)" }}
                >
                  Privacy policy
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
                  href="/report-appeal"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "var(--trust-teal)" }}
                >
                  Appeal process
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
