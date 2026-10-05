import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import TiltedCard from './reactbits/TiltedCard';
import SpotlightCard from './reactbits/SpotlightCard';
import { ExternalLink, Copy, Check, Shield, Code, Palette } from 'lucide-react';

export default function TeamSection() {
  const { data, showToast } = useStudio();
  const [copiedId, setCopiedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const handleCopyHandle = (handle, id) => {
    navigator.clipboard.writeText(handle);
    setCopiedId(id);
    showToast(`📋 คัดลอก ${handle} สำเร็จ!`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['ALL', 'OWNER', 'DEVELOPERS', 'MODELERS'];

  const getRoleBadgeStyle = (role) => {
    const r = (role || '').toUpperCase();
    if (r.includes('OWNER') || r.includes('FOUNDER')) {
      return {
        bg: 'bg-sky-950/70',
        border: 'border-sky-400/50 text-sky-200',
        glow: 'shadow-[0_0_15px_rgba(56,189,248,0.35)]',
        icon: <Shield className="w-3.5 h-3.5 text-sky-400" />
      };
    }
    if (r.includes('DEV') || r.includes('SCRIPT') || r.includes('PROGRAM')) {
      return {
        bg: 'bg-blue-950/70',
        border: 'border-cyan-400/50 text-cyan-200',
        glow: 'shadow-[0_0_15px_rgba(6,182,212,0.35)]',
        icon: <Code className="w-3.5 h-3.5 text-cyan-400" />
      };
    }
    return {
      bg: 'bg-indigo-950/70',
      border: 'border-indigo-400/50 text-indigo-200',
      glow: 'shadow-[0_0_15px_rgba(99,102,241,0.35)]',
      icon: <Palette className="w-3.5 h-3.5 text-indigo-400" />
    };
  };

  const filteredTeam = data.team.filter((member) => {
    if (selectedCategory === 'ALL') return true;
    return (
      member.category?.toUpperCase() === selectedCategory ||
      member.role?.toUpperCase().includes(selectedCategory)
    );
  });

  return (
    <section id="team" className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-[#081124]/60 to-transparent">
      
      {/* Glow aura */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-widest mb-2">
            <span>// THE TEAM</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight uppercase">
            WHO'S BUILDING THIS
          </h2>
          <p className="mt-3 text-gray-400 text-sm sm:text-base font-sans max-w-xl">
            Meet the talented developers, directors, and 3D artists powering Project Unleash.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full mt-4" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 border ${
                selectedCategory === cat
                  ? 'bg-sky-600/25 border-sky-500 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredTeam.map((member) => {
            const badgeStyle = getRoleBadgeStyle(member.role);
            const isCopied = copiedId === member.id;

            return (
              <TiltedCard
                key={member.id}
                maxTilt={12}
                scale={1.02}
                className="h-full"
              >
                <SpotlightCard
                  spotlightColor="rgba(56, 189, 248, 0.2)"
                  borderColor="rgba(56, 189, 248, 0.4)"
                  className="h-full p-6 flex flex-col justify-between items-center text-center bg-[#0b1428]/90 border border-sky-500/20 rounded-2xl group hover:border-sky-500/50 transition-all duration-300"
                >
                  {/* Top content */}
                  <div className="flex flex-col items-center w-full">
                    
                    {/* Avatar with glow ring (File extension badge removed as requested) */}
                    <div className="relative mb-5 group/avatar">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-sky-400 via-blue-500 to-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.35)] group-hover/avatar:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-all duration-300">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-[#0c162d]">
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/LogoMap.png';
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Member Name */}
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-sky-300 transition-colors">
                      {member.name}
                    </h3>

                    {/* Member Handle with Copy Button */}
                    <button
                      onClick={() => handleCopyHandle(member.handle, member.id)}
                      className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-sky-400 transition-colors py-0.5 px-2 rounded-md hover:bg-white/5"
                      title="คัดลอก Roblox Username"
                    >
                      <span>{member.handle}</span>
                      {isCopied ? (
                        <Check className="w-3 h-3 text-cyan-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-60" />
                      )}
                    </button>

                    {/* Role Badge */}
                    <div className="mt-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider border ${badgeStyle.bg} ${badgeStyle.border} ${badgeStyle.glow}`}
                      >
                        {badgeStyle.icon}
                        <span>{member.role}</span>
                      </span>
                    </div>

                    {/* Bio */}
                    {member.bio && (
                      <p className="mt-4 text-xs font-sans text-gray-300 line-clamp-3 leading-relaxed px-1">
                        {member.bio}
                      </p>
                    )}

                  </div>

                  {/* Bottom: Roblox Profile Link Button */}
                  <div className="w-full pt-6 mt-4 border-t border-sky-500/10">
                    <a
                      href={member.robloxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-mono text-xs font-semibold text-white bg-sky-950/40 hover:bg-sky-600/20 border border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group/btn"
                    >
                      {/* Roblox Logo Graphic / Icon */}
                      <svg className="w-3.5 h-3.5 fill-current text-sky-400 group-hover/btn:rotate-12 transition-transform" viewBox="0 0 24 24">
                        <path d="M5.337 0L0 18.663l18.663 5.337L24 5.337 5.337 0zm10.74 13.914l-3.328.948-.948-3.328 3.328-.948.948 3.328z" />
                      </svg>
                      <span>ROBLOX PROFILE</span>
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover/btn:text-white" />
                    </a>
                  </div>

                </SpotlightCard>
              </TiltedCard>
            );
          })}
        </div>

      </div>
    </section>
  );
}
