import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Settings, ExternalLink, Menu, X, Shield, Sparkles } from 'lucide-react';
import Magnet from './reactbits/Magnet';

export default function Navbar() {
  const { data, setIsAdminOpen } = useStudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'GAMES', href: '#games' },
    { label: 'TEAM', href: '#team' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c0712]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <a href="#home" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-pink-500/30 bg-[#160b22] p-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:border-pink-500/60 shadow-[0_0_15px_rgba(232,93,158,0.2)]">
              <img
                src={data.studio.logoUrl}
                alt={data.studio.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/LogoMap.png';
                }}
              />
              <span className="absolute inset-0 rounded-xl bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-wider text-white group-hover:text-pink-400 transition-colors uppercase">
                {data.studio.name}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-pink-400/80 uppercase -mt-0.5">
                {data.studio.badge || 'ROBLOX STUDIO'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-mono font-medium tracking-widest text-gray-300 hover:text-pink-400 transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3.5">
            {/* Backoffice / Admin CMS Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400/60 rounded-xl transition-all duration-300 group shadow-sm"
              title="จัดการข้อมูลหลังบ้าน / เชื่อมต่อ Git"
            >
              <Settings className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-45 transition-transform duration-300" />
              <span>หลังบ้าน (CMS)</span>
            </button>

            {/* Roblox Group Button */}
            <Magnet padding={40} magnetStrength={0.25}>
              <a
                href={data.studio.robloxGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl shadow-[0_0_20px_rgba(232,93,158,0.35)] hover:shadow-[0_0_28px_rgba(232,93,158,0.55)] transition-all duration-300 transform active:scale-95"
              >
                <span>ROBLOX GROUP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Magnet>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 text-purple-400 bg-purple-950/40 border border-purple-500/30 rounded-lg"
              title="หลังบ้าน"
            >
              <Settings className="w-4 h-4" />
            </button>
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
        <div className="md:hidden bg-[#12091b] border-b border-pink-500/20 px-6 py-5 space-y-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-mono tracking-wider text-gray-300 hover:text-pink-400 py-2 border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            <a
              href={data.studio.robloxGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-xl text-center shadow-lg"
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
