import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

const LenisContext = createContext(null);

/**
 * Custom hook to access the Lenis instance
 * @returns {React.RefObject<Lenis>} Lenis instance ref
 */
export const useLenis = () => {
  const context = useContext(LenisContext);
  if (!context) {
    console.warn("useLenis must be used within a LenisProvider");
  }
  return context;
};

/**
 * Provider component for Lenis smooth scrolling
 * Manages Lenis lifecycle and exposes it via context
 */
export const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Ultra-premium Lenis config for buttery smooth, accelerating scrolls
    const lenis = new Lenis({
      duration: 1.5, // Increased for "heavy" premium feel
      easing: (t) => 1 - Math.pow(1 - t, 5), // Quintic Out: Extremely smooth deceleration
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 2.5, // Highly responsive touch
      wheelMultiplier: 1.2, // Slightly faster to match the heavy easing
      infinite: false,
      autoResize: true,
      // Prevent scroll blocking
      prevent: (node) => {
        // Allow scroll to pass through video elements
        return node.tagName === "VIDEO";
      },
    });

    lenisRef.current = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
};

/**
 * Helper hook for smooth scrolling to targets
 * @returns {Function} scrollTo function with dynamic duration
 */
export const useLenisScroll = () => {
  const lenisRef = useLenis();

  const scrollTo = (target, opts = {}) => {
    try {
      if (!lenisRef?.current) {
        // Fallback to native scrolling
        if (typeof target === "string") {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: "smooth" });
        }
        return;
      }

      const currentY = window.scrollY;
      let targetY = 0;

      if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) targetY = el.offsetTop;
      } else if (typeof target === "number") {
        targetY = target;
      }

      const distance = Math.abs(targetY - currentY);

      // "Accelerate and Brake" Logic (Premium Feel)
      // 1. Duration: Needs to be long enough to feel the physics (min 1.5s, max 3.5s)
      const dynamicDuration = Math.min(3.5, Math.max(1.5, distance / 600));

      // 2. Easing: easeInOutQuart for pronounced acceleration and smooth braking
      const accelerateBrakeEasing = (t) =>
        t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

      lenisRef.current.scrollTo(target, {
        ...opts,
        duration: dynamicDuration,
        easing: accelerateBrakeEasing,
        lock: true, // Prevent user interference during the "flight"
      });
    } catch (err) {
      console.error("Lenis scroll error:", err);
      // Fallback to native behavior
      if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    }
  };

  return scrollTo;
};
