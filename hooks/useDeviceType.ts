"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================================
// Types
// ============================================================================

export interface DeviceInfo {
  deviceType: "mobile" | "tablet" | "desktop";
  browser: { name: string; version: string };
  os: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: "portrait" | "landscape";
}

// ============================================================================
// Constants
// ============================================================================

// User agent patterns
const TABLET_UA_PATTERN = /iPad|Android(?!.*Mobile)|Tablet/i;
const MOBILE_UA_PATTERN = /iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i;

// Browser detection patterns (order matters - check specific before generic)
const BROWSER_PATTERNS: Array<{
  name: string;
  pattern: RegExp;
  versionPattern: RegExp;
}> = [
  { name: "edge", pattern: /Edg\//i, versionPattern: /Edg\/(\d+[\d.]*)/i },
  { name: "opera", pattern: /OPR\//i, versionPattern: /OPR\/(\d+[\d.]*)/i },
  {
    name: "firefox",
    pattern: /Firefox\//i,
    versionPattern: /Firefox\/(\d+[\d.]*)/i,
  },
  {
    name: "safari",
    pattern: /Safari\//i,
    versionPattern: /Version\/(\d+[\d.]*)/i,
  },
  {
    name: "chrome",
    pattern: /Chrome\//i,
    versionPattern: /Chrome\/(\d+[\d.]*)/i,
  },
];

// OS detection patterns
const OS_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: "ios", pattern: /iPhone|iPad|iPod/i },
  { name: "android", pattern: /Android/i },
  { name: "windows", pattern: /Windows/i },
  { name: "macos", pattern: /Mac OS X|Macintosh/i },
  { name: "linux", pattern: /Linux/i },
];

// Breakpoints
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

// Debounce delay in ms
const DEBOUNCE_DELAY = 100;

// ============================================================================
// SSR-safe defaults
// ============================================================================

const SSR_DEFAULTS: DeviceInfo = {
  deviceType: "desktop",
  browser: { name: "other", version: "" },
  os: "other",
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isTouchDevice: false,
  isIOS: false,
  isAndroid: false,
  isSafari: false,
  isChrome: false,
  screenWidth: 0,
  screenHeight: 0,
  orientation: "landscape",
};

// ============================================================================
// Detection helpers
// ============================================================================

function detectBrowser(userAgent: string): { name: string; version: string } {
  // Check for Chrome but not Edge/Opera (they include Chrome in UA)
  const isChromeBased = /Chrome\//i.test(userAgent);
  const isEdge = /Edg\//i.test(userAgent);
  const isOpera = /OPR\//i.test(userAgent);

  for (const { name, pattern, versionPattern } of BROWSER_PATTERNS) {
    // Skip Chrome detection if it's actually Edge or Opera
    if (name === "chrome" && (isEdge || isOpera)) {
      continue;
    }
    // Skip Safari detection if it's Chrome-based (Chrome includes Safari in UA)
    if (name === "safari" && isChromeBased) {
      continue;
    }

    if (pattern.test(userAgent)) {
      const versionMatch = userAgent.match(versionPattern);
      return {
        name,
        version: versionMatch?.[1] || "",
      };
    }
  }

  return { name: "other", version: "" };
}

function detectOS(userAgent: string): string {
  for (const { name, pattern } of OS_PATTERNS) {
    if (pattern.test(userAgent)) {
      return name;
    }
  }
  return "other";
}

function detectTouchDevice(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE-specific
    navigator.msMaxTouchPoints > 0
  );
}

function detectDeviceType(width: number, userAgent: string): "mobile" | "tablet" | "desktop" {
  const isTabletUA = TABLET_UA_PATTERN.test(userAgent);
  const isMobileUA = MOBILE_UA_PATTERN.test(userAgent);

  // Width-based detection first
  if (width < MOBILE_BREAKPOINT) {
    return "mobile";
  }

  if (width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT) {
    return "tablet";
  }

  // Width >= 1024, check UA for tablet/mobile override
  // Tablet UA takes precedence over mobile UA (as per user confirmation)
  if (isTabletUA) {
    return "tablet";
  }

  if (isMobileUA) {
    return "mobile";
  }

  return "desktop";
}

function detectOrientation(width: number, height: number): "portrait" | "landscape" {
  return height > width ? "portrait" : "landscape";
}

function getDeviceInfo(): DeviceInfo {
  // SSR check
  if (typeof window === "undefined") {
    return SSR_DEFAULTS;
  }

  const userAgent = navigator.userAgent;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const browser = detectBrowser(userAgent);
  const os = detectOS(userAgent);
  const deviceType = detectDeviceType(screenWidth, userAgent);
  const orientation = detectOrientation(screenWidth, screenHeight);
  const isTouchDevice = detectTouchDevice();

  const isIOS = os === "ios";
  const isAndroid = os === "android";
  const isSafari = browser.name === "safari";
  const isChrome = browser.name === "chrome";

  return {
    deviceType,
    browser,
    os,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop",
    isTouchDevice,
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    screenWidth,
    screenHeight,
    orientation,
  };
}

// ============================================================================
// Hook
// ============================================================================

export function useDeviceType(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(SSR_DEFAULTS);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoized update function
  const updateDeviceInfo = useCallback(() => {
    setDeviceInfo(getDeviceInfo());
  }, []);

  // Debounced handler for resize/orientation events
  const handleResize = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      updateDeviceInfo();
    }, DEBOUNCE_DELAY);
  }, [updateDeviceInfo]);

  useEffect(() => {
    // Initial detection on mount (client-side only)
    updateDeviceInfo();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [handleResize, updateDeviceInfo]);

  return deviceInfo;
}

export default useDeviceType;
