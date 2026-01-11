"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Eye, EyeOff, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useGuestAuth } from "@/lib/guest-auth";
import { useTranslation } from "@/lib/i18n";

export default function SignUpPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const { loginAsGuest } = useGuestAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      return;
    }

    // Validation
    if (password.length < 8) {
      setError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signIn("password", { email, password, flow: "signUp" });
      router.push("/onboarding");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "אימייל זה כבר רשום");
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("auth.signUpTitle")}</h1>
        <p className="text-muted-foreground">צור חשבון והתחל לגלות את הזכויות שלך</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            סיסמה
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="••••••••"
              required={true}
              disabled={isLoading}
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-foreground mb-2"
          >
            אימות סיסמה
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="••••••••"
              required={true}
              disabled={isLoading}
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              aria-label={showConfirmPassword ? "הסתר סיסמה" : "הצג סיסמה"}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-error-bg border border-error text-error px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !email || !password || !confirmPassword}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-primary disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>נרשם...</span>
            </div>
          ) : (
            "הרשם"
          )}
        </button>
      </form>

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
