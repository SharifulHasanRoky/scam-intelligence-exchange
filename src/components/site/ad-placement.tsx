import { Info } from "lucide-react";

interface AdPlacementProps {
  /** Where this ad unit appears. Used for the visible label and audit. */
  location: "homepage" | "guide";
  /** Optional slot ID once AdSense is approved. */
  slotId?: string;
  className?: string;
}

/**
 * Reusable advertisement placement.
 *
 * Per §22 of the spec:
 *  - Ads appear ONLY on the homepage and on educational guide pages.
 *  - Ads are clearly labelled.
 *  - We use a placeholder in development. The AdSense script is only loaded
 *    when NEXT_PUBLIC_ADSENSE_CLIENT is set AND the platform has been
 *    approved by Google.
 *
 * We never claim AdSense is active before approval.
 */
export function AdPlacement({ location, slotId, className }: AdPlacementProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <aside
      aria-label="Advertisement"
      className={
        "relative w-full overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 " +
        (className || "")
      }
    >
      <div className="flex items-center justify-center px-4 py-6 min-h-[90px]">
        {client && slotId ? (
          // Real AdSense unit — only rendered when configured.
          <ins
            className="adsbygoogle block"
            style={{ display: "block" }}
            data-ad-client={client}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
              <Info className="h-3 w-3" />
              Advertisement
            </span>
            <p className="text-xs text-muted-foreground max-w-md">
              Small, clearly-labelled ad placement ({location}). Google AdSense is loaded only after the platform is approved.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
