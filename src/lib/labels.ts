/**
 * Human-readable labels and formatting helpers shared by the UI and the API.
 *
 * These labels are intentionally small and consistent. They never assert
 * criminal wrongdoing — they describe community-reported status only.
 */

import type {
  ScamCategory,
  CommunicationChannel,
  IdentifierType,
  EvidenceStatus,
  SearchStatus,
} from "./types";

export const CATEGORY_LABELS: Record<ScamCategory, string> = {
  online_shopping: "Online Shopping",
  fake_job: "Fake Job",
  investment: "Investment",
  phishing: "Phishing",
  romance: "Romance",
  impersonation: "Impersonation",
  giveaway: "Giveaway",
  advance_payment: "Advance Payment",
  fake_website: "Fake Website",
  other: "Other",
};

export const CHANNEL_LABELS: Record<CommunicationChannel, string> = {
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  instagram: "Instagram",
  telegram: "Telegram",
  website: "Website",
  email: "Email",
  phone_call: "Phone Call",
  sms: "SMS",
  other: "Other",
};

export const IDENTIFIER_TYPE_LABELS: Record<IdentifierType, string> = {
  phone: "Phone Number",
  domain: "Website Domain",
  url: "Website URL",
  email: "Email Address",
  social_profile: "Social Profile",
  business_name: "Business / Seller Name",
};

export const EVIDENCE_STATUS_LABELS: Record<EvidenceStatus, string> = {
  unverified: "Unverified community report",
  multiple_reports: "Multiple independent reports",
  evidence_reviewed: "Evidence reviewed",
  independently_confirmed: "Independently confirmed",
};

export const SEARCH_STATUS_LABELS: Record<SearchStatus, string> = {
  no_reports: "No community reports found",
  unverified: "Unverified community report",
  multiple_reports: "Multiple independent reports",
  evidence_reviewed: "Evidence reviewed",
  independently_confirmed: "Independently confirmed",
  disputed: "Report disputed",
};

/** Tailwind classes for status badges. */
export const STATUS_BADGE_CLASS: Record<SearchStatus, string> = {
  no_reports: "bg-muted text-muted-foreground border-border",
  unverified: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900",
  multiple_reports: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-200 dark:border-orange-900",
  evidence_reviewed: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900",
  independently_confirmed: "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-900",
  disputed: "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-900",
};

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}
