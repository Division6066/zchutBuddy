"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import SignInModal from "@/components/SignInModal";

export default function HomePrimaryCta() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handlePrimaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSignedIn) {
      router.push("/app");
    } else {
      setShowSignInModal(true);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-6 pb-10 w-full z-10 bg-white">
        {/* Decorative dots indicator */}
        <div className="flex justify-center gap-2 mb-1" aria-hidden="true">
          <div className="w-8 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>
        
        {/* Primary CTA Button */}
        <Button
          onClick={handlePrimaryClick}
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:bg-[#5b38c4] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={isSignedIn ? "עבור לאפליקציה" : "התחבר כדי להתחיל"}
        >
          <span className="text-[17px] font-bold tracking-tight ml-2">צא לדרך עכשיו</span>
          <Icon name="arrow_forward" size={20} className="transition-transform group-hover:translate-x-1" />
        </Button>
        
        {/* Secondary help link */}
        <Link
          href="/onboarding"
          className="text-text-subtle text-sm font-semibold hover:text-primary transition-colors flex items-center justify-center gap-1.5 group -mt-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
          aria-label="למד איך זה עובד"
        >
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-text-subtle group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Icon name="help" size={14} />
          </div>
          איך זה עובד?
        </Link>
        <div className="h-2" />
      </div>

      {/* Sign In Modal */}
      <SignInModal open={showSignInModal} onOpenChange={setShowSignInModal} />
    </>
  );
}

