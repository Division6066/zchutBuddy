"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

export default function OnboardingProfileSetupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ageRange: "",
    city: "",
    employmentStatus: "",
    tracks: [] as string[],
  });

  const ageRanges = [
    { value: "18-25", label: "18-25" },
    { value: "26-35", label: "26-35" },
    { value: "36-45", label: "36-45" },
    { value: "46-55", label: "46-55" },
    { value: "56-65", label: "56-65" },
    { value: "65+", label: "65+" },
  ];

  const employmentOptions = [
    { value: "employed", label: "עובד/ת" },
    { value: "self-employed", label: "עצמאי/ת" },
    { value: "unemployed", label: "לא עובד/ת" },
    { value: "student", label: "סטודנט/ית" },
    { value: "retired", label: "פנסיונר/ית" },
  ];

  const tracks = [
    { value: "nii", label: "ביטוח לאומי", icon: "account_balance" },
    { value: "mod", label: "משרד הביטחון", icon: "shield" },
    { value: "moh", label: "משרד הבריאות", icon: "local_hospital" },
  ];

  const handleTrackToggle = (track: string) => {
    setFormData((prev) => ({
      ...prev,
      tracks: prev.tracks.includes(track)
        ? prev.tracks.filter((t) => t !== track)
        : [...prev.tracks, track],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // In a real app, save profile data to Convex here
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between p-6 relative z-10">
        <Link
          href="/onboarding/radar"
          className="size-10 rounded-xl bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          {t("common.skip")}
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col px-6 relative z-10 overflow-y-auto pb-32">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">person</span>
          </div>
          <h1 className="text-foreground tracking-tight text-2xl font-black leading-tight">
            {t("onboarding.profile.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {t("onboarding.profile.description")}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6 max-w-md mx-auto w-full">
          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">טווח גילאים</label>
            <div className="grid grid-cols-3 gap-2">
              {ageRanges.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, ageRange: option.value })}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    formData.ageRange === option.value
                      ? "bg-primary text-white shadow-primary"
                      : "bg-card border border-border text-foreground hover:bg-accent"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
              עיר מגורים
            </label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="לדוגמה: תל אביב"
            />
          </div>

          {/* Employment Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">סטטוס תעסוקה</label>
            <div className="grid grid-cols-2 gap-2">
              {employmentOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, employmentStatus: option.value })}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    formData.employmentStatus === option.value
                      ? "bg-primary text-white shadow-primary"
                      : "bg-card border border-border text-foreground hover:bg-accent"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tracks */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              תחומים שמעניינים אותך
            </label>
            <div className="space-y-2">
              {tracks.map((track) => (
                <button
                  key={track.value}
                  type="button"
                  onClick={() => handleTrackToggle(track.value)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                    formData.tracks.includes(track.value)
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-card border border-border hover:bg-accent"
                  }`}
                >
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center ${
                      formData.tracks.includes(track.value)
                        ? "bg-primary text-white"
                        : "bg-accent text-muted-foreground"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{track.icon}</span>
                  </div>
                  <span className="font-medium text-foreground">{track.label}</span>
                  {formData.tracks.includes(track.value) && (
                    <span className="material-symbols-outlined text-primary ms-auto">
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* CTA section */}
      <footer className="fixed bottom-0 left-0 right-0 flex flex-col gap-5 p-6 pb-10 w-full z-10 bg-gradient-to-t from-background via-background to-transparent">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-8 h-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span className="text-lg font-bold">מתחיל...</span>
            </div>
          ) : (
            <>
              <span className="text-lg font-bold tracking-tight ms-2">התחל לגלות זכויות</span>
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
                arrow_back
              </span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
}
