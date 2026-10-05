import React, { useState, useEffect, useRef } from 'react';
import { useStudio } from '../context/StudioContext';
import { ExternalLink, Menu, X } from 'lucide-react';
import Magnet from './reactbits/Magnet';

export default function Navbar() {
  const { data, setIsAdminOpen } = useStudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoClickCount = useRef(0);
  const logoTimer = useRef(null);

  // Secret Admin Activation Methods:
  // 1. Keyboard Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
  // 2. URL Hash: #admin or ?admin=true
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    const checkUrlAdmin = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=true')
      ) {
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    checkUrlAdmin();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsAdminOpen]);

  // 3. Secret Triple-Click on Logo (Clicking logo 3 times within 1 second)
  const handleLogoSecretClick = (e) => {
    logoClickCount.current += 1;
    if (logoTimer.current) clearTimeout(logoTimer.current);

    if (logoClickCount.current >= 3) {
      e.preventDefault();
      logoClickCount.current = 0;
      setIsAdminOpen(true);
      return;
    }

    logoTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 1000);
  };

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'GAMES', href: '#games' },
    { label: 'TEAM', href: '#team' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070c18]/85 backdrop-blur-xl border-b border-sky-500/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand (Secret entry: Triple-click logo to open admin) */}
          <div
            onClick={handleLogoSecretClick}
            className="flex items-center gap-3.5 group cursor-pointer select-none"
            title={data.studio.name}
          >
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-sky-500/30 bg-[#0c162d] p-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              <img
                src={data.studio.logoUrl}
                alt={data.studio.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/LogoMap.png';
                }}
              />
              <span className="absolute inset-0 rounded-xl bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-wider text-white group-hover:text-sky-400 transition-colors uppercase">
                {data.studio.name}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-sky-400/80 uppercase -mt-0.5">
                {data.studio.badge || 'ROBLOX STUDIO'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-mono font-medium tracking-widest text-gray-300 hover:text-sky-400 transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right Action Button (Only Roblox Group is visible to the public) */}
          <div className="hidden md:flex items-center gap-3.5">
            <Magnet padding={40} magnetStrength={0.25}>
              <a
                href={data.studio.robloxGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:shadow-[0_0_28px_rgba(56,189,248,0.55)] transition-all duration-300 transform active:scale-95"
              >
                <span>ROBLOX GROUP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Magnet>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a1224] border-b border-sky-500/20 px-6 py-5 space-y-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-mono tracking-wider text-gray-300 hover:text-sky-400 py-2 border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            <a
              href={data.studio.robloxGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl text-center shadow-lg"
            >
              <span>JOIN ROBLOX GROUP</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
