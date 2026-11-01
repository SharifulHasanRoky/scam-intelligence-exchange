import Link from "next/link";

/**
 * Homepage FAQ section.
 *
 * Targets the main "scam checker" keyword and its natural variants.
 * Includes JSON-LD `FAQPage` structured data for rich search results.
 */
const FAQS = [
  {
    q: "Is the scam checker free to use?",
    a: "Yes. Our scam checker is 100% free. You can search phone numbers, websites, emails and social profiles without creating an account or paying any fee. The platform is funded by minimal, clearly-labelled advertising on the homepage and educational guides only — never on search results or report pages.",
  },
  {
    q: "How does the scam checker work?",
    a: "When you enter a phone number, website, email or social profile, the scam checker normalizes it (for example, converting phone numbers to E.164 format and lowercasing domains), hashes it for privacy, and matches it against approved community reports stored in our public index. You see the masked identifier, the number of reports, the evidence status, and clear safety advice. Raw identifiers are never published.",
  },
  {
    q: "What can I check with the scam checker?",
    a: "You can check phone numbers, website domains, full URLs, email addresses, social media profile URLs, and business or seller names. We do not search bank account or payment identifiers in the initial launch. For targeted checks, use our Website Scam Checker, Phone Number Scam Checker, Email Scam Checker, or Phishing Link Checker.",
  },
  {
    q: "Does a report mean the person or business is a scammer?",
    a: "No. A community report is a submitted experience — it does not, by itself, establish that any person or business committed a crime. Each result shows an evidence status: unverified, multiple independent reports, evidence reviewed, independently confirmed, or disputed. Always verify independently before sending money or sharing personal information.",
  },
  {
    q: "What if no reports are found for an identifier?",
    a: "The absence of reports does not guarantee safety. Scammers constantly create new phone numbers, websites and accounts. If no community reports exist yet, treat the identifier with normal caution and verify independently. You can also submit a report if you have had a suspicious experience.",
  },
  {
    q: "Can I report a scam anonymously?",
    a: "Yes. Report submissions are anonymous by default. No account is required, and you do not need to provide your real name. Reports are reviewed by a human moderator before being published, and private information is redacted. Your IP address is used only for rate-limiting and is not stored with your report.",
  },
  {
    q: "How do I check if a website is legit?",
    a: "Use our Website Scam Checker or enter the domain in the main scam checker above. We match the domain against community reports and flag known fake stores, phishing pages and fraudulent sites. Also check for warning signs such as recently-registered domains, below-market pricing, and unusual payment methods.",
  },
  {
    q: "What should I do if I think I have been scammed?",
    a: "Act quickly: contact your bank or card issuer immediately and request a chargeback, freeze any compromised accounts, gather evidence (screenshots, chat logs, transaction IDs), and report the scam to your national cybercrime authority. Read our recovery guide for detailed, country-specific steps.",
  },
];

export function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="container-page scroll-mt-20">
      <div className="max-w-2xl mb-6">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--trust-teal)" }}>
          Scam checker FAQ
        </p>
        <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-balance" style={{ color: "var(--trust-navy)" }}>
          Everything you need to know about our scam checker
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Common questions about how the scam checker works, what the results mean, and how to stay safe.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-background divide-y divide-border overflow-hidden">
        {FAQS.map((f, i) => (
          <details key={i} className="group py-4 px-5 open:pb-5">
            <summary className="flex items-start justify-between gap-3 cursor-pointer list-none">
              <h3 className="text-sm sm:text-base font-semibold pr-4" style={{ color: "var(--trust-navy)" }}>
                {f.q}
              </h3>
              <span
                className="mt-0.5 shrink-0 h-6 w-6 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Still have questions?{" "}
        <Link href="/#contact" className="underline-offset-4 hover:underline font-medium" style={{ color: "var(--trust-teal)" }}>
          Get in touch
        </Link>{" "}
        or{" "}
        <Link href="/#report" className="underline-offset-4 hover:underline font-medium" style={{ color: "var(--trust-teal)" }}>
          report a scam
        </Link>
        .
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
