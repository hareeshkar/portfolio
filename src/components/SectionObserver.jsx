// File: /src/components/SectionObserver.jsx

import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useParticles } from "./ParticleContext";

export default function SectionObserver({
  children,
  configKey,
  threshold = 0.3, // REDUCED from 0.55 for faster triggering
}) {
  const { setParticleConfig } = useParticles();
  const timeoutRef = useRef(null);
  const lastAppliedConfigRef = useRef(null);

  const { ref, inView } = useInView({
    threshold: threshold,
    triggerOnce: false,
    rootMargin: "0px 0px -30% 0px", // ADDED: Trigger when section is 30% from bottom of viewport
  });

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (inView) {
      // REDUCED delay for faster particle switching
      timeoutRef.current = setTimeout(() => {
        if (lastAppliedConfigRef.current !== configKey) {
          console.log(`[SectionObserver] Switching to config: ${configKey}`); // DEBUG
          setParticleConfig(configKey);
          lastAppliedConfigRef.current = configKey;
        }
      }, 100); // REDUCED from 180ms
    } else {
      lastAppliedConfigRef.current = null;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [inView, configKey, setParticleConfig]);

  return <div ref={ref}>{children}</div>;
}
