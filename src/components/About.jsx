import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView as useFramerInView,
  animate,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useLenisScroll } from "../contexts/LenisContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

// --- EXISTING SUB-COMPONENTS ---
import ArchitectCard from "./ArchitectCard";
import { HoverBorderGradient } from "./HoverBorderGradient";
import TextScramble from "./TextScramble";
import Spotlight from "./Spotlight";
import AnnotationLines from "./blueprint/AnnotationLines";

// --- 1. STYLE INJECTION ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=JetBrains+Mono:wght@300&display=swap');

    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-cormorant { font-family: 'Cormorant Garamond', serif; }
    .font-mono-tech { font-family: 'JetBrains Mono', monospace; }
    
    .text-stroke-accent {
      -webkit-text-stroke: 1px var(--color-accent);
      color: transparent; 
    }
  `}</style>
);

// --- 2. UTILITY: ANIMATED COUNTER (CountUp) ---
const AnimatedCounter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useFramerInView(ref, { margin: "-10%" });

  // Parse number from string (e.g. "15+" -> 15)
  const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
  const isPlus = value.includes("+");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (inView) {
      const controls = animate(0, numericValue, {
        duration: 2,
        ease: [0.22, 1, 0.36, 1], // Custom "Heavy" ease
        onUpdate: (v) => {
          node.textContent = Math.round(v) + (isPlus ? "+" : "") + suffix;
        },
      });
      return controls.stop;
    } else {
      // Reset to 0 when out of view
      node.textContent = "0" + (isPlus ? "+" : "") + suffix;
    }
  }, [inView, numericValue, isPlus, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      0
    </span>
  );
};

// --- 3. COMPONENT: ALCHEMY TEXT REVEAL ---
// Updated to support both word and character reveal (revealType prop)
const AlchemyTextReveal = ({
  children,
  className,
  revealType = "words", // "words" | "chars"
  start = "top 85%",
  end = "bottom 65%",
  scrub = 0.5,
  stagger = 0.05,
  dimColor = "var(--color-text-tertiary)",
  finalColor = "var(--color-text-primary)",
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const split = new SplitType(containerRef.current, {
      types: revealType,
      tagName: "span",
      preserveWhitespace: true,
    });

    const targets = revealType === "chars" ? split.chars : split.words;

    if (!targets || targets.length === 0) return;

    gsap.fromTo(
      targets,
      { opacity: 0.15, color: dimColor, willChange: "opacity,color" },
      {
        opacity: 1,
        color: finalColor,
        stagger,
        ease: "power2.out",
        duration: 1.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub,
        },
      }
    );

    return () => {
      split && split.revert();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === containerRef.current) t.kill();
      });
    };
  }, [revealType, start, end, scrub, stagger, dimColor, finalColor]);

  return (
    <div ref={containerRef} className={`font-cormorant ${className}`}>
      {children}
    </div>
  );
};

// --- 4. COMPONENT: GOLD HIGHLIGHT ---
const GoldHighlight = ({ children }) => (
  <span className="font-cinzel font-semibold text-[var(--color-accent)] tracking-wide relative inline-block px-1">
    {children}
  </span>
);

// --- 5. COMPONENT: INTERACTIVE VIDEO CARD ---
const InteractiveVideoCard = ({ item, index }) => {
  const [isActive, setIsActive] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Lazy load video only when near viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
          }
        });
      },
      { rootMargin: "200px" } // Preload 200px before entering viewport
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Pause video when out of viewport to save resources
  useEffect(() => {
    if (!videoRef.current || !shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [shouldLoad]);

  // Handle Mobile Tap
  const handleTap = () => setIsActive(!isActive);

  return (
    <motion.div
      ref={containerRef}
      className="group relative cursor-pointer overflow-hidden rounded-sm border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors duration-500"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      onClick={handleTap}
      style={{
        contain: "layout style paint", // CSS containment for better performance
        willChange: "auto", // Let browser optimize
      }}
    >
      {/* Container Aspect Ratio */}
      <div className="aspect-[4/5] w-full relative bg-black">
        {/* Video Layer - Only render when needed */}
        {shouldLoad ? (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              isActive ? "grayscale-0 scale-105" : "grayscale-[0.8] scale-100"
            } group-hover:grayscale-0 group-hover:scale-105`}
            muted
            loop
            playsInline
            preload="metadata" // Only load metadata initially
            style={{
              willChange: "transform, filter", // GPU optimization
              transform: "translateZ(0)", // Force GPU acceleration
            }}
          >
            <source src={item.videoSrc} type="video/mp4" />
          </video>
        ) : (
          // Placeholder while loading
          <div className="absolute inset-0 bg-gray-900 animate-pulse" />
        )}

        {/* Scanline Overlay (Aesthetic) */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />

        {/* Gradient Scrim */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${
            isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
          }`}
        />

        {/* Content Layer */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end h-full">
          {/* Title moves up on hover/active */}
          <div
            className={`transform transition-transform duration-500 ${
              isActive
                ? "-translate-y-2"
                : "translate-y-4 group-hover:-translate-y-2"
            }`}
          >
            <h4 className="font-cinzel text-xl text-white mb-2 [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
              {item.title}
            </h4>

            {/* Description Reveal */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                isActive
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100"
              }`}
            >
              <p className="font-mono-tech text-[10px] text-gray-300 leading-relaxed border-l-2 border-[var(--color-accent)] pl-3 mt-2">
                {item.desc}
              </p>
            </div>
          </div>

          {/* Mobile Tap Hint */}
          <div
            className={`lg:hidden absolute top-4 right-4 transition-opacity duration-300 ${
              isActive ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 animate-pulse">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Border Glow */}
        <div
          className={`absolute inset-0 border-2 border-[var(--color-accent)] pointer-events-none transition-opacity duration-500 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />
      </div>
    </motion.div>
  );
};

// --- 6. UTILITY: TECH SEPARATOR ---
const TechSeparator = () => (
  <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10 pointer-events-none -translate-y-[99%]">
    <svg
      className="relative block w-[calc(100%+1.3px)] h-[80px] text-[#0a0a0a] fill-current"
      preserveAspectRatio="none"
      viewBox="0 0 1200 120"
    >
      <path
        d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
        className="opacity-100"
      />
    </svg>
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent" />
  </div>
);

// --- 7. UTILITY: CIPHER TEXT ---
const CipherText = ({ text, className }) => {
  const CHARS = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ0123456789";
  const [display, setDisplay] = useState(text);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let iter = 0;
    const interval = setInterval(() => {
      setDisplay(() =>
        text
          .split("")
          .map((l, i) =>
            i < iter ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join("")
      );
      if (iter >= text.length) clearInterval(interval);
      iter += 1 / 3;
    }, 20); // Reduced from 30ms to 20ms for faster animation
    return () => clearInterval(interval);
  }, [text, inView]);
  return (
    <span
      ref={ref}
      className={`font-mono-tech uppercase tracking-widest text-[var(--color-accent)] ${className}`}
    >
      {display}
    </span>
  );
};

// --- 8. MAIN COMPONENT ---
export default function About() {
  const scrollTo = useLenisScroll();
  const sectionRef = useRef(null);
  const [ref, inView] = useInView({ threshold: 0.1 });

  // Refs
  const architectCardRef = useRef(null);
  const statRefs = useRef([]);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // --- ANIMATION VARIANTS ---
  const cinematicReveal = {
    hidden: { opacity: 0, y: 80, scale: 0.96, filter: "blur(15px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const containerStagger = {
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  // Data
  const stats = useMemo(
    () => [
      { number: "6+", label: "Core Languages" },
      { number: "15+", label: "Production Builds" },
      { number: "3", label: "Deployment Platforms" },
    ],
    []
  );

  const expertise = useMemo(
    () => [
      {
        title: "Full-Stack Architecture",
        desc: "Engineering enterprise-grade platforms like 'The Gadget Hub' with ASP.NET Core.",
        videoSrc: "videos/fsc.mp4",
      },
      {
        title: "Intelligent Systems",
        desc: "Pioneering AI integration via facial recognition (OpenCV) and LLM-powered simulators.",
        videoSrc: "videos/isc.mp4",
      },
      {
        title: "AI-Augmented Dev",
        desc: "Leveraging AI workflows with Cursor and custom VS Code extensions.",
        videoSrc: "videos/aic.mp4",
      },
    ],
    []
  );

  return (
    <section
      id="about"
      ref={(node) => {
        sectionRef.current = node;
        ref(node);
      }}
      className="relative section-padding bg-transparent text-[var(--color-text-primary)] z-10 overflow-hidden min-h-screen"
    >
      <GlobalStyles />
      <TechSeparator />

      {/* ATMOSPHERE */}
      <motion.div
        style={{ y: parallaxY }}
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-accent)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-accent)_1px,transparent_1px)] bg-[size:60px_60px] mask-image-[radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] opacity-[0.12]" />
      </motion.div>

      <Spotlight
        from="top-left"
        size="large"
        fill="var(--color-accent-light)"
        duration={3}
        delay={0.1}
        finalX="-20%"
        finalY="-30%"
        inView={inView}
        onUpdate={setSpotlightPos}
      />
      <AnnotationLines
        isActive={showAnnotations}
        fromRef={architectCardRef}
        toRefs={statRefs.current}
        color="var(--color-accent-glow)"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-20 pt-24 lg:pt-32">
        {/* --- HEADER (Animates Every Time) --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-10%", once: false }} // Re-animate on every view
          variants={containerStagger}
        >
          {/* --- HEADER --- */}
          <div className="flex flex-col lg:flex-row gap-12 mb-32 border-b border-white/40 pb-12">
            <motion.div className="lg:w-2/3" variants={cinematicReveal}>
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
                <span className="font-mono-tech text-xs text-[var(--color-accent)] tracking-[0.3em]">
                  THE CRAFTSMAN // 001
                </span>
              </div>
              <h2 className="font-cinzel text-5xl sm:text-7xl lg:text-8xl leading-[0.85] text-[var(--color-text-primary)] tracking-tight">
                Logic <br />
                <span className="font-cormorant italic text-[var(--color-accent)] font-light">
                  meets
                </span>{" "}
                Imagination
              </h2>
            </motion.div>

            <motion.div
              className="lg:w-1/3 flex flex-col justify-end items-end text-right"
              variants={cinematicReveal}
            >
              <p className="font-mono-tech text-[10px] text-[var(--color-text-secondary)] leading-relaxed tracking-widest">
                [ STATUS: AVAILABLE ]<br />
                [ DISCIPLINE: FULL-STACK ]<br />[ LOCATION: CARDIFF, UK ]
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* --- REST OF CONTENT (Animates Only Once) --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-10%", once: true }} // Animate only once
          variants={containerStagger}
        >
          {/* --- CONTENT GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* LEFT: Identity Card */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32 transition-all duration-700 ease-out">
                <motion.div
                  ref={architectCardRef}
                  variants={cinematicReveal}
                  className="relative group outline-none"
                  onMouseEnter={() => setShowAnnotations(true)}
                  onMouseLeave={() => setShowAnnotations(false)}
                >
                  <div className="absolute -inset-8 bg-[var(--color-accent-light)] blur-3xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-1000" />
                  <ArchitectCard
                    name="HAREESHKAR RAVI"
                    title="DIGITAL ARCHITECT"
                    handle="ID_94021"
                    avatarUrl="profile.jpg"
                    externalSpotlightPosition={spotlightPos}
                    isAutoSpotlightActive={Boolean(spotlightPos)}
                  />
                  <div className="flex justify-between mt-4 px-2 font-mono-tech text-[9px] text-[var(--color-accent)] opacity-60 tracking-[0.2em]">
                    <span>FIG_1.0</span>
                    <span>AUTH_KEY_VALID</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* RIGHT: Bio */}
            <div className="lg:col-span-7 flex flex-col justify-center pl-0 lg:pl-8 border-l border-[var(--color-border]">
              <motion.div
                className="space-y-12 py-8 px-4 lg:px-12"
                variants={containerStagger}
              >
                {/* PARAGRAPH 1 - The Hook */}
                <motion.div variants={cinematicReveal}>
                  <AlchemyTextReveal
                    revealType="words"
                    stagger={0.08}
                    scrub={0.35}
                    start="top 88%"
                    end="bottom 70%"
                    className="text-3xl md:text-4xl font-light leading-[1.5] tracking-tight"
                  >
                    I build software like{" "}
                    <GoldHighlight>architecture</GoldHighlight>—where{" "}
                    <GoldHighlight>precision</GoldHighlight> and{" "}
                    <GoldHighlight>elegance</GoldHighlight> are inseparable.{" "}
                    Every system I design stands on{" "}
                    <span className="text-[var(--color-accent-light)] italic">
                      solid foundations
                    </span>
                    .
                  </AlchemyTextReveal>
                </motion.div>

                {/* PARAGRAPH 2 - The Expertise */}
                <motion.div variants={cinematicReveal}>
                  <AlchemyTextReveal
                    revealType="words"
                    stagger={0.06}
                    scrub={0.4}
                    className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-[1.8] tracking-wide"
                  >
                    Full-stack expertise across{" "}
                    <GoldHighlight>backend systems</GoldHighlight>,{" "}
                    <GoldHighlight>intelligent frontends</GoldHighlight>, and{" "}
                    <GoldHighlight>AI integration</GoldHighlight>. I work with
                    enterprise platforms, scalable architectures, and systems
                    that{" "}
                    <span className="text-[var(--color-accent-light)] italic">
                      evolve with purpose
                    </span>
                    .
                  </AlchemyTextReveal>
                </motion.div>

                {/* PARAGRAPH 3 - The Approach */}
                <motion.div variants={cinematicReveal}>
                  <AlchemyTextReveal
                    revealType="words"
                    stagger={0.07}
                    scrub={0.38}
                    className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-[1.8] tracking-wide"
                  >
                    Whether architecting{" "}
                    <GoldHighlight>scalable backends</GoldHighlight>, crafting{" "}
                    <GoldHighlight>responsive frontends</GoldHighlight>, or
                    integrating <GoldHighlight>AI workflows</GoldHighlight>—each
                    system is engineered for clarity and resilience. The best
                    software fades into the background,{" "}
                    <span className="text-[var(--color-accent-light)] italic">
                      letting impact speak
                    </span>
                    .
                  </AlchemyTextReveal>
                </motion.div>

                {/* Tech Stack Highlights */}
                <motion.div
                  variants={cinematicReveal}
                  className="pt-6 border-t border-[var(--color-border)]/30"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <span className="font-mono-tech text-[9px] text-[var(--color-accent)] uppercase tracking-widest mb-2 opacity-70">
                        Backend
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)] font-light">
                        Node.js, Python, ASP.NET
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono-tech text-[9px] text-[var(--color-accent)] uppercase tracking-widest mb-2 opacity-70">
                        Frontend
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)] font-light">
                        React, GSAP, WebGL
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono-tech text-[9px] text-[var(--color-accent)] uppercase tracking-widest mb-2 opacity-70">
                        AI/ML
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)] font-light">
                        OpenCV, LLMs, Vision
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div variants={cinematicReveal} className="pt-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo("#projects", { offset: -80 });
                    }}
                    className="group relative px-8 py-4 bg-transparent border border-[var(--color-accent)]/40 text-[var(--color-accent)] font-mono-tech text-xs tracking-[0.2em] overflow-hidden transition-all hover:border-[var(--color-accent)]"
                  >
                    <span className="absolute inset-0 w-0 bg-[var(--color-accent)] transition-all duration-[0.4s] ease-out group-hover:w-full opacity-10"></span>
                    <span className="relative flex items-center gap-3">
                      <TextScramble
                        text="VIEW_WORK"
                        trigger="inViewAndHover"
                        speed={30}
                        replayOnView={true}
                      />
                      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-background)]">
                        →
                      </span>
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* --- ANIMATED DATA HUD (STATS) --- */}
          <motion.div
            className="mt-40 mb-32 relative border-y border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-sm"
            variants={cinematicReveal}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  ref={(el) => (statRefs.current[index] = el)}
                  className="relative p-12 flex flex-col items-center text-center hover:bg-[var(--color-accent-light)] transition-colors duration-500 group"
                >
                  {/* Icon */}
                  <div className="absolute top-2 left-2 text-[var(--color-accent)] opacity-40 group-hover:animate-pulse">
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path
                        d="M0 0 L0 10 L10 10"
                        fill="none"
                        stroke="currentColor"
                      />
                    </svg>
                  </div>

                  {/* Animated Number */}
                  <div className="font-cinzel text-5xl text-[var(--color-accent)] mb-2">
                    <AnimatedCounter value={stat.number} />
                  </div>

                  {/* Label */}
                  <div className="font-mono-tech text-[10px] tracking-[0.2em] text-[var(--color-text-secondary)] uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* --- INTERACTIVE VISUAL LOGS (Videos) --- */}
          <div className="relative z-20 space-y-12">
            <motion.div
              className="flex items-end justify-between border-b border-[var(--color-border)] pb-6"
              variants={cinematicReveal}
            >
              <h3 className="font-cinzel text-3xl text-[var(--color-text-primary]">
                TECHNICAL DOMAINS
              </h3>
              <span className="font-mono-tech text-[10px] text-[var(--color-accent)] tracking-widest">
                VISUAL_LOG_SEQUENCE
              </span>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerStagger}
            >
              {expertise.map((item, idx) => (
                <motion.div key={idx} variants={cinematicReveal}>
                  <InteractiveVideoCard item={item} index={idx} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* --- FOOTER --- */}
          <motion.div
            className="mt-60 mb-24 text-center"
            variants={cinematicReveal}
          >
            <div className="font-cinzel text-[var(--color-accent)] opacity-10 text-[120px] leading-none select-none pointer-events-none">
              &rdquo;
            </div>
            <p className="relative -mt-16 font-cinzel text-3xl md:text-4xl text-[var(--color-text-primary)] max-w-3xl mx-auto leading-tight">
              Building software that bridges the gap between{" "}
              <span className="text-[var(--color-accent)]">what is</span> and{" "}
              <span className="text-[var(--color-accent)]">what could be</span>.
            </p>
            <div className="mt-12 w-px h-16 bg-gradient-to-b from-[var(--color-accent)] to-transparent mx-auto" />
            <div className="mt-6">
              <TextScramble
                text="HAREESHKAR RAVI"
                trigger="inView"
                className="text-sm font-mono-tech tracking-widest"
                speed={40}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
