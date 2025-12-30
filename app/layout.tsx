import type { Metadata } from "next";
import { Inter, Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const notoHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-hebrew",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZchuyotBuddy - מצא את הזכויות שמגיעות לך",
  description: "פלטפורמה חכמה לניווט בזכויות סוציאליות בישראל. גלה, עקוב ותבע את הזכויות שמגיעות לך בקלות.",
  icons: {
    icon: [
      { url: "/icons/icon-512.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }],
    shortcut: "/icons/icon-192.svg",
  },
  keywords: ["זכויות", "ביטוח לאומי", "הטבות", "ישראל", "benefits", "rights", "Israel"],
  authors: [{ name: "ZchuyotBuddy" }],
  openGraph: {
    title: "ZchuyotBuddy - מצא את הזכויות שמגיעות לך",
    description: "פלטפורמה חכמה לניווט בזכויות סוציאליות בישראל",
    type: "website",
    locale: "he_IL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${inter.variable} ${notoHebrew.variable}`} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
