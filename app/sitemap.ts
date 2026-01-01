/**
 * Dynamic Sitemap Generation for ZchuyotBuddy
 *
 * Generates a sitemap.xml with all public pages in both Hebrew and English.
 * Reference: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from "next";

const baseUrl = "https://zchuyotbuddy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static marketing pages (high priority)
  const marketingPages = [
    "", // Homepage
    "/about",
    "/pricing",
    "/contact",
    "/faq",
  ];

  // Legal pages (lower priority)
  const legalPages = ["/terms", "/privacy", "/accessibility"];

  // Feature pages (indexable landing pages, even if features require auth)
  const featurePages = ["/rights-finder", "/chat"];

  // Generate entries for both locales - marketing pages
  const staticEntries: MetadataRoute.Sitemap = marketingPages.flatMap((page) => [
    {
      url: `${baseUrl}/he${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          he: `${baseUrl}/he${page}`,
          en: `${baseUrl}/en${page}`,
        },
      },
    },
    {
      url: `${baseUrl}/en${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 0.9 : 0.7, // Slightly lower priority for English (Hebrew is primary)
    },
  ]);

  // Legal pages - both locales
  const legalEntries: MetadataRoute.Sitemap = legalPages.flatMap((page) => [
    {
      url: `${baseUrl}/he${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/en${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ]);

  // Feature pages - both locales (higher priority for engagement)
  const featureEntries: MetadataRoute.Sitemap = featurePages.flatMap((page) => [
    {
      url: `${baseUrl}/he${page}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
      alternates: {
        languages: {
          he: `${baseUrl}/he${page}`,
          en: `${baseUrl}/en${page}`,
        },
      },
    },
    {
      url: `${baseUrl}/en${page}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ]);

  // Combine all entries
  return [...staticEntries, ...legalEntries, ...featureEntries];
}
