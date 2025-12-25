import HeroVisual from "./HeroVisual";

export default function HomeHero() {
  return (
    <section className="relative z-10 flex flex-col min-h-screen" aria-labelledby="hero-heading">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full py-12">
        {/* Desktop: Two-column layout, Mobile: Stacked */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Text content - Left side on desktop (RTL) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-right space-y-5 order-2 lg:order-1">
            <h1 
              id="hero-heading"
              className="text-text-dark tracking-tight text-[32px] md:text-[40px] lg:text-[48px] font-extrabold leading-[1.15]"
            >
              ה-GPS לזכויות שלך -<br />
              <span className="text-primary relative inline-block pb-1">
                וטייס-משנה לניירת
                <svg 
                  className="absolute w-full h-2.5 bottom-0 right-0 text-primary/30" 
                  preserveAspectRatio="none" 
                  viewBox="0 0 100 10"
                  aria-hidden="true"
                >
                  <path 
                    d="M0 5 Q 50 10 100 5" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeWidth="3" 
                  />
                </svg>
              </span>
            </h1>
            <p className="text-text-subtle text-[17px] md:text-[19px] font-medium leading-relaxed px-1 max-w-lg">
              נווט בקלות בנבכי הזכויות הרפואיות. אנו מטפלים בניירת כדי שתקבל בדיוק את מה שמגיע לך.
            </p>
          </div>

          {/* Hero Visual - Right side on desktop (RTL) */}
          <div className="order-1 lg:order-2">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

