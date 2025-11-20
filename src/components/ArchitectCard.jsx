import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import "./ArchitectCard.css";
import { useLenisScroll } from "../contexts/LenisContext";
import TextScramble from "./TextScramble";

const ArchitectCard = ({
  name = "JOHN DOE",
  title = "SYSTEM ARCHITECT",
  handle = "johndoe_dev",
  avatarUrl = "https://via.placeholder.com/600x800",
}) => {
  const sceneRef = useRef(null);
  const cardRef = useRef(null);
  const btnRef = useRef(null);
  const rafId = useRef(null);
  const scrollTo = useLenisScroll();

  // Smooth Damping Variables
  const damping = 0.08;
  const currentMouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });

  // Mobile touch state
  const [isMobileActive, setIsMobileActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // --- PHYSICS ENGINE (Heavy, Architectural Rotation) ---
  // Reference: Smaller rotation values (10deg max vs 15deg) for "architectural" solidity
  const animate = useCallback(() => {
    const lx =
      currentMouse.current.x +
      (targetMouse.current.x - currentMouse.current.x) * damping;
    const ly =
      currentMouse.current.y +
      (targetMouse.current.y - currentMouse.current.y) * damping;

    currentMouse.current = { x: lx, y: ly };

    if (cardRef.current) {
      // Lighter rotation for "architectural" feel
      const rotateX = (ly * -10).toFixed(3); // Max 10deg (was 15deg)
      const rotateY = (lx * 10).toFixed(3); // Max 10deg (was 15deg)

      // Set CSS Variables for GPU handling
      cardRef.current.style.setProperty("--rotate-x", `${rotateX}deg`);
      cardRef.current.style.setProperty("--rotate-y", `${rotateY}deg`);

      // Pass pointer values for shimmer and parallax effects
      const pointerXPercent = (targetMouse.current.x + 0.5) * 100;
      const pointerYPercent = (targetMouse.current.y + 0.5) * 100;

      cardRef.current.style.setProperty("--pointer-x", `${pointerXPercent}%`);
      cardRef.current.style.setProperty("--pointer-y", `${pointerYPercent}%`);

      // Parallax offsets for different layers
      const parallaxFast = (targetMouse.current.x * 30).toFixed(2);
      const parallaxSlow = (targetMouse.current.x * 15).toFixed(2);

      cardRef.current.style.setProperty("--parallax-fast", `${parallaxFast}px`);
      cardRef.current.style.setProperty("--parallax-slow", `${parallaxSlow}px`);

      // Glow intensity based on distance from center
      const fromCenter = Math.sqrt(
        Math.pow(targetMouse.current.x, 2) + Math.pow(targetMouse.current.y, 2)
      );
      const glowIntensity = Math.min(fromCenter * 1.5, 1).toFixed(3);
      cardRef.current.style.setProperty("--glow-intensity", glowIntensity);
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Start Loop
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [animate]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle touch events for mobile diorama effect
  const handleTouchStart = useCallback(
    (e) => {
      if (!isMobile) return;
      touchStartY.current = e.touches[0].clientY;
      setIsMobileActive(true);
    },
    [isMobile]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isMobile) return;
      touchEndY.current = e.touches[0].clientY;
    },
    [isMobile]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;

    const swipeDistance = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 30; // Minimum pixels to consider a swipe

    // If swiped up/down significantly, return to normal and allow scroll
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      setIsMobileActive(false);

      // Add returning class for smooth transition
      if (cardRef.current) {
        cardRef.current.classList.add("mobile-returning");
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.classList.remove("mobile-returning");
          }
        }, 800);
      }
    } else {
      // Just a tap, toggle the state
      setIsMobileActive((prev) => !prev);
    }

    touchStartY.current = 0;
    touchEndY.current = 0;
  }, [isMobile]);

  // Apply mobile active class
  useEffect(() => {
    if (!cardRef.current || !isMobile) return;

    if (isMobileActive) {
      cardRef.current.classList.add("mobile-active");
    } else {
      cardRef.current.classList.remove("mobile-active");
    }
  }, [isMobileActive, isMobile]);

  const handleMouseMove = useCallback(
    (e) => {
      if (isMobile) return; // Disable on mobile
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      // Normalize range to -0.5 to 0.5 (centered)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetMouse.current = { x, y };
    },
    [isMobile]
  );

  const handleMouseLeave = () => {
    targetMouse.current = { x: 0, y: 0 }; // Snap back to center
  };

  // Name split for styling
  const [firstName, ...lastNameArr] = name.split(" ");
  const lastName = lastNameArr.join(" ");

  const handleConnectClick = (e) => {
    e.preventDefault();
    scrollTo("#contact", { offset: -80 });
  };

  return (
    <div
      className="architect-scene"
      ref={sceneRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={!isMobile ? handleMouseMove : undefined}
      onMouseLeave={handleMouseLeave}
    >
      <div className="architect-composition" ref={cardRef}>
        {/* LAYER 0: Ambient Glow */}
        <div className="architect-glow" />

        {/* LAYER 1: Grid Structure */}
        <div className="architect-grid-layer">
          <div className="grid-line v1"></div>
          <div className="grid-line v2"></div>
          <div className="grid-line h1"></div>
          <div className="decorative-ref">001</div>
        </div>

        {/* LAYER 2: Image Artifact */}
        <div className="architect-image-plane">
          <div className="image-wrapper">
            <div className="image-noise"></div>
            <img src={avatarUrl} alt={name} decoding="async" loading="lazy" />
          </div>
          <div className="image-border-accent"></div>
        </div>

        {/* LAYER 3: Glass Interface (Enhanced with Parallax) */}
        <div className="architect-glass-panel">
          {/* Dynamic Shimmer Overlay */}
          <div className="glass-shimmer"></div>

          <div className="architect-identity">
            <div className="name-display">
              <span className="name-first font-bold">{firstName}</span>
              <span
                className="name-last relative font-normal"
                style={{ marginBottom: "4px", marginTop: "2px" }}
              >
                {lastName}
                {/* Gold underline near RAVI */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-transparent"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ marginBottom: "2px" }}
                />
              </span>
            </div>
            <span className="title-role">{title}</span>
          </div>

          <div className="separator-line"></div>

          <div className="meta-grid">
            <div className="meta-item">
              <span className="meta-label">ID_REF</span>
              <span className="meta-value text-mono">@{handle}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">SYS_STATUS</span>
              <span className="meta-value text-[#10b981] flex items-center gap-2">
                {/* Glowing dot with theme-aware color */}
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-primary)] animate-pulse shadow-lg"
                  style={{
                    boxShadow:
                      "0 0 8px var(--color-text-primary), 0 0 16px var(--color-text-primary)",
                  }}
                />
                ONLINE
              </span>
            </div>
          </div>

          {/* Interactive Button - With TextScramble */}
          <button
            className="group relative px-6 py-3 bg-transparent border border-[var(--color-accent)]/40 text-[var(--color-accent)] font-mono-tech text-xs tracking-[0.2em] overflow-hidden transition-all hover:border-[var(--color-accent)]"
            ref={btnRef}
            onClick={handleConnectClick}
          >
            <span className="absolute inset-0 w-0 bg-[var(--color-accent)] transition-all duration-[0.4s] ease-out group-hover:w-full opacity-10"></span>
            <span className="relative flex items-center gap-2">
              <TextScramble
                text="CONNECT_NOW"
                className="text-xs"
                trigger="inViewAndHover"
                speed={30}
                replayOnView={true}
              />
              <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                →
              </span>
            </span>
          </button>
        </div>

        {/* LAYER 4: Floating Decoration */}
        <div className="floating-el sq"></div>
      </div>
    </div>
  );
};

export default React.memo(ArchitectCard);
