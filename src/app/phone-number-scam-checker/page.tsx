import type { Metadata } from "next";
import { HubPage } from "@/components/site/hub-page";
import { getHubPage } from "@/data/hub-pages";

export const metadata: Metadata = {
  title: "Phone Number Scam Check — Check a Number for Scam Reports | Free",
  description:
    "Free phone number scam checker. Check if a phone number is associated with scam reports before you respond. Search community reports of fraudulent calls and messages. No sign-up.",
  alternates: { canonical: "/phone-number-scam-checker" },
  openGraph: {
    title: "Phone Number Scam Check — Check a Number for Scam Reports | Free",
    description:
      "Free phone number scam checker. Check if a phone number is associated with scam reports before you respond.",
    type: "website",
  },
};

export default function PhoneNumberScamCheckerPage() {
  return <HubPage content={getHubPage("phone-number-scam-checker")!} />;
}
