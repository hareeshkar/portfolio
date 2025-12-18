// File: /src/components/Footer.jsx

import React from 'react';
import { SiGithub, SiLinkedin } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-background)] border-t border-[var(--color-text-secondary)]/20">
      <div className="mx-auto max-w-7xl px-6 py-8 md:flex md:items-center md:justify-between lg:px-8">
        
        {/* Social / Contact Icons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 md:order-2">
          <div className="flex space-x-6">
            <a href="https://github.com/hareeshkar" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-all duration-300 hover:scale-110 hover:drop-shadow-lg">
              <span className="sr-only">GitHub</span>
              <SiGithub className="h-6 w-6" />
            </a>
            <a href="https://www.linkedin.com/in/hareeshkar-ravi" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-all duration-300 hover:scale-110 hover:drop-shadow-lg">
              <span className="sr-only">LinkedIn</span>
              <SiLinkedin className="h-6 w-6" />
            </a>
          </div>

          <div className="text-text-secondary text-xs mt-2 sm:mt-0">
            <a href="mailto:hareeshkarravi@gmail.com" className="block hover:text-accent">hareeshkarravi@gmail.com</a>
            <a href="tel:+94771737524" className="block hover:text-accent">+94 77 173 7524</a>
          </div>
        </div>
        
        {/* Copyright / Attribution */}
        <div className="mt-4 md:mt-0 md:order-1">
          <p className="text-center text-xs leading-5 text-text-secondary font-sans">
            &copy; {new Date().getFullYear()} RAVI HAREESHKAR — Software Engineering Undergraduate
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;