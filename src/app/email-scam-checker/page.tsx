import type { Metadata } from "next";
import { HubPage } from "@/components/site/hub-page";
import { getHubPage } from "@/data/hub-pages";

export const metadata: Metadata = {
  title: "Email Scam Checker — Check an Email for Scam Reports | Free",
  description:
    "Free email scam checker. Check if an email address is linked to scam or phishing reports. Search community reports of fraudulent emails before you reply or click. No sign-up.",
  alternates: { canonical: "/email-scam-checker" },
  openGraph: {
    title: "Email Scam Checker — Check an Email for Scam Reports | Free",
    description:
      "Free email scam checker. Check if an email address is linked to scam or phishing reports.",
    type: "website",
  },
};

export default function EmailScamCheckerPage() {
  return <HubPage content={getHubPage("email-scam-checker")!} />;
}
