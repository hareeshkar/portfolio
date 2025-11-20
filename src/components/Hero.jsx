import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useLenisScroll } from "../contexts/LenisContext";

// --- STYLE INJECTION ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=JetBrains+Mono:wght@300&display=swap');
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-cormorant { font-family: 'Cormorant Garamond', serif; }
    .font-mono-tech { font-family: 'JetBrains Mono', monospace; }
  `}</style>
);

// --- UTILITIES (Kept your logic, added slight optimization) ---
const CHARS = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ0123456789±∞∫≈≠≤≥";

const CipherText = ({ text, className, speed = 40, delay = 0 }) => {
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
      setDisplay(
        text.replace(
          /./g,
          () => CHARS[Math.floor(Math.random() * CHARS.length)]
        )
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, text]);

  useEffect(() => {
    if (!started) return;
    let iter = 0;
    const interval = setInterval(() => {
      setDisplay(() =>
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iter) return text[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (iter >= text.length) clearInterval(interval);
      iter += 1 / 3;
    }, speed);
    return () => clearInterval(interval);
  }, [text, started, speed]);

  return <span className={`font-mono-tech ${className}`}>{display}</span>;
};

const CipherRotator = ({ words, duration = 3500 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div className="relative inline-block min-w-[200px] overflow-visible whitespace-nowrap">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 15, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -15, filter: "blur(12px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block font-cinzel font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-amber-600 pr-4"
        >
          <CipherText text={words[index]} speed={20} />
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// --- ANIMATION CONSTANTS ---
const EASE_LUXURY = [0.22, 1, 0.36, 1]; // Heavy friction
const ANIM_DURATION = 1.4;

// Variant: Masked Text Reveal (The "Monolith" Rise)
const revealVariant = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: ANIM_DURATION, ease: EASE_LUXURY },
  },
};

// Variant: Stagger Container
const containerVariant = {
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// --- COMPONENTS ---

const CornerBracket = ({ className, delay = 0 }) => (
  <motion.svg
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 0.4, scale: 1 }}
    transition={{ duration: 1, delay: delay, ease: "easeOut" }}
    className={`absolute w-6 h-6 text-[var(--color-accent)] pointer-events-none z-30 ${className}`}
    viewBox="0 0 16 16"
    fill="none"
  >
    <path d="M1 15V1H15" stroke="currentColor" strokeWidth="1" />
  </motion.svg>
);

const ArchitecturalGrid = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2 }}
    className="absolute inset-0 z-0 pointer-events-none"
  >
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(to right, var(--color-accent) 1px, transparent 1px),
                          linear-gradient(to bottom, var(--color-accent) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }}
    />
    {/* Ensure this gradient doesn't block the scrim - make it fully transparent at edges */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_100%)]" />
  </motion.div>
);

// --- MAIN HERO COMPONENT ---
export default function Hero() {
  const scrollTo = useLenisScroll();
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // Cinematic Scroll Physics
  const yVal = useTransform(scrollY, [0, 800], [0, 250]);
  const opacityVal = useTransform(scrollY, [0, 600], [1, 0]);
  const blurVal = useTransform(scrollY, [0, 600], ["0px", "15px"]);
  const scaleVal = useTransform(scrollY, [0, 600], [1, 0.95]);

  return (
    <section
      id="home"
      className="relative w-full h-screen flex flex-col bg-transparent text-[var(--color-text-primary)] overflow-hidden"
    >
      <GlobalStyles />

      {/* --- LAYER 1: ENVIRONMENT --- */}
      <ArchitecturalGrid />

      {/* Remove local scrim - rely on global scrim instead */}
      {/* <div className="absolute inset-0 z-10 bg-black opacity-[var(--global-scrim-opacity,0.2)] pointer-events-none" /> */}

      {/* Asymmetrical Side Lines */}
      {/* Left: Draws Down */}
      <motion.div
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: EASE_LUXURY }}
        className="absolute left-8 top-0 bottom-0 w-px bg-[var(--color-accent)]/10 hidden lg:block"
      />
      {/* Right: Draws Up */}
      <motion.div
        initial={{ scaleY: 0, originY: 1 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: EASE_LUXURY }}
        className="absolute right-8 top-0 bottom-0 w-px bg-[var(--color-accent)]/10 hidden lg:block"
      />

      {/* --- LAYER 2: HUD / METADATA --- */}
      {/* Top Left: Flash Entry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "circOut" }} // Fast tech feel
        className="absolute top-8 left-12 hidden lg:flex items-start gap-4 opacity-60 z-30"
      >
        <div className="w-2 h-2 mt-1 bg-[var(--color-accent)] animate-pulse rounded-full" />
        <div className="font-mono-tech text-[10px] tracking-[0.2em] text-[var(--color-text-primary)]">
          <CipherText text="SYSTEM ONLINE" speed={60} delay={200} />
          <br />
          <span className="text-[var(--color-text-secondary)]">
            SECURE_CONN // 2048-BIT
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute top-8 right-12 hidden lg:block text-right opacity-60 z-30"
      >
        <div className="font-mono-tech text-[10px] tracking-[0.2em] text-[var(--color-text-primary)]">
          <CipherText text="HAREESHKAR RAVI" speed={40} delay={800} /> <br />
          <span className="text-[var(--color-accent)]">ID: 94021</span>
        </div>
      </motion.div>

      {/* --- LAYER 3: MAIN CONTENT --- */}
      <motion.div
        style={
          prefersReducedMotion
            ? {}
            : {
                y: yVal,
                opacity: opacityVal,
                filter: blurVal,
                scale: scaleVal,
              }
        }
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full h-full flex flex-col justify-center px-6 lg:px-20 max-w-[120rem] mx-auto"
      >
        <CornerBracket
          className="top-32 left-8 lg:left-20 rotate-0"
          delay={0.8}
        />
        <CornerBracket
          className="bottom-32 right-8 lg:right-20 rotate-180"
          delay={1.0}
        />

        {/* Superheader */}
        <div className="overflow-hidden mb-6 lg:pl-2">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.2, delay: 0.5, ease: EASE_LUXURY }}
            className="flex items-center gap-4"
          >
            <div className="h-[1px] w-16 bg-[var(--color-accent)]" />
            <span className="font-cinzel font-bold text-xs tracking-[0.4em] text-[var(--color-accent)]">
              SOFTWARE ARCHITECT
            </span>
          </motion.div>
        </div>

        {/* TYPOGRAPHY MONOLITH */}
        <div className="relative">
          {/* 1. The Statement: Masked Reveal */}
          {/* We wrap in overflow-hidden to create the 'rising from floor' effect */}
          <div className="overflow-hidden">
            <motion.h1
              variants={revealVariant}
              className="font-cinzel text-[12vw] lg:text-[11rem] leading-[0.85] text-[var(--color-text-primary)] tracking-tighter mix-blend-difference"
            >
              CRAFTING
            </motion.h1>
          </div>

          {/* 2. The Second Line */}
          <div className="flex flex-col lg:flex-row items-start lg:items-baseline gap-4 lg:gap-6 mt-2 lg:pl-4 overflow-visible w-full lg:w-auto">
            {/* Static serif anchor */}
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 0.6 }}
                transition={{ duration: 1.2, delay: 0.9, ease: EASE_LUXURY }}
                className="block font-cormorant italic text-4xl lg:text-7xl text-[var(--color-text-secondary)] font-light shrink-0 p-2"
              >
                digital
              </motion.span>
            </div>

            {/* Dynamic Cipher */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="font-cinzel text-[9vw] lg:text-[8rem] leading-[1.02] tracking-tight overflow-visible"
            >
              <CipherRotator
                words={["EXPERIENCES", "ECOSYSTEMS", "INTELLIGENCE", "FUTURES"]}
                duration={3000}
              />
            </motion.div>
          </div>
        </div>

        {/* --- MANIFESTO (Asymmetrical Layout) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
          className="mt-12 lg:mt-20 max-w-xl lg:ml-[35%] border-l border-[var(--color-accent)]/30 pl-8"
        >
          <p className="font-cormorant text-xl lg:text-2xl text-[var(--color-text-primary)]/80 leading-relaxed">
            Where{" "}
            <span className="text-[var(--color-accent)] italic">
              algorithmic precision
            </span>{" "}
            meets{" "}
            <span className="text-[var(--color-accent)] italic">
              human empathy
            </span>
            . I engineer systems that don't just compute—they connect, adapt,
            and inspire.
          </p>
        </motion.div>
      </motion.div>

      {/* --- LAYER 4: INTERACTIVE FOOTER --- */}
      <motion.div
        style={{ opacity: opacityVal }}
        className="absolute bottom-12 left-8 hidden lg:block"
      >
        <p className="font-mono-tech text-[9px] text-[var(--color-text-secondary)] writing-mode-vertical rotate-180 tracking-[0.3em]">
          EST. 2024 :: DIGITAL ETERNITY
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 1 }}
        className="absolute bottom-10 right-8 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 z-30"
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#about", { offset: -50 });
          }}
          className="group flex flex-col items-center gap-3 cursor-pointer"
        >
          <span className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors">
            DISCOVER
          </span>
          {/* Animated Line - Infinite Loop */}
          <div className="h-12 w-[1px] bg-[var(--color-text-primary)]/20 relative overflow-hidden">
            <motion.div
              animate={{ top: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-1/2 bg-[var(--color-accent)]"
            />
          </div>
        </button>
      </motion.div>
    </section>
  );
}
