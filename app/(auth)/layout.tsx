"use client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Demo mode: no authentication checks, just render children
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
