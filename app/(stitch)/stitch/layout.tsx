import type { Metadata } from "next";
import "./stitch.css";

export const metadata: Metadata = {
  title: "Stitch Preview | ZchuyotBuddy",
  description: "Preview of Stitch design templates",
};

export default function StitchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="stitch-preview">
      {/* Preview indicator banner */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 text-center py-1 text-xs font-bold">
        🎨 Stitch Preview Mode - These pages are under development
      </div>
      <div className="pt-6">{children}</div>
    </div>
  );
}
