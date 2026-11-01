import { ShieldCheck } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  /** Size in pixels. */
  size?: number;
  /** Show the wordmark next to the icon. */
  withText?: boolean;
}

/**
 * Brand logo: a shield-with-checkmark icon + wordmark.
 *
 * Uses inline SVG so it works without external font/icon assets. Color is
 * the trust teal defined in globals.css.
 */
export function Logo({ size = 32, withText = true }: LogoProps) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 group" aria-label="Scam Intelligence Exchange — home">
      <span
        className="inline-flex items-center justify-center rounded-md"
        style={{
          width: size,
          height: size,
          background: "var(--trust-navy)",
        }}
      >
        <ShieldCheck
          size={Math.round(size * 0.6)}
          strokeWidth={2.2}
          color="var(--trust-teal)"
        />
      </span>
      {withText && (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--trust-navy)" }}>
            Scam Intelligence
          </span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Exchange
          </span>
        </span>
      )}
    </Link>
  );
}
