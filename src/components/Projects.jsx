import React, { useMemo } from "react";
import SectionObserver from "./SectionObserver";
import ProjectGallery from "./ProjectGallery";

const projectsData = [
  {
    title: "Synapse Med — AI Clinical Intelligence Engine",
    description:
      "MERN SPA converting medical lectures into interactive knowledge graphs. Orchestrates a 'Socratic Tutor' using Gemini to parse documents and produce visual flowcharts and quizzes.",
    techStack: ["MongoDB", "Express", "React", "Node.js", "Gemini AI", "Three.js"],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar/synapse-med",
    image:
      "https://images.unsplash.com/photo-1581093588401-7b6c4c0c2b6b?q=80&w=1965&auto=format&fit=crop",
  },
  {
    title: "Clinical Simulator — iOS Training Platform",
    description:
      "Native iOS app (SwiftUI, SwiftData, Firebase) with multilingual patient simulation and AI-driven diagnostics. MVVM architecture, offline-first features and adaptive vitals animations.",
    techStack: ["SwiftUI", "SwiftData", "Firebase", "Gemini/OpenAI APIs"],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar/ClinicalSimulator",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "The Gadget Hub — Enterprise E‑Commerce",
    description:
      "B2B/B2C ASP.NET Core platform built on SOA with multi-tenant APIs, Entity Framework Core, JWT auth and RBAC. Automated quotation comparison and inventory sync.",
    techStack: ["ASP.NET Core", "C#", "MSSQL", "Entity Framework"],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar", // fallback
    image:
      "https://images.unsplash.com/photo-1542223616-6f2f5aedf1f4?q=80&w=1965&auto=format&fit=crop",
  },
  {
    title: "E‑Waste Management Platform",
    description:
      "A multi-role platform for managing e-waste logistics, featuring role-based access control and analytics dashboards.",
    techStack: ["PHP", "MySQL", "REST API", "Chart.js"],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar", // restored project (fallback)
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
  },
  {
    title: "EcoStay Retreat — Resort Management",
    description:
      "Native Android app with a custom room-allocation algorithm and offline storage (SQLite). Improved operations with automated reminders and conflict-resolution logic.",
    techStack: ["Java", "Android SDK", "SQLite"],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar", // restored project (fallback)
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e4b1d70f1b?q=80&w=1965&auto=format&fit=crop",
  },
  {
    title: "AI Powered Virtual Try-On Studio",
    description:
      "Photorealistic virtual try-on app leveraging generative models and iterative prompts for multi-angle outfit previews.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Gemini AI"],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar", // fallback
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  },
  {
    title: "AI Powered Attendance System",
    description:
      "A secure, automated attendance system using facial recognition, featuring dynamic dashboards and leave policy enforcement.",
    techStack: ["Python", "OpenCV", "PHP", "MySQL", "GSAP"],
    liveLink: null,
    githubLink: "https://github.com/hareeshkar", // fallback
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
  },
  {
    title: "Codebase Prompt Packer",
    description:
      "VS Code extension to package workspace context into LLM-friendly prompts to accelerate AI-assisted development workflows.",
    techStack: ["JavaScript", "VS Code API", "Node.js"],
    liveLink: null,
    githubLink: "https://github.com/hareeshkar/codebase-prompt-packer",
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
