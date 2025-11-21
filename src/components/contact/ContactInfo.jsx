import React from "react";
import { motion } from "framer-motion";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { HiEnvelope } from "react-icons/hi2";

// Optimized variants for coordinated animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const SocialLink = ({ href, icon: Icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    variants={itemVariants}
    className="group flex items-center gap-4 p-4 border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-surface)]/30 backdrop-blur-sm transition-all duration-300 active:scale-[0.98]"
  >
    <div className="p-2 bg-[var(--color-background)] rounded-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors">
      <Icon size={20} />
    </div>
    <div className="flex flex-col">
      <span className="font-mono-tech text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest">
        {label}
      </span>
      <span className="font-cinzel text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
        Connect
      </span>
    </div>
    <div className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-accent)] hidden sm:block">
      →
    </div>
  </motion.a>
);

const ContactInfo = () => {
  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SocialLink
          href="mailto:hello@example.com"
          icon={HiEnvelope}
          label="Email Protocol"
        />
        <SocialLink
          href="https://github.com"
          icon={SiGithub}
          label="Code Repository"
        />
        <SocialLink
          href="https://linkedin.com"
          icon={SiLinkedin}
          label="Professional Net"
        />
        <SocialLink
          href="https://x.com"
          icon={SiX}
          label="Broadcast Feed"
        />
      </div>

      {/* Location Data */}
      <motion.div
        variants={itemVariants}
        className="mt-12 pt-8 border-t border-[var(--color-border)] flex justify-between items-end"
      >
        <div className="flex flex-col gap-2">
          <span className="font-mono-tech text-[10px] text-[var(--color-accent)] tracking-widest">
            CURRENT_COORDINATES
          </span>
          <span className="font-cinzel text-lg text-[var(--color-text-primary)]">
            Cardiff, United Kingdom
          </span>
        </div>
        <div className="text-right">
          <span className="font-mono-tech text-[10px] text-[var(--color-text-secondary)]">
            51.4816° N, 3.1791° W
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactInfo;
