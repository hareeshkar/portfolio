import React from "react";
import { motion } from "framer-motion";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { HiEnvelope } from "react-icons/hi2";

const SocialLink = ({ href, icon: Icon, label, delay }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="group flex items-center gap-4 p-4 border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-surface)]/30 backdrop-blur-sm transition-all duration-300"
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
    <div className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-accent)]">
      →
    </div>
  </motion.a>
);

const ContactInfo = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SocialLink
          href="mailto:hello@example.com"
          icon={HiEnvelope}
          label="Email Protocol"
          delay={0.1}
        />
        <SocialLink
          href="https://github.com"
          icon={SiGithub}
          label="Code Repository"
          delay={0.2}
        />
        <SocialLink
          href="https://linkedin.com"
          icon={SiLinkedin}
          label="Professional Net"
          delay={0.3}
        />
        <SocialLink
          href="https://x.com"
          icon={SiX}
          label="Broadcast Feed"
          delay={0.4}
        />
      </div>

      {/* Location Data */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 1 }}
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
    </div>
  );
};

export default ContactInfo;
