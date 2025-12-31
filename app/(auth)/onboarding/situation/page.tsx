/**
 * Onboarding Step 3: Life Situation
 *
 * Collects employment status, IDF service, and additional eligibility factors.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";

const EMPLOYMENT_OPTIONS = [
  { value: "employed", labelHe: "עובד/ת", labelEn: "Employed", icon: "work" },
  { value: "self_employed", labelHe: "עצמאי/ת", labelEn: "Self-Employed", icon: "business" },
  { value: "unemployed", labelHe: "לא עובד/ת", labelEn: "Unemployed", icon: "work_off" },
  { value: "student", labelHe: "סטודנט/ית", labelEn: "Student", icon: "school" },
  { value: "retired", labelHe: "גמלאי/ת", labelEn: "Retired", icon: "elderly" },
  { value: "other", labelHe: "אחר", labelEn: "Other", icon: "more_horiz" },
];

const IDF_OPTIONS = [
  { value: "served", labelHe: "שירתתי", labelEn: "Served", icon: "military_tech" },
  {
    value: "currently_serving",
    labelHe: "משרת/ת כעת",
    labelEn: "Currently Serving",
    icon: "security",
  },
  {
    value: "national_service",
    labelHe: "שירות לאומי/אזרחי",
    labelEn: "National/Civil Service",
    icon: "volunteer_activism",
  },
  { value: "not_served", labelHe: "לא שירתתי", labelEn: "Did Not Serve", icon: "close" },
];

// Storage key for persistence
const STORAGE_KEY = "onboarding_situation";

export default function SituationPage() {
  const { locale } = useTranslation();
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateUserProfile);
  const existingProfile = useQuery(api.users.getUserProfile);

  // Form state
  const [employmentStatus, setEmploymentStatus] = useState<string>("");
  const [idfService, setIdfService] = useState<string>("");
  const [isIdfDisabled, setIsIdfDisabled] = useState<boolean>(false);
  const [isRecognizedIdfDisabled, setIsRecognizedIdfDisabled] = useState<boolean>(false);

  // Additional toggles
  const [receivingDisabilityBenefit, setReceivingDisabilityBenefit] = useState<boolean>(false);
  const [hasChildrenUnder18, setHasChildrenUnder18] = useState<boolean>(false);
  const [isRenting, setIsRenting] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.employmentStatus) setEmploymentStatus(data.employmentStatus);
        if (data.idfService) setIdfService(data.idfService);
        if (data.isIdfDisabled) setIsIdfDisabled(data.isIdfDisabled);
        if (data.isRecognizedIdfDisabled) setIsRecognizedIdfDisabled(data.isRecognizedIdfDisabled);
        if (data.receivingDisabilityBenefit)
          setReceivingDisabilityBenefit(data.receivingDisabilityBenefit);
        if (data.hasChildrenUnder18) setHasChildrenUnder18(data.hasChildrenUnder18);
        if (data.isRenting) setIsRenting(data.isRenting);
      } catch {
        // Ignore
      }
    }
  }, []);

  // Load from existing profile
  useEffect(() => {
    if (existingProfile) {
      if (existingProfile.employmentStatus && !employmentStatus) {
        setEmploymentStatus(existingProfile.employmentStatus);
      }
      if (existingProfile.idfService && !idfService) {
        setIdfService(existingProfile.idfService);
      }
      if (existingProfile.isIdfDisabled !== undefined) {
        setIsIdfDisabled(existingProfile.isIdfDisabled);
      }
      if (existingProfile.isRecognizedIdfDisabled !== undefined) {
        setIsRecognizedIdfDisabled(existingProfile.isRecognizedIdfDisabled);
      }
      if (existingProfile.receivingDisabilityBenefit !== undefined) {
        setReceivingDisabilityBenefit(existingProfile.receivingDisabilityBenefit);
      }
      if (existingProfile.hasChildrenUnder18 !== undefined) {
        setHasChildrenUnder18(existingProfile.hasChildrenUnder18);
      }
      if (existingProfile.isRenting !== undefined) {
        setIsRenting(existingProfile.isRenting);
      }
    }
  }, [existingProfile, employmentStatus, idfService]);

  // Save to localStorage on change
  useEffect(() => {
    const data = {
      employmentStatus,
      idfService,
      isIdfDisabled,
      isRecognizedIdfDisabled,
      receivingDisabilityBenefit,
      hasChildrenUnder18,
      isRenting,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [
    employmentStatus,
    idfService,
    isIdfDisabled,
    isRecognizedIdfDisabled,
    receivingDisabilityBenefit,
    hasChildrenUnder18,
    isRenting,
  ]);

  // Reset IDF disability when not served
  useEffect(() => {
    if (idfService !== "served" && idfService !== "currently_serving") {
      setIsIdfDisabled(false);
      setIsRecognizedIdfDisabled(false);
    }
  }, [idfService]);

  const handleContinue = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        employmentStatus: employmentStatus || undefined,
        idfService: idfService || undefined,
        isIdfDisabled:
          idfService === "served" || idfService === "currently_serving"
            ? isIdfDisabled
            : undefined,
        isRecognizedIdfDisabled:
          idfService === "served" && isIdfDisabled ? isRecognizedIdfDisabled : undefined,
        receivingDisabilityBenefit,
        hasChildrenUnder18,
        isRenting,
      });
      localStorage.removeItem(STORAGE_KEY);
      router.push("/onboarding/disabilities");
    } catch (error) {
      console.error("Failed to save situation:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = employmentStatus && idfService;
  const showIdfDisabilityQuestion =
    idfService === "served" || idfService === "currently_serving";

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4">
          <Icon name="work" className="text-3xl" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2">
          {locale === "he" ? "מצב חיים" : "Life Situation"}
        </h2>
        <p className="text-muted-foreground">
          {locale === "he"
            ? "עוזר לנו להתאים זכויות ייחודיות למצבך"
            : "Helps us match unique benefits to your situation"}
        </p>
      </div>

      {/* Employment Status */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          {locale === "he" ? "סטטוס תעסוקה" : "Employment Status"}{" "}
          <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {EMPLOYMENT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setEmploymentStatus(option.value)}
              className={`flex items-center gap-2 py-3 px-4 rounded-xl border text-start font-medium transition-all ${
                employmentStatus === option.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 text-foreground"
              }`}
            >
              <Icon
                name={option.icon}
                className={`text-xl ${
                  employmentStatus === option.value ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span>{locale === "he" ? option.labelHe : option.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* IDF Service */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          {locale === "he" ? "שירות צבאי/לאומי" : "Military/National Service"}{" "}
          <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {IDF_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setIdfService(option.value)}
              className={`flex items-center gap-2 py-3 px-4 rounded-xl border text-start font-medium transition-all ${
                idfService === option.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 text-foreground"
              }`}
            >
              <Icon
                name={option.icon}
                className={`text-xl ${
                  idfService === option.value ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span className="text-sm">{locale === "he" ? option.labelHe : option.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* IDF Disability - Conditional */}
      {showIdfDisabilityQuestion && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl space-y-4">
          {/* Has service-related disability */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isIdfDisabled}
                onChange={(e) => setIsIdfDisabled(e.target.checked)}
                className="peer sr-only"
              />
              <div
                className={`size-6 rounded-md border-2 transition-all flex items-center justify-center ${
                  isIdfDisabled
                    ? "bg-primary border-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {isIdfDisabled && <Icon name="check" className="text-white text-sm" />}
              </div>
            </div>
            <div>
              <span className="font-medium text-foreground">
                {locale === "he"
                  ? "יש לי נכות הקשורה לשירות"
                  : "I have a service-related disability"}
              </span>
              <p className="text-xs text-muted-foreground">
                {locale === "he"
                  ? "נכות שנגרמה במהלך או בעקבות השירות"
                  : "Disability caused during or as a result of service"}
              </p>
            </div>
          </label>

          {/* Officially recognized - Only if has disability */}
          {isIdfDisabled && (
            <label className="flex items-center gap-3 cursor-pointer ps-9">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isRecognizedIdfDisabled}
                  onChange={(e) => setIsRecognizedIdfDisabled(e.target.checked)}
                  className="peer sr-only"
                />
                <div
                  className={`size-6 rounded-md border-2 transition-all flex items-center justify-center ${
                    isRecognizedIdfDisabled
                      ? "bg-primary border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {isRecognizedIdfDisabled && <Icon name="check" className="text-white text-sm" />}
                </div>
              </div>
              <div>
                <span className="font-medium text-foreground">
                  {locale === "he" ? 'מוכר כנכה צה"ל' : "Recognized as IDF disabled"}
                </span>
                <p className="text-xs text-muted-foreground">
                  {locale === "he"
                    ? "פותח גישה לזכויות נכי צה״ל ממשרד הביטחון"
                    : "Opens access to IDF disability benefits from Ministry of Defense"}
                </p>
              </div>
            </label>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground">
            {locale === "he" ? "שאלות נוספות" : "Additional Questions"}
          </span>
        </div>
      </div>

      {/* Additional Toggles Section */}
      <div className="space-y-4 mb-8">
        {/* Receiving disability benefit from Bituach Leumi */}
        <label className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted transition-colors">
          <div className="relative">
            <input
              type="checkbox"
              checked={receivingDisabilityBenefit}
              onChange={(e) => setReceivingDisabilityBenefit(e.target.checked)}
              className="peer sr-only"
            />
            <div
              className={`size-6 rounded-md border-2 transition-all flex items-center justify-center ${
                receivingDisabilityBenefit
                  ? "bg-primary border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {receivingDisabilityBenefit && <Icon name="check" className="text-white text-sm" />}
            </div>
          </div>
          <div className="flex-1">
            <span className="font-medium text-foreground">
              {locale === "he"
                ? "האם אתה מקבל קצבת נכות מביטוח לאומי?"
                : "Are you receiving disability benefits from National Insurance?"}
            </span>
          </div>
          <Icon
            name="account_balance"
            className={`text-xl ${receivingDisabilityBenefit ? "text-primary" : "text-muted-foreground"}`}
          />
        </label>

        {/* Has children under 18 */}
        <label className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted transition-colors">
          <div className="relative">
            <input
              type="checkbox"
              checked={hasChildrenUnder18}
              onChange={(e) => setHasChildrenUnder18(e.target.checked)}
              className="peer sr-only"
            />
            <div
              className={`size-6 rounded-md border-2 transition-all flex items-center justify-center ${
                hasChildrenUnder18
                  ? "bg-primary border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {hasChildrenUnder18 && <Icon name="check" className="text-white text-sm" />}
            </div>
          </div>
          <div className="flex-1">
            <span className="font-medium text-foreground">
              {locale === "he"
                ? "האם יש לך ילדים מתחת לגיל 18?"
                : "Do you have children under 18?"}
            </span>
          </div>
          <Icon
            name="child_care"
            className={`text-xl ${hasChildrenUnder18 ? "text-primary" : "text-muted-foreground"}`}
          />
        </label>

        {/* Renting an apartment */}
        <label className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted transition-colors">
          <div className="relative">
            <input
              type="checkbox"
              checked={isRenting}
              onChange={(e) => setIsRenting(e.target.checked)}
              className="peer sr-only"
            />
            <div
              className={`size-6 rounded-md border-2 transition-all flex items-center justify-center ${
                isRenting ? "bg-primary border-primary" : "border-border hover:border-primary/50"
              }`}
            >
              {isRenting && <Icon name="check" className="text-white text-sm" />}
            </div>
          </div>
          <div className="flex-1">
            <span className="font-medium text-foreground">
              {locale === "he" ? "האם אתה שוכר דירה?" : "Are you renting an apartment?"}
            </span>
            <p className="text-xs text-muted-foreground">
              {locale === "he"
                ? "רלוונטי להנחות בארנונה ותוכניות סיוע בדיור"
                : "Relevant for property tax discounts and housing assistance"}
            </p>
          </div>
          <Icon
            name="home"
            className={`text-xl ${isRenting ? "text-primary" : "text-muted-foreground"}`}
          />
        </label>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!isValid || isSaving}
        className="w-full h-14 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-primary"
      >
        {isSaving ? (
          <Icon name="progress_activity" className="text-xl animate-spin" />
        ) : (
          <>
            {locale === "he" ? "המשך" : "Continue"}
            <Icon name="arrow_forward" className="text-xl rtl:rotate-180" />
          </>
        )}
      </button>
    </div>
  );
}
