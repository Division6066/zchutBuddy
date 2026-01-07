import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { AuthRedirectHandler } from "@/components/auth/AuthRedirectHandler";
import { Providers } from "@/components/providers/providers";
import { fontVariables } from "./fonts";

/**
 * Viewport Configuration
 * Defines how the page should be displayed on different devices
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0d968b" },
    { media: "(prefers-color-scheme: dark)", color: "#065f5b" },
  ],
};

/**
 * Comprehensive SEO Metadata
 * Optimized for Israeli audience with Hebrew as primary language
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://zchuyotbuddy.com"),

  title: {
    default: "זכויות באדי | מצא את הזכויות שמגיעות לך",
    template: "%s | זכויות באדי",
  },

  description:
    "פלטפורמת AI חכמה לניווט זכויות נכים בישראל. גלה הטבות מביטוח לאומי, משרד הביטחון, קופות חולים, משרד הרווחה ועוד. חינם לנסות!",

  keywords: [
    "זכויות נכים",
    "ביטוח לאומי",
    "קצבת נכות",
    'נכי צה"ל',
    "הטבות לנכים",
    "זכויות רפואיות",
    "פטור מארנונה",
    "קצבת שירותים מיוחדים",
    "גמלת ניידות",
    "דמי מחלה",
    "Israeli disability benefits",
    "Bituach Leumi",
    "Israeli government benefits",
  ],

  authors: [{ name: "ZchuyotBuddy", url: "https://zchuyotbuddy.com" }],
  creator: "ZchuyotBuddy",
  publisher: "ZchuyotBuddy",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "he_IL",
    alternateLocale: ["en_US"],
    url: "https://zchuyotbuddy.com",
    siteName: "זכויות באדי - ZchuyotBuddy",
    title: "זכויות באדי | מצא את הזכויות שמגיעות לך",
    description:
      "פלטפורמת AI לניווט זכויות נכים בישראל. גלה הטבות מביטוח לאומי, משרד הביטחון ועוד.",
    images: [
      {
        url: "/og-image-he.svg",
        width: 1200,
        height: 630,
        alt: "זכויות באדי - מצא את הזכויות שלך",
        type: "image/svg+xml",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "זכויות באדי | מצא את הזכויות שמגיעות לך",
    description: "פלטפורמת AI לניווט זכויות נכים בישראל",
    images: ["/twitter-image-he.svg"],
    creator: "@zchuyotbuddy",
  },

  alternates: {
    canonical: "https://zchuyotbuddy.com",
    languages: {
      "he-IL": "https://zchuyotbuddy.com/he",
      "en-US": "https://zchuyotbuddy.com/en",
    },
  },

  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },

  manifest: "/manifest.json",

  category: "Government Services",

  other: {
    "google-site-verification": "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={fontVariables} suppressHydrationWarning={true}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ConvexAuthNextjsServerProvider>
          <Providers>
            <AuthRedirectHandler />
            {children}
          </Providers>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
