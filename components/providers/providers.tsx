"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import type React from "react";
import { GuestAuthProvider } from "@/lib/guest-auth";
import { I18nProvider } from "@/lib/i18n";

// Read env vars at module level (consistent between server and client)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Only create Convex client if URL exists
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function Providers({ children }: { children: React.ReactNode }) {
  // If missing Convex URL, render children with guest auth and i18n only
  if (!convex) {
    return (
      <I18nProvider>
        <GuestAuthProvider>{children}</GuestAuthProvider>
      </I18nProvider>
    );
  }

  return (
    <ConvexAuthProvider client={convex}>
      <I18nProvider>
        <GuestAuthProvider>{children}</GuestAuthProvider>
      </I18nProvider>
    </ConvexAuthProvider>
  );
}
