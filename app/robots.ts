/**
 * Robots.txt Configuration for ZchuyotBuddy
 *
 * Controls which pages search engines can crawl.
 * Reference: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import type { MetadataRoute } from "next";

const baseUrl = "https://zchuyotbuddy.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/he/",
          "/en/",
          "/he/about",
          "/en/about",
          "/he/pricing",
          "/en/pricing",
          "/he/faq",
          "/en/faq",
          "/he/contact",
          "/en/contact",
          "/he/rights-finder",
          "/en/rights-finder",
          "/he/terms",
          "/en/terms",
          "/he/privacy",
          "/en/privacy",
          "/he/accessibility",
          "/en/accessibility",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/app/",
          "/onboarding/",
          "/profile/",
          "/settings/",
          "/alerts/",
          "/chat/", // Chat sessions are private
          "/_next/",
          "/admin/",
          "/*.json$",
          "/*?*", // Query parameters
        ],
      },
      {
        // Block OpenAI's crawler
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        // Block Common Crawl
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        // Block other AI crawlers
        userAgent: "Google-Extended",
        disallow: "/",
      },
      {
        // Block anthropic crawler
        userAgent: "anthropic-ai",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

