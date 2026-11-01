import type { CategoryMeta } from "@/lib/types";

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "online-shopping",
    id: "online_shopping",
    name: "Online Shopping Scam",
    short_description: "Fake stores that take payment but never ship, or ship counterfeit goods.",
    icon: "ShoppingCart",
    warning_signs: [
      "Prices far below market value",
      "No verified reviews or only glowing 5-star reviews",
      "Payment by wire transfer, crypto, or gift cards only",
      "Recently registered domain with short validity",
    ],
  },
  {
    slug: "fake-job",
    id: "fake_job",
    name: "Fake Job Scam",
    short_description: "Fake recruitment offers that request upfront fees or unpaid 'trial' work.",
    icon: "Briefcase",
    warning_signs: [
      "Offer for a job you never applied to",
      "Request for an upfront 'processing' or 'equipment' fee",
      "Interviews only over chat apps",
      "No verifiable company domain email",
    ],
  },
  {
    slug: "investment",
    id: "investment",
    name: "Investment Scam",
    short_description: "Fake trading platforms and 'guaranteed return' investment schemes.",
    icon: "TrendingUp",
    warning_signs: [
      "Promises of guaranteed or unusually high returns",
      "Pressure to invest quickly",
      "Platform controls withdrawals",
      "Contact only through messaging apps",
    ],
  },
  {
    slug: "phishing",
    id: "phishing",
    name: "Phishing",
    short_description: "Fake messages impersonating banks, delivery services or government agencies.",
    icon: "MailWarning",
    warning_signs: [
      "Urgent requests to 'verify' your account",
      "Links to look-alike domains",
      "Requests for OTPs or passwords",
      "Generic greetings and poor spelling",
    ],
  },
  {
    slug: "romance",
    id: "romance",
    name: "Romance Scam",
    short_description: "Fake romantic relationships that eventually request money or gifts.",
    icon: "HeartCrack",
    warning_signs: [
      "Quick confession of love before meeting",
      "Refusal to video call",
      "Request for money for 'emergencies' or 'travel'",
      "Profile photos that reverse-search to other people",
    ],
  },
  {
    slug: "impersonation",
    id: "impersonation",
    name: "Impersonation Scam",
    short_description: "Fake accounts pretending to be officials, friends, family or celebrities.",
    icon: "UserX",
    warning_signs: [
      "New account claiming to be someone you know",
      "Requests moved to a private channel",
      "Urgent financial 'emergency'",
      "Refusal to verify identity through a known channel",
    ],
  },
  {
    slug: "giveaway",
    id: "giveaway",
    name: "Fake Giveaway Scam",
    short_description: "Fake prize or giveaway offers that require an upfront fee to 'claim'.",
    icon: "Gift",
    warning_signs: [
      "You won a prize you never entered for",
      "Fee or tax required before release",
      "Domain mimics a real brand",
      "Limited-time pressure to act fast",
    ],
  },
  {
    slug: "advance-payment",
    id: "advance_payment",
    name: "Advance Payment Scam",
    short_description: "Goods, services or loans that require an upfront payment that never materializes.",
    icon: "Wallet",
    warning_signs: [
      "Upfront fee before any service is delivered",
      "Unusual payment method",
      "Vague contract terms",
      "Refusal to provide a refund policy",
    ],
  },
  {
    slug: "fake-website",
    id: "fake_website",
    name: "Fake Website",
    short_description: "Counterfeit sites mimicking banks, marketplaces or government portals.",
    icon: "Globe",
    warning_signs: [
      "URL is slightly misspelled or uses a different TLD",
      "No HTTPS padlock or invalid certificate",
      "Aggressive pop-ups and urgent banners",
      "Login form submits to an unrelated domain",
    ],
  },
  {
    slug: "other",
    id: "other",
    name: "Other Scam",
    short_description: "Suspicious activity that does not fit the categories above.",
    icon: "CircleAlert",
    warning_signs: [
      "Pressure to act fast",
      "Request for unusual payment methods",
      "Reluctance to answer questions",
      "Contact via disposable channels",
    ],
  },
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
export function getCategoryById(id: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
