import type { MetadataRoute } from "next";
import { HUB_PAGES } from "@/data/hub-pages";
import { CATEGORIES } from "@/data/categories";
import { SAFETY_GUIDES } from "@/data/safety-guides";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://scam-intelligence-exchange.vercel.app";

/**
 * Dynamic sitemap. Only approved, public content is included — pending,
 * rejected and disputed moderation issues are never listed.
 *
 * The four scam-checker hub pages are high-priority because they target the
 * main commercial keywords (website scam checker, phone number scam check,
 * email scam checker, phishing link checker).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    // Scam-checker hub pages (keyword-rich URLs, high priority)
    ...HUB_PAGES.map((p) => ({
      url: `${siteUrl}${p.href}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    // Top-level anchor sections of the homepage
    { url: `${siteUrl}/#search`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/#report`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/#categories`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/#guides`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/#faq`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/#latest`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${siteUrl}/#about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // Static public pages
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/latest-reports`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    // Category pages
    ...CATEGORIES.map((c) => ({
      url: `${siteUrl}/scam-categories/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    // Safety guide pages
    ...SAFETY_GUIDES.map((g) => ({
      url: `${siteUrl}/safety-guides/${g.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Legal pages
    { url: `${siteUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/community-guidelines`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/correction-request`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/report-appeal`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  // Pending, rejected, disputed, and admin pages are deliberately excluded.
  // Individual report pages (/reports/[id]) are included automatically by
  // search engines via internal links from search results and the latest
  // reports section; we do not enumerate them in the sitemap to avoid
  // generating thousands of low-quality pages.

  return base;
}
