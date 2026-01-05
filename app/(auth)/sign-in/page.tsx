"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useGuestAuth } from "@/lib/guest-auth";
import { useTranslation } from "@/lib/i18n";

type AuthStep = "email" | "code";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const { loginAsGuest } = useGuestAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Redirect if already authenticated
  if (isAuthenticated && !isAuthLoading) {
    router.push("/dashboard");
    return null;
  }

  const handleGuestLogin = () => {
    loginAsGuest();
    router.push("/dashboard");
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      // Use Resend OTP provider for email verification
      await signIn("resend", { email });
      setStep("code");

      // Start cooldown for resend
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "שגיאה בשליחת קוד האימות");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    setError("");

    try {
      await signIn("resend", { email, code });
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "קוד אימות שגוי");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0) return;

    setIsLoading(true);
    setError("");

    try {
      await signIn("resend", { email });

      // Reset cooldown
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "שגיאה בשליחת קוד חדש");
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signIn("google");
    } catch (err) {
      console.error("Google OAuth error:", err);
      setError("שגיאה בהתחברות עם Google");
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setCode("");
    setError("");
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-soft p-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">accessibility_new</span>
          </div>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("auth.signInTitle")}</h1>
        <p className="text-muted-foreground">
          {step === "email" ? "התחבר לחשבון שלך" : `קוד אימות נשלח ל-${email}`}
        </p>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="your@email.com"
              required={true}
              disabled={isLoading}
              autoFocus={true}
            />
          </div>

          {error && (
            <div className="bg-error-bg border border-error text-error px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-primary disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>שולח קוד...</span>
              </div>
            ) : (
              "שלח קוד אימות"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-foreground mb-2">
              קוד אימות
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-center text-2xl tracking-widest"
              placeholder="000000"
              required={true}
              disabled={isLoading}
              autoFocus={true}
            />
          </div>

          {error && (
            <div className="bg-error-bg border border-error text-error px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || code.length < 6}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-primary disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>מאמת...</span>
              </div>
            ) : (
              "אמת והתחבר"
            )}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleBackToEmail}
              className="text-muted-foreground hover:text-foreground transition"
            >
              ← שנה כתובת מייל
            </button>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={cooldown > 0 || isLoading}
              className="text-primary hover:text-primary-dark disabled:text-muted-foreground disabled:cursor-not-allowed transition"
            >
              {cooldown > 0 ? `שלח שוב (${cooldown}s)` : "שלח קוד חדש"}
            </button>
          </div>
        </form>
      )}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">{t("auth.orContinueWith")}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full bg-background text-foreground py-3 px-4 rounded-xl font-medium border border-border hover:bg-accent transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full bg-background text-foreground py-3 px-4 rounded-xl font-medium border border-border hover:bg-accent transition-all flex items-center justify-center gap-3"
        >
          <UserCircle className="w-5 h-5" />
          <span>המשך כאורח</span>
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.noAccount")}{" "}
        <Link href="/sign-up" className="text-primary hover:text-primary-dark font-bold">
          {t("common.signUp")}
        </Link>
      </p>
    </div>
  );
}
