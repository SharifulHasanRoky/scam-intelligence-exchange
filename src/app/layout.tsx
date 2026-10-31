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
    default: "Scam Intelligence Exchange — Check Before You Trust",
    template: "%s · Scam Intelligence Exchange",
  },
  description:
    "A free, community-powered platform to search suspicious phone numbers, websites, emails and online profiles, report scam experiences, and access reliable scam-prevention intelligence.",
  keywords: [
    "scam checker",
    "scam report",
    "phone number lookup",
    "website scam check",
    "email scam",
    "fraud prevention",
    "community scam intelligence",
    "scam protection",
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
    title: "Scam Intelligence Exchange — Check Before You Trust",
    description:
      "Free, community-powered scam intelligence. Search suspicious identifiers, report scams, and learn how to stay safe online.",
    url: siteUrl,
    siteName: "Scam Intelligence Exchange",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scam Intelligence Exchange — Check Before You Trust",
    description:
      "Free, community-powered scam intelligence. Search suspicious identifiers, report scams, and stay safe online.",
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
