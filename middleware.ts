import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// #region agent log
const isDemoMode = process.env.ZB_DEMO === "true";
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isValidClerkKey = !isDemoMode && clerkKey && !clerkKey.includes('YOUR_CLERK') && clerkKey.startsWith('pk_');
// #endregion

// Conditionally use Clerk middleware or passthrough
export default isValidClerkKey
  ? clerkMiddleware((auth, req) => {
      // #region agent log
      // Middleware execution with Clerk
      // #endregion
      return NextResponse.next();
    })
  : function middleware(req: NextRequest) {
      // #region agent log
      // Passthrough - no Clerk middleware (dev mode)
      // #endregion
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
