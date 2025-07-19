import React from 'react';
import { Github, Twitter, MessageCircle } from 'lucide-react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-cyan-900/30 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br rounded-lg">
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none" className="logo-spin">
                <circle className="dot dot1" cx="24" cy="8" r="5" fill="#00E5FF"/>
                <circle className="dot dot2" cx="40" cy="24" r="5" fill="#1DE9B6"/>
                <circle className="dot dot3" cx="24" cy="40" r="5" fill="#76FF03"/>
                <circle className="dot dot4" cx="8" cy="24" r="5" fill="#00BCD4"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg brand-text text-white">IOTA PASSPORT</h3>
              <p className="brand-subtitle text-cyan-400">POWERED BY IOTA</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-9 h-9 bg-neutral-900 border border-cyan-900/30 hover:bg-cyan-900/20 hover:border-cyan-700 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            </a>
            
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-9 h-9 bg-neutral-900 border border-cyan-900/30 hover:bg-cyan-900/20 hover:border-cyan-700 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-9 h-9 bg-neutral-900 border border-cyan-900/30 hover:bg-cyan-900/20 hover:border-cyan-700 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="Discord"
            >
              <MessageCircle className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-neutral-500 text-center md:text-right">
            <p className="font-semibold">© 2025 IOTA PASSPORT </p>
            <div className="flex items-center justify-center md:justify-end space-x-2 mt-1">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
              <span className="font-semibold tracking-wide">IOTA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};