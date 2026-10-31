import Link from "next/link";
import { Logo } from "./logo";

const FOOTER_GROUPS = [
  {
    title: "Platform",
    links: [
      { href: "/#search", label: "Search" },
      { href: "/#report", label: "Report a Scam" },
      { href: "/#latest", label: "Latest Reports" },
      { href: "/#categories", label: "Scam Categories" },
      { href: "/#guides", label: "Safety Guides" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/#about", label: "About the Platform" },
      { href: "/#how", label: "How It Works" },
      { href: "/#contact", label: "Contact" },
      { href: "/#community-guidelines", label: "Community Guidelines" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/#privacy", label: "Privacy Policy" },
      { href: "/#terms", label: "Terms of Service" },
      { href: "/#correction", label: "Correction Request" },
      { href: "/#appeal", label: "Report Appeal" },
    ],
  },
];

/** Site footer — sticky to bottom via the page wrapper's `mt-auto`. */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="container-page py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo size={32} />
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              A free, community-powered scam intelligence platform. Check phone numbers, websites, emails and online profiles before you trust.
            </p>
            <p className="mt-3 text-xs font-medium" style={{ color: "var(--trust-teal)" }}>
              Check Before You Trust.
            </p>
          </div>
          {FOOTER_GROUPS.map((g) => (
            <div key={g.title}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--trust-navy)" }}>
                {g.title}
              </h3>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Scam Intelligence Exchange. A free public service.
          </p>
          <p className="text-xs text-muted-foreground max-w-xl">
            Community reports represent submitted experiences and do not automatically establish criminal wrongdoing. Always verify independently.
          </p>
        </div>
      </div>
    </footer>
  );
}
