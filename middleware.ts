import { convexAuthNextjsMiddleware, createRouteMatcher, isAuthenticatedNextjs, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/onboarding(.*)", "/settings(.*)"]);

// Define routes that should redirect authenticated users (e.g., sign-in page)
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default convexAuthNextjsMiddleware(async (request) => {
  // Redirect authenticated users away from auth pages
  if (isAuthRoute(request) && (await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }

  // Redirect unauthenticated users away from protected pages
  if (isProtectedRoute(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/sign-in");
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
