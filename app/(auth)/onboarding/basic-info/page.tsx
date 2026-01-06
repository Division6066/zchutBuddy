/**
 * Onboarding Step 2: Basic Info
 *
 * Collects age range, city (searchable), and HMO information.
 * Uses React Hook Form with Zod validation and localStorage persistence.
 */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icon } from "@/components/ui/icon";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/lib/i18n";

// Israeli cities list
const ISRAELI_CITIES = [
  // Major cities
  { value: "jerusalem", labelHe: "ירושלים", labelEn: "Jerusalem" },
  { value: "tel_aviv", labelHe: "תל אביב-יפו", labelEn: "Tel Aviv-Yafo" },
  { value: "haifa", labelHe: "חיפה", labelEn: "Haifa" },
  { value: "rishon_lezion", labelHe: "ראשון לציון", labelEn: "Rishon LeZion" },
  { value: "petah_tikva", labelHe: "פתח תקווה", labelEn: "Petah Tikva" },
  { value: "ashdod", labelHe: "אשדוד", labelEn: "Ashdod" },
  { value: "netanya", labelHe: "נתניה", labelEn: "Netanya" },
  { value: "beer_sheva", labelHe: "באר שבע", labelEn: "Beer Sheva" },
  { value: "bnei_brak", labelHe: "בני ברק", labelEn: "Bnei Brak" },
  { value: "holon", labelHe: "חולון", labelEn: "Holon" },
  { value: "ramat_gan", labelHe: "רמת גן", labelEn: "Ramat Gan" },
  { value: "ashkelon", labelHe: "אשקלון", labelEn: "Ashkelon" },
  { value: "rehovot", labelHe: "רחובות", labelEn: "Rehovot" },
  { value: "bat_yam", labelHe: "בת ים", labelEn: "Bat Yam" },
  { value: "herzliya", labelHe: "הרצליה", labelEn: "Herzliya" },
  { value: "kfar_saba", labelHe: "כפר סבא", labelEn: "Kfar Saba" },
  { value: "hadera", labelHe: "חדרה", labelEn: "Hadera" },
  { value: "modiin", labelHe: "מודיעין-מכבים-רעות", labelEn: "Modi'in" },
  { value: "nazareth", labelHe: "נצרת", labelEn: "Nazareth" },
  { value: "lod", labelHe: "לוד", labelEn: "Lod" },
  { value: "raanana", labelHe: "רעננה", labelEn: "Ra'anana" },
  { value: "eilat", labelHe: "אילת", labelEn: "Eilat" },
  { value: "akko", labelHe: "עכו", labelEn: "Akko" },
  { value: "nahariya", labelHe: "נהריה", labelEn: "Nahariya" },
  { value: "kiryat_gat", labelHe: "קרית גת", labelEn: "Kiryat Gat" },
  { value: "carmiel", labelHe: "כרמיאל", labelEn: "Carmiel" },
  { value: "tiberias", labelHe: "טבריה", labelEn: "Tiberias" },
  { value: "afula", labelHe: "עפולה", labelEn: "Afula" },
  { value: "dimona", labelHe: "דימונה", labelEn: "Dimona" },
  { value: "other", labelHe: "אחר", labelEn: "Other" },
];

const AGE_RANGES = [
  { value: "18-25", labelHe: "18-25", labelEn: "18-25" },
  { value: "26-35", labelHe: "26-35", labelEn: "26-35" },
  { value: "36-45", labelHe: "36-45", labelEn: "36-45" },
  { value: "46-55", labelHe: "46-55", labelEn: "46-55" },
  { value: "56-65", labelHe: "56-65", labelEn: "56-65" },
  { value: "65+", labelHe: "65+", labelEn: "65+" },
];

const HMOS = [
  { value: "clalit", labelHe: "כללית", labelEn: "Clalit" },
  { value: "maccabi", labelHe: "מכבי", labelEn: "Maccabi" },
  { value: "meuhedet", labelHe: "מאוחדת", labelEn: "Meuhedet" },
  { value: "leumit", labelHe: "לאומית", labelEn: "Leumit" },
];

// Validation schema
const basicInfoSchema = z.object({
  ageRange: z.string().min(1, "נא לבחור טווח גילאים"),
  city: z.string().min(1, "נא לבחור עיר"),
  hmo: z.string().min(1, "נא לבחור קופת חולים"),
});

type BasicInfoForm = z.infer<typeof basicInfoSchema>;

// Local storage key
const STORAGE_KEY = "onboarding_basic_info";

export default function BasicInfoPage() {
  const { locale } = useTranslation();
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateUserProfile);
  const existingProfile = useQuery(api.users.getUserProfile);

  const [citySearch, setCitySearch] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with React Hook Form + Zod
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<BasicInfoForm>({
    resolver: zodResolver(basicInfoSchema),
    mode: "onChange",
    defaultValues: {
      ageRange: "",
      city: "",
      hmo: "",
    },
  });

  const selectedCity = watch("city");
  const selectedAgeRange = watch("ageRange");
  const selectedHmo = watch("hmo");

  // Load from localStorage or existing profile on mount
  useEffect(() => {
    // First try localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved) as Partial<BasicInfoForm>;
        if (data.ageRange) {
          setValue("ageRange", data.ageRange);
        }
        if (data.city) {
          setValue("city", data.city);
        }
        if (data.hmo) {
          setValue("hmo", data.hmo);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, [setValue]);

  // Load from existing profile when available
  useEffect(() => {
    if (existingProfile) {
      if (existingProfile.ageRange && !selectedAgeRange) {
        setValue("ageRange", existingProfile.ageRange);
      }
      if (existingProfile.city && !selectedCity) {
        setValue("city", existingProfile.city);
      }
      if (existingProfile.hmo && !selectedHmo) {
        setValue("hmo", existingProfile.hmo);
      }
    }
  }, [existingProfile, setValue, selectedAgeRange, selectedCity, selectedHmo]);

  // Save to localStorage on change
  useEffect(() => {
    const data = { ageRange: selectedAgeRange, city: selectedCity, hmo: selectedHmo };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [selectedAgeRange, selectedCity, selectedHmo]);

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    if (!citySearch) {
      return ISRAELI_CITIES;
    }
    const search = citySearch.toLowerCase();
    return ISRAELI_CITIES.filter(
      (city) =>
        city.labelHe.toLowerCase().includes(search) ||
        city.labelEn.toLowerCase().includes(search) ||
        city.value.includes(search)
    );
  }, [citySearch]);

  // Get display label for selected city
  const selectedCityLabel = useMemo(() => {
    const city = ISRAELI_CITIES.find((c) => c.value === selectedCity);
    return city ? (locale === "he" ? city.labelHe : city.labelEn) : "";
  }, [selectedCity, locale]);

  // Form submission
  const onSubmit = async (data: BasicInfoForm) => {
    setIsSaving(true);
    try {
      await updateProfile({
        ageRange: data.ageRange,
        city: data.city,
        hmo: data.hmo,
      });
      // Clear localStorage after successful save
      localStorage.removeItem(STORAGE_KEY);
      router.push("/onboarding/situation");
    } catch (_error) {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4">
          <Icon name="person" className="text-3xl" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2">
          {locale === "he" ? "פרטים בסיסיים" : "Basic Information"}
        </h2>
        <p className="text-muted-foreground">
          {locale === "he"
            ? "כדי להתאים את הזכויות המתאימות לך"
            : "To match you with the right benefits"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Age Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            {locale === "he" ? "טווח גילאים" : "Age Range"}{" "}
            <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {AGE_RANGES.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => setValue("ageRange", range.value, { shouldValidate: true })}
                className={`py-3 px-4 rounded-xl border text-center font-medium transition-all ${
                  selectedAgeRange === range.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 text-foreground"
                }`}
              >
                {locale === "he" ? range.labelHe : range.labelEn}
              </button>
            ))}
          </div>
          {errors.ageRange && (
            <p className="mt-2 text-sm text-destructive flex items-center gap-1">
              <Icon name="error" className="text-base" />
              {locale === "he" ? "נא לבחור טווח גילאים" : "Please select an age range"}
            </p>
          )}
        </div>

        {/* City - Searchable Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            {locale === "he" ? "עיר מגורים" : "City"} <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className={`w-full px-4 py-3 rounded-xl border text-start flex items-center justify-between transition-all ${
                selectedCity
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              } ${isCityDropdownOpen ? "ring-2 ring-primary" : ""}`}
            >
              <span className={selectedCity ? "text-foreground" : "text-muted-foreground"}>
                {selectedCityLabel || (locale === "he" ? "בחר עיר" : "Select city")}
              </span>
              <Icon
                name={isCityDropdownOpen ? "expand_less" : "expand_more"}
                className="text-xl text-muted-foreground"
              />
            </button>

            {/* Dropdown */}
            {isCityDropdownOpen && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg max-h-64 overflow-hidden">
                {/* Search Input */}
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Icon
                      name="search"
                      className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      placeholder={locale === "he" ? "חפש עיר..." : "Search city..."}
                      className="w-full ps-10 pe-4 py-2 rounded-lg bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* City List */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredCities.length === 0 ? (
                    <p className="p-4 text-center text-muted-foreground text-sm">
                      {locale === "he" ? "לא נמצאו תוצאות" : "No results found"}
                    </p>
                  ) : (
                    filteredCities.map((city) => (
                      <button
                        key={city.value}
                        type="button"
                        onClick={() => {
                          setValue("city", city.value, { shouldValidate: true });
                          setIsCityDropdownOpen(false);
                          setCitySearch("");
                        }}
                        className={`w-full px-4 py-3 text-start hover:bg-muted transition-colors flex items-center justify-between ${
                          selectedCity === city.value ? "bg-primary/10 text-primary" : ""
                        }`}
                      >
                        <span>{locale === "he" ? city.labelHe : city.labelEn}</span>
                        {selectedCity === city.value && (
                          <Icon name="check" className="text-primary" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {locale === "he"
              ? "עוזר לנו למצוא הטבות מקומיות מהרשות המקומית שלך"
              : "Helps us find local benefits from your municipality"}
          </p>
          {errors.city && (
            <p className="mt-2 text-sm text-destructive flex items-center gap-1">
              <Icon name="error" className="text-base" />
              {locale === "he" ? "נא לבחור עיר" : "Please select a city"}
            </p>
          )}
        </div>

        {/* HMO */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-foreground mb-3">
            {locale === "he" ? "קופת חולים" : "Health Insurance (HMO)"}{" "}
            <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {HMOS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue("hmo", option.value, { shouldValidate: true })}
                className={`py-3 px-4 rounded-xl border text-center font-medium transition-all ${
                  selectedHmo === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 text-foreground"
                }`}
              >
                {locale === "he" ? option.labelHe : option.labelEn}
              </button>
            ))}
          </div>
          {errors.hmo && (
            <p className="mt-2 text-sm text-destructive flex items-center gap-1">
              <Icon name="error" className="text-base" />
              {locale === "he" ? "נא לבחור קופת חולים" : "Please select an HMO"}
            </p>
          )}
        </div>

        {/* Continue Button */}
        <button
          type="submit"
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
      </form>

      {/* Close dropdown when clicking outside */}
      {isCityDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsCityDropdownOpen(false);
            setCitySearch("");
          }}
        />
      )}
    </div>
  );
}
