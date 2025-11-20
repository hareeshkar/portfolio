import React from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

const ProjectListItem = ({
  project,
  index,
  setHoveredProject,
  hoveredProject,
}) => {
  const isHovered = hoveredProject === index;
  const isDimmed = hoveredProject !== null && !isHovered;

  // Use react-intersection-observer for stable "once" behavior
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "-50px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: inView ? (isDimmed ? 0.3 : 1) : 0,
        y: inView ? 0 : 20,
        filter: inView ? (isDimmed ? "blur(1px)" : "blur(0px)") : "blur(0px)",
      }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHoveredProject(index)}
      className="group relative flex flex-col py-12 border-b border-border transition-colors duration-500 cursor-pointer"
    >
      <div className="flex items-baseline justify-between w-full">
        <div className="flex items-baseline gap-8">
          <span className="font-mono text-sm text-accent/80">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium text-text-primary group-hover:text-accent transition-colors duration-300">
            {project.title}
          </h3>
        </div>

        <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-4 group-hover:translate-x-0">
          <span className="font-mono text-xs text-accent tracking-widest uppercase">
            View Case Study
          </span>
          <FiArrowUpRight className="text-accent text-xl" />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 ml-0 md:ml-14">
        {project.techStack.slice(0, 4).map((tech, i) => (
          <span
            key={i}
            className="font-mono text-xs text-text-secondary uppercase tracking-wider"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectListItem;
