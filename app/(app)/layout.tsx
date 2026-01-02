"use client";

import { useConvexAuth } from "convex/react";
import { MainLayout } from "@/components/layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useConvexAuth();

  // Show loading state while Convex auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-3xl">accessibility_new</span>
          </div>
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
