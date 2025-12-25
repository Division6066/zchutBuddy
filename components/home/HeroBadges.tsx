import { Icon } from "@/components/ui/icon";

export default function HeroBadges() {
  return (
    <>
      {/* Status badge - bottom right (RTL) */}
      <div 
        className="absolute -bottom-6 right-4 md:right-12 bg-white rounded-2xl p-4 shadow-lg flex items-center gap-3 animate-bounce z-20 border border-gray-50" 
        style={{ animationDuration: "3s" }}
        aria-label="סטטוס: הזכויות הובטחו"
      >
        <div className="bg-green-50 p-2.5 rounded-xl text-green-500 flex items-center justify-center">
          <Icon name="verified" size={22} className="text-green-500" filled />
        </div>
        <div className="flex flex-col pr-2">
          <span className="text-[10px] text-text-subtle font-bold uppercase tracking-wider mb-0.5">סטטוס</span>
          <span className="text-sm text-text-dark font-bold leading-none">הזכויות הובטחו</span>
        </div>
      </div>

      {/* Document badge - top left (RTL) */}
      <div 
        className="absolute top-6 left-4 md:left-12 bg-white rounded-full py-2.5 px-4 shadow-lg flex items-center gap-2.5 transform -rotate-3 border border-gray-50 z-20"
        aria-label="ניירת: הושלמה"
      >
        <div className="bg-primary/10 p-1.5 rounded-full text-primary flex items-center justify-center">
          <Icon name="description" size={16} className="text-primary" />
        </div>
        <span className="text-xs text-text-dark font-bold pr-1">ניירת: הושלמה</span>
      </div>
    </>
  );
}

