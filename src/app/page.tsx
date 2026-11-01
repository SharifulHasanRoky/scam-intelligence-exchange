"use client";

import { useState } from "react";
import {
  ShieldCheck, Search, FileWarning, BookOpen, Eye, CheckCircle2,
  ArrowRight, Mail, Scale, Users, Lock, Cpu, Globe2,
} from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SearchSection } from "@/components/site/search-section";
import { TrustBar } from "@/components/site/trust-bar";
import { FaqSection } from "@/components/site/faq-section";
import { ReportForm } from "@/components/site/report-form";
import { LatestReports } from "@/components/site/latest-reports";
import { AdPlacement } from "@/components/site/ad-placement";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type View = "public" | "admin";

export default function Home() {
  const [view, setView] = useState<View>("public");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader
        onNavigate={(href) => {
          if (href === "/#admin") setView("admin");
          else setView("public");
        }}
      />
      <main className="flex-1">
        {view === "public" ? (
          <PublicView onOpenAdmin={() => setView("admin")} />
        ) : (
          <AdminView onExit={() => setView("public")} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

/**
 * Streamlined public homepage.
 *
 * Flow:
 *   1. Hero + search + tools  (what you can DO right now)
 *   2. Trust bar              (real numbers)
 *   3. Latest reports         (proof the platform is alive)
 *   4. Report CTA + form      (the second key action)
 *   5. How it works           (one compact section, not three)
 *   6. Browse (categories + guides in tabs, no duplication)
 *   7. FAQ
 *   8. Single ad placement
 *   9. About / contact / legal links (links only — full text on dedicated pages)
 */
function PublicView({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  return (
    <div className="space-y-14 sm:space-y-16 py-8 sm:py-12">
      {/* 1. Hero + Search + Tools */}
      <div className="container-page space-y-6">
        <SearchSection />
        <TrustBar />
      </div>

      {/* 2. Latest reports */}
      <section id="latest" className="container-page scroll-mt-20">
        <SectionHeader
          eyebrow="Recently reviewed"
          title="Latest community reports"
          subtitle="Reports reviewed and published by editors. Identifiers are masked to protect privacy."
        />
        <LatestReports />
      </section>

      {/* 3. Report CTA + form */}
      <section id="report" className="container-page scroll-mt-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <FileWarning className="h-3.5 w-3.5" style={{ color: "var(--trust-teal)" }} />
              Report a scam
            </div>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-balance" style={{ color: "var(--trust-navy)" }}>
              Help the community by reporting what happened to you.
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Your report is reviewed by a moderator before being published. Reports are anonymous — no account required. Raw identifiers are masked before publication.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {[
                "Anonymous — no account required.",
                "Reviewed by a human moderator before publication.",
                "Private identifiers are masked and hashed before public display.",
                "Free. Always.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--trust-teal)" }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <ReportForm />
        </div>
      </section>

      {/* 4. How it works (single compact section — was three before) */}
      <section id="how" className="container-page scroll-mt-20">
        <SectionHeader
          eyebrow="How the platform works"
          title="From submission to published intelligence"
          subtitle="Every report goes through a transparent moderation pipeline before it appears publicly."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FileWarning, title: "1. Submit", desc: "Anyone can submit a report anonymously. No account required." },
            { icon: Cpu, title: "2. AI-assisted triage", desc: "Gemini analyzes the submission for category, identifiers, sensitive info — never to assign guilt." },
            { icon: Eye, title: "3. Human review", desc: "A moderator reviews the AI analysis, redacts private info, and decides whether to publish." },
            { icon: Globe2, title: "4. Publish", desc: "Approved reports are published as masked, structured JSON and indexed for community search." },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-xl border border-border bg-background p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent" style={{ color: "var(--trust-teal)" }}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>{s.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Core principles — condensed inline, no separate section */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, label: "Free for everyone" },
            { icon: Lock, label: "Privacy by default" },
            { icon: Scale, label: "Right to respond" },
            { icon: Users, label: "Community-powered" },
          ].map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.label} className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--trust-teal)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--trust-navy)" }}>{p.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Browse — categories + guides in tabs (no duplication) */}
      <section id="browse" className="container-page scroll-mt-20">
        <SectionHeader
          eyebrow="Browse"
          title="Learn the patterns scammers use"
          subtitle="Explore scam categories and safety guides. Click any item to read the full details on its dedicated page."
        />
        <BrowseTabs />
      </section>

      {/* 6. FAQ */}
      <FaqSection />

      {/* 7. Single homepage ad placement */}
      <section className="container-page scroll-mt-20">
        <AdPlacement location="homepage" />
      </section>

      {/* 8. About / contact / legal — links only, full text on dedicated pages */}
      <section id="about" className="container-page scroll-mt-20">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--trust-navy)" }}>About</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              The Scam Intelligence Exchange is a free, community-powered platform that helps people check suspicious online identifiers before they trust them. Built on a simple idea: <strong>shared experiences protect everyone</strong>.
            </p>
            <a href="/about" className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline" style={{ color: "var(--trust-teal)" }}>
              Read more <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div id="contact">
            <h2 className="text-xl font-bold" style={{ color: "var(--trust-navy)" }}>Contact</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@scam-intelligence.example" className="hover:underline">hello@scam-intelligence.example</a>
              </li>
              <li className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                <a href="/correction-request" className="hover:underline">Submit a correction</a>
              </li>
            </ul>
            <a href="/contact" className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline" style={{ color: "var(--trust-teal)" }}>
              Contact page <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--trust-navy)" }}>Legal & community</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ["Privacy Policy", "/privacy-policy"],
                ["Terms of Service", "/terms"],
                ["Community Guidelines", "/community-guidelines"],
                ["Correction Request", "/correction-request"],
                ["Report Appeal", "/report-appeal"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-muted-foreground hover:text-foreground hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Admin access — small link, not security by obscurity */}
      <section className="container-page scroll-mt-20">
        <div className="rounded-xl border border-dashed border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Authorized moderator?{" "}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="font-medium underline-offset-4 hover:underline"
              style={{ color: "var(--trust-teal)" }}
            >
              Open the admin dashboard
            </button>
            . Access is protected by server-side authentication, rate-limiting and audit logging.
          </p>
        </div>
      </section>
    </div>
  );
}

/**
 * Tabs for Browse section: Categories + Guides in one place, no duplication.
 * Each item links to its dedicated page for full details.
 */
function BrowseTabs() {
  return (
    <Tabs defaultValue="categories" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="categories">Scam Categories</TabsTrigger>
        <TabsTrigger value="guides">Safety Guides</TabsTrigger>
      </TabsList>
      <TabsContent value="categories" className="mt-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`/scam-categories/${c.slug}`}
              className="group flex items-start gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:border-foreground/20 hover:shadow-sm hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent" style={{ color: "var(--trust-teal)" }}>
                <BookOpen className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>{c.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{c.short_description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="guides" className="mt-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SAFETY_GUIDES.map((g) => (
            <a
              key={g.slug}
              href={`/safety-guides/${g.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-background p-4 transition-all hover:border-foreground/20 hover:shadow-sm hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent" style={{ color: "var(--trust-teal)" }}>
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Guide</span>
              </div>
              <p className="mt-3 text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>{g.title}</p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 flex-1">{g.summary}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--trust-teal)" }}>
                Read guide <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

function AdminView({ onExit }: { onExit: () => void }) {
  return (
    <div className="container-page py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--trust-navy)" }}>
            Admin
          </h1>
          <p className="text-sm text-muted-foreground">Moderation queue and platform overview.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onExit}>Back to site</Button>
      </div>
      <AdminDashboard />
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl mb-6">
      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--trust-teal)" }}>{eyebrow}</p>
      <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-balance" style={{ color: "var(--trust-navy)" }}>{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

// Keep these imports referenced — they were used by the old legal accordions
// and the data is still used by the BrowseTabs above.
import { CATEGORIES } from "@/data/categories";
import { SAFETY_GUIDES } from "@/data/safety-guides";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
