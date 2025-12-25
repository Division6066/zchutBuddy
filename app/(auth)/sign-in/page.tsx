"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to /app after 1 second (demo mode)
    const timer = setTimeout(() => {
      router.push("/app");
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary-bg/30 flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-2xl border border-gray-100">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BrandLogo size={32} />
            <span className="text-2xl font-extrabold text-text-dark">ZchuyotBuddy</span>
          </div>
          
          <h1 className="text-3xl font-bold text-text-dark mb-2 text-center">התחברות</h1>
          <p className="text-text-subtle text-center mb-8">Sign In</p>

          <div className="bg-primary-bg/50 border border-primary/20 rounded-xl px-4 py-3 text-center text-sm text-primary mb-6">
            <p className="font-semibold mb-1">מצב הדגמה - מעבר אוטומטי</p>
            <p className="text-xs">Demo Mode - Auto Redirecting...</p>
          </div>

          <div className="space-y-3">
            <button
              disabled
              className="w-full bg-gray-100 text-gray-400 py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
            >
              התחבר עם אימייל / Sign in with Email
            </button>
            <button
              disabled
              className="w-full bg-gray-100 text-gray-400 py-3 px-4 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-3"
            >
              <span>המשך עם Google / Continue with Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-text-subtle">
            עדיין אין לכם חשבון?{" "}
            <Link href="/sign-up" className="text-primary hover:text-primary-light font-semibold transition">
              הירשמו כאן / Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
