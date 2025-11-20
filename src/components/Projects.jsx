import React, { useMemo } from "react";
import SectionObserver from "./SectionObserver";
import ProjectGallery from "./ProjectGallery";

const projectsData = [
  {
    title: "AI Powered Attendance System",
    description:
      "A secure, automated attendance system using facial recognition, featuring dynamic dashboards and leave policy enforcement.",
    techStack: ["Python", "OpenCV", "PHP", "MySQL", "GSAP"],
    liveLink: null,
    githubLink: "#",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
  },
  {
    title: "AI Powered Clinical Simulator",
    description:
      "An iOS medical training app with interactive patient simulations and AI-based feedback to enhance clinical decision-making.",
    techStack: ["SwiftUI", "Firebase", "LLM APIs"],
    liveLink: "#",
    githubLink: "#",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "AI Powered Virtual Try-On Studio",
    description:
      "A cutting-edge virtual try-on application using the Gemini AI model to generate photorealistic outfits from user photos and text or garment prompts, featuring multi-angle views and iterative refinement.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Gemini AI"],
    liveLink: "#",
    githubLink: "#",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  },
  {
    title: "E-Waste Management Platform",
    description:
      "A multi-role platform for managing e-waste logistics, featuring role-based access control and analytics dashboards.",
    techStack: ["PHP", "MySQL", "REST API", "Chart.js"],
    liveLink: "#",
    githubLink: null,
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
  },
  {
    title: "Codebase Prompt Packer",
    description:
      "A VS Code extension to streamline AI-assisted development by packaging workspace context into LLM-friendly prompts.",
    techStack: ["JavaScript", "VS Code API", "Node.js"],
    liveLink: null,
    githubLink: "#",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
  },
];

export default function Projects() {
  return (
    <SectionObserver configKey="projects" threshold={0.08}>
      <section id="projects">
        <ProjectGallery projects={projectsData} />
      </section>
    </SectionObserver>
  );
}
