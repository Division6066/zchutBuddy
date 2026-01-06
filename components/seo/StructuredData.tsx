/**
 * Structured Data Components for ZchuyotBuddy
 *
 * JSON-LD schema components for improved Google search results.
 * These components render <script type="application/ld+json"> tags.
 */

import type React from "react";

const BASE_URL = "https://zchuyotbuddy.com";

/**
 * Organization Schema
 * Provides information about ZchuyotBuddy as an organization
 */
export function OrganizationSchema(): React.JSX.Element {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "זכויות באדי",
    alternateName: "ZchuyotBuddy",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: "פלטפורמת AI לניווט זכויות נכים בישראל",
    foundingDate: "2024",
    areaServed: {
      "@type": "Country",
      name: "Israel",
    },
    serviceType: "Government Benefits Navigation",
    availableLanguage: ["Hebrew", "English"],
    sameAs: [
      "https://facebook.com/zchuyotbuddy",
      "https://twitter.com/zchuyotbuddy",
      "https://linkedin.com/company/zchuyotbuddy",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Hebrew", "English"],
      url: `${BASE_URL}/contact`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * WebSite Schema
 * Provides information about the website
 */
export function WebSiteSchema(): React.JSX.Element {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "זכויות באדי",
    alternateName: "ZchuyotBuddy",
    url: BASE_URL,
    description: "פלטפורמת AI לניווט זכויות נכים בישראל",
    inLanguage: ["he", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/rights-finder?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * WebApplication Schema
 * Describes ZchuyotBuddy as a web application
 */
export function WebAppSchema(): React.JSX.Element {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "זכויות באדי",
    alternateName: "ZchuyotBuddy",
    url: BASE_URL,
    applicationCategory: "GovernmentApplication",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript, HTML5 support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ILS",
      description: "Free trial available",
    },
    featureList: [
      "AI-powered benefits search",
      "Hebrew and English support",
      "Personalized recommendations",
      "Real-time updates on benefits",
      "Document management",
    ],
    screenshot: `${BASE_URL}/screenshots/app-screenshot.png`,
    softwareHelp: {
      "@type": "CreativeWork",
      url: `${BASE_URL}/faq`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * FAQ Schema
 * For FAQ pages to get rich results in search
 */
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps): React.JSX.Element {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Breadcrumb Schema
 * For navigation breadcrumbs to appear in search results
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps): React.JSX.Element {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Software Application Schema
 * For app store listings and mobile app SEO
 */
export function SoftwareAppSchema(): React.JSX.Element {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ZchuyotBuddy",
    operatingSystem: "iOS, Android, Web",
    applicationCategory: "UtilitiesApplication",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Organization",
      name: "ZchuyotBuddy",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Service Schema
 * Describes ZchuyotBuddy's services
 */
export function ServiceSchema(): React.JSX.Element {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "זכויות באדי - ניווט זכויות",
    alternateName: "ZchuyotBuddy Benefits Navigation",
    description:
      "שירות AI לניווט וגילוי זכויות ממשלתיות לאזרחי ישראל, כולל זכויות נכים, הטבות ביטוח לאומי ועוד",
    provider: {
      "@type": "Organization",
      name: "ZchuyotBuddy",
    },
    areaServed: {
      "@type": "Country",
      name: "Israel",
    },
    serviceType: "Government Benefits Navigation",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: BASE_URL,
      serviceSmsNumber: "",
      servicePhone: "",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Local Business Schema (if applicable)
 * Use this if ZchuyotBuddy has a physical location
 */
interface LocalBusinessSchemaProps {
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone?: string;
  openingHours?: string[];
}

export function LocalBusinessSchema({
  address,
  telephone,
  openingHours,
}: LocalBusinessSchemaProps): React.JSX.Element | null {
  if (!address) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "זכויות באדי",
    alternateName: "ZchuyotBuddy",
    url: BASE_URL,
    telephone,
    address: {
      "@type": "PostalAddress",
      ...address,
    },
    openingHoursSpecification: openingHours?.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.split(" ")[0],
      opens: hours.split(" ")[1]?.split("-")[0],
      closes: hours.split(" ")[1]?.split("-")[1],
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Article Schema
 * For blog posts or article pages
 */
interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}

export function ArticleSchema({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
}: ArticleSchemaProps): React.JSX.Element {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "ZchuyotBuddy",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    image: image ? (image.startsWith("http") ? image : `${BASE_URL}${image}`) : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${BASE_URL}${url}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Combined Schema for homepage
 * Includes Organization + WebSite + WebApp schemas
 */
export function HomePageSchema(): React.JSX.Element {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <WebAppSchema />
    </>
  );
}

export type { FAQItem, BreadcrumbItem, ArticleSchemaProps, LocalBusinessSchemaProps };
