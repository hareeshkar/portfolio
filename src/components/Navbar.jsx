// File: /src/components/Navbar.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeContext";
import { useLenisScroll } from "../contexts/LenisContext";
import { HiSun, HiMoon } from "react-icons/hi2";
import { HiMenu } from "react-icons/hi";
import TextScramble from "./TextScramble";
import MobileMenu from "./MobileMenu"; // Import our new component

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const scrollTo = useLenisScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const links = [
    { title: "About", href: "#about" },
    { title: "Projects", href: "#projects" },
    { title: "Skills", href: "#skills" },
    { title: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Threshold for frosted effect
    };
    window.addEventListener("scroll", handleScroll, { passive: true }); // Passive for better performance
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth navigation handler using the Lenis context
  const handleNavClick = (e, href) => {
    if (e && e.preventDefault) e.preventDefault();
    // close mobile menu when a nav item is clicked
    if (mobileMenuOpen) setMobileMenuOpen(false);

    // use Lenis scroll with offset for navbar height
    scrollTo(href, { offset: -80 });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 p-6 md:p-8 transition-all duration-300 ${
          isScrolled ? "backdrop-blur-md bg-surface/80" : ""
        }`}
        style={{
          willChange: "backdrop-filter, background-color", // GPU hint for backdrop
        }}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#home", { offset: -80 });
            }}
            className="font-display text-2xl font-bold tracking-wide"
          >
            RH.
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <a
                key={link.title}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm uppercase tracking-widest"
              >
                <TextScramble text={link.title} />
              </a>
            ))}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface border border-border"
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "light" ? (
                    <HiMoon className="w-5 h-5" />
                  ) : (
                    <HiSun className="w-5 h-5 text-accent" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-2xl text-text-primary"
            >
              <HiMenu />
            </button>
          </div>
        </div>
      </header>

      {/* The Mobile Menu itself */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={links}
        onNavigate={(href) => {
          // ensure menu is closed then navigate
          setMobileMenuOpen(false);
          // small delay allows close animation to finish if any
          setTimeout(() => scrollTo(href, { offset: -80 }), 80);
        }}
      />
    </>
  );
}
