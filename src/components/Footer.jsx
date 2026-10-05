import React from 'react';
import { useStudio } from '../context/StudioContext';
import { ExternalLink, Settings, GitBranch } from 'lucide-react';

export default function Footer() {
  const { data, setIsAdminOpen } = useStudio();

  return (
    <footer className="border-t border-sky-500/10 bg-[#050914] relative z-10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-sky-500/10">
          
          {/* Left Studio info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-sky-500/30 bg-[#0c162d] p-1 flex items-center justify-center">
                <img
                  src={data.studio.logoUrl}
                  alt={data.studio.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/LogoMap.png';
                  }}
                />
              </div>
              <span className="font-display font-black text-xl tracking-wider text-white uppercase">
                {data.studio.name}
              </span>
            </div>
            <p className="text-sm text-gray-400 font-sans max-w-sm leading-relaxed">
              {data.studio.tagline || 'Unleash Your Power. Elevating Roblox Anime Gaming.'}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Git-Connected & Configurable via Studio CMS (Supabase)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-widest text-gray-200 uppercase">
              // NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a href="#home" className="text-gray-400 hover:text-sky-400 transition-colors">
                  HOME
                </a>
              </li>
              <li>
                <a href="#games" className="text-gray-400 hover:text-sky-400 transition-colors">
                  OUR GAMES
                </a>
              </li>
              <li>
                <a href="#team" className="text-gray-400 hover:text-sky-400 transition-colors">
                  MEET THE TEAM
                </a>
              </li>
            </ul>
          </div>

          {/* Socials & Backoffice */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-widest text-gray-200 uppercase">
              // COMMUNITY & ADMIN
            </h4>
            <div className="space-y-2.5">
              <a
                href={data.studio.robloxGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>JOIN ROBLOX GROUP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-sky-300 bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/30 transition-all"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>จัดการข้อมูลหลังบ้าน (Admin CMS)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <p>© 2026 {data.studio.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted for Roblox Developers & Creators
          </p>
        </div>
      </div>
    </footer>
  );
}
