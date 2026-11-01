import type { Metadata } from "next";
import Link from "next/link";
import { Users, ShieldCheck, MessageSquare, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Community guidelines",
  description:
    "The community guidelines for submitting reports to the Scam Intelligence Exchange — report your own experience, stick to facts, no private info, no harassment.",
};

export default function CommunityGuidelinesPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Community guidelines"
      subtitle="A short set of rules to keep the platform useful, fair and safe for everyone."
    >
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <article className="prose prose-sm sm:prose-base max-w-none text-foreground/90 space-y-5">
          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              1. Report your own genuine experience
            </h2>
            <p className="mt-2">
              File a report only about something that happened to you. Do not
              file reports on behalf of others without their consent, and do
              not file reports based on rumour or third-hand accounts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              2. Stick to the facts
            </h2>
            <p className="mt-2">
              Describe what actually happened: dates, channels, amounts,
              identifiers, the sequence of events. Avoid speculation about who
              is &quot;behind&quot; a phone number or account. Avoid insults,
              threats and identity-based attacks. Editors may redact or reject
              submissions that cross these lines.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              3. No private personal information
            </h2>
            <p className="mt-2">
              Do not post home addresses, the full names of private
              individuals, identity document numbers, passwords, OTPs, or card
              numbers. The platform masks phone numbers and emails by default;
              extend that same care to everything else you submit.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              4. No harassment or competitive abuse
            </h2>
            <p className="mt-2">
              Do not use the platform to harass a competitor, settle a personal
              dispute, or pursue a non-scam grievance. Coordinated
              report-filing campaigns against a single target will be detected
              and removed, and may be referred to the appropriate authority.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              5. Use the correction process
            </h2>
            <p className="mt-2">
              If a report is about you and you believe it is inaccurate, use
              the{" "}
              <Link
                href="/correction-request"
                className="underline-offset-4 hover:underline"
                style={{ color: "var(--trust-teal)" }}
              >
                correction request process
              </Link>
              . Do not respond by filing counter-reports, doxing the original
              reporter, or retaliating in any channel.
            </p>
          </section>
        </article>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-5">
            <Users
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              <strong style={{ color: "var(--trust-navy)" }}>
                Community-powered.
              </strong>{" "}
              Reports come from people like you. Editors review, but no single
              report is treated as proof.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <ShieldCheck
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              <strong style={{ color: "var(--trust-navy)" }}>
                Moderation.
              </strong>{" "}
              Editors may reject, edit or remove reports that violate these
              guidelines. Repeat violations may lead to rate-limiting.
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-background p-5">
            <MessageSquare
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Spotted a report that violates these guidelines? Email{" "}
              <a
                href="mailto:hello@scam-intelligence.example"
                className="underline-offset-4 hover:underline"
                style={{ color: "var(--trust-teal)" }}
              >
                hello@scam-intelligence.example
              </a>{" "}
              with the report ID and the issue.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              Full contact options
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
