/**
 * Hero section heading and description text
 */
export default function HeroContent() {
  return (
    <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
      <h1 className="text-text-dark tracking-tight text-[32px] font-extrabold leading-[1.2]">
        ה-GPS לזכויות שלך <br />ו
        <span className="text-primary relative inline-block">
          טייס-משנה לניירת
          <svg
            className="absolute w-full h-2 -bottom-1 left-0 text-primary/20"
            preserveAspectRatio="none"
            viewBox="0 0 100 10"
            aria-hidden="true"
          >
            <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        </span>
      </h1>
      <p className="text-text-subtle text-base font-medium leading-relaxed px-2">
        נווט בקלות בנבכי הזכויות הרפואיות. אנו מטפלים בניירת כדי שתקבל בדיוק את מה שמגיע לך.
      </p>
    </div>
  );
}
