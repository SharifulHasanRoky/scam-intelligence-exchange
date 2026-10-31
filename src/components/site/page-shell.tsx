import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Logo } from "./logo";

interface PageShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Show a "back to home" link. */
  backToHome?: boolean;
}

/**
 * Shared page shell for production routes. Wraps content with the site
 * header, footer, and a consistent page header.
 *
 * Used by /search, /report, /reports/[id], /scam-categories/[slug],
 * /safety-guides/[slug], /about, /contact and the legal pages.
 */
export function PageShell({ eyebrow, title, subtitle, children, backToHome = true }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 container-page py-10 sm:py-14">
        {backToHome && (
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        )}
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--trust-teal)" }}>
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-balance" style={{ color: "var(--trust-navy)" }}>
          {title}
        </h1>
        {subtitle && <p className="mt-3 text-base text-muted-foreground max-w-2xl">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

/** Minimal brand mark used as fallback. */
export function BrandMark() {
  return <Logo size={28} />;
}
