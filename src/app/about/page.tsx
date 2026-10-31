import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck, Lock, Scale, Users, BadgeCheck, Cpu, Mail,
} from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the Scam Intelligence Exchange — a free, community-powered platform to check suspicious identifiers before you trust them.",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="A free, community-powered scam intelligence platform"
      subtitle="Built on a simple idea: shared experiences protect everyone."
    >
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <article className="prose prose-sm sm:prose-base max-w-none text-foreground/90 space-y-4">
          <p>
            The Scam Intelligence Exchange is a free public service that helps
            people check suspicious phone numbers, websites, emails and social
            profiles before they engage with them. Every report on this
            platform is submitted by a member of the public, reviewed by a
            human editor, and published in a structured, masked form so that
            others can search it instantly.
          </p>
          <p>
            Our mission is straightforward: <strong>Check Before You Trust</strong>.
            Scammers rely on isolation and speed. By the time a single person
            realises they have been targeted, the same phone number or website
            is usually already being used against someone else. A searchable,
            community-moderated index of masked identifiers breaks that cycle —
            the first victim's report can prevent the next.
          </p>
          <p>
            The platform is funded by minimal, clearly-labelled advertising.
            There are no paid subscriptions, no premium search tiers, and no
            paid removal. We never charge a user to search, to report, or to
            request a correction. Advertising is clearly separated from
            community content and never influences moderation decisions.
          </p>
          <p>
            Privacy is built in by default. Raw private identifiers — full phone
            numbers, email addresses — are used only for matching against other
            reports. They are never published. Approved public reports store
            only a masked display form and an HMAC hash of the normalised
            identifier. Pending submissions live in a private GitHub
            moderation queue; approved reports are stored as public JSON files.
          </p>
          <p>
            We are clear about what a community report is and is not. A report
            is a submitted experience. It does not, by itself, establish that
            any specific person or business committed a crime. Each report
            carries an evidence status — unverified, multiple reports,
            evidence reviewed, or independently confirmed — and any subject of
            a report can submit a free correction or appeal.
          </p>
          <p>
            The platform combines AI-assisted triage with human moderation.
            Gemini analyses new submissions for category, identifiers,
            sensitive information and possible duplicates, but it never
            auto-publishes. A human editor always makes the final call.
          </p>
        </article>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Our principles
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
              <Principle icon={ShieldCheck} title="Free for everyone">
                No paid subscriptions, no premium search, no paid removal.
              </Principle>
              <Principle icon={Lock} title="Privacy by default">
                Raw identifiers are never published. Only masked and hashed
                forms appear in public reports.
              </Principle>
              <Principle icon={Scale} title="Right to respond">
                Anyone named in a report can submit a free correction or
                appeal. Disputed reports are clearly labelled.
              </Principle>
              <Principle icon={Users} title="Community-powered">
                Reports come from people like you. Editors review, but no
                single report is treated as proof.
              </Principle>
              <Principle icon={BadgeCheck} title="Status, not verdict">
                Each result shows its evidence status — never a judgement of
                guilt.
              </Principle>
              <Principle icon={Cpu} title="AI assists, humans decide">
                Gemini triages submissions. A human moderator always decides
                what gets published.
              </Principle>
            </ul>
          </div>

          <div className="rounded-xl border border-dashed border-border bg-background p-5">
            <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Get in touch
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Questions, media enquiries or partnerships — reach the team
              directly.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              <Mail className="h-3.5 w-3.5" />
              Contact the platform
            </Link>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function Principle({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <Icon
        className="h-4 w-4 mt-0.5 shrink-0"
        style={{ color: "var(--trust-teal)" }}
      />
      <div>
        <p className="font-medium" style={{ color: "var(--trust-navy)" }}>
          {title}
        </p>
        <p className="text-xs text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}
