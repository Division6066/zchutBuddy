"use client";

import { useSignUp, useUser } from "@clerk/nextjs";
import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";
import { useGuestAuth } from "@/lib/guest-auth";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn?: () => void;
}

export function SignUpModal({ isOpen, onClose, onSwitchToSignIn }: SignUpModalProps) {
  const { signUp, setActive } = useSignUp();
  const { isSignedIn } = useUser();
  const { loginAsGuest } = useGuestAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const hasRedirectedRef = useRef(false);

  const handleGuestLogin = () => {
    loginAsGuest();
    onClose();
    router.push("/dashboard");
  };

  useEffect(() => {
    if (isSignedIn && isOpen && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      onClose();
      router.push("/onboarding");
    }
  }, [isSignedIn, isOpen, onClose, router]);

  useEffect(() => {
    if (!isOpen) {
      hasRedirectedRef.current = false;
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        onClose();
        router.push("/onboarding");
      } else if (result.status === "missing_requirements") {
        // Email verification might be required
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setError("Please check your email for verification code");
      } else {
        setError(t("auth.signUpTitle") + ": " + result.status);
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message?: string }> };
      setError(error.errors?.[0]?.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    if (!signUp) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/onboarding",
      });
    } catch (err) {
      console.error("Google OAuth error:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <div className="p-8" dir="rtl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-foreground text-center">
              {t("auth.signUpTitle")}
            </DialogTitle>
            <p className="text-muted-foreground text-center mt-2">
              צור חשבון והתחל לגלות את הזכויות שלך
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-2">
                {t("auth.email")}
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-2">
                {t("auth.password")}
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={8}
              />
              <p className="text-xs text-muted-foreground mt-1">לפחות 8 תווים</p>
            </div>

            {error && (
              <div className="bg-error-bg border border-error text-error px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-primary"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{t("common.loading")}</span>
                </div>
              ) : (
                t("common.signUp")
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
              onClick={signUpWithGoogle}
              className="w-full bg-background text-foreground py-3 px-4 rounded-xl font-medium border border-border hover:bg-accent focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 transition-all flex items-center justify-center gap-3"
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
              className="w-full bg-background text-foreground py-3 px-4 rounded-xl font-medium border border-border hover:bg-accent focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 transition-all flex items-center justify-center gap-3"
            >
              <UserCircle className="w-5 h-5" />
              <span>המשך כאורח</span>
            </button>
          </div>

          {onSwitchToSignIn && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("auth.haveAccount")}{" "}
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="text-primary hover:text-primary-dark font-bold transition"
              >
                {t("common.signIn")}
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignUpModal;

