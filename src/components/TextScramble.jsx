// TextScramble.jsx
import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useScramble } from "./useScramble";

const TextScramble = ({
  text,
  title,
  as: Component = "span",
  className = "",
  // Triggers: "hover" | "inView" | "inViewAndHover" | "always"
  trigger = "hover",
  replayOnView = false, // If true, animation runs every time element enters viewport
  speed = 50,
  accentColor = "var(--color-accent)",
  baseColor = "var(--color-text-secondary)",
}) => {
  const content = text || title || "";
  const ref = useRef(null);

  // 1. Viewport Detection
  const isInView = useInView(ref, {
    once: !replayOnView, // If replay is on, we keep listening
    amount: 0.5,
    margin: "0px 0px -10% 0px",
  });

  // 2. The Brain (Hook)
  const { display, play, stop, finished } = useScramble({
    text: content,
    speed,
    startOnMount: trigger === "always",
  });

  // 3. Handle Auto-Triggering (Scroll)
  useEffect(() => {
    const isAutoTrigger = trigger === "inView" || trigger === "inViewAndHover";

    if (isInView && isAutoTrigger) {
      play();
    }
  }, [isInView, trigger, play]);

  // 4. Handle Manual Interaction (Hover)
  const handleMouseEnter = () => {
    // Allow hover to replay if it's strictly 'hover' OR 'inViewAndHover'
    if (trigger === "hover" || trigger === "inViewAndHover") {
      play();
    }
  };

  const handleMouseLeave = () => {
    // Only stop mid-way if it's strictly a hover effect.
    // For hybrid modes, it feels more premium to let it finish.
    if (trigger === "hover") {
      stop();
    }
  };

  return (
    <Component
      ref={ref}
      className={`relative inline-block overflow-hidden whitespace-pre ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={content}
    >
      <span aria-hidden="true" className="font-mono relative z-10">
        {display.split("").map((char, i) => {
          const finalChar = content[i];
          const isRevealed = char === finalChar; // Character is locked in

          return (
            <motion.span
              key={i}
              style={{ display: "inline-block" }}
              animate={{
                color: isRevealed || finished ? accentColor : baseColor,
                opacity: isRevealed || finished ? 1 : 0.6, // Dim the scrambling chars
                y: isRevealed ? 0 : [0, -1, 1, 0], // Subtle micro-shake while scrambling
              }}
              transition={{
                duration: isRevealed ? 0.5 : 0.11, // Slower reveal, slightly slower shake
                ease: isRevealed ? "backOut" : "linear",
              }}
            >
              {char}
            </motion.span>
          );
        })}
      </span>

      {/* Progress / Underline Indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: finished ? 1 : 0 }}
        style={{ backgroundColor: accentColor }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </Component>
  );
};

export default TextScramble;
