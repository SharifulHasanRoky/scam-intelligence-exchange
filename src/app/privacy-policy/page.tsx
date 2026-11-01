import type { Metadata } from "next";
import Link from "next/link";
import { Lock, Github, Cookie, ShieldAlert, FileText } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How the Scam Intelligence Exchange collects, uses and protects the minimum information needed to operate a free community scam-intelligence platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy policy"
      subtitle="We collect the minimum information needed to operate a free, community-powered scam-intelligence platform."
    >
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <article className="prose prose-sm sm:prose-base max-w-none text-foreground/90 space-y-5">
          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              What we collect
            </h2>
            <p className="mt-2">
              We collect the minimum information needed to operate the platform:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
              <li>
                The contents of any report you choose to submit — the
                identifier, description and metadata you enter.
              </li>
              <li>
                Server logs needed for security and rate-limiting, including
                your IP address. The IP address is used only for abuse
                prevention and is not stored alongside your report.
              </li>
              <li>
                A signed session cookie if you sign in as an authorized
                moderator.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              What we do not collect or sell
            </h2>
            <p className="mt-2">
              We do <strong>not</strong> sell personal information. We do not
              use tracking advertising. We do not maintain user accounts for
              the public site — submitting a report does not require one, and
              no email is required to search.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              How identifiers are handled
            </h2>
            <p className="mt-2">
              Raw private identifiers — full phone numbers and email addresses —
              are used only for matching against other reports. They are
              <strong> never published</strong>. Approved public reports store
              only a masked display form (for example, <code>+60****6789</code>)
              and an HMAC hash of the normalised identifier. The hash lets us
              group reports about the same identifier without ever exposing the
              raw value.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              Where data lives
            </h2>
            <p className="mt-2">
              Pending reports are stored as issues in a private GitHub
              repository, accessible only to authorized moderators. Approved
              reports are stored as public JSON files in a public GitHub
              repository. Both are subject to GitHub&apos;s own data practices.
              The application itself is hosted on Vercel and uses serverless
              API routes. There is no traditional database in the MVP.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              Cookies
            </h2>
            <p className="mt-2">
              The public site uses no tracking cookies. A single signed session
              cookie is set only when an authorized moderator signs in to the
              admin dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              Your rights
            </h2>
            <p className="mt-2">
              You may contact us to request access to, or deletion of, personal
              data you have submitted, subject to our legal obligations and the
              need to preserve evidence in active moderation. To exercise these
              rights, email{" "}
              <a
                href="mailto:hello@scam-intelligence.example"
                className="underline-offset-4 hover:underline"
                style={{ color: "var(--trust-teal)" }}
              >
                hello@scam-intelligence.example
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold" style={{ color: "var(--trust-navy)" }}>
              Changes to this policy
            </h2>
            <p className="mt-2">
              Material changes will be reflected by updating this page. We will
              not retroactively weaken privacy protections on already-published
              reports.
            </p>
          </section>
        </article>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-5">
            <Lock
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              <strong style={{ color: "var(--trust-navy)" }}>
                Privacy by default.
              </strong>{" "}
              Raw identifiers are masked and hashed before publication. They
              are used for matching only.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <Github
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              <strong style={{ color: "var(--trust-navy)" }}>
                GitHub-backed.
              </strong>{" "}
              Pending reports live in a private moderation repo. Approved
              reports live in a public JSON repo.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <Cookie
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              <strong style={{ color: "var(--trust-navy)" }}>
                Minimal cookies.
              </strong>{" "}
              No tracking cookies. A signed session cookie is set only for
              authorized moderators.
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-background p-5">
            <ShieldAlert
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Want to access or delete data you submitted?{" "}
              <Link
                href="/contact"
                className="font-medium underline-offset-4 hover:underline"
                style={{ color: "var(--trust-teal)" }}
              >
                Contact the platform
              </Link>
              .
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-background p-5">
            <FileText
              className="h-5 w-5"
              style={{ color: "var(--trust-teal)" }}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              See also:{" "}
              <Link
                href="/terms"
                className="font-medium underline-offset-4 hover:underline"
                style={{ color: "var(--trust-teal)" }}
              >
                Terms of service
              </Link>{" "}
              and{" "}
              <Link
                href="/community-guidelines"
                className="font-medium underline-offset-4 hover:underline"
                style={{ color: "var(--trust-teal)" }}
              >
                community guidelines
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
