"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type React from "react";

// #region agent log
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
fetch('http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'providers.tsx:8',message:'Convex URL env check',data:{hasUrl:!!convexUrl,urlLength:convexUrl?.length||0,urlPrefix:convexUrl?.substring(0,20)||'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
// #endregion

// Only create Convex client if URL is valid
const isValidConvexUrl = convexUrl && !convexUrl.includes('YOUR-DEPLOY');
const convex = isValidConvexUrl ? new ConvexReactClient(convexUrl) : null;

interface ProvidersProps {
  children: React.ReactNode;
}

function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  if (!convex) {
    return <>{children}</>;
  }
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export function Providers({ children }: ProvidersProps) {
  // #region agent log
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  fetch('http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'providers.tsx:26',message:'Clerk key env check',data:{hasKey:!!clerkKey,keyLength:clerkKey?.length||0,keyPrefix:clerkKey?.substring(0,30)||'undefined',isPlaceholder:clerkKey?.includes('YOUR_CLERK')||false},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  const isValidClerkKey = clerkKey && !clerkKey.includes('YOUR_CLERK') && clerkKey.startsWith('pk_');
  const isValidConvexUrl = convexUrl && !convexUrl.includes('YOUR-DEPLOY');
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'providers.tsx:30',message:'Provider validation check',data:{isValidClerkKey,isValidConvexUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  // If keys are invalid, render children without providers (development mode)
  if (!isValidClerkKey || !isValidConvexUrl) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'providers.tsx:35',message:'Rendering without providers (dev mode)',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return <>{children}</>;
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'providers.tsx:40',message:'ClerkProvider init start',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  try {
    return (
      <ClerkProvider publishableKey={clerkKey!}>
        {/* #region agent log */}
        {(()=>{fetch('http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'providers.tsx:46',message:'ClerkProvider render',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});return null;})()}
        {/* #endregion */}
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </ClerkProvider>
    );
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'providers.tsx:51',message:'ClerkProvider init error',data:{errorMessage:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    // Fallback: render children without providers if Clerk fails
    return <>{children}</>;
  }
}
