"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { LogOut, Menu, User, UserCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SignInModal from "@/components/SignInModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { debug } from "@/lib/debug";
import { useGuestAuth } from "@/lib/guest-auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#how-it-works", label: "איך זה עובד?" },
  { href: "/#features", label: "תכונות" },
  { href: "/about", label: "אודות" },
];

function NavbarContent() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.users.getCurrentUser);
  const { isGuest, guestUser, logoutGuest } = useGuestAuth();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [currentHash, setCurrentHash] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const hasRedirectedRef = useRef(false);

  const isAnyUserLoggedIn = isAuthenticated || isGuest;

  // Track hash changes for active link highlighting
  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Redirect to /dashboard when user becomes signed in
  useEffect(() => {
    if (isAuthenticated && !hasRedirectedRef.current && showSignInModal) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      if (currentPath === "/" || currentPath === "") {
        debug.info({
          location: "Navbar.tsx:useEffect",
          message: "Fallback: User signed in - redirecting to /dashboard",
          data: { isAuthenticated, showSignInModal, currentPath },
        });
        hasRedirectedRef.current = true;
        setShowSignInModal(false);
        if (typeof window !== "undefined") {
          window.location.replace("/dashboard");
        } else {
          router.replace("/dashboard");
        }
      }
    }
  }, [isAuthenticated, showSignInModal, router]);

  useEffect(() => {
    if (!showSignInModal) {
      hasRedirectedRef.current = false;
    }
  }, [showSignInModal]);

  const handleSignOut = async () => {
    if (isGuest) {
      logoutGuest();
    } else {
      await signOut();
    }
    setProfileOpen(false);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const isLinkActive = (href: string) => {
    if (href.startsWith("/#")) {
      // Hash link on home page
      return pathname === "/" && currentHash === href.slice(1);
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              aria-label="דף הבית"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0d968b] flex items-center justify-center text-white shadow-lg shadow-[#0d968b]/30">
                <span className="material-symbols-outlined text-[20px]">accessible</span>
              </div>
              <span className="text-[#111817] font-extrabold text-lg tracking-tight hidden sm:inline">
                ZchuyotBuddy
              </span>
            </Link>
            <div className="h-8 w-24 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              aria-label="דף הבית"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0d968b] flex items-center justify-center text-white shadow-lg shadow-[#0d968b]/30">
                <span className="material-symbols-outlined text-[20px]">accessible</span>
              </div>
              <span className="text-[#111817] font-extrabold text-lg tracking-tight hidden sm:inline">
                ZchuyotBuddy
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isLinkActive(link.href)
                      ? "text-[#0d968b]"
                      : "text-[#111817]/70 hover:text-[#0d968b]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side: Language toggle + CTA/Profile */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <div className="hidden sm:flex items-center text-sm text-[#111817]/60 gap-1">
                <Link href="/home-en" className="hover:text-[#0d968b] transition-colors px-1">
                  EN
                </Link>
                <span>|</span>
                <Link
                  href="/"
                  className="hover:text-[#0d968b] transition-colors px-1 font-medium text-[#111817]"
                >
                  עב
                </Link>
              </div>

              {/* Auth CTA or Profile */}
              {isAnyUserLoggedIn ? (
                <div className="relative" ref={profileRef}>
                  <Button
                    variant="ghost"
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-xl px-3 py-2 h-auto"
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0d968b]/10 flex items-center justify-center">
                      {isGuest ? (
                        <UserCircle className="w-4 h-4 text-[#0d968b]" />
                      ) : (
                        <User className="w-4 h-4 text-[#0d968b]" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-[#111817] hidden sm:inline">
                      {isGuest
                        ? guestUser?.name
                        : currentUser?.name || currentUser?.email?.split("@")[0]}
                    </span>
                  </Button>

                  {profileOpen && (
                    <Card className="absolute left-0 mt-2 w-72 shadow-lg border-gray-200 z-50">
                      <CardContent className="p-0">
                        <div className="px-4 py-4 border-b border-gray-100 bg-gray-50/50">
                          <p className="text-sm font-semibold text-[#111817] mb-1">
                            {isGuest
                              ? guestUser?.name
                              : currentUser?.name || currentUser?.email?.split("@")[0]}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {isGuest ? "מצב אורח - נתונים נשמרים מקומית" : currentUser?.email}
                          </p>
                          {isGuest && (
                            <p className="text-xs text-orange-500 mt-1">
                              התחבר לשמירת הנתונים שלך לצמיתות
                            </p>
                          )}
                        </div>

                        <div className="p-2">
                          <Link
                            href="/dashboard"
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-[#111817] hover:bg-[#0d968b]/10 rounded-md"
                            onClick={() => setProfileOpen(false)}
                          >
                            <span className="material-symbols-outlined text-[18px] ml-2 text-[#0d968b]">
                              dashboard
                            </span>
                            לוח בקרה
                          </Link>
                          {isGuest && (
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setProfileOpen(false);
                                setShowSignInModal(true);
                              }}
                              className="w-full justify-start px-3 py-2 text-right hover:bg-[#0d968b]/10 text-[#0d968b] rounded-md mb-1"
                            >
                              <User className="w-4 h-4 ml-2" />
                              <span className="text-sm font-medium">התחבר / הרשם</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            onClick={handleSignOut}
                            className="w-full justify-start px-3 py-2 text-right hover:bg-red-50 text-red-600 rounded-md"
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
                <Link
                  href="/sign-up"
                  className="bg-[#0d968b] text-white hover:bg-[#0d968b]/90 font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-[#0d968b]/25 transition-all text-sm hidden sm:inline-flex"
                >
                  התחל עכשיו
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                type="button"
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-[#111817]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-100 bg-white">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isLinkActive(link.href)
                      ? "bg-[#0d968b]/10 text-[#0d968b]"
                      : "text-[#111817] hover:bg-gray-50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Language toggle mobile */}
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-[#111817]/60">
                <Link
                  href="/home-en"
                  className="hover:text-[#0d968b] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  EN
                </Link>
                <span>|</span>
                <Link
                  href="/"
                  className="hover:text-[#0d968b] transition-colors font-medium text-[#111817]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  עב
                </Link>
              </div>

              {/* Mobile CTA */}
              {!isAnyUserLoggedIn && (
                <Link
                  href="/sign-up"
                  className="block mx-4 mt-2 bg-[#0d968b] text-white text-center font-semibold px-5 py-3 rounded-xl shadow-lg shadow-[#0d968b]/25 transition-all text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  התחל עכשיו
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Sign In Modal */}
      <SignInModal open={showSignInModal} onOpenChange={setShowSignInModal} />
    </>
  );
}

export default function Navbar() {
  const hasValidConvexUrl = process.env.NEXT_PUBLIC_CONVEX_URL !== undefined;

  // If Convex is not available, render navbar without auth features
  if (!hasValidConvexUrl) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              aria-label="דף הבית"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0d968b] flex items-center justify-center text-white shadow-lg shadow-[#0d968b]/30">
                <span className="material-symbols-outlined text-[20px]">accessible</span>
              </div>
              <span className="text-[#111817] font-extrabold text-lg tracking-tight hidden sm:inline">
                ZchuyotBuddy
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#111817]/70 hover:text-[#0d968b] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center text-sm text-[#111817]/60 gap-1">
                <Link href="/home-en" className="hover:text-[#0d968b] transition-colors px-1">
                  EN
                </Link>
                <span>|</span>
                <Link
                  href="/"
                  className="hover:text-[#0d968b] transition-colors px-1 font-medium text-[#111817]"
                >
                  עב
                </Link>
              </div>
              <Link
                href="/sign-up"
                className="bg-[#0d968b] text-white hover:bg-[#0d968b]/90 font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-[#0d968b]/25 transition-all text-sm"
              >
                התחל עכשיו
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return <NavbarContent />;
}
