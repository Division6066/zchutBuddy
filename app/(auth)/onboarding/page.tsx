/**
 * Onboarding Entry Point
 *
 * Redirects to the first step of onboarding.
 */

import { redirect } from "next/navigation";

export default function OnboardingPage() {
  redirect("/onboarding/welcome");
}

