"use client";

import { useConvexAuth } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { authDebug } from "@/lib/auth-debug";

/**
 * AuthRedirectHandler Component
 * Monitors authentication state globally and handles redirects after magic link callback
 * Logs all authentication and redirect events for debugging
 */
export function AuthRedirectHandler() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Log auth state changes
    authDebug.logAuthState({
      isAuthenticated,
      isLoading,
      message: "Auth state updated",
    });

    // Prevent double redirects
    if (hasRedirectedRef.current) {
      return;
    }

    // Don't redirect while loading
    if (isLoading) {
      authDebug.debug({
        component: "AuthRedirectHandler",
        message: "Still loading auth state, waiting...",
      });
      return;
    }

    // Check if user just authenticated (likely from magic link callback)
    if (isAuthenticated) {
      authDebug.debug({
        component: "AuthRedirectHandler",
        message: "User is authenticated, checking for callback",
      });

      // Check if this is a callback from magic link
      const code = searchParams.get("code");
      const callbackEmail = searchParams.get("email");
      const redirectParam = searchParams.get("redirectTo");

      if (code) {
        authDebug.logCallback({
          provider: "resend",
          hasCode: true,
          hasRedirectTo: !!redirectParam,
          message: `Magic link callback detected - redirectTo param: ${redirectParam || "not present"}`,
        });
      }

      // Determine redirect target
      // Priority: redirectTo param > /dashboard
      const redirectTarget = redirectParam || "/dashboard";

      authDebug.logRedirect({
        source: "AuthRedirectHandler",
        target: redirectTarget,
        reason: "Post-authentication redirect after magic link",
        authenticated: true,
      });

      hasRedirectedRef.current = true;

      // Perform redirect
      router.push(redirectTarget);
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  // This component doesn't render anything
  return null;
}
