import Link from "next/link";

interface StitchHeaderProps {
  /** Show skip button */
  showSkip?: boolean;
  /** Skip button text */
  skipText?: string;
  /** Brand name */
  brandName?: string;
  /** Icon name from Material Symbols */
  iconName?: string;
}

/**
 * Stitch design header with logo and optional skip button
 */
export default function StitchHeader({
  showSkip = true,
  skipText = "דלג",
  brandName = "זכויותבאדי",
  iconName = "shield",
}: StitchHeaderProps) {
  return (
    <header className="flex items-center justify-between p-6 pt-12 z-10">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <span className="material-symbols-outlined text-[20px] font-bold">{iconName}</span>
        </div>
        <span className="text-text-dark font-extrabold text-xl tracking-tight">{brandName}</span>
      </Link>
      {showSkip && (
        <button
          type="button"
          className="text-text-subtle text-sm font-semibold hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-primary-bg"
        >
          {skipText}
        </button>
      )}
    </header>
  );
}
