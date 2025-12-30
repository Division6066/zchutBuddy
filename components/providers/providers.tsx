"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type React from "react";
import { GuestAuthProvider } from "@/lib/guest-auth";
import { I18nProvider } from "@/lib/i18n";

// Read env vars at module level (consistent between server and client)
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Only create Convex client if URL exists
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function Providers({ children }: { children: React.ReactNode }) {
  // If missing required keys, render children with guest auth and i18n only
  if (!clerkKey || !convex) {
    return (
      <I18nProvider>
        <GuestAuthProvider>{children}</GuestAuthProvider>
      </I18nProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <I18nProvider>
          <GuestAuthProvider>{children}</GuestAuthProvider>
        </I18nProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
