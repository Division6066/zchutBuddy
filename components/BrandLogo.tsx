import Image from "next/image";

interface BrandLogoProps {
  size?: number;
  variant?: "logo" | "icon";
  className?: string;
}

export default function BrandLogo({ size = 24, variant = "logo", className = "" }: BrandLogoProps) {
  const src = variant === "icon" ? "/icons/icon-512.svg" : "/brand/logo.svg";
  const alt = "ZchuyotBuddy - זכויותבאדי";

  // Use Image for SVG files (Next.js handles SVGs in Image component)
  return (
    <Image src={src} alt={alt} width={size} height={size} className={className} priority={true} />
  );
}
