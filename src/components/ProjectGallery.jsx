import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProjectListItem from "./ProjectListItem";

const ProjectGallery = ({ projects }) => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Intersection observer to detect when section is out of view
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (!inView) {
      setHoveredProject(null);
    }
  }, [inView]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // --- CINEMATIC ANIMATION VARIANTS (Inspired by About.jsx) ---
  const cinematicReveal = {
    hidden: { opacity: 0, y: 80, scale: 0.96, filter: "blur(15px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }, // Heavy ease for luxury feel
    },
  };

  const containerStagger = {
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-transparent py-32 px-4 md:px-12 overflow-hidden"
    >
      {/* Background Image Reveal Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="wait">
          {hoveredProject !== null && projects[hoveredProject] && (
            <motion.div
              key={hoveredProject}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }} // Opacity handled by CSS variable on the image or container
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={projects[hoveredProject].image}
                alt="Project Preview"
                className="w-full h-full object-cover transition-all duration-700"
                style={{
                  opacity: "var(--bg-image-opacity)",
                  filter: "var(--bg-image-filter)",
                }}
              />
              {/* Scrim Layer for Light Mode Contrast */}
              <div
                className="absolute inset-0 bg-black transition-opacity duration-700 gpu-accelerated"
                style={{ opacity: "var(--bg-image-scrim)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Cursor Follower (Optional, for extra flair) */}
      <motion.div
        className="fixed z-50 w-4 h-4 bg-accent rounded-full pointer-events-none mix-blend-difference hidden md:block"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: hoveredProject !== null ? 4 : 1,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      />

      {/* Content Layer with Cinematic Entry */}
      <motion.div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: "-10%", once: true }}
        variants={containerStagger}
        style={{ willChange: "transform, opacity, filter" }} // GPU acceleration
      >
        <motion.div
          className="mb-24 border-b border-white/40 pb-12"
          variants={cinematicReveal}
        >
          {/* Separator Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent mb-12 origin-left"
          />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
            <span className="font-mono-tech text-xs text-[var(--color-accent)] tracking-[0.3em]">
              SELECTED WORKS // 002
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-cinzel text-5xl sm:text-7xl lg:text-8xl leading-[0.85] text-[var(--color-text-primary)] tracking-tight"
          >
            Digital <br />
            <span className="font-cormorant italic text-[var(--color-accent)] font-light">
              Artifacts
            </span>
          </motion.h2>
        </motion.div>

        <motion.div
          className="flex flex-col"
          onMouseLeave={() => setHoveredProject(null)}
          variants={cinematicReveal} // Apply cinematic reveal to the project list container
        >
          {projects.map((project, index) => (
            <ProjectListItem
              key={index}
              index={index}
              project={project}
              hoveredProject={hoveredProject}
              setHoveredProject={setHoveredProject}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectGallery;
