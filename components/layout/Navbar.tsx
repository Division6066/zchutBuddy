"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { SignInModal } from "@/components/SignInModal";
import { SignUpModal } from "@/components/SignUpModal";
import { useGuestAuth } from "@/lib/guest-auth";
import { useToggleLocale, useTranslation } from "@/lib/i18n";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isGuest } = useGuestAuth();
  const isAuthenticated = isSignedIn || isGuest;
  const isLoading = !isLoaded;
  const { t, locale } = useTranslation();
  const toggleLocale = useToggleLocale();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const navLinks = [
    { href: "/features", label: t("nav.features") },
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">accessibility_new</span>
            </div>
            <h1 className="text-xl font-bold text-foreground hidden sm:block">
              {t("common.appName")}
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center justify-center size-10 rounded-xl hover:bg-accent transition-colors"
              aria-label="Toggle language"
            >
              <span className="text-sm font-bold">{locale === "en" ? "עב" : "EN"}</span>
            </button>

            {/* Auth Buttons */}
            {!isLoading &&
              (isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center gap-2 transition-colors shadow-primary"
                >
                  {t("nav.dashboard")}
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSignIn(true)}
                    className="hidden sm:flex h-10 px-4 rounded-xl text-foreground font-medium hover:bg-accent transition-colors items-center"
                  >
                    {t("common.signIn")}
                  </button>
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center gap-2 transition-colors shadow-primary"
                  >
                    {t("common.signUp")}
                  </button>
                </div>
              ))}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden flex items-center justify-center size-10 rounded-xl hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">{showMobileMenu ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMobileMenu(false)}
                  className="px-4 py-3 rounded-xl text-foreground hover:bg-accent transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && !isLoading && (
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowSignIn(true);
                  }}
                  className="px-4 py-3 rounded-xl text-foreground hover:bg-accent transition-colors font-medium text-start"
                >
                  {t("common.signIn")}
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Auth Modals */}
      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />
      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => {
          setShowSignUp(false);
          setShowSignIn(true);
        }}
      />
    </>
  );
}
