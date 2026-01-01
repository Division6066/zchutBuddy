"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useGuestAuth } from "@/lib/guest-auth";
import { Sidebar, BottomNav, TabletSidebar } from "@/components/layout";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useAuth();
  const { isGuest } = useGuestAuth();
  const isAuthenticated = isSignedIn || isGuest;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading state
  if (!isLoaded) {
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

  // For guest access, allow access
  // In production, you might want stricter auth checks

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar (lg and up) */}
      <div className="hidden lg:block">
        <Sidebar isOpen={true} onClose={() => {}} />
      </div>

      {/* Tablet Sidebar (md only - 768px to 1023px) */}
      <TabletSidebar />

      {/* Mobile Sidebar (overlay for hamburger menu) */}
      <div className="md:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="size-10 rounded-xl bg-accent text-foreground flex items-center justify-center"
              aria-label="פתח תפריט"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">accessibility_new</span>
            </div>
            <div className="size-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-24 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}

