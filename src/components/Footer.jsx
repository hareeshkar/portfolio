// File: /src/components/Footer.jsx

import React from 'react';
import { SiGithub, SiLinkedin } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-background)] border-t border-[var(--color-text-secondary)]/20">
      <div className="mx-auto max-w-7xl px-6 py-8 md:flex md:items-center md:justify-between lg:px-8">
        
        {/* Social Icons */}
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-all duration-300 hover:scale-110 hover:drop-shadow-lg">
            <span className="sr-only">GitHub</span>
            <SiGithub className="h-6 w-6" />
          </a>
          <a href="https://linkedin.com/in/your-linkedin" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-all duration-300 hover:scale-110 hover:drop-shadow-lg">
            <span className="sr-only">LinkedIn</span>
            <SiLinkedin className="h-6 w-6" />
          </a>
        </div>
        
        {/* Copyright Text */}
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-xs leading-5 text-text-secondary font-sans">
            &copy; 2025 Ravi Hareeshkar. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;