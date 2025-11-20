import React, { useLayoutEffect, useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { useTheme } from "./ThemeContext";
import { HiX, HiSun, HiMoon } from "react-icons/hi";

const MobileMenu = ({ isOpen, onClose, items = [], onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const panelRef = useRef(null);
  const openTlRef = useRef(null);
  const busyRef = useRef(false);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();

    const itemEls = Array.from(
      panel.querySelectorAll(".mobile-menu-item-label")
    );

    gsap.set(itemEls, { yPercent: 100, rotate: 3 }); // Reduced rotation
    gsap.set(panel, { xPercent: 100, scale: 0.96 });

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        busyRef.current = false;
      },
    });

    tl.to(
      panel,
      { xPercent: 0, scale: 1, duration: 0.6, ease: "power3.out" }, // Faster
      0.08
    ).to(
      itemEls,
      {
        yPercent: 0,
        rotate: 0,
        duration: 0.7, // Faster
        ease: "power3.out",
        stagger: { each: 0.08, from: "start" }, // Tighter stagger
      },
      0.2
    );

    openTlRef.current = tl;
    return tl;
  }, []);

  // playClose now accepts an optional callback to run after the panel fully closed
  const playClose = useCallback(
    (postCloseCallback) => {
      busyRef.current = true;
      openTlRef.current?.kill();
      gsap.to(panelRef.current, {
        xPercent: 100,
        scale: 0.96,
        duration: 0.8, // Increased for buttery smooth close on mobile
        ease: "power3.out", // Premium decelerating ease for luxurious feel
        force3D: true, // Forces hardware acceleration for smoother performance
        onComplete: () => {
          busyRef.current = false;
          onClose();
          if (typeof postCloseCallback === "function") {
            // run after menu closed
            postCloseCallback();
          }
        },
      });
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // Prevent scroll on mobile
      const tl = buildOpenTimeline();
      tl?.play(0);
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
  }, [isOpen, buildOpenTimeline]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Main Menu Panel with glassmorphism - ensure it's above scrim */}
      <aside
        ref={panelRef}
        className="absolute inset-0 backdrop-blur-lg flex flex-col p-6 z-[101]"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translateZ(0)",
          willChange: "transform", // GPU acceleration for smoother animation
        }}
      >
        <header className="flex justify-between items-center mb-16">
          <a
            href="#home"
            className="font-display text-2xl font-bold"
            onClick={() => playClose()}
            style={{
              willChange: "transform", // GPU hint
            }}
          >
            RH.
          </a>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface/50 border border-border/50 backdrop-blur-sm"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <HiMoon className="w-5 h-5" />
              ) : (
                <HiSun className="w-5 h-5 text-accent" />
              )}
            </button>
            <button onClick={() => playClose()} className="text-2xl">
              <HiX />
            </button>
          </div>
        </header>

        <nav className="flex-1 flex flex-col items-center justify-center">
          <ul className="list-none m-0 p-0 flex flex-col items-center gap-8">
            {items.map((item) => (
              <li key={item.title} className="overflow-hidden">
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    // close menu, then navigate using lenis or provided onNavigate
                    playClose(() => {
                      if (typeof onNavigate === "function") {
                        onNavigate(item.href);
                        return;
                      }
                      if (
                        typeof window !== "undefined" &&
                        window.__lenisScrollTo
                      ) {
                        window.__lenisScrollTo(item.href, { offset: -80 }); // Offset for navbar
                      } else {
                        const el = document.querySelector(item.href);
                        if (el)
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        else window.location.href = item.href;
                      }
                    });
                  }}
                  className="mobile-menu-item block font-display text-4xl text-text-primary"
                >
                  <span className="mobile-menu-item-label inline-block">
                    {item.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default MobileMenu;
