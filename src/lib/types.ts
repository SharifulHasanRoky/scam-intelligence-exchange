/**
 * Core domain types for the Scam Intelligence Exchange.
 *
 * These types model approved public reports, pending moderation issues,
 * search indexes, and the structured output returned by the Gemini analysis.
 *
 * IMPORTANT: Public reports must never contain raw private identifiers.
 * Use `identifier_hash` (HMAC) for matching and `identifier_display`
 * (masked) for display.
 */

export type IdentifierType =
  | "phone"
  | "domain"
  | "url"
  | "email"
  | "social_profile"
  | "business_name";

export type ScamCategory =
  | "online_shopping"
  | "fake_job"
  | "investment"
  | "phishing"
  | "romance"
  | "impersonation"
  | "giveaway"
  | "advance_payment"
  | "fake_website"
  | "other";

export type CommunicationChannel =
  | "whatsapp"
  | "facebook"
  | "instagram"
  | "telegram"
  | "website"
  | "email"
  | "phone_call"
  | "sms"
  | "other";

export type PublicationStatus =
  | "pending_review"
  | "ai_analysis_complete"
  | "needs_human_review"
  | "approved"
  | "rejected"
  | "disputed"
  | "correction_request"
  | "possible_duplicate";

export type EvidenceStatus =
  | "unverified" // single community report, no review
  | "multiple_reports" // multiple independent community reports
  | "evidence_reviewed" // an editor reviewed supporting evidence
  | "independently_confirmed"; // corroborated by trusted source

/** Status shown to the public on search & report pages. */
export type SearchStatus =
  | "no_reports"
  | "unverified"
  | "multiple_reports"
  | "evidence_reviewed"
  | "independently_confirmed"
  | "disputed";

export interface Identifier {
  type: IdentifierType;
  /** Masked, display-safe value, e.g. "+60****1234" or "exa***.com" */
  display: string;
  /** HMAC of the normalized identifier, used for matching without exposing raw value */
  hash: string;
  /** Normalized value (domain lowercased, E.164 phone, etc.) — only for non-PII types */
  normalized?: string;
}

/** An approved, public scam report stored as a JSON file. */
export interface ScamReport {
  id: string; // e.g. "SC-000001"
  category: ScamCategory;
  country: string;
  channel: CommunicationChannel;
  identifier_type: IdentifierType;
  identifier_display: string;
  identifier_hash: string;
  description: string;
  incident_date: string; // ISO date (YYYY-MM-DD)
  publication_status: "approved";
  evidence_status: EvidenceStatus;
  corroboration_count: number;
  created_at: string; // ISO date the report was first submitted
  published_at: string; // ISO date the report was approved & published
  /** Optional: related report IDs that corroborate the same identifier */
  related_reports?: string[];
  /** Optional: AI-extracted risk indicators (no accusations) */
  risk_indicators?: string[];
  /** Optional: a short, editor-reviewed safety tip specific to this report */
  safety_advice?: string;
  /** Whether the report subject has submitted a correction or response */
  disputed?: boolean;
}

/** Payload submitted by a visitor through the report form. */
export interface ReportSubmission {
  category: ScamCategory;
  channel: CommunicationChannel;
  identifier_type: IdentifierType;
  identifier_value: string; // raw, only seen by moderation
  country: string;
  description: string;
  incident_date: string;
  asked_for_money: boolean;
  lost_money: boolean;
  additional_info?: string;
  /** Optional, anonymous reporter handle (not required) */
  reporter_handle?: string;
  consent: {
    good_faith: boolean;
    not_false: boolean;
    understands_review: boolean;
    understands_redaction: boolean;
  };
  /** Honeypot — must be empty for legitimate submissions */
  company?: string;
}

/** Structured response returned by the Gemini analysis. */
export interface GeminiAnalysis {
  suggested_category: ScamCategory;
  communication_channel: CommunicationChannel;
  country: string;
  extracted_identifiers: Array<{
    type: IdentifierType;
    value: string;
  }>;
  sensitive_information_detected: boolean;
  sensitive_information_types?: string[];
  possible_duplicate: boolean;
  related_report_suggestions: string[];
  risk_indicators: string[];
  moderation_recommendation: "auto_approve" | "manual_review" | "reject";
  confidence: "low" | "medium" | "high";
  safety_advice?: string;
  /** Translation of the description into the platform's default language */
  translated_description?: string;
}

/** A pending report item shown in the admin moderation queue. */
export interface PendingReport {
  /** GitHub issue number in the private moderation repository */
  issue_number: number;
  /** Generated reference number, e.g. "SC-2026-000123" */
  reference: string;
  submitted_at: string;
  submission: ReportSubmission;
  analysis?: GeminiAnalysis;
  status: PublicationStatus;
  labels: string[];
}

/** Search index entry — one per identifier hash. */
export interface SearchIndexEntry {
  hash: string;
  type: IdentifierType;
  display: string;
  normalized?: string;
  report_ids: string[];
  categories: ScamCategory[];
  countries: string[];
  latest_date: string;
  evidence_status: EvidenceStatus;
  corroboration_count: number;
  disputed: boolean;
}

/** Aggregated search result for a single identifier. */
export interface SearchResult {
  query: string;
  identifier_type: IdentifierType | "unknown";
  status: SearchStatus;
  identifier_display: string;
  total_reports: number;
  reports: Array<Pick<ScamReport, "id" | "category" | "country" | "channel" | "identifier_display" | "incident_date" | "evidence_status" | "corroboration_count" | "disputed">>;
  categories: ScamCategory[];
  countries: string[];
  safety_advice: string;
}

export interface CategoryMeta {
  slug: string;
  id: ScamCategory;
  name: string;
  short_description: string;
  icon: string; // lucide icon name
  warning_signs: string[];
}

export interface CountryMeta {
  code: string;
  name: string;
  /** Official consumer-protection / cybercrime reporting URL */
  report_url?: string;
}

export interface SafetyGuide {
  slug: string;
  title: string;
  category: ScamCategory | "general";
  summary: string;
  how_it_works: string[];
  warning_signs: string[];
  how_to_avoid: string[];
  if_affected: string[];
  official_resources: Array<{ label: string; url: string }>;
}

/** Public site configuration. */
export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  contact_email: string;
}
