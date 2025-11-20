// File: /src/components/ParticleController.jsx

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  Suspense,
  lazy,
} from "react";
import { useParticles } from "./ParticleContext";
import { useTheme } from "./ThemeContext";
import getParticlePresets from "../particle-presets";

// Dynamically import Particles component and initialize engine
const ParticlesComponent = lazy(() =>
  import("@tsparticles/react").then(async (module) => {
    // Initialize the particles engine with slim preset
    await module.initParticlesEngine(async (engine) => {
      const { loadSlim } = await import("@tsparticles/slim");
      await loadSlim(engine);
    });
    return { default: module.Particles };
  })
);

export default function ParticleController() {
  const [isClient, setIsClient] = useState(false);
  const { config: currentConfigKey } = useParticles();
  const { theme } = useTheme();

  const presets = useMemo(() => getParticlePresets(theme), [theme]);

  // State for managing our two overlapping particle instances for cross-fading
  const [optionsA, setOptionsA] = useState(null);
  const [optionsB, setOptionsB] = useState(null);
  const [activeInstance, setActiveInstance] = useState("A");
  const [keyA, setKeyA] = useState("A-key-0");
  const [keyB, setKeyB] = useState("B-key-0");
  const isInitialLoad = useRef(true);
  const configCounter = useRef(0);
  const activeInstanceRef = useRef("A");
  const activeConfigRef = useRef(null);
  const pendingConfigRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const swapTimeoutRef = useRef(null);
  const settleTimeoutRef = useRef(null);
  const activeThemeRef = useRef(theme);
  const latestThemeRef = useRef(theme);
  const presetsRef = useRef(presets);

  useEffect(() => {
    // Ensure component only renders on client-side
    setIsClient(true);
  }, []);

  useEffect(() => {
    latestThemeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    presetsRef.current = presets;
  }, [presets]);

  const clearTimers = useCallback(() => {
    if (swapTimeoutRef.current) {
      clearTimeout(swapTimeoutRef.current);
      swapTimeoutRef.current = null;
    }
    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
  }, []);

  const SWAP_DELAY = 220;
  const FADE_DURATION = 1800;

  const startTransition = useCallback(
    (configKeyToLoad) => {
      if (!configKeyToLoad) return;
      const lookup = presetsRef.current;
      const nextOptions = lookup?.[configKeyToLoad] || {
        particles: { number: { value: 0 } },
      };
      const themeForTransition = latestThemeRef.current;

      configCounter.current += 1;

      if (isInitialLoad.current) {
        setOptionsA(nextOptions);
        setKeyA(`A-key-${configCounter.current}`);
        activeConfigRef.current = configKeyToLoad;
        activeThemeRef.current = themeForTransition;
        isInitialLoad.current = false;
        return;
      }

      isTransitioningRef.current = true;
      pendingConfigRef.current = null;
      clearTimers();

      if (activeInstanceRef.current === "A") {
        setOptionsB(nextOptions);
        setKeyB(`B-key-${configCounter.current}`);
        swapTimeoutRef.current = setTimeout(() => {
          setActiveInstance("B");
          activeInstanceRef.current = "B";
          activeConfigRef.current = configKeyToLoad;
          activeThemeRef.current = themeForTransition;
        }, SWAP_DELAY);
      } else {
        setOptionsA(nextOptions);
        setKeyA(`A-key-${configCounter.current}`);
        swapTimeoutRef.current = setTimeout(() => {
          setActiveInstance("A");
          activeInstanceRef.current = "A";
          activeConfigRef.current = configKeyToLoad;
          activeThemeRef.current = themeForTransition;
        }, SWAP_DELAY);
      }

      settleTimeoutRef.current = setTimeout(() => {
        isTransitioningRef.current = false;
        if (
          pendingConfigRef.current &&
          pendingConfigRef.current !== activeConfigRef.current
        ) {
          const queued = pendingConfigRef.current;
          pendingConfigRef.current = null;
          startTransition(queued);
        }
      }, SWAP_DELAY + FADE_DURATION);
    },
    [clearTimers]
  );

  useEffect(() => {
    if (!isClient || !currentConfigKey) return;

    const themeChanged = activeThemeRef.current !== latestThemeRef.current;
    if (!themeChanged && activeConfigRef.current === currentConfigKey) {
      return;
    }


    if (isTransitioningRef.current) {
      pendingConfigRef.current = currentConfigKey;
      return;
    }

    startTransition(currentConfigKey);
  }, [isClient, currentConfigKey, theme, startTransition]);

  useEffect(() => clearTimers, [clearTimers]);

  if (!isClient) return null;

  const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    pointerEvents: "none",
    background: "transparent",
  };

  const instanceStyle = (isActive) => ({
    position: "absolute",
    inset: 0,
    opacity: isActive ? 1 : 0,
    transition: `opacity ${
      isActive ? "1.8s" : "0.9s"
    } cubic-bezier(0.4, 0, 0.2, 1)`,
  });

  return (
    <div style={containerStyle}>
      <Suspense fallback={<div />}>
        {optionsA && (
          <div style={instanceStyle(activeInstance === "A")}>
            <ParticlesComponent
              key={keyA}
              id="tsparticles-instanceA"
              options={optionsA}
            />
          </div>
        )}

        {optionsB && (
          <div style={instanceStyle(activeInstance === "B")}>
            <ParticlesComponent
              key={keyB}
              id="tsparticles-instanceB"
              options={optionsB}
            />
          </div>
        )}
      </Suspense>
    </div>
  );
}
