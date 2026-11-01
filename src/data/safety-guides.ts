import type { SafetyGuide } from "@/lib/types";

/**
 * Safety guides content. Each guide follows the structure required by §17:
 * how it works, warning signs, how to avoid, what to do if affected, and
 * official reporting resources.
 *
 * Official resources are real, well-known consumer-protection / cybercrime
 * reporting portals. Always verify the destination before submitting
 * personal information.
 */
export const SAFETY_GUIDES: SafetyGuide[] = [
  {
    slug: "fake-online-stores",
    title: "Fake Online Stores",
    category: "online_shopping",
    summary: "How to spot counterfeit e-commerce sites before you pay.",
    how_it_works: [
      "Scammers set up professional-looking online stores offering popular products at suspiciously low prices.",
      "Payment is taken by card, wire transfer, cryptocurrency or gift cards.",
      "After payment, no order is shipped, counterfeit goods are sent, or the store disappears entirely.",
      "Some sites exist only to harvest payment card details at checkout.",
    ],
    warning_signs: [
      "Prices 50–90% below market value for branded goods.",
      "Domain registered in the last few weeks, often with a cheap TLD like .shop, .store, .top.",
      "No working phone number, no physical address, no refund policy.",
      "All reviews are 5-star and generic, often posted within a short window.",
      "Payment only via wire transfer, crypto, or gift cards.",
    ],
    how_to_avoid: [
      "Verify the domain age using a WHOIS lookup service.",
      "Search the store name plus 'reviews' or 'scam' before ordering.",
      "Pay with a credit card or trusted payment service that offers chargeback protection.",
      "Avoid checkout pages that request more personal information than necessary.",
    ],
    if_affected: [
      "Contact your bank or card issuer immediately and request a chargeback.",
      "Change the password of any account used at the fraudulent store.",
      "Report the site to your national consumer-protection authority.",
      "Monitor your card statements for unauthorized charges.",
    ],
    official_resources: [
      { label: "FTC ReportFraud (US)", url: "https://reportfraud.ftc.gov/" },
      { label: "Action Fraud (UK)", url: "https://www.actionfraud.police.uk/" },
      { label: "Scamwatch (AU)", url: "https://www.scamwatch.gov.au/" },
    ],
  },
  {
    slug: "fake-recruitment",
    title: "Fake Recruitment Scams",
    category: "fake_job",
    summary: "Spot fake job offers that ask for money before you start.",
    how_it_works: [
      "Scammers contact targets via WhatsApp, Telegram or email with unsolicited job offers.",
      "The role is described as easy, well-paid and remote, with no interview or a chat-only interview.",
      "Before starting, the victim must pay a 'registration', 'equipment' or 'training' fee.",
      "After payment, the recruiter disappears or the work never materializes.",
    ],
    warning_signs: [
      "Unsolicited offer for a job you never applied for.",
      "Interviews conducted only through chat apps, never video or in person.",
      "Request for an upfront fee, gift cards, or 'equipment deposit'.",
      "Recruiter email uses a free domain (gmail, outlook) instead of a company domain.",
      "Job description is vague and promises unusually high pay for low effort.",
    ],
    how_to_avoid: [
      "Verify the company exists and the recruiter's email domain matches.",
      "Never pay money to apply for or accept a job.",
      "Search the recruiter's name and phone number for scam reports.",
      "Be skeptical of 'easy money' roles such as liking posts, rating apps, or reshipping packages.",
    ],
    if_affected: [
      "Stop communication with the recruiter immediately.",
      "Report the recruiter's number and any account details to the platform they contacted you on.",
      "File a report with your national cybercrime authority.",
      "If you shared identity documents, place a fraud alert with your credit bureau.",
    ],
    official_resources: [
      { label: "FTC ReportFraud (US)", url: "https://reportfraud.ftc.gov/" },
      { label: "Action Fraud (UK)", url: "https://www.actionfraud.police.uk/" },
      { label: "Cyber Crime (IN)", url: "https://cybercrime.gov.in/" },
    ],
  },
  {
    slug: "investment-scams",
    title: "Investment Scams",
    category: "investment",
    summary: "How to recognize 'guaranteed return' schemes and fake trading platforms.",
    how_it_works: [
      "Scammers promise high, guaranteed or risk-free returns from forex, crypto, commodities or 'AI trading bots'.",
      "Victims are shown fake profit dashboards and pressured to invest more.",
      "Withdrawals are blocked, delayed, or require an additional 'tax' or 'fee' to release.",
      "Eventually the platform disappears, taking all deposited funds.",
    ],
    warning_signs: [
      "Promises of guaranteed or unusually high returns.",
      "Pressure to invest quickly before an 'opportunity closes'.",
      "Trading platform controls all withdrawals.",
      "Contact only through WhatsApp, Telegram or social media.",
      "No regulated entity behind the platform; no license number you can verify.",
    ],
    how_to_avoid: [
      "Verify the firm is registered with your country's financial regulator.",
      "Be suspicious of any 'risk-free' investment claim — all real investments carry risk.",
      "Never invest based on a tip from someone you only met online.",
      "Test withdrawals with a small amount before investing more.",
    ],
    if_affected: [
      "Stop sending money immediately, even if pressured to pay a 'release fee'.",
      "Save all communications and transaction records as evidence.",
      "Report to your financial regulator and national cybercrime authority.",
      "If crypto was used, report to chain-analysis-supported recovery services; recovery is rarely possible but reports help.",
    ],
    official_resources: [
      { label: "FTC ReportFraud (US)", url: "https://reportfraud.ftc.gov/" },
      { label: "FCA (UK)", url: "https://www.fca.org.uk/consumers/report-scam-unauthorised-firm" },
      { label: "ASIC (AU)", url: "https://asic.gov.au/" },
    ],
  },
  {
    slug: "romance-scams",
    title: "Romance Scams",
    category: "romance",
    summary: "How to protect yourself when a new online relationship turns to money requests.",
    how_it_works: [
      "A scammer creates an attractive profile on a dating app or social media.",
      "Affection and trust are built quickly — often within days or weeks.",
      "The scammer refuses to video call or meet in person, citing an 'emergency' or 'overseas work'.",
      "Eventually a request for money arrives: a medical bill, customs fee, travel ticket, or investment opportunity.",
    ],
    warning_signs: [
      "Quick declarations of love before meeting.",
      "Refusal to video call or always having a poor connection.",
      "Profile photos that reverse-search to other people.",
      "Money requests framed as 'emergencies' or 'temporary'.",
      "Requests to move the conversation to a private messaging app.",
    ],
    how_to_avoid: [
      "Take time. Genuine relationships develop gradually.",
      "Insist on a video call early in the conversation.",
      "Reverse-search profile photos to check for stolen images.",
      "Never send money, gift cards, or banking details to someone you have not met in person.",
    ],
    if_affected: [
      "Stop all contact and do not send any more money.",
      "Report the profile to the dating platform or social network.",
      "File a report with your national cybercrime authority.",
      "Talk to someone you trust — romance scam victims are often isolated, and shame is part of the scammer's toolset.",
    ],
    official_resources: [
      { label: "FTC ReportFraud (US)", url: "https://reportfraud.ftc.gov/" },
      { label: "Action Fraud (UK)", url: "https://www.actionfraud.police.uk/" },
      { label: "Scamwatch (AU)", url: "https://www.scamwatch.gov.au/" },
    ],
  },
  {
    slug: "phishing",
    title: "Phishing",
    category: "phishing",
    summary: "How to recognize fake messages impersonating banks, delivery services and governments.",
    how_it_works: [
      "You receive an email, SMS or call that appears to come from a trusted brand or authority.",
      "The message creates urgency — your account will be closed, a parcel held, a fine due.",
      "A link leads to a lookalike login page that captures your credentials, OTP or card details.",
      "Scammers use the captured data to take over accounts or make fraudulent payments.",
    ],
    warning_signs: [
      "Urgent or threatening language ('act now', 'final notice').",
      "Links to domains slightly different from the real brand.",
      "Requests for passwords, OTPs, or full card details.",
      "Generic greetings ('Dear Customer') and poor spelling or grammar.",
    ],
    how_to_avoid: [
      "Never click links in unexpected messages — type the official URL directly.",
      "Enable two-factor authentication on important accounts.",
      "Check the sender's email address and the link's actual destination before clicking.",
      "Be skeptical of any message demanding immediate action.",
    ],
    if_affected: [
      "Change the password of any account you may have exposed.",
      "Contact your bank immediately if you entered card or banking details.",
      "Enable 2FA on the affected account and review recent login activity.",
      "Forward phishing emails to your country's anti-phishing reporting address.",
    ],
    official_resources: [
      { label: "FTC ReportFraud (US)", url: "https://reportfraud.ftc.gov/" },
      { label: "NCSC (UK) report phishing", url: "https://www.ncsc.gov.uk/section/about-this-website/report-scam-website" },
      { label: "APWG", url: "https://apwg.org/" },
    ],
  },
  {
    slug: "fake-giveaways",
    title: "Fake Giveaways",
    category: "giveaway",
    summary: "How to spot fake prize offers that ask for a fee or your details.",
    how_it_works: [
      "You receive a message or see a post claiming you have won a prize, giveaway or lottery.",
      "To claim, you must pay a 'shipping', 'tax' or 'processing' fee, or provide card details.",
      "Sometimes the scammer impersonates a real brand or celebrity.",
      "After payment, no prize arrives and the scammer disappears.",
    ],
    warning_signs: [
      "You won a prize you never entered for.",
      "A fee or tax is required before the prize can be released.",
      "The account or domain mimics a real brand with slight spelling differences.",
      "Pressure to act quickly before the 'offer expires'.",
    ],
    how_to_avoid: [
      "You cannot win a lottery or giveaway you did not enter.",
      "Genuine giveaways never require a fee to claim a prize.",
      "Verify the promotion on the brand's official website or verified social account.",
      "Never share card details or pay a fee to receive a 'prize'.",
    ],
    if_affected: [
      "Stop communication and do not pay any further fees.",
      "Report the impersonating account to the platform.",
      "Contact your bank if you paid by card and request a chargeback.",
      "Report the scam to your national consumer-protection authority.",
    ],
    official_resources: [
      { label: "FTC ReportFraud (US)", url: "https://reportfraud.ftc.gov/" },
      { label: "Action Fraud (UK)", url: "https://www.actionfraud.police.uk/" },
      { label: "Scamwatch (AU)", url: "https://www.scamwatch.gov.au/" },
    ],
  },
  {
    slug: "social-media-impersonation",
    title: "Social Media Impersonation",
    category: "impersonation",
    summary: "How to verify a contact claiming to be someone you know.",
    how_it_works: [
      "A scammer creates an account that looks like a friend, family member, official or celebrity.",
      "They reach out claiming an urgent emergency — a lost phone, a hospital bill, a stranded traveller.",
      "Pressure to act fast and keep the request secret.",
      "Money is sent to an account controlled by the scammer.",
    ],
    warning_signs: [
      "A 'new' number or account for someone you already know.",
      "Request to move conversation to a private channel.",
      "Urgent financial request with pressure to keep it secret.",
      "Refusal to verify identity through a known channel.",
    ],
    how_to_avoid: [
      "Verify the request through a separate, known channel — call the person directly.",
      "Set a safe word with close family for emergency requests.",
      "Be skeptical of any new account claiming to be a public figure.",
      "Check whether the account is verified on the platform.",
    ],
    if_affected: [
      "Stop communication and verify the real identity through a known channel.",
      "Report the impersonating account to the platform.",
      "If you sent money, contact your bank immediately.",
      "File a report with your national cybercrime authority.",
    ],
    official_resources: [
      { label: "FTC ReportFraud (US)", url: "https://reportfraud.ftc.gov/" },
      { label: "Action Fraud (UK)", url: "https://www.actionfraud.police.uk/" },
      { label: "Cyber Crime (IN)", url: "https://cybercrime.gov.in/" },
    ],
  },
  {
    slug: "advance-payment-scams",
    title: "Advance Payment Scams",
    category: "advance_payment",
    summary: "How to recognize requests for money before any service is delivered.",
    how_it_works: [
      "A product, service, loan or opportunity is offered at attractive terms.",
      "An upfront fee is required before anything is delivered.",
      "After payment, additional fees are requested, or the contact disappears.",
      "Payment is requested via wire transfer, crypto, or gift cards — methods that are hard to reverse.",
    ],
    warning_signs: [
      "Upfront fee required before any service is provided.",
      "Unusual payment method (gift cards, crypto, wire transfer).",
      "Vague contract terms and refusal to provide written refund policy.",
      "Pressure to act quickly.",
    ],
    how_to_avoid: [
      "Never pay an upfront fee for a loan, grant, prize or job.",
      "Use a credit card or trusted payment service that offers buyer protection.",
      "Read the contract and refund policy before paying.",
      "Verify the business exists and has a real address and phone number.",
    ],
    if_affected: [
      "Stop communication and do not pay any further fees.",
      "Contact your bank and request a chargeback if paid by card.",
      "Report the scam to your national consumer-protection authority.",
      "Save all communications and receipts as evidence.",
    ],
    official_resources: [
      { label: "FTC ReportFraud (US)", url: "https://reportfraud.ftc.gov/" },
      { label: "Action Fraud (UK)", url: "https://www.actionfraud.police.uk/" },
      { label: "Scamwatch (AU)", url: "https://www.scamwatch.gov.au/" },
    ],
  },
  {
    slug: "recovery-scams",
    title: "Recovery Scams",
    category: "general",
    summary: "How to avoid being scammed again by people claiming they can recover your money.",
    how_it_works: [
      "After losing money to a scam, victims are contacted by someone claiming to be a 'recovery agent', 'hacker' or 'lawyer'.",
      "The agent claims they can recover the lost funds for a fee.",
      "The fee is paid — and the agent disappears, often using information the victim posted publicly about the original scam.",
      "Some recovery agents impersonate government agencies or blockchain analysts.",
    ],
    warning_signs: [
      "Unsolicited contact after you have publicly posted about being scammed.",
      "Guaranteed recovery of lost funds — no legitimate service can guarantee this.",
      "Upfront fee required before any recovery.",
      "Claims of special access to banks, exchanges or law enforcement.",
    ],
    how_to_avoid: [
      "Do not trust anyone who contacts you offering to recover your funds.",
      "Real law enforcement and regulators never charge a fee to investigate.",
      "Be cautious about what you post publicly — recovery scammers target public complaint forums.",
      "Use only official reporting channels (police, regulator, your bank).",
    ],
    if_affected: [
      "Stop all communication and do not pay any further fees.",
      "Report the recovery scammer to the platform they contacted you on.",
      "File a report with your national cybercrime authority.",
      "Talk to a trusted person — being targeted twice is common and not your fault.",
    ],
    official_resources: [
      { label: "FTC ReportFraud (US)", url: "https://reportfraud.ftc.gov/" },
      { label: "Action Fraud (UK)", url: "https://www.actionfraud.police.uk/" },
      { label: "Scamwatch (AU)", url: "https://www.scamwatch.gov.au/" },
    ],
  },
  {
    slug: "what-to-do-after-losing-money",
    title: "What to Do After Losing Money",
    category: "general",
    summary: "Practical steps to limit the damage and report the crime.",
    how_it_works: [
      "After a scam, time is critical — fast action can limit further losses.",
      "The steps below help you protect your accounts, gather evidence, and report the crime to the right authority.",
      "Recovery of funds is never guaranteed, but reporting helps build cases against scammers and protect others.",
    ],
    warning_signs: [
      "Repeated requests for more money after the initial loss.",
      "Anyone contacting you offering guaranteed recovery.",
      "Pressure to keep the loss secret.",
    ],
    how_to_avoid: [
      "Do not pay any further fees to the scammer or to anyone offering to 'recover' the funds.",
      "Do not share details of the scam publicly with your real identity attached.",
      "Be cautious of any new contact that references your case — recovery scammers monitor public complaints.",
    ],
    if_affected: [
      "Contact your bank or card issuer immediately — request a stop-payment or chargeback.",
      "Freeze or close any account that may be compromised; change passwords and enable 2FA.",
      "Gather evidence: screenshots, chat logs, transaction IDs, phone numbers, URLs, dates.",
      "File a report with your national cybercrime authority and your local police.",
      "Report the scammer's phone number, email and accounts to the platforms involved.",
      "Tell someone you trust. Scams thrive on shame and isolation.",
    ],
    official_resources: [
      { label: "FTC ReportFraud (US)", url: "https://reportfraud.ftc.gov/" },
      { label: "Action Fraud (UK)", url: "https://www.actionfraud.police.uk/" },
      { label: "Scamwatch (AU)", url: "https://www.scamwatch.gov.au/" },
      { label: "Cyber Crime (IN)", url: "https://cybercrime.gov.in/" },
    ],
  },
];

export function getGuideBySlug(slug: string): SafetyGuide | undefined {
  return SAFETY_GUIDES.find((g) => g.slug === slug);
}
