/**
 * Content for the four scam-checker hub pages.
 *
 * Each hub page targets a cluster of related long-tail keywords (see
 * README SEO strategy). Content is original, substantial and non-alarmist.
 *
 * Pages:
 *  - /website-scam-checker       (11 keywords)
 *  - /phone-number-scam-checker  (2 keywords)
 *  - /email-scam-checker         (3 keywords)
 *  - /phishing-link-checker      (4 keywords)
 */

export type IdentifierTypeKey = "domain" | "url" | "phone" | "email";

export interface HubPageContent {
  slug: string;
  /** URL path. */
  href: string;
  /** H1 of the page. */
  h1: string;
  /** Meta title (≤60 chars ideal). */
  metaTitle: string;
  /** Meta description (≤160 chars). */
  metaDescription: string;
  /** Hero subtitle. */
  subtitle: string;
  /** Identifier type this checker focuses on (used to pre-fill the search). */
  identifierType: IdentifierTypeKey;
  /** Placeholder for the search input. */
  searchPlaceholder: string;
  /** Example queries shown as quick chips. */
  examples: string[];
  /** "How to use" steps. */
  howToUse: { title: string; desc: string }[];
  /** Warning signs / red flags. */
  warningSigns: string[];
  /** How the checker works (technical but accessible). */
  howItWorks: string[];
  /** What to do if flagged. */
  ifFlagged: string[];
  /** FAQ items (also rendered as JSON-LD FAQPage). */
  faqs: { q: string; a: string }[];
  /** Related safety-guide slugs on the platform. */
  relatedGuides: string[];
  /** Other hub pages to cross-link. */
  relatedHubs: string[];
}

export const HUB_PAGES: HubPageContent[] = [
  // ───────────────────────────────────────────────────────────────────────
  // Website Scam Checker
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "website-scam-checker",
    href: "/website-scam-checker",
    h1: "Free Website Scam Checker",
    metaTitle: "Website Scam Checker — Check if a Website is Legit | Free",
    metaDescription:
      "Free website scam checker and fake website detector. Check if a website is legit before you buy. Search community reports of scam sites, fake stores and phishing pages.",
    subtitle:
      "Check if a website is legit before you buy. Our scam website detector searches community reports to flag fake stores, phishing pages and fraudulent sites — free, no sign-up.",
    identifierType: "domain",
    searchPlaceholder: "Enter a website domain, e.g. example.com",
    examples: ["luxurydeals-2026.shop", "gadget-mega-sale.store", "postbank-login-secure.de"],
    howToUse: [
      { title: "Enter the domain", desc: "Type the website domain you want to check (e.g. example.com). You can also paste a full URL — we extract the domain automatically." },
      { title: "Click Check Now", desc: "Our scam website detector normalizes the domain, hashes it for privacy, and matches it against approved community reports." },
      { title: "Read the result", desc: "You see the masked domain, the number of reports, the evidence status, and clear safety advice on what to do next." },
    ],
    warningSigns: [
      "Domain registered in the last few weeks, often with a cheap TLD like .shop, .store, .top, .xyz",
      "Prices 50–90% below market value for branded goods",
      "No working phone number, no physical address, no refund policy",
      "All reviews are 5-star and generic, often posted within a short window",
      "Payment only via wire transfer, crypto, or gift cards",
      "Card charged in a foreign currency you did not expect",
      "No order confirmation email, or the support email bounces",
      "Login form submits to a different domain than the one in the address bar",
    ],
    howItWorks: [
      "Our website scam checker normalizes the domain you enter — lowercasing it, stripping the protocol (http/https) and any path, and removing the leading 'www.'.",
      "The normalized domain is HMAC-hashed using a server-side secret, so we can match it against reports without storing the raw domain in a publicly enumerable way.",
      "We match the hash against approved community reports in our public search index. We also try partial domain-suffix matches, so a report about 'shop.example.com' will match a search for 'example.com'.",
      "Raw domains are never exposed in their original form on public pages — they are masked (e.g. 'exa***.com') before display.",
      "If no reports match, we tell you clearly. The absence of reports does not guarantee a site is safe — scammers register new domains constantly.",
    ],
    ifFlagged: [
      "Do not enter payment details or personal information on the site.",
      "If you already paid by card, contact your bank immediately and request a chargeback.",
      "Change the password of any account you created on the site.",
      "Report the site to your national consumer-protection authority.",
      "Submit a report on our platform so other people can find it.",
    ],
    faqs: [
      {
        q: "How do I check if a website is legit?",
        a: "Enter the domain in our website scam checker above and click Check Now. We match it against community reports and show you the number of reports, the evidence status, and clear safety advice. Also check the domain age, look for a refund policy and a working contact method, and avoid sites that only accept wire transfer, crypto, or gift cards.",
      },
      {
        q: "Is the website scam checker free?",
        a: "Yes. Our fake website checker is 100% free. There is no sign-up, no premium tier, and no paywall. The platform is funded by minimal, clearly-labelled advertising on the homepage and educational guides only — never on search results.",
      },
      {
        q: "What does it mean if a site is flagged?",
        a: "A flag means one or more community members have reported the site. It does not, by itself, prove the site is fraudulent. Each result shows an evidence status — unverified, multiple independent reports, evidence reviewed, independently confirmed, or disputed — so you can judge how much weight to give it.",
      },
      {
        q: "Can I check a full URL, not just a domain?",
        a: "Yes. If you paste a full URL (e.g. https://example.com/product/123), our scam website detector extracts the domain automatically and matches it. For specific phishing pages, you can also use our Phishing Link Checker.",
      },
      {
        q: "What if no reports are found?",
        a: "The absence of reports does not guarantee a site is safe. Scammers register new domains constantly — a brand-new scam site will not yet have any reports. Always verify independently: check the domain age, look for reviews on independent sites, and avoid unusually low prices or unusual payment methods.",
      },
      {
        q: "How do I report a fake website?",
        a: "Use our report form to submit a description of what happened. Your report is reviewed by a human moderator before being published, and private information is redacted. Reports are anonymous by default — no account is required.",
      },
    ],
    relatedGuides: ["fake-online-stores", "fake-website", "phishing"],
    relatedHubs: ["phishing-link-checker", "email-scam-checker"],
  },

  // ───────────────────────────────────────────────────────────────────────
  // Phone Number Scam Checker
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "phone-number-scam-checker",
    href: "/phone-number-scam-checker",
    h1: "Free Phone Number Scam Checker",
    metaTitle: "Phone Number Scam Check — Check a Number for Scam Reports",
    metaDescription:
      "Free phone number scam checker. Check if a phone number is associated with scam reports before you respond. Search community reports of fraudulent calls and messages. No sign-up.",
    subtitle:
      "Check if a phone number is associated with scam reports before you respond. Search community-submitted reports of fraudulent calls, WhatsApp messages and SMS — free, anonymous.",
    identifierType: "phone",
    searchPlaceholder: "Enter a phone number, e.g. +60123456789",
    examples: ["+60123456789", "+919876543210", "+2348012345678"],
    howToUse: [
      { title: "Enter the number", desc: "Type the phone number including the country code (e.g. +60...). You can also paste a number with spaces or dashes — we normalize it." },
      { title: "Click Check Now", desc: "Our phone number scam checker normalizes the number to E.164 format, hashes it for privacy, and matches it against approved community reports." },
      { title: "Read the result", desc: "You see the masked number (e.g. +60****6789), the number of reports, the evidence status, and clear safety advice." },
    ],
    warningSigns: [
      "Unsolicited calls or messages offering prizes, loans, or investment opportunities",
      "Caller claims to be from a government agency, bank, or telecom and creates urgency",
      "Requests for OTPs, passwords, or remote access to your device",
      "Requests for payment via gift cards, crypto, or wire transfer",
      "Pressure to act quickly and keep the conversation secret",
      "WhatsApp or Telegram messages from unknown numbers offering 'easy money' jobs",
      "Caller refuses to verify their identity through a known, official channel",
      "Threats of arrest, fines, or account suspension if you do not pay",
    ],
    howItWorks: [
      "Our phone number scam checker normalizes the number you enter to E.164 format — the international standard. We handle '+', '00' international prefixes, spaces, dashes, and parentheses.",
      "The normalized number is HMAC-hashed using a server-side secret, so we can match it against reports without exposing the raw number publicly.",
      "We match the hash against approved community reports in our public search index.",
      "Raw phone numbers are never published. On public pages, numbers are masked (e.g. +60****6789) so only the country code and last four digits are visible.",
      "If no reports match, we tell you clearly. The absence of reports does not mean the number is safe — scammers rotate numbers constantly.",
    ],
    ifFlagged: [
      "Do not share any personal or financial information with the caller.",
      "Block the number on your phone and report it to your carrier.",
      "If you shared an OTP or password, change it immediately and contact your bank.",
      "Report the number to your national cybercrime authority.",
      "Submit a report on our platform so other people can find it.",
    ],
    faqs: [
      {
        q: "How do I check a phone number for scams?",
        a: "Enter the number including the country code in our phone number scam checker above and click Check Now. We normalize it to E.164, hash it for privacy, and match it against community reports. You see the masked number, the report count, the evidence status, and safety advice.",
      },
      {
        q: "Is the phone number scam check free?",
        a: "Yes. Our phone number scam checker is 100% free, no sign-up required. There is no premium tier and no paywall. The platform is funded by minimal, clearly-labelled advertising on the homepage and educational guides only.",
      },
      {
        q: "Do you publish the full phone number?",
        a: "No. Raw phone numbers are never published. On public pages, numbers are masked (e.g. +60****6789) so only the country code and last four digits are visible. We store an HMAC hash of the normalized number for matching, not the raw number itself.",
      },
      {
        q: "What if the number is not in your database?",
        a: "The absence of reports does not mean the number is safe. Scammers rotate numbers constantly — a brand-new scam number will not yet have any reports. Always be skeptical of unsolicited calls and messages, especially those asking for money, OTPs, or personal information.",
      },
      {
        q: "Can I check WhatsApp and Telegram numbers?",
        a: "Yes. Our phone number scam checker matches the underlying phone number regardless of which app the scammer used. Many reports involve WhatsApp, Telegram, SMS, and phone calls — all are matched the same way.",
      },
      {
        q: "How do I report a scam phone number?",
        a: "Use our report form to describe what happened. Choose 'Phone Call', 'SMS', or 'WhatsApp' as the channel, and enter the phone number as the identifier. Your report is reviewed by a moderator before being published. Reports are anonymous by default.",
      },
    ],
    relatedGuides: ["fake-recruitment", "impersonation", "advance-payment-scams"],
    relatedHubs: ["website-scam-checker", "email-scam-checker"],
  },

  // ───────────────────────────────────────────────────────────────────────
  // Email Scam Checker
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "email-scam-checker",
    href: "/email-scam-checker",
    h1: "Free Email Scam Checker",
    metaTitle: "Email Scam Checker — Check an Email for Scam Reports | Free",
    metaDescription:
      "Free email scam checker. Check if an email address is linked to scam or phishing reports. Search community reports of fraudulent emails before you reply or click. No sign-up.",
    subtitle:
      "Check if an email address is linked to scam or phishing reports. Search community reports of fraudulent emails before you reply, click a link, or share information — free, anonymous.",
    identifierType: "email",
    searchPlaceholder: "Enter an email address, e.g. name@example.com",
    examples: ["support@bkash-verify-secure.com", "noreply@royalmail-parcel.com", "admin@fx-pro-signals.com"],
    howToUse: [
      { title: "Enter the email", desc: "Type the sender email address you want to check (e.g. name@example.com)." },
      { title: "Click Check Now", desc: "Our email scam checker normalizes the email (lowercasing the local part and domain), hashes it for privacy, and matches it against approved community reports." },
      { title: "Read the result", desc: "You see the masked email (e.g. nam***@example.com), the number of reports, the evidence status, and clear safety advice." },
    ],
    warningSigns: [
      "Sender domain is a lookalike of a real brand (e.g. paypa1.com instead of paypal.com)",
      "Generic greetings ('Dear Customer') instead of your name",
      "Urgent or threatening language ('your account will be closed', 'final notice')",
      "Links to domains slightly different from the real brand",
      "Requests for passwords, OTPs, or full card details",
      "Attachments you were not expecting, especially .zip, .htm, or .html files",
      "Poor spelling and grammar in a message that claims to be from a major brand",
      "Reply-to address different from the sender address",
    ],
    howItWorks: [
      "Our email scam checker normalizes the address you enter — lowercasing both the local part and the domain, and stripping the leading 'www.' from the domain.",
      "The normalized email is HMAC-hashed using a server-side secret, so we can match it against reports without exposing the raw address publicly.",
      "We match the hash against approved community reports in our public search index.",
      "Raw email addresses are never published. On public pages, they are masked (e.g. nam***@example.com) so only the first three characters of the local part and the full domain are visible.",
      "If no reports match, we tell you clearly. The absence of reports does not mean the sender is safe — scammers create new email addresses constantly.",
    ],
    ifFlagged: [
      "Do not click any links or download any attachments in the email.",
      "Do not reply with personal or financial information.",
      "If you already clicked a link and entered credentials, change the password immediately and enable two-factor authentication.",
      "Mark the email as spam or phishing in your email client.",
      "Forward the email to your country's anti-phishing reporting address.",
      "Submit a report on our platform so other people can find it.",
    ],
    faqs: [
      {
        q: "How do I check if an email is a scam?",
        a: "Enter the sender email address in our email scam checker above and click Check Now. We normalize it, hash it for privacy, and match it against community reports. You see the masked email, the report count, the evidence status, and safety advice. Also check the sender domain for lookalikes (e.g. paypa1.com vs paypal.com) and be skeptical of urgent requests.",
      },
      {
        q: "Is the email scam checker free?",
        a: "Yes. Our email scam checker is 100% free, no sign-up required. There is no premium tier and no paywall. The platform is funded by minimal, clearly-labelled advertising on the homepage and educational guides only — never on search results.",
      },
      {
        q: "Do you publish the full email address?",
        a: "No. Raw email addresses are never published. On public pages, they are masked (e.g. nam***@example.com). We store an HMAC hash of the normalized email for matching, not the raw email itself.",
      },
      {
        q: "Should I check the email domain or the full email?",
        a: "You can check either. If you enter a full email address (name@example.com), we hash the full address for an exact match. If you want to check an entire sender domain, enter just the domain in our Website Scam Checker instead.",
      },
      {
        q: "What if the email is not in your database?",
        a: "The absence of reports does not mean the email is safe. Scammers create new email addresses constantly. Always be skeptical of unsolicited emails asking for personal information, payment, or containing unexpected attachments — even if no reports exist yet.",
      },
      {
        q: "How do I report a scam email?",
        a: "Use our report form to describe what happened. Choose 'Email' as the channel, and enter the sender email address as the identifier. Your report is reviewed by a moderator before being published. Reports are anonymous by default.",
      },
    ],
    relatedGuides: ["phishing", "fake-website", "impersonation"],
    relatedHubs: ["phishing-link-checker", "website-scam-checker"],
  },

  // ───────────────────────────────────────────────────────────────────────
  // Phishing Link Checker
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "phishing-link-checker",
    href: "/phishing-link-checker",
    h1: "Free Phishing Link Checker",
    metaTitle: "Phishing Link Checker — Check a Link for Phishing | Free",
    metaDescription:
      "Free phishing link checker. Check a link for phishing before you click. Search community reports and known phishing patterns to flag dangerous URLs. No sign-up, anonymous.",
    subtitle:
      "Check a link for phishing before you click. Our phishing link checker searches community reports to flag dangerous URLs that capture credentials, payments and personal data — free, anonymous.",
    identifierType: "url",
    searchPlaceholder: "Enter a URL, e.g. https://example.com/login",
    examples: ["https://royalmail-parcel-redelivery.com", "https://postbank-login-secure.de", "https://bkash-verify-secure.com/login"],
    howToUse: [
      { title: "Enter the URL", desc: "Paste the full link you received (e.g. in an email, SMS, or chat). Include the https:// or http:// prefix if possible." },
      { title: "Click Check Now", desc: "Our phishing link checker normalizes the URL, extracts the domain, hashes it for privacy, and matches it against approved community reports." },
      { title: "Read the result", desc: "You see the masked URL (e.g. roy***.com/…24), the number of reports, the evidence status, and clear safety advice." },
    ],
    warningSigns: [
      "URL is a slight misspelling of a real brand (e.g. paypa1.com, rnicrosoft.com)",
      "URL uses a different TLD than the real brand (e.g. .shop, .top, .xyz)",
      "No HTTPS padlock, or a certificate that does not match the domain",
      "Link was sent in an unsolicited email, SMS, or chat message",
      "Link is shortened (e.g. bit.ly, tinyurl) and you cannot see the destination",
      "Page asks for passwords, OTPs, or full card details",
      "Login form submits to a different domain than the one in the address bar",
      "Page has aggressive pop-ups or urgent banners ('your account will be closed')",
    ],
    howItWorks: [
      "Our phishing link checker parses the URL you enter and extracts the hostname. We strip the leading 'www.' and lowercase the domain.",
      "The normalized domain is HMAC-hashed using a server-side secret, so we can match it against reports without exposing the raw URL publicly.",
      "We match the hash against approved community reports in our public search index. We also try partial domain-suffix matches, so a report about 'login.example.com' will match a search for 'example.com'.",
      "Raw URLs are never published. On public pages, they are masked (e.g. roy***.com/…24, where 24 is the path length) so the structure is visible without exposing the full link.",
      "If no reports match, we tell you clearly. The absence of reports does not mean the link is safe — phishing pages are deployed constantly.",
      "We never visit or fetch the URL you enter. The check is performed against our local index only.",
    ],
    ifFlagged: [
      "Do not click the link. If you already clicked, do not enter any information.",
      "If you entered credentials, change the password immediately and enable two-factor authentication.",
      "If you entered card or banking details, contact your bank immediately.",
      "Report the link to your email provider, your national anti-phishing authority, or Google Safe Browsing.",
      "Submit a report on our platform so other people can find it.",
    ],
    faqs: [
      {
        q: "How do I check a link for phishing?",
        a: "Paste the full URL in our phishing link checker above and click Check Now. We extract the domain, hash it for privacy, and match it against community reports. You see the masked URL, the report count, the evidence status, and safety advice. Also check the URL for misspellings, unusual TLDs, and whether the link was unsolicited.",
      },
      {
        q: "Is the phishing link checker free?",
        a: "Yes. Our phishing link checker is 100% free, no sign-up required. There is no premium tier and no paywall. The platform is funded by minimal, clearly-labelled advertising on the homepage and educational guides only — never on search results.",
      },
      {
        q: "Do you visit the link I enter?",
        a: "No. We never visit or fetch the URL you enter. The check is performed entirely against our local index of approved community reports. This is also an SSRF safety measure — we never let user input cause our server to make outbound requests.",
      },
      {
        q: "Can I check shortened links (bit.ly, tinyurl)?",
        a: "We can match the shortened link's domain against reports, but we do not follow redirects to see where the link ultimately points. If you receive a shortened link in an unsolicited message, treat it with high caution regardless of our result. You can use a link expander tool first, then check the destination URL with our phishing link checker.",
      },
      {
        q: "What if the link is not in your database?",
        a: "The absence of reports does not mean the link is safe. Phishing pages are deployed constantly — a brand-new phishing link will not yet have any reports. Always check the URL for misspellings, look for the HTTPS padlock, and be skeptical of unsolicited links asking for credentials or payment.",
      },
      {
        q: "How do I report a phishing link?",
        a: "Use our report form to describe what happened. Choose the channel you received the link through (Email, SMS, WhatsApp, etc.), and enter the URL as the identifier. Your report is reviewed by a moderator before being published. Reports are anonymous by default.",
      },
    ],
    relatedGuides: ["phishing", "fake-website", "what-to-do-after-losing-money"],
    relatedHubs: ["website-scam-checker", "email-scam-checker"],
  },
];

export function getHubPage(slug: string): HubPageContent | undefined {
  return HUB_PAGES.find((p) => p.slug === slug);
}
