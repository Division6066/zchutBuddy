import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";

/**
 * Convex Auth Route Handler
 * Handles magic link callbacks from Resend and other auth providers
 * Logs callback parameters for debugging redirect issues
 */

export const { GET, POST } = convexAuthNextjsMiddleware(async (request) => {
  // The middleware will automatically handle the auth flow
  // and perform redirects based on the redirectTo parameter

  const url = new URL(request.url);

  // Log callback processing for debugging
  if (url.searchParams.has("code") || url.searchParams.has("state")) {
    const hasRedirectTo = url.searchParams.has("redirectTo");
    const redirectTo = url.searchParams.get("redirectTo");
    const code = url.searchParams.get("code");

    // Note: Using console here since this is a server-side handler
    // The logs will appear in the server terminal/logs
    console.log(`[AUTH:INFO] ${new Date().toISOString()} | Callback | Resend`, {
      path: url.pathname,
      hasCode: !!code,
      hasRedirectTo,
      redirectTo,
      message: "Processing magic link callback",
    });
  }

  // Return undefined to let the middleware handle the rest
  return;
});
