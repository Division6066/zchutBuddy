/**
 * Font Configuration for ZchuyotBuddy
 *
 * Optimized Hebrew and English font loading using next/font.
 * Hebrew-first with English fallback.
 */

import { Heebo, Inter } from "next/font/google";

/**
 * Hebrew primary font - Heebo
 * Modern, clean Hebrew font with excellent readability
 */
export const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-heebo",
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
});

/**
 * English primary font - Inter
 * Clean, modern sans-serif optimized for screen reading
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
});

/**
 * Combined CSS variable classes for applying to <html> or <body>
 * Usage: <html className={fontVariables}>
 */
export const fontVariables = `${heebo.variable} ${inter.variable}`;

/**
 * Font configuration object for programmatic access
 */
export const fonts = {
  heebo,
  inter,
  variables: fontVariables,
} as const;

export default fonts;

