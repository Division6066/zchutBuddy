"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Eye, EyeOff, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGuestAuth } from "@/lib/guest-auth";
import { useTranslation } from "@/lib/i18n";

interface SignInModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSwitchToSignUp?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SignInModal(props: SignInModalProps) {
  const isOpen = props.isOpen ?? props.open ?? false;
  const onClose =
    props.onClose ?? (props.onOpenChange ? () => props.onOpenChange?.(false) : () => {});
  const { onSwitchToSignUp } = props;

  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const { loginAsGuest } = useGuestAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && isOpen && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      onClose();
      router.push("/dashboard");
    }
  }, [isAuthenticated, isOpen, onClose, router]);

  useEffect(() => {
    if (!isOpen) {
      hasRedirectedRef.current = false;
      setEmail("");
      setPassword("");
      setError("");
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleGuestLogin = () => {
    loginAsGuest();
    onClose();
    router.push("/dashboard");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signIn("password", { email, password, flow: "signIn" });
      onClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "אימייל או סיסמה שגויים");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <div className="p-8" dir="rtl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-foreground text-center">
              {t("auth.signInTitle")}
            </DialogTitle>
            <p className="text-muted-foreground text-center mt-2">התחבר לחשבון שלך</p>
          </DialogHeader>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="signin-email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {t("auth.email")}
              </label>
              <input
                id="signin-email"
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
              <label
                htmlFor="signin-password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                סיסמה
              </label>
              <div className="relative">
                <input
                  id="signin-password"
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

            {error && (
              <div className="bg-error-bg border border-error text-error px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-primary"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>מתחבר...</span>
                </div>
              ) : (
                "התחבר"
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
              className="w-full bg-background text-foreground py-3 px-4 rounded-xl font-medium border border-border hover:bg-accent focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 transition-all flex items-center justify-center gap-3"
            >
              <UserCircle className="w-5 h-5" />
              <span>המשך כאורח</span>
            </button>
          </div>

          {onSwitchToSignUp && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-primary hover:text-primary-dark font-bold transition"
              >
                {t("common.signUp")}
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignInModal;
