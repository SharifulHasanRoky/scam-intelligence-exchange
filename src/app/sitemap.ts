import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://scam-intelligence-exchange.vercel.app";

/**
 * Dynamic sitemap. Only approved, public content is included — pending,
 * rejected and disputed moderation issues are never listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/#search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/#report`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/#categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/#guides`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/#latest`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/#about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // In production, the search index entries would also produce per-identifier
  // pages. For the MVP we keep sitemap focused on top-level entry points to
  // avoid generating low-quality pages.

  return base;
}
