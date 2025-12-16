import { useState, useEffect } from "react";

/**
 * Hook to detect if the user is on a desktop device with mouse input
 * Returns true for devices with fine pointer (mouse) and no coarse pointer (touch)
 */
export const useDesktopDetection = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      // Check for fine pointer (mouse) capability
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
      // Check for hover capability (not available on touch devices)
      const hasHover = window.matchMedia("(hover: hover)").matches;
      // Check screen width (tablets in landscape might have large screens but are still touch)
      const hasLargeScreen = window.innerWidth >= 1024;
      // Check if primary input is NOT touch
      const notPrimaryTouch = !window.matchMedia("(pointer: coarse)").matches;

      // Consider desktop if: has fine pointer AND hover capability
      // OR has fine pointer and large screen with no primary touch
      setIsDesktop((hasFinePointer && hasHover) || (hasFinePointer && hasLargeScreen && notPrimaryTouch));
    };

    checkDesktop();

    // Listen for window resize in case of device mode switching in dev tools
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return isDesktop;
};
