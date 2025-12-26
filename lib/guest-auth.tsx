"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const GUEST_STORAGE_KEY = "zchuyot_guest_user";

interface GuestUser {
  id: string;
  name: string;
  isGuest: true;
  createdAt: number;
}

interface GuestAuthContextType {
  isGuest: boolean;
  guestUser: GuestUser | null;
  loginAsGuest: () => void;
  logoutGuest: () => void;
}

const GuestAuthContext = createContext<GuestAuthContextType | null>(null);

function generateGuestId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function GuestAuthProvider({ children }: { children: React.ReactNode }) {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load guest user from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as GuestUser;
          setGuestUser(parsed);
        } catch {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const loginAsGuest = useCallback(() => {
    const newGuestUser: GuestUser = {
      id: generateGuestId(),
      name: "אורח",
      isGuest: true,
      createdAt: Date.now(),
    };
    setGuestUser(newGuestUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newGuestUser));
    }
  }, []);

  const logoutGuest = useCallback(() => {
    setGuestUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
  }, []);

  // Don't render children until we've loaded from localStorage
  if (!isLoaded) {
    return null;
  }

  return (
    <GuestAuthContext.Provider
      value={{
        isGuest: !!guestUser,
        guestUser,
        loginAsGuest,
        logoutGuest,
      }}
    >
      {children}
    </GuestAuthContext.Provider>
  );
}

export function useGuestAuth() {
  const context = useContext(GuestAuthContext);
  if (!context) {
    throw new Error("useGuestAuth must be used within a GuestAuthProvider");
  }
  return context;
}
