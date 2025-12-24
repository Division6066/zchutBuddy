import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";
import { Icon } from "@/components/ui/icon";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white" dir="rtl">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[60%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-20%] h-[50%] w-[70%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full">
          {/* Template Image Display with decorative elements */}
          <div className="w-full relative mb-12 flex justify-center max-w-5xl mx-auto">
            {/* Decorative circles */}
            <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/10 rounded-full hidden md:block" />
            <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] border border-primary/20 rounded-full border-dashed hidden md:block" />
            
            {/* Template Image */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white z-10 bg-white">
              <Image
                src="/templates/homepage-template.png"
                alt="ZchuyotBuddy Homepage Template"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Status badges - animated */}
            <div className="absolute -bottom-6 right-4 md:right-12 bg-white rounded-2xl p-4 shadow-lg flex items-center gap-3 animate-bounce z-20 border border-gray-50" style={{ animationDuration: "3s" }}>
              <div className="bg-green-50 p-2.5 rounded-xl text-green-500 flex items-center justify-center">
                <Icon name="verified" size={22} className="text-green-500" filled />
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-[10px] text-text-subtle font-bold uppercase tracking-wider mb-0.5">סטטוס</span>
                <span className="text-sm text-text-dark font-bold leading-none">זכויות מאובטחות</span>
              </div>
            </div>

            <div className="absolute top-6 left-4 md:left-12 bg-white rounded-full py-2.5 px-4 shadow-lg flex items-center gap-2.5 transform -rotate-3 border border-gray-50 z-20">
              <div className="bg-primary/10 p-1.5 rounded-full text-primary flex items-center justify-center">
                <Icon name="description" size={16} className="text-primary" />
              </div>
              <span className="text-xs text-text-dark font-bold pr-1">ניירת: הושלמה</span>
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col items-center text-center space-y-5 max-w-lg mx-auto mb-12">
            <h1 className="text-text-dark tracking-tight text-[32px] md:text-[40px] font-extrabold leading-[1.15]">
              ה-GPS לזכויות שלך -<br />
              <span className="text-primary relative inline-block pb-1">
                וטייס-משנה לניירת
                <svg className="absolute w-full h-2.5 bottom-0 right-0 text-primary/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                </svg>
              </span>
            </h1>
            <p className="text-text-subtle text-[17px] md:text-[19px] font-medium leading-relaxed px-1">
              נווט בקלות בנבכי הזכויות הרפואיות. אנו מטפלים בניירת כדי שתקבל בדיוק את מה שמגיע לך.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mb-12 px-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="shield_person" size={24} className="text-primary" />
              </div>
              <h3 className="text-text-dark font-bold text-lg mb-2">ניווט קל</h3>
              <p className="text-text-subtle text-sm leading-relaxed">
                מצא את הזכויות שמגיעות לך בקלות ובמהירות
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="description" size={24} className="text-primary" />
              </div>
              <h3 className="text-text-dark font-bold text-lg mb-2">טיפול בניירת</h3>
              <p className="text-text-subtle text-sm leading-relaxed">
                אנחנו מטפלים בכל הניירת כדי שתקבל את מה שמגיע לך
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="verified" size={24} className="text-primary" filled />
              </div>
              <h3 className="text-text-dark font-bold text-lg mb-2">אמין ובטוח</h3>
              <p className="text-text-subtle text-sm leading-relaxed">
                מידע מדויק ומעודכן על זכויות רפואיות
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA section */}
        <div className="flex flex-col gap-6 p-6 pb-10 w-full z-10 bg-white">
          <div className="flex justify-center gap-2 mb-1">
            <div className="w-8 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-gray-200" />
            <div className="w-2 h-2 rounded-full bg-gray-200" />
          </div>
          <Link href="/onboarding" className="w-full">
            <Button className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:bg-[#5b38c4] active:scale-[0.98]">
              <span className="text-[17px] font-bold tracking-tight ml-2">התחל תביעה</span>
              <Icon name="arrow_forward" size={20} className="transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link
            href="/onboarding"
            className="text-text-subtle text-sm font-semibold hover:text-primary transition-colors flex items-center justify-center gap-1.5 group -mt-2"
          >
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-text-subtle group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Icon name="help" size={14} />
            </div>
            איך זה עובד?
          </Link>
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}
