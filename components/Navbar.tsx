"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, User, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SignInModal from "@/components/SignInModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BrandLogo from "@/components/BrandLogo";
import { debug } from "@/lib/debug";

function NavbarContent() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Redirect to /app when user becomes signed in (after login) - fallback only
  // Primary redirect should happen in SignInModal.handleSubmit
  useEffect(() => {
    if (isSignedIn && !hasRedirectedRef.current && showSignInModal) {
      // Only redirect if we're still on the home page (fallback mechanism)
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      if (currentPath === '/' || currentPath === '') {
        debug.info({
          location: "Navbar.tsx:useEffect",
          message: "Fallback: User signed in detected in Navbar - redirecting to /app",
          data: { isSignedIn, showSignInModal, currentPath },
        });
        hasRedirectedRef.current = true;
        setShowSignInModal(false);
        // Use window.location.replace for reliable redirect
        if (typeof window !== 'undefined') {
          window.location.replace("/app");
        } else {
          router.replace("/app");
        }
      }
    }
  }, [isSignedIn, showSignInModal, router]);

  // Reset redirect flag when modal closes
  useEffect(() => {
    if (!showSignInModal) {
      hasRedirectedRef.current = false;
    }
  }, [showSignInModal]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-l from-primary to-primary/90 border-b border-primary/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Navigation Links - Right Side (RTL) */}
          <div className="flex gap-6 items-center">
            <Link
              href="/"
              className="flex items-center gap-2 hover:scale-105 transition-transform"
              aria-label="דף הבית"
            >
              <div className="brightness-0 invert">
                <BrandLogo size={24} />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">ZchuyotBuddy</span>
            </Link>
            <Link
              href="/onboarding"
              className="text-sm font-medium text-white hover:text-white/80 transition-colors"
            >
              איך זה עובד?
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-white hover:text-white/80 transition-colors"
            >
              למי זה מתאים?
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-white hover:text-white/80 transition-colors"
            >
              אודות
            </Link>
          </div>

          {/* User Profile or Sign In - Left Side (RTL) */}
          <div className="mr-auto">
            {isSignedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 hover:bg-accent rounded-lg px-3 py-2 h-auto"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">
                    שלום, {user.firstName || user.emailAddresses[0]?.emailAddress.split("@")[0]}
                  </span>
                </Button>

                {isOpen && (
                  <Card className="absolute left-0 mt-2 w-72 shadow-lg border-border z-50">
                    <CardContent className="p-0">
                      <div className="px-4 py-4 border-b border-border bg-muted/50">
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {user.firstName || user.emailAddresses[0]?.emailAddress.split("@")[0]}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.emailAddresses[0]?.emailAddress}
                        </p>
                      </div>

                      <div className="p-2">
                        <Button
                          variant="ghost"
                          onClick={handleSignOut}
                          className="w-full justify-start px-3 py-2 text-right hover:bg-destructive/10 text-destructive rounded-md"
                        >
                          <LogOut className="w-4 h-4 ml-2" />
                          <span className="text-sm font-medium">התנתק</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Button
                onClick={() => {
                  debug.info({
                    location: "Navbar.tsx:onClick",
                    message: "Login button clicked",
                    data: { isSignedIn },
                  });
                  setShowSignInModal(true);
                }}
                className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-2 rounded-xl shadow-lg shadow-black/10 transition-all"
              >
                התחבר/הרשם
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      <SignInModal open={showSignInModal} onOpenChange={setShowSignInModal} />
    </nav>
  );
}

export default function Navbar() {
  const hasValidClerkKey = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_CLERK')
    : false;
  
  // If Clerk is not available, render navbar without auth features
  if (!hasValidClerkKey) {
    return (
      <nav className="bg-gradient-to-l from-primary to-primary/90 border-b border-primary/20 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <Link
                href="/"
                className="flex items-center gap-2 hover:scale-105 transition-transform"
                aria-label="דף הבית"
              >
                <div className="brightness-0 invert">
                <BrandLogo size={24} />
              </div>
                <span className="text-lg font-extrabold text-white tracking-tight">ZchuyotBuddy</span>
              </Link>
              <Link
                href="/onboarding"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                איך זה עובד?
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                למי זה מתאים?
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                אודות
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }
  
  return <NavbarContent />;
}
