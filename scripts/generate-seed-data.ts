/**
 * Generate seed/demo approved reports and the search index.
 *
 * Produces:
 *   src/data/reports.json          — array of ScamReport
 *   src/data/indexes/search-index.json  — array of SearchIndexEntry
 *
 * All reports are FICTIONAL demo data — they use clearly-fake masked
 * identifiers and do not reference any real person, business or number.
 *
 * Run: bun run scripts/generate-seed-data.ts
 */

import { createHmac } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const SECRET = process.env.IDENTIFIER_HMAC_SECRET || "dev-insecure-secret-change-me";
const hash = (v: string) => createHmac("sha256", SECRET).update(v).digest("hex");

interface SeedSpec {
  id: string;
  category: string;
  country: string;
  channel: string;
  identifier_type: string;
  identifier_normalized: string;
  identifier_display: string;
  description: string;
  incident_date: string;
  created_at: string;
  evidence_status: string;
  corroboration_count: number;
  disputed?: boolean;
  risk_indicators?: string[];
}

// Demo data — all identifiers are FICTIONAL. Hashes are derived from the
// normalized value using the same HMAC the production search uses, so the
// search demo works against the same code path.
const specs: SeedSpec[] = [
  {
    id: "SC-000001",
    category: "fake_job",
    country: "Malaysia",
    channel: "whatsapp",
    identifier_type: "phone",
    identifier_normalized: "+60123456789",
    identifier_display: "+60****6789",
    description: "Reporter received a WhatsApp job offer for a 'data entry' position that required an upfront registration fee of RM 200. After payment, no work was provided and the contact became unreachable.",
    incident_date: "2026-10-12",
    created_at: "2026-10-13",
    evidence_status: "multiple_reports",
    corroboration_count: 4,
    risk_indicators: ["advance_payment_request", "messaging_app_only", "vague_job_description"],
  },
  {
    id: "SC-000002",
    category: "investment",
    country: "Singapore",
    channel: "telegram",
    identifier_type: "social_profile",
    identifier_normalized: "fx_pro_signals_99",
    identifier_display: "fx***",
    description: "A Telegram channel offered 'guaranteed' daily forex returns of 3-5%. After the reporter deposited funds into a trading platform link, withdrawals were blocked unless an additional 'tax' fee was paid.",
    incident_date: "2026-10-05",
    created_at: "2026-10-07",
    evidence_status: "evidence_reviewed",
    corroboration_count: 7,
    risk_indicators: ["guaranteed_returns", "withdrawal_blocked", "tax_fee_request"],
  },
  {
    id: "SC-000003",
    category: "online_shopping",
    country: "United States",
    channel: "website",
    identifier_type: "domain",
    identifier_normalized: "luxurydeals-2026.shop",
    identifier_display: "lux***.shop",
    description: "Reporter ordered branded sneakers at 70% discount from a website that was registered three weeks earlier. Payment was taken by card; no order confirmation or shipping details followed and the support email bounced.",
    incident_date: "2026-10-20",
    created_at: "2026-10-21",
    evidence_status: "multiple_reports",
    corroboration_count: 5,
    risk_indicators: ["recently_registered_domain", "below_market_pricing", "no_order_confirmation"],
  },
  {
    id: "SC-000004",
    category: "phishing",
    country: "United Kingdom",
    channel: "sms",
    identifier_type: "domain",
    identifier_normalized: "royalmail-parcel-redelivery.com",
    identifier_display: "roy***.com",
    description: "SMS claimed a parcel was held for redelivery and asked the recipient to pay a £1.50 'redelivery fee' via a link. The link led to a card-details capture page mimicking the postal service.",
    incident_date: "2026-10-18",
    created_at: "2026-10-18",
    evidence_status: "independently_confirmed",
    corroboration_count: 12,
    risk_indicators: ["lookalike_domain", "small_fee_lure", "card_details_capture"],
  },
  {
    id: "SC-000005",
    category: "romance",
    country: "Australia",
    channel: "facebook",
    identifier_type: "social_profile",
    identifier_normalized: "james_morgan_offshore",
    identifier_display: "ja***",
    description: "A profile claiming to be an offshore engineer built a relationship over several weeks, then asked for money to cover a fake 'customs fee' for a gift shipment. Reporter sent money before realizing the inconsistency.",
    incident_date: "2026-09-28",
    created_at: "2026-10-02",
    evidence_status: "multiple_reports",
    corroboration_count: 3,
    risk_indicators: ["quick_affection", "refuses_video-call", "shipping_fee_request"],
  },
  {
    id: "SC-000006",
    category: "impersonation",
    country: "India",
    channel: "phone_call",
    identifier_type: "phone",
    identifier_normalized: "+919876543210",
    identifier_display: "+91****3210",
    description: "Caller claimed to be from a telecom regulatory authority and said the reporter's mobile number would be disconnected within hours unless 'KYC verification' was completed. The caller asked for the reporter's bank OTP.",
    incident_date: "2026-10-22",
    created_at: "2026-10-22",
    evidence_status: "multiple_reports",
    corroboration_count: 9,
    risk_indicators: ["authority_impersonation", "urgency_pressure", "otp_request"],
  },
  {
    id: "SC-000007",
    category: "giveaway",
    country: "Canada",
    channel: "instagram",
    identifier_type: "social_profile",
    identifier_normalized: "official.brand.giveaways",
    identifier_display: "of***",
    description: "An Instagram profile mimicking a well-known brand announced a 'milestone giveaway'. Winners had to pay a 'shipping fee' to claim their prize. The legitimate brand confirmed no such giveaway existed.",
    incident_date: "2026-10-15",
    created_at: "2026-10-16",
    evidence_status: "evidence_reviewed",
    corroboration_count: 6,
    risk_indicators: ["brand_impersonation", "fee_to_claim_prize", "lookalike_handle"],
  },
  {
    id: "SC-000008",
    category: "advance_payment",
    country: "Nigeria",
    channel: "whatsapp",
    identifier_type: "phone",
    identifier_normalized: "+2348012345678",
    identifier_display: "+23****45678",
    description: "Reporter was offered a personal loan at favourable terms but had to pay a 'processing fee' in gift cards before disbursement. No loan was ever disbursed and the fee was not refunded.",
    incident_date: "2026-10-08",
    created_at: "2026-10-09",
    evidence_status: "unverified",
    corroboration_count: 1,
    risk_indicators: ["advance_fee_for_loan", "gift_card_payment", "no_disbursement"],
  },
  {
    id: "SC-000009",
    category: "fake_website",
    country: "Germany",
    channel: "website",
    identifier_type: "domain",
    identifier_normalized: "postbank-login-secure.de",
    identifier_display: "pos***.de",
    description: "Reporter received an email linking to a website mimicking their bank's login page. The page submitted credentials to an unrelated domain. Reporter realized after failed login attempts and froze the account.",
    incident_date: "2026-10-19",
    created_at: "2026-10-19",
    evidence_status: "multiple_reports",
    corroboration_count: 4,
    risk_indicators: ["lookalike_domain", "credential_capture", "email_lure"],
  },
  {
    id: "SC-000010",
    category: "online_shopping",
    country: "United Arab Emirates",
    channel: "website",
    identifier_type: "domain",
    identifier_normalized: "gadget-mega-sale.store",
    identifier_display: "gad***.store",
    description: "Reporter ordered electronics at 80% off. Card was charged in a foreign currency, no goods arrived and the website disappeared within two weeks. Customer support number was non-functional.",
    incident_date: "2026-10-10",
    created_at: "2026-10-12",
    evidence_status: "multiple_reports",
    corroboration_count: 8,
    risk_indicators: ["recently_registered_domain", "foreign_currency_charge", "site_disappeared"],
  },
  {
    id: "SC-000011",
    category: "investment",
    country: "South Africa",
    channel: "whatsapp",
    identifier_type: "phone",
    identifier_normalized: "+27712345678",
    identifier_display: "+27****5678",
    description: "Reporter was added to a WhatsApp 'investment group' showing fake profit screenshots. After depositing, withdrawals required recruiting two new members first — a clear Ponzi structure.",
    incident_date: "2026-10-01",
    created_at: "2026-10-03",
    evidence_status: "independently_confirmed",
    corroboration_count: 15,
    risk_indicators: ["recruitment_required_for_withdrawal", "fake_profit_screenshots", "ponzi_structure"],
  },
  {
    id: "SC-000012",
    category: "phishing",
    country: "Bangladesh",
    channel: "email",
    identifier_type: "email",
    identifier_normalized: "support@bkash-verify-secure.com",
    identifier_display: "sup***@bkash-verify-secure.com",
    description: "Email claiming the reporter's mobile wallet account was restricted. The 'verify now' link pointed to a credential-capture page. Reporter did not click; the sender domain was a lookalike.",
    incident_date: "2026-10-23",
    created_at: "2026-10-23",
    evidence_status: "unverified",
    corroboration_count: 2,
    risk_indicators: ["lookalike_domain", "account_restriction_lure", "credential_capture"],
  },
  {
    id: "SC-000013",
    category: "online_shopping",
    country: "Ireland",
    channel: "website",
    identifier_type: "domain",
    identifier_normalized: "country-crafts-ireland.example",
    identifier_display: "cou***.example",
    description: "Reporter alleged a small craft store failed to deliver an order. The store owner submitted a correction request with proof of refund and shipping delay from a courier strike. Report is retained but flagged as disputed pending review.",
    incident_date: "2026-09-15",
    created_at: "2026-09-20",
    evidence_status: "unverified",
    corroboration_count: 1,
    disputed: true,
    risk_indicators: ["delivery_delay"],
  },
];

const reports = specs.map((s) => ({
  id: s.id,
  category: s.category,
  country: s.country,
  channel: s.channel,
  identifier_type: s.identifier_type,
  identifier_display: s.identifier_display,
  identifier_hash: hash(s.identifier_normalized),
  description: s.description,
  incident_date: s.incident_date,
  publication_status: "approved" as const,
  evidence_status: s.evidence_status,
  corroboration_count: s.corroboration_count,
  created_at: s.created_at,
  published_at: s.created_at,
  related_reports: [] as string[],
  risk_indicators: s.risk_indicators || [],
  disputed: !!s.disputed,
}));

// Build the search index by grouping reports by identifier_hash
const entryMap = new Map<string, any>();
for (const r of reports) {
  const key = r.identifier_hash;
  if (!entryMap.has(key)) {
    entryMap.set(key, {
      hash: r.identifier_hash,
      type: r.identifier_type,
      display: r.identifier_display,
      normalized:
        r.identifier_type === "phone" || r.identifier_type === "social_profile"
          ? undefined
          : specs.find((s) => s.id === r.id)!.identifier_normalized,
      report_ids: [] as string[],
      categories: [] as string[],
      countries: [] as string[],
      latest_date: r.incident_date,
      evidence_status: r.evidence_status,
      corroboration_count: 0,
      disputed: false,
    });
  }
  const e = entryMap.get(key);
  e.report_ids.push(r.id);
  if (!e.categories.includes(r.category)) e.categories.push(r.category);
  if (!e.countries.includes(r.country)) e.countries.push(r.country);
  if (r.incident_date > e.latest_date) e.latest_date = r.incident_date;
  const order = ["unverified", "multiple_reports", "evidence_reviewed", "independently_confirmed"];
  if (order.indexOf(r.evidence_status) > order.indexOf(e.evidence_status)) {
    e.evidence_status = r.evidence_status;
  }
  e.corroboration_count += r.corroboration_count;
  if (r.disputed) e.disputed = true;
}
const index = Array.from(entryMap.values());

const outReports = resolve(process.cwd(), "src/data/reports.json");
const outIndex = resolve(process.cwd(), "src/data/indexes/search-index.json");
mkdirSync(dirname(outReports), { recursive: true });
mkdirSync(dirname(outIndex), { recursive: true });
writeFileSync(outReports, JSON.stringify(reports, null, 2) + "\n", "utf-8");
writeFileSync(outIndex, JSON.stringify(index, null, 2) + "\n", "utf-8");
console.log(`Wrote ${reports.length} reports -> ${outReports}`);
console.log(`Wrote ${index.length} index entries -> ${outIndex}`);
