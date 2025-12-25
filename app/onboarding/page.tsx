"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";
import { Icon } from "@/components/ui/icon";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  // Step 1: Welcome
  if (step === 1) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden bg-white">
        {/* Background gradients */}
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[60%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-[40%] right-[-20%] h-[50%] w-[70%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-12 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Icon name="shield_with_heart" size={24} className="text-white" />
            </div>
            <BrandLogo size={24} />
            <span className="text-text-dark font-extrabold text-xl tracking-tight">ZchuyotBuddy</span>
          </div>
          <Link
            href="/app"
            className="text-text-subtle text-sm font-semibold hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-primary-bg/50"
          >
            Skip
          </Link>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full mt-[-20px]">
          {/* Illustration */}
          <div className="w-full relative mb-12 flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-primary/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-primary/20 rounded-full border-dashed" />
            <div className="relative w-full aspect-square max-w-[280px] rounded-full overflow-hidden shadow-soft bg-white p-2 z-10">
              <div className="w-full h-full bg-primary-bg rounded-full overflow-hidden relative">
                <Image
                  src="/stitch/onboarding/hero-illustration.png"
                  alt="3D illustration of a map with a location pin and a friendly robot helper navigating a path"
                  fill
                  className="object-contain scale-110 mt-4"
                  priority
                />
              </div>
            </div>

            {/* Status badges */}
            <div className="absolute -bottom-4 right-0 md:right-8 bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 animate-bounce z-20 border border-gray-50" style={{ animationDuration: "3s" }}>
              <div className="bg-green-50 p-2.5 rounded-xl text-green-500 flex items-center justify-center">
                <Icon name="verified" size={22} className="text-green-500" filled />
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-[10px] text-text-subtle font-bold uppercase tracking-wider mb-0.5">Status</span>
                <span className="text-sm text-text-dark font-bold leading-none">Rights Secured</span>
              </div>
            </div>

            <div className="absolute top-4 left-0 md:left-6 bg-white rounded-full py-2.5 px-4 shadow-card flex items-center gap-2.5 transform -rotate-3 border border-gray-50 z-20">
              <div className="bg-primary/10 p-1.5 rounded-full text-primary flex items-center justify-center">
                <Icon name="description" size={16} className="text-primary" />
              </div>
              <span className="text-xs text-text-dark font-bold pr-1">Paperwork: Done</span>
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col items-center text-center space-y-5 max-w-sm mx-auto">
            <h1 className="text-text-dark tracking-tight text-[32px] font-extrabold leading-[1.15]">
              ה-GPS לזכויות שלך -<br />
              <span className="text-primary relative inline-block pb-1">
                וטייס-משנה לניירת
                <svg className="absolute w-full h-2.5 bottom-0 left-0 text-primary/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                </svg>
              </span>
            </h1>
            <p className="text-text-subtle text-[17px] font-medium leading-relaxed px-1">
              נווט בקלות בנבכי הזכויות הרפואיות. אנו מטפלים בניירת כדי שתקבל בדיוק את מה שמגיע לך.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col gap-6 p-6 pb-10 w-full z-10 bg-white">
          <div className="flex justify-center gap-2 mb-1">
            <div className="w-8 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-gray-200" />
            <div className="w-2 h-2 rounded-full bg-gray-200" />
          </div>
          <Button
            onClick={() => setStep(2)}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:bg-[#5b38c4] active:scale-[0.98]"
          >
            <span className="text-[17px] font-bold tracking-tight mr-2">המשך</span>
            <Icon name="arrow_forward" size={20} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Radar/Updates
  if (step === 2) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden bg-white">
        {/* Background gradients */}
        <div className="absolute top-[-20%] right-[-20%] h-[60%] w-[80%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[50%] w-[60%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-12 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <span className="text-[24px] font-bold">📡</span>
            </div>
            <span className="text-text-dark font-black text-xl tracking-tight">רדאר עדכונים</span>
          </div>
          <Link
            href="/app"
            className="text-text-subtle text-sm font-semibold hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-primary-bg"
          >
            דלג
          </Link>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full mt-[-20px]">
          {/* Illustration */}
          <div className="w-full relative mb-12 flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative w-full aspect-square max-w-[320px] rounded-full overflow-hidden border-[6px] border-white shadow-soft bg-gradient-to-br from-primary-bg to-white p-1">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-primary-bg">
                <Image
                  src="/stitch/onboarding/radar-illustration.png"
                  alt="Radar visualization illustration"
                  fill
                  className="object-cover scale-110"
                  priority
                />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col items-center text-center space-y-5 max-w-sm mx-auto">
            <h1 className="text-text-dark tracking-tight text-[32px] font-extrabold leading-[1.15]">
              רדאר עדכונים<br />
              <span className="text-primary relative inline-block pb-1">
                בזמן אמת
                <svg className="absolute w-full h-2.5 bottom-0 left-0 text-primary/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                </svg>
              </span>
            </h1>
            <p className="text-text-subtle text-[17px] font-medium leading-relaxed px-1">
              קבל התראות מיידיות על שינויים בזכויות שלך, עדכוני תביעות ומידע חשוב שצריך לדעת.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col gap-6 p-6 pb-10 w-full z-10 bg-white">
          <div className="flex justify-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-gray-200" />
            <div className="w-8 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-gray-200" />
          </div>
          <Button
            onClick={() => setStep(3)}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:bg-[#5b38c4] active:scale-[0.98]"
          >
            <span className="text-[17px] font-bold tracking-tight mr-2">המשך</span>
            <Icon name="arrow_forward" size={20} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Final step - redirect to app
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Link href="/app">
        <Button size="lg">התחל להשתמש</Button>
      </Link>
    </div>
  );
}
