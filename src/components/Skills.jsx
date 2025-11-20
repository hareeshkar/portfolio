import React, { useMemo, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BentoItem from "./skills/BentoItem";
import MetallicIcon from "./skills/MetallicIcon";
import { preloadIcons } from "../utils/imageProcessor";

// Utility: Tech Separator (Reusing for consistency)
const TechSeparator = () => (
  <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10 pointer-events-none -translate-y-[99%]">
    <svg
      className="relative block w-[calc(100%+1.3px)] h-[60px] text-[var(--color-background)] fill-current"
      preserveAspectRatio="none"
      viewBox="0 0 1200 120"
    >
      <path
        d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
        className="opacity-100"
      />
    </svg>
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/20 to-transparent" />
  </div>
);

// Merged Skills Data (Old Real Ones + New Additions)
const skillsData = {
  frontend: [
    { name: "React", iconSrc: "icons/react.svg" },
    { name: "JavaScript", iconSrc: "icons/javascript.svg" },
    { name: "TypeScript", iconSrc: "icons/typescript.svg" },
    { name: "Swift", iconSrc: "icons/swift.svg" }, // Preserved
    { name: "Tailwind", iconSrc: "icons/tailwind.svg" },
    { name: "Framer Motion", iconSrc: "icons/framer.svg" },
    { name: "Three.js", iconSrc: "icons/threejs.svg" },
  ],
  backend: [
    { name: "Node.js", iconSrc: "icons/nodejs.svg" },
    { name: "Python", iconSrc: "icons/python.svg" },
    { name: "Java", iconSrc: "icons/java.svg" }, // Preserved
    { name: "C# / .NET", iconSrc: "icons/csharp.svg" }, // Preserved
    { name: "PHP", iconSrc: "icons/php.svg" }, // Preserved
    { name: "PostgreSQL", iconSrc: "icons/postgresql.svg" },
    { name: "MySQL", iconSrc: "icons/mysql.svg" }, // Moved from Ecosystem
  ],
  ai: [
    { name: "OpenCV", iconSrc: "icons/opencv.svg" },
    { name: "TensorFlow", iconSrc: "icons/tensorflow.svg" },
    { name: "LLMs", iconSrc: "icons/ai.svg" },
  ],
  tools: [
    { name: "Git", iconSrc: "icons/git.svg" }, // Preserved
    { name: "Docker", iconSrc: "icons/docker.svg" },
    { name: "Figma", iconSrc: "icons/figma.svg" },
  ],
};

export default function Skills() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Preload all skill icons for better performance
  useEffect(() => {
    const iconPaths = Object.values(skillsData).flatMap((categoryArray) =>
      categoryArray.map((item) => item.iconSrc)
    );
    // Preload with normal priority (will process during idle time)
    preloadIcons(iconPaths, "normal");
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-32 bg-transparent overflow-hidden min-h-screen"
    >
      <TechSeparator />

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-accent)]/5 rounded-full blur-[100px] opacity-30" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-20 border-b border-white/40 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
            <span className="font-mono-tech text-xs text-[var(--color-accent)] tracking-[0.3em]">
              CAPABILITIES // 003
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-cinzel text-5xl sm:text-7xl lg:text-8xl leading-[0.85] text-[var(--color-text-primary)] tracking-tight"
          >
            Technical <br />
            <span className="font-cormorant italic text-[var(--color-accent)] font-light">
              Arsenal
            </span>
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[minmax(180px,auto)]">
          {/* 1. Frontend (Large Block) */}
          <BentoItem
            className="md:col-span-2 md:row-span-2"
            title="Frontend Engineering"
            subtitle="VISUAL INTERFACE"
            delay={0.1}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-4">
              {skillsData.frontend.map((skill) => (
                <div
                  key={skill.name}
                  className="flex flex-col items-center gap-2 group/icon"
                >
                  <div className="p-3 rounded-lg bg-[var(--color-background)]/50 border border-[var(--color-border)] group-hover/icon:border-[var(--color-accent)] transition-colors w-16 h-16 flex items-center justify-center">
                    <MetallicIcon
                      src={skill.iconSrc}
                      alt={skill.name}
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="text-xs font-mono-tech text-[var(--color-text-secondary)]">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </BentoItem>

          {/* 2. Backend (Tall Block) */}
          <BentoItem
            className="md:col-span-1 md:row-span-2"
            title="Backend Systems"
            subtitle="CORE LOGIC"
            delay={0.2}
          >
            <div className="flex flex-col gap-6 mt-4">
              {skillsData.backend.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-4 group/icon"
                >
                  <div className="p-2 rounded bg-[var(--color-background)]/50 border border-[var(--color-border)] group-hover/icon:border-[var(--color-accent)] transition-colors w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <MetallicIcon
                      src={skill.iconSrc}
                      alt={skill.name}
                      className="w-8 h-8"
                    />
                  </div>
                  <span className="text-sm font-mono-tech text-[var(--color-text-secondary)]">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </BentoItem>

          {/* 3. AI/ML (Wide Block) */}
          <BentoItem
            className="md:col-span-1 lg:col-span-1 md:row-span-1"
            title="AI Integration"
            subtitle="INTELLIGENCE"
            delay={0.3}
          >
            <div className="flex flex-wrap gap-3 mt-4">
              {skillsData.ai.map((skill) => (
                <span
                  key={skill.name}
                  className="px-3 py-1 text-[10px] font-mono-tech border border-[var(--color-accent)]/30 text-[var(--color-accent)] rounded-full bg-[var(--color-accent)]/5"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </BentoItem>

          {/* 4. Tools (Small Block) */}
          <BentoItem
            className="md:col-span-1 lg:col-span-1 md:row-span-1"
            title="DevOps & Tools"
            subtitle="INFRASTRUCTURE"
            delay={0.4}
          >
            <div className="flex gap-4 mt-4 justify-center">
              {skillsData.tools.map((skill) => (
                <div
                  key={skill.name}
                  className="group/icon relative w-10 h-10 m-2"
                >
                  <MetallicIcon
                    src={skill.iconSrc}
                    alt={skill.name}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          </BentoItem>

          {/* 5. Decorative / Stat Block */}
          <BentoItem
            className="md:col-span-3 lg:col-span-4 min-h-[120px] lg:max-h-[120px] flex items-center justify-center bg-[var(--color-accent)]/5 !border-[var(--color-accent)]/20"
            delay={0.5}
          >
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 text-center">
              <div>
                <span className="block text-3xl font-cinzel text-[var(--color-accent)]">
                  100%
                </span>
                <span className="text-[10px] font-mono-tech text-[var(--color-text-secondary)] tracking-widest">
                  COMMITMENT
                </span>
              </div>
              <div className="hidden md:block w-[1px] h-8 bg-[var(--color-accent)]/30" />
              <div>
                <span className="block text-3xl font-cinzel text-[var(--color-accent)]">
                  24/7
                </span>
                <span className="text-[10px] font-mono-tech text-[var(--color-text-secondary)] tracking-widest">
                  UPTIME
                </span>
              </div>
              <div className="hidden md:block w-[1px] h-8 bg-[var(--color-accent)]/30" />
              <div className="max-w-md text-sm text-[var(--color-text-secondary)] font-light italic">
                "Constantly evolving my stack to build faster, scalable, and
                more resilient systems."
              </div>
            </div>
          </BentoItem>
        </div>
      </div>
    </section>
  );
}
