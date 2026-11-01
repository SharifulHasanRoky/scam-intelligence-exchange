import type { Metadata } from "next";
import { HubPage } from "@/components/site/hub-page";
import { getHubPage } from "@/data/hub-pages";

export const metadata: Metadata = {
  title: "Website Scam Checker — Check if a Website is Legit | Free",
  description:
    "Free website scam checker and fake website detector. Check if a website is legit before you buy. Search community reports of scam sites, fake stores and phishing pages.",
  alternates: { canonical: "/website-scam-checker" },
  openGraph: {
    title: "Website Scam Checker — Check if a Website is Legit | Free",
    description:
      "Free website scam checker and fake website detector. Check if a website is legit before you buy.",
    type: "website",
  },
};

export default function WebsiteScamCheckerPage() {
  return <HubPage content={getHubPage("website-scam-checker")!} />;
}
