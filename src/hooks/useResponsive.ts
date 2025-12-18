import { useState, useEffect, useMemo } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface ResponsiveState {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  width: number;
  height: number;
  isLandscape: boolean;
  isPortrait: boolean;
  // Breakpoint helpers
  isSmall: boolean;   // < 640px (sm)
  isMedium: boolean;  // >= 640px && < 1024px (md)
  isLarge: boolean;   // >= 1024px (lg)
  isXLarge: boolean;  // >= 1280px (xl)
}

// Breakpoints matching Tailwind defaults
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * Hook to detect device type, screen size, and touch capability.
 * Provides responsive state for adapting UI across mobile, tablet, and desktop.
 */
export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => getResponsiveState());

  useEffect(() => {
    const handleResize = () => {
      setState(getResponsiveState());
    };

    // Initial check
    handleResize();

    // Listen for resize and orientation changes
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Also listen to pointer changes (for dev tools device mode)
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    mediaQuery.addEventListener?.("change", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      mediaQuery.removeEventListener?.("change", handleResize);
    };
  }, []);

  return state;
};

function getResponsiveState(): ResponsiveState {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Touch detection
  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const hasTouchEvents = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isTouch = hasCoarsePointer || hasTouchEvents;

  // Fine pointer detection (mouse)
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const hasHover = window.matchMedia("(hover: hover)").matches;

  // Device type determination
  let deviceType: DeviceType;

  if (width < BREAKPOINTS.md) {
    // Small screens are always mobile
    deviceType = "mobile";
  } else if (width < BREAKPOINTS.lg) {
    // Medium screens: tablet if touch, otherwise could still be mobile landscape or small desktop
    deviceType = isTouch ? "tablet" : (hasFinePointer && hasHover ? "desktop" : "tablet");
  } else {
    // Large screens: desktop if has fine pointer, otherwise tablet (iPad Pro, etc.)
    deviceType = hasFinePointer && hasHover ? "desktop" : "tablet";
  }

  const isLandscape = width > height;

  return {
    deviceType,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop",
    isTouch,
    width,
    height,
    isLandscape,
    isPortrait: !isLandscape,
    isSmall: width < BREAKPOINTS.sm,
    isMedium: width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg,
    isLarge: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
    isXLarge: width >= BREAKPOINTS.xl,
  };
}

/**
 * Returns scaling factors for responsive sizing.
 * Use these to scale UI elements proportionally.
 */
export const useResponsiveScale = () => {
  const { deviceType, width, height } = useResponsive();

  return useMemo(() => {
    // Base scale factors
    const baseScale = deviceType === "mobile" ? 0.7 : deviceType === "tablet" ? 0.85 : 1;

    // Font scale based on viewport
    const fontScale = Math.min(1, Math.max(0.7, width / 1440));

    // Card scale for evidence nodes
    const cardScale = deviceType === "mobile" ? 0.65 : deviceType === "tablet" ? 0.8 : 1;

    // Minimum touch target size (44px recommended by Apple)
    const minTouchTarget = 44;

    // Padding/spacing scale
    const spacingScale = deviceType === "mobile" ? 0.75 : deviceType === "tablet" ? 0.875 : 1;

    return {
      baseScale,
      fontScale,
      cardScale,
      minTouchTarget,
      spacingScale,
      // Useful viewport values
      vw: width / 100,
      vh: height / 100,
      vmin: Math.min(width, height) / 100,
      vmax: Math.max(width, height) / 100,
    };
  }, [deviceType, width, height]);
};

export default useResponsive;
