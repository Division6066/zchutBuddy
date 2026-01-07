import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/onboarding(.*)", "/settings(.*)"]);

// Define routes that should redirect authenticated users (e.g., sign-in page)
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default convexAuthNextjsMiddleware(async (request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const isAuthenticated = await isAuthenticatedNextjs();

  // Log all requests to auth-related routes
  if (isAuthRoute(request) || isProtectedRoute(request) || pathname.includes("/api/auth")) {
    const timestamp = new Date().toISOString();
    const hasCode = url.searchParams.has("code");
    const hasRedirectTo = url.searchParams.has("redirectTo");

    console.log(`[AUTH:INFO] ${timestamp} | Middleware | Request`, {
      pathname,
      isAuthenticated,
      hasCode,
      hasRedirectTo,
      message: "Incoming request to auth route",
    });
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(request) && isAuthenticated) {
    const timestamp = new Date().toISOString();
    console.log(`[AUTH:INFO] ${timestamp} | Middleware | Redirect`, {
      from: pathname,
      to: "/dashboard",
      reason: "Authenticated user on auth page",
      message: "Redirecting away from auth page",
    });
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }

  // Redirect unauthenticated users away from protected pages
  if (isProtectedRoute(request) && !isAuthenticated) {
    const timestamp = new Date().toISOString();
    console.log(`[AUTH:INFO] ${timestamp} | Middleware | Redirect`, {
      from: pathname,
      to: "/sign-in",
      reason: "Unauthenticated user on protected page",
      message: "Redirecting to sign-in",
    });
    return nextjsMiddlewareRedirect(request, "/sign-in");
  }

  // Log successful auth route access
  if ((isAuthRoute(request) || isProtectedRoute(request)) && isAuthenticated) {
    const timestamp = new Date().toISOString();
    console.log(`[AUTH:INFO] ${timestamp} | Middleware | Access`, {
      pathname,
      authenticated: true,
      message: "Authenticated access granted",
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
