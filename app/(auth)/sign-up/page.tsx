"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { UserCircle, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import { useGuestAuth } from "@/lib/guest-auth";
import { useTranslation } from "@/lib/i18n";

type AuthStep = "email" | "sent";

export default function SignUpPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const { loginAsGuest } = useGuestAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated (using useEffect to handle post-auth redirect properly)
  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      router.push("/onboarding");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Early return to prevent flash of content
  if (isAuthenticated && !isAuthLoading) {
    return null;
  }

  const handleGuestLogin = () => {
    loginAsGuest();
    router.push("/dashboard");
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Send magic link email with redirectTo for after sign-up
      await signIn("resend", { email, redirectTo: "/onboarding" });
      setStep("sent");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "שגיאה בשליחת קישור ההרשמה");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLink = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signIn("resend", { email, redirectTo: "/onboarding" });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "שגיאה בשליחת קישור חדש");
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      await signIn("google", { redirectTo: "/onboarding" });
    } catch (_err) {
      setError("שגיאה בהרשמה עם Google");
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
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

      {step === "email" ? (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">{t("auth.signUpTitle")}</h1>
            <p className="text-muted-foreground">צור חשבון והתחל לגלות את הזכויות שלך</p>
          </div>

          <form onSubmit={handleSendMagicLink} className="space-y-4">
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
                  <span>שולח קישור...</span>
                </div>
              ) : (
                "שלח קישור הרשמה"
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Mail className="size-8" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">בדוק את תיבת המייל שלך</h2>
            <p className="text-muted-foreground">
              שלחנו קישור הרשמה אל
              <br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="bg-accent/50 rounded-xl p-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <CheckCircle className="size-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-right">לחץ על הקישור במייל כדי להשלים את ההרשמה. הקישור תקף ל-24 שעות.</p>
            </div>
          </div>

          {error && (
            <div className="bg-error-bg border border-error text-error px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleResendLink}
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-primary disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>שולח...</span>
                </div>
              ) : (
                "שלח קישור חדש"
              )}
            </button>

            <button
              type="button"
              onClick={handleBackToEmail}
              className="text-muted-foreground hover:text-foreground transition text-sm"
            >
              ← שנה כתובת מייל
            </button>
          </div>
        </div>
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
          onClick={signUpWithGoogle}
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
        {t("auth.haveAccount")}{" "}
        <Link href="/sign-in" className="text-primary hover:text-primary-dark font-bold">
          {t("common.signIn")}
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        בהרשמה אתה מסכים ל
        <Link href="/terms" className="text-primary hover:underline mx-1">
          תנאי השימוש
        </Link>
        ול
        <Link href="/privacy" className="text-primary hover:underline mx-1">
          מדיניות הפרטיות
        </Link>
      </p>
    </div>
  );
}
