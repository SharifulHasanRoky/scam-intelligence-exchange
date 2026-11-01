"use client";

import { useState } from "react";
import {
  ShieldCheck, Search, FileWarning, BookOpen, Eye, CheckCircle2,
  Filter, ArrowRight, Mail, MessageSquare, Scale, FileText, Users,
  Lock, Cpu, Github, Server, Globe2, BadgeCheck, AlertTriangle,
} from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SearchSection } from "@/components/site/search-section";
import { TrustBar } from "@/components/site/trust-bar";
import { FaqSection } from "@/components/site/faq-section";
import { ReportForm } from "@/components/site/report-form";
import { LatestReports } from "@/components/site/latest-reports";
import { CategoryGrid } from "@/components/site/category-grid";
import { GuidesGrid } from "@/components/site/guides-grid";
import { AdPlacement } from "@/components/site/ad-placement";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { CATEGORIES } from "@/data/categories";
import { SAFETY_GUIDES } from "@/data/safety-guides";
import { CATEGORY_LABELS } from "@/lib/labels";

type View = "public" | "admin";

export default function Home() {
  const [view, setView] = useState<View>("public");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader onNavigate={(href) => {
        if (href === "/#admin") setView("admin");
        else setView("public");
      }} />

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

function PublicView({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  return (
    <div className="space-y-16 sm:space-y-20 py-8 sm:py-12">
      {/* Hero + Search */}
      <div className="container-page space-y-6">
        <SearchSection />
        <TrustBar />
      </div>

      {/* Report CTA */}
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
              Your report is reviewed by a moderator before being published. Reports are anonymous — no account is required. Raw identifiers are masked before publication.
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

      {/* Latest reports */}
      <section id="latest" className="container-page scroll-mt-20">
        <SectionHeader
          eyebrow="Recently reviewed"
          title="Latest community reports"
          subtitle="Reports reviewed and published by editors. Identifiers are masked to protect privacy."
        />
        <LatestReports />
      </section>

      {/* Categories */}
      <section id="categories" className="container-page scroll-mt-20">
        <SectionHeader
          eyebrow="Browse by type"
          title="Popular scam categories"
          subtitle="Recognize the patterns used by each type of scam before you engage."
        />
        <CategoryGrid />

        {/* Category detail accordions */}
        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            {CATEGORIES.map((c) => (
              <AccordionItem key={c.id} value={c.slug}>
                <AccordionTrigger className="text-sm font-medium">
                  <span id={`category-${c.slug}`} className="scroll-mt-24">
                    {c.name}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-3">{c.short_description}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                    Warning signs
                  </p>
                  <ul className="text-sm space-y-1">
                    {c.warning_signs.map((w) => (
                      <li key={w} className="flex items-start gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "var(--trust-teal)" }} />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Safety guides */}
      <section id="guides" className="container-page scroll-mt-20">
        <SectionHeader
          eyebrow="Stay safe"
          title="Scam prevention guides"
          subtitle="Practical, non-alarmist advice on how each scam works, the warning signs, and what to do if you are affected."
        />
        <GuidesGrid />

        {/* Guide detail accordions */}
        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            {SAFETY_GUIDES.map((g) => (
              <AccordionItem key={g.slug} value={g.slug}>
                <AccordionTrigger className="text-sm font-medium">
                  <span id={`guide-${g.slug}`} className="scroll-mt-24">{g.title}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-4">{g.summary}</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <GuideBlock title="How it works" items={g.how_it_works} />
                    <GuideBlock title="Warning signs" items={g.warning_signs} />
                    <GuideBlock title="How to avoid" items={g.how_to_avoid} />
                    <GuideBlock title="If you are affected" items={g.if_affected} />
                  </div>
                  {g.official_resources.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                        Official reporting resources
                      </p>
                      <ul className="text-sm space-y-1">
                        {g.official_resources.map((r) => (
                          <li key={r.url}>
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:underline"
                              style={{ color: "var(--trust-teal)" }}
                            >
                              {r.label}
                              <ArrowRight className="h-3 w-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* SEO content: why use our scam checker */}
      <section id="why" className="container-page scroll-mt-20">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--trust-teal)" }}>
              Why use our scam checker
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-balance" style={{ color: "var(--trust-navy)" }}>
              A free scam checker built for everyone
            </h2>
            <div className="mt-4 space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                Our scam checker is a free, community-powered tool that helps you verify suspicious phone numbers, websites, emails and online profiles before you trust them. Whether you have received a strange WhatsApp message, found an unfamiliar online store, or been contacted by someone asking for money, the scam checker lets you see whether other people have reported the same identifier — in seconds.
              </p>
              <p>
                Unlike paid lookup services, our scam checker never charges you to search, submit a report, or access safety information. There is no sign-up, no premium tier, and no paywall. The platform is funded by minimal, clearly-labelled advertising on the homepage and educational guides only. Search results and report pages are always ad-free.
              </p>
              <p>
                Every result shows a clear evidence status — <strong>unverified</strong>, <strong>multiple independent reports</strong>, <strong>evidence reviewed</strong>, <strong>independently confirmed</strong>, or <strong>disputed</strong> — so you can judge how much weight to give it. A community report is a submitted experience, not a verdict. It does not, by itself, prove that anyone committed a crime.
              </p>
              <p>
                For targeted checks, use one of our dedicated tools:{" "}
                <a href="/website-scam-checker" className="font-medium underline-offset-4 hover:underline" style={{ color: "var(--trust-teal)" }}>Website Scam Checker</a>,{" "}
                <a href="/phone-number-scam-checker" className="font-medium underline-offset-4 hover:underline" style={{ color: "var(--trust-teal)" }}>Phone Number Scam Checker</a>,{" "}
                <a href="/email-scam-checker" className="font-medium underline-offset-4 hover:underline" style={{ color: "var(--trust-teal)" }}>Email Scam Checker</a>, or{" "}
                <a href="/phishing-link-checker" className="font-medium underline-offset-4 hover:underline" style={{ color: "var(--trust-teal)" }}>Phishing Link Checker</a>.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-muted/30 p-5 sm:p-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--trust-navy)" }}>
              What you can check
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Phone numbers", "Mobile and landline numbers, normalized to E.164 for matching"],
                ["Website domains", "e.g. example.com — matched against reported scam sites"],
                ["Full URLs", "Specific pages, not just the domain"],
                ["Email addresses", "Sender emails reported in phishing and romance scams"],
                ["Social profiles", "Handles and profile URLs from Facebook, Instagram, Telegram and more"],
                ["Business names", "Online sellers and businesses reported by customers"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--trust-teal)" }} />
                  <span>
                    <span className="font-medium text-foreground">{k}.</span>{" "}
                    <span className="text-muted-foreground">{v}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Bank account and payment identifier searches are not included in the initial launch, pending privacy and legal review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container-page scroll-mt-20">
        <SectionHeader
          eyebrow="How the platform works"
          title="From submission to published intelligence"
          subtitle="Every report goes through a transparent moderation pipeline before it appears publicly."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FileWarning, title: "1. Submit", desc: "Anyone can submit a report anonymously through the form above. No account required." },
            { icon: Cpu, title: "2. AI-assisted triage", desc: "Gemini analyzes the submission for category, identifiers, sensitive info and possible duplicates — never to assign guilt." },
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
      </section>

      {/* Trust & privacy principles */}
      <section className="container-page scroll-mt-20">
        <div className="rounded-2xl border border-border surface-accent p-6 sm:p-10">
          <SectionHeader
            eyebrow="Our principles"
            title="Trust, privacy and the difference between a report and proof"
            subtitle="A community report is a submitted experience. It does not, by itself, establish that any person or business committed a crime."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Free for everyone", desc: "No paid subscriptions, no premium search, no paid removal. Advertising is minimal and clearly labelled." },
              { icon: Lock, title: "Privacy by default", desc: "Raw phone numbers and emails are never published. Identifiers are hashed and masked." },
              { icon: Scale, title: "Right to respond", desc: "Anyone named in a report can submit a correction or appeal. Disputed reports are clearly labelled." },
              { icon: Users, title: "Community-powered", desc: "Reports come from people like you. Editors review, but no single report is treated as proof." },
              { icon: BadgeCheck, title: "Status, not verdict", desc: "Each result shows its evidence status — unverified, multiple reports, reviewed, or independently confirmed." },
              { icon: Cpu, title: "AI assists, humans decide", desc: "Gemini triages submissions. A human moderator always decides what gets published." },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="rounded-xl border border-border bg-background p-5">
                  <Icon className="h-5 w-5" style={{ color: "var(--trust-teal)" }} />
                  <p className="mt-2 text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech architecture (transparency) */}
      <section className="container-page scroll-mt-20">
        <SectionHeader
          eyebrow="Built for transparency"
          title="A lightweight, auditable architecture"
          subtitle="No black-box database in the MVP. Approved reports are public JSON files. Pending reports live in a private moderation queue."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Github, title: "GitHub-backed", desc: "Source code and approved reports live in a public repo. Pending reports live in a private moderation repo as issues." },
            { icon: Cpu, title: "Gemini-assisted", desc: "Server-side Gemini calls analyze and triage new reports. AI never auto-publishes." },
            { icon: Server, title: "Vercel-hosted", desc: "Edge-rendered Next.js. Serverless API routes. No traditional database required." },
            { icon: Globe2, title: "Global by design", desc: "Reports from any country. Country-specific official reporting resources are linked from each guide." },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-xl border border-border bg-background p-5">
                <Icon className="h-5 w-5" style={{ color: "var(--trust-teal)" }} />
                <p className="mt-2 text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>{s.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* Single homepage ad placement */}
      <section className="container-page scroll-mt-20">
        <AdPlacement location="homepage" />
      </section>

      {/* About + contact + legal */}
      <section id="about" className="container-page scroll-mt-20">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--trust-navy)" }}>About</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              The Scam Intelligence Exchange is a free, community-powered platform that helps people check suspicious online identifiers before they trust them. It is built on a simple idea: <strong>shared experiences protect everyone</strong>.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              The platform is funded by minimal, clearly-labelled advertising. It never charges users to search, report or access safety information.
            </p>
          </div>
          <div id="contact">
            <h2 className="text-xl font-bold" style={{ color: "var(--trust-navy)" }}>Contact</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@scam-intelligence.example" className="hover:underline">hello@scam-intelligence.example</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>For corrections and appeals, use the links below.</span>
              </li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Report a security issue responsibly — do not submit vulnerabilities through the public report form.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--trust-navy)" }}>Legal & community</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ["Privacy policy", "/#privacy"],
                ["Terms of service", "/#terms"],
                ["Community guidelines", "/#community-guidelines"],
                ["Correction request", "/#correction"],
                ["Report appeal", "/#appeal"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline">
                    <FileText className="h-3.5 w-3.5" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Legal accordions */}
      <section className="container-page scroll-mt-20">
        <Accordion type="single" collapsible className="w-full">
          <LegalItem value="privacy" title="Privacy Policy" body={<PrivacyPolicy />} />
          <LegalItem value="terms" title="Terms of Service" body={<TermsOfService />} />
          <LegalItem value="community-guidelines" title="Community Guidelines" body={<CommunityGuidelines />} />
          <LegalItem value="correction" title="Correction Request Process" body={<CorrectionProcess />} />
          <LegalItem value="appeal" title="Report Appeal Process" body={<AppealProcess />} />
        </Accordion>
      </section>

      {/* Admin access (small link, not security by obscurity) */}
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

function GuideBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">{title}</p>
      <ul className="text-sm space-y-1">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LegalItem({ value, title, body }: { value: string; title: string; body: React.ReactNode }) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="text-base font-medium">{title}</AccordionTrigger>
      <AccordionContent>
        <div className="prose prose-sm max-w-none text-sm text-foreground/80 space-y-3">{body}</div>
      </AccordionContent>
    </AccordionItem>
  );
}

function PrivacyPolicy() {
  return (
    <>
      <p>We collect the minimum information needed to operate a free scam-intelligence platform. Specifically:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Report submissions you choose to make, including the identifier, description and metadata you enter.</li>
        <li>Server logs needed for security and rate-limiting (including IP address, used only for abuse prevention).</li>
        <li>A signed session cookie if you sign in as an authorized moderator.</li>
      </ul>
      <p>We do <strong>not</strong> sell personal information. We do not use tracking advertising. Raw private identifiers (full phone numbers, emails) are used only for matching and are masked before publication. Approved public reports store HMAC hashes of normalized identifiers, not the raw values.</p>
      <p>Pending reports are stored in a private GitHub repository as issues. Approved reports are stored as public JSON files. Both are subject to GitHub's own data practices.</p>
      <p>You may contact us to request access to or deletion of personal data you have submitted, subject to our legal obligations.</p>
    </>
  );
}
function TermsOfService() {
  return (
    <>
      <p>By using the Scam Intelligence Exchange you agree to the following terms:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>You will submit information in good faith and not knowingly file false reports.</li>
        <li>You understand that reports are moderated before publication and may be edited or rejected.</li>
        <li>You will not include passwords, OTPs, card numbers or identity document numbers in submissions.</li>
        <li>You understand that community reports represent submitted experiences and do not, by themselves, establish criminal wrongdoing.</li>
        <li>You grant the platform a non-exclusive licence to publish, edit and redact your submission for the purpose of public scam prevention.</li>
      </ul>
      <p>The platform is provided "as is" without warranty. We are not liable for decisions you make based on community reports.</p>
    </>
  );
}
function CommunityGuidelines() {
  return (
    <>
      <p>To keep the platform useful and safe for everyone:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Report your own genuine experience. Do not file reports on behalf of others without consent.</li>
        <li>Stick to facts. Avoid insults, threats and speculation about the identity of specific individuals.</li>
        <li>Do not post private personal information (home addresses, full names of private individuals, ID numbers).</li>
        <li>Do not use the platform to harass a business competitor or settle a personal dispute.</li>
        <li>Use the correction request process if you believe a report about you or your business is inaccurate.</li>
      </ul>
      <p>Editors may reject, edit or remove reports that violate these guidelines.</p>
    </>
  );
}
function CorrectionProcess() {
  return (
    <>
      <p>If a report about you or your business is inaccurate, you may submit a correction request:</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Email <a href="mailto:corrections@scam-intelligence.example" className="underline">corrections@scam-intelligence.example</a> with the report ID and the specific inaccuracy.</li>
        <li>Include any evidence supporting the correction (e.g. proof of refund, shipping confirmation, court order).</li>
        <li>Our editors will review the request, may contact you for clarification, and will update, label as disputed, or remove the report as appropriate.</li>
        <li>You will receive a response within 14 business days.</li>
      </ol>
      <p>Correction requests are free. We never charge for corrections or removals.</p>
    </>
  );
}
function AppealProcess() {
  return (
    <>
      <p>If your correction request was denied or your report was rejected, you may appeal:</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Email <a href="mailto:appeals@scam-intelligence.example" className="underline">appeals@scam-intelligence.example</a> within 30 days of the decision.</li>
        <li>Provide the reference number and the reason you believe the decision was incorrect.</li>
        <li>A different editor will review the appeal and issue a final decision.</li>
      </ol>
      <p>Appeals are also free. Decisions are auditable and logged.</p>
    </>
  );
}
