import HomeBackground from "@/components/home/HomeBackground";
import HomeHero from "@/components/home/HomeHero";
import HomePrimaryCta from "@/components/home/HomePrimaryCta";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import HomeFooter from "@/components/home/HomeFooter";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white" dir="rtl">
      {/* Background gradients */}
      <HomeBackground />

      {/* Main content */}
      <main id="main-content" className="relative z-10 flex flex-col">
        {/* Hero Section */}
        <HomeHero />

        {/* Why Choose Section */}
        <div className="flex flex-col items-center justify-center px-6 relative z-10 w-full py-12">
          <WhyChooseSection />
        </div>

        {/* Primary CTA Section */}
        <HomePrimaryCta />
      </main>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
