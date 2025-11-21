import React from "react";
import { motion } from "framer-motion";

const BentoItem = ({
  children,
  className = "",
  title,
  subtitle,
  delay = 0,
  isMobile = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 15 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        margin: isMobile ? "0%" : "-10%",
        amount: isMobile ? 0.2 : 0.3,
      }}
      transition={{
        duration: isMobile ? 0.4 : 0.8,
        delay: isMobile ? delay * 0.5 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        relative p-6 md:p-8
        bg-[var(--color-surface)]/30
        backdrop-blur-sm
        border border-[var(--color-border)]
        hover:border-[var(--color-accent)]/40
        transition-all duration-500 ease-out
        group
        ${className}
      `}
      style={{ willChange: "auto" }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {subtitle && (
            <span className="font-mono-tech text-[9px] md:text-[10px] text-[var(--color-accent)] tracking-[0.2em] block mb-2 opacity-70">
              {subtitle}
            </span>
          )}
          {title && (
            <h3 className="font-cinzel text-lg md:text-xl text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-500">
              {title}
            </h3>
          )}
        </div>
      )}

      {/* Content */}
      {children}

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-[var(--color-accent)]/0 group-hover:bg-[var(--color-accent)]/5 transition-all duration-500 pointer-events-none rounded-sm" />
    </motion.div>
  );
};

export default BentoItem;
