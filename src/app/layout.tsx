import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://scam-intelligence-exchange.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Scam Checker — Check Phone Numbers, Websites & Emails for Free",
    template: "%s · Scam Checker",
  },
  description:
    "Free scam checker. Check phone numbers, websites, emails and social profiles against community scam reports before you trust them. 100% free, no sign-up, anonymous.",
  keywords: [
    "scam checker",
    "website scam checker",
    "phone number scam check",
    "email scam checker",
    "phishing link checker",
    "fake website checker",
    "scam website detector",
    "check if website is legit",
    "scam report",
    "fraud prevention",
    "community scam intelligence",
  ],
  authors: [{ name: "Scam Intelligence Exchange" }],
  applicationName: "Scam Intelligence Exchange",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Scam Checker — Check Phone Numbers, Websites & Emails for Free",
    description:
      "Free scam checker. Check phone numbers, websites, emails and social profiles against community scam reports before you trust them. 100% free, no sign-up.",
    url: siteUrl,
    siteName: "Scam Checker",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scam Checker — Check Before You Trust",
    description:
      "Free scam checker for phone numbers, websites, emails and links. 100% free, no sign-up, anonymous.",
  },
  alternates: {
    canonical: "/",
  },
  category: "consumer-protection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Scam Checker",
    alternateName: "Scam Intelligence Exchange",
    url: siteUrl,
    applicationCategory: "SecurityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free scam checker. Check phone numbers, websites, emails and social profiles against community scam reports before you trust them.",
    publisher: {
      "@type": "Organization",
      name: "Scam Intelligence Exchange",
      url: siteUrl,
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
