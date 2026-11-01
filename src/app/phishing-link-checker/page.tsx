import type { Metadata } from "next";
import { HubPage } from "@/components/site/hub-page";
import { getHubPage } from "@/data/hub-pages";

export const metadata: Metadata = {
  title: "Phishing Link Checker — Check a Link for Phishing | Free",
  description:
    "Free phishing link checker. Check a link for phishing before you click. Search community reports and known phishing patterns to flag dangerous URLs. No sign-up, anonymous.",
  alternates: { canonical: "/phishing-link-checker" },
  openGraph: {
    title: "Phishing Link Checker — Check a Link for Phishing | Free",
    description:
      "Free phishing link checker. Check a link for phishing before you click.",
    type: "website",
  },
};

export default function PhishingLinkCheckerPage() {
  return <HubPage content={getHubPage("phishing-link-checker")!} />;
}
