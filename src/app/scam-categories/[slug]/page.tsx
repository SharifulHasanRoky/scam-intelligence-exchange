import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { getCategoryBySlug, CATEGORIES } from "@/data/categories";
import { getGuideBySlug } from "@/data/safety-guides";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Static params so the page can be statically generated at build time. */
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Category not found" };
  return {
    title: cat.name,
    description: cat.short_description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  // Link to a related safety guide if one maps to this category.
  const guide =
    cat.id === "online_shopping" ? getGuideBySlug("fake-online-stores")
    : cat.id === "fake_job" ? getGuideBySlug("fake-recruitment")
    : cat.id === "investment" ? getGuideBySlug("investment-scams")
    : cat.id === "romance" ? getGuideBySlug("romance-scams")
    : cat.id === "phishing" ? getGuideBySlug("phishing")
    : cat.id === "giveaway" ? getGuideBySlug("fake-giveaways")
    : cat.id === "impersonation" ? getGuideBySlug("social-media-impersonation")
    : cat.id === "advance_payment" ? getGuideBySlug("advance-payment-scams")
    : cat.id === "fake_website" ? getGuideBySlug("fake-online-stores")
    : undefined;

  return (
    <PageShell
      eyebrow="Scam category"
      title={cat.name}
      subtitle={cat.short_description}
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-6">
          {/* Warning signs */}
          <section className="rounded-xl border border-border bg-background p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle
                className="h-5 w-5"
                style={{ color: "var(--trust-teal)" }}
              />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Warning signs
              </h2>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {cat.warning_signs.map((w) => (
                <li key={w} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--trust-teal)" }}
                  />
                  <span className="text-foreground/90">{w}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* About this category */}
          <section className="rounded-xl border border-border bg-background p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              About this scam type
            </h2>
            <p className="mt-3 text-sm text-foreground/90 leading-relaxed">
              {cat.name.toLowerCase().includes("scam")
                ? cat.short_description
                : `${cat.short_description} These schemes evolve quickly — scammers copy each other's playbooks and adapt them to new platforms and payment methods. The reports filed under this category describe real community experiences with this scam type.`}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              A community report under this category is a submitted experience.
              It does not, by itself, establish that any specific person or
              business committed a crime. Always verify independently and use
              the correction process if a report is inaccurate.
            </p>
          </section>

          {/* What to do */}
          <section className="rounded-xl border border-border bg-muted/30 p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert
                className="h-5 w-5 mt-0.5 shrink-0"
                style={{ color: "var(--trust-teal)" }}
              />
              <div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
                  If you have been targeted
                </h2>
                <p className="mt-1 text-sm text-foreground/80">
                  Stop contact with the suspected scammer, do not send money or
                  share personal information, and report the incident to your
                  national cybercrime authority. Then file a community report
                  here so others can find the identifier before they engage.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar CTAs */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Report this scam
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Share what happened to help others recognize the pattern.
              Submissions are anonymous and moderated before publication.
            </p>
            <Link
              href="/report"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              Report a scam of this type
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {guide && (
            <div className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
                Read the safety guide
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{guide.summary}</p>
              <Link
                href={`/safety-guides/${guide.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                style={{ color: "var(--trust-teal)" }}
              >
                Open guide
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          <div className="rounded-xl border border-dashed border-border bg-background p-5">
            <h2 className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>
              Search identifiers
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have a phone number, website, email or social profile?
              Check it against the community index.
            </p>
            <Link
              href="/search"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              Open search
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
