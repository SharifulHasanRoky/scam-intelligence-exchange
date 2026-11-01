import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail, MessageSquare, FileText, Scale, ShieldAlert, ArrowRight,
} from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the Scam Intelligence Exchange — general enquiries, corrections, appeals and responsible security disclosure.",
};

const PRIMARY_EMAIL = "hello@scam-intelligence.example";
const CORRECTIONS_EMAIL = "corrections@scam-intelligence.example";
const APPEALS_EMAIL = "appeals@scam-intelligence.example";
const SECURITY_EMAIL = "security@scam-intelligence.example";

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Get in touch"
      subtitle="Use the right channel below — it helps us route your message to the editor or engineer who can actually act on it."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <ContactCard
          icon={Mail}
          label="General enquiries"
          email={PRIMARY_EMAIL}
          description="Questions about the platform, media enquiries, partnership proposals, or feedback that does not fit one of the channels below."
        />
        <ContactCard
          icon={FileText}
          label="Correction requests"
          email={CORRECTIONS_EMAIL}
          description="If a report about you or your business is inaccurate. Include the report ID and any supporting evidence. We respond within 14 business days. Corrections are always free."
          actionHref="/correction-request"
          actionLabel="Read the correction process"
        />
        <ContactCard
          icon={Scale}
          label="Appeals"
          email={APPEALS_EMAIL}
          description="If your correction was denied or your submission was rejected and you disagree. Email within 30 days of the decision. A different editor reviews every appeal."
          actionHref="/report-appeal"
          actionLabel="Read the appeal process"
        />
        <ContactCard
          icon={ShieldAlert}
          label="Responsible security disclosure"
          email={SECURITY_EMAIL}
          description="Found a vulnerability? Please report it privately here. Do not submit vulnerabilities through the public report form or any other channel."
        />
      </div>

      <section className="mt-10 rounded-xl border border-border bg-muted/30 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <MessageSquare
            className="h-5 w-5 mt-0.5 shrink-0"
            style={{ color: "var(--trust-teal)" }}
          />
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Before you write
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>
                We cannot investigate individual scams or recover lost funds
                on your behalf. To report a crime, contact your national
                cybercrime authority — see the relevant{" "}
                <Link
                  href="/#guides"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "var(--trust-teal)" }}
                >
                  safety guide
                </Link>{" "}
                for official reporting links.
              </li>
              <li>
                To file a community report about an identifier, use the{" "}
                <Link
                  href="/report"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "var(--trust-teal)" }}
                >
                  report form
                </Link>{" "}
                — that is the only channel moderation acts on.
              </li>
              <li>
                We do not provide individualised legal advice. For legal
                questions, consult a qualified professional in your
                jurisdiction.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-dashed border-border bg-background p-5">
        <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
          Response times
        </h2>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>
            <strong>General enquiries:</strong> best-effort, typically within
            5 business days.
          </li>
          <li>
            <strong>Correction requests:</strong> within 14 business days.
          </li>
          <li>
            <strong>Appeals:</strong> within 14 business days of receipt.
          </li>
          <li>
            <strong>Security disclosures:</strong> acknowledged within 48
            hours, with a coordinated disclosure timeline.
          </li>
        </ul>
      </section>
    </PageShell>
  );
}

function ContactCard({
  icon: Icon,
  label,
  email,
  description,
  actionHref,
  actionLabel,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  email: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon
          className="h-4 w-4"
          style={{ color: "var(--trust-teal)" }}
        />
        <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
          {label}
        </h2>
      </div>
      <a
        href={`mailto:${email}`}
        className="font-mono text-sm hover:underline"
        style={{ color: "var(--trust-teal)" }}
      >
        {email}
      </a>
      <p className="text-sm text-muted-foreground">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
          style={{ color: "var(--trust-teal)" }}
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
