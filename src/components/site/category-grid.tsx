import Link from "next/link";
import {
  ShoppingCart, Briefcase, TrendingUp, MailWarning, HeartCrack,
  UserX, Gift, Wallet, Globe, CircleAlert, ArrowRight,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";

const ICONS: Record<string, any> = {
  ShoppingCart, Briefcase, TrendingUp, MailWarning, HeartCrack,
  UserX, Gift, Wallet, Globe, CircleAlert,
};

/** "Popular scam categories" grid on the homepage. */
export function CategoryGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((c) => {
        const Icon = ICONS[c.icon] || CircleAlert;
        return (
          <Link
            key={c.id}
            href={`/#category-${c.slug}`}
            className="group flex items-start gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-foreground/20 hover:bg-accent/30"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent" style={{ color: "var(--trust-teal)" }}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--trust-navy)" }}>{c.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{c.short_description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        );
      })}
    </div>
  );
}
