import type { CountryMeta } from "@/lib/types";

/**
 * Curated list of countries with their official consumer-protection /
 * cybercrime reporting resources. URLs are real and verified at the time of
 * writing; users should always double-check the destination.
 */
export const COUNTRIES: CountryMeta[] = [
  { code: "AU", name: "Australia", report_url: "https://www.scamwatch.gov.au/report-a-scam" },
  { code: "BD", name: "Bangladesh", report_url: "https://www.dmp.gov.bd/cyber-security-center/" },
  { code: "BR", name: "Brazil", report_url: "https://www.gov.br/antifraude/pt-br" },
  { code: "CA", name: "Canada", report_url: "https://www.antifraudcentre-centreantifraude.ca/report-signalez-eng.htm" },
  { code: "CN", name: "China", report_url: "https://www.12321.cn/" },
  { code: "DE", name: "Germany", report_url: "https://www.bzk-urteil.de/" },
  { code: "EG", name: "Egypt", report_url: "https://nc3.eg" },
  { code: "FR", name: "France", report_url: "https://www.cybermalveillance.gouv.fr/" },
  { code: "GB", name: "United Kingdom", report_url: "https://www.actionfraud.police.uk/" },
  { code: "HK", name: "Hong Kong", report_url: "https://www.adcc.gov.hk/en/home.html" },
  { code: "ID", name: "Indonesia", report_url: "https://patrolsiber.id/" },
  { code: "IN", name: "India", report_url: "https://cybercrime.gov.in/" },
  { code: "KE", name: "Kenya", report_url: "https://www.dcikenya.go.ke/" },
  { code: "MY", name: "Malaysia", report_url: "https://semakmule.rmp.gov.my/" },
  { code: "NG", name: "Nigeria", report_url: "https://cert.gov.ng/" },
  { code: "NZ", name: "New Zealand", report_url: "https://cert.govt.nz/" },
  { code: "PH", name: "Philippines", report_url: "https://www.pnpacg.ph/" },
  { code: "PK", name: "Pakistan", report_url: "https://www.fia.gov.pk/" },
  { code: "RU", name: "Russia", report_url: "https://cert.mvd.ru/" },
  { code: "SA", name: "Saudi Arabia", report_url: "https://cert.gov.sa/" },
  { code: "SG", name: "Singapore", report_url: "https://www.police.gov.sg/iwitness" },
  { code: "TH", name: "Thailand", report_url: "https://www.thaicert.or.th/" },
  { code: "TR", name: "Turkey", report_url: "https://www.usom.gov.tr/" },
  { code: "US", name: "United States", report_url: "https://reportfraud.ftc.gov/" },
  { code: "VN", name: "Vietnam", report_url: "https://canhbao.vn/" },
  { code: "ZA", name: "South Africa", report_url: "https://cybersecurityhub.gov.za/" },
];

export function getCountryByName(name: string): CountryMeta | undefined {
  const n = name.trim().toLowerCase();
  return COUNTRIES.find((c) => c.name.toLowerCase() === n || c.code.toLowerCase() === n);
}
