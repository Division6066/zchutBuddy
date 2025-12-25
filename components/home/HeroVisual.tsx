import Image from "next/image";
import HeroBadges from "./HeroBadges";

export default function HeroVisual() {
  return (
    <div className="w-full relative flex justify-center max-w-5xl mx-auto">
      {/* Decorative circles */}
      <div 
        className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/10 rounded-full hidden md:block" 
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] border border-primary/20 rounded-full border-dashed hidden md:block" 
        aria-hidden="true"
      />
      
      {/* Hero Illustration */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white z-10 bg-white">
        <Image
          src="/stitch/home/hero-illustration.png"
          alt="רובוט ידידותי עם מפה - ZchuyotBuddy עוזר לך לנווט בזכויות הרפואיות"
          width={1200}
          height={800}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Floating status badges */}
      <HeroBadges />
    </div>
  );
}

