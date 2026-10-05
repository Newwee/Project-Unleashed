import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import SpotlightCard from './reactbits/SpotlightCard';
import { Gamepad2, Sparkles, ExternalLink, Flame, Shield, ArrowUpRight } from 'lucide-react';

export default function GamesSection() {
  const { data } = useStudio();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filters = [
    { label: 'ALL', value: 'ALL' },
    { label: '● RELEASED', value: 'RELEASED' },
    { label: '● IN DEVELOPMENT', value: 'IN DEVELOPMENT' },
    { label: '● PLANNING', value: 'PLANNING' },
  ];

  const filteredGames = data.games.filter((game) => {
    if (activeFilter === 'ALL') return true;
    return (
      game.status?.toUpperCase().includes(activeFilter) ||
      game.statusTag?.toUpperCase().includes(activeFilter)
    );
  });

  return (
    <section id="games" className="py-24 relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-pink-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-pink-400 uppercase tracking-widest mb-2">
            <span>// OUR GAMES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight uppercase">
            OUR GAMES
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-3" />
        </div>

        {/* Status Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-12">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium tracking-wider transition-all duration-300 border ${
                  isActive
                    ? 'bg-pink-600/20 border-pink-500 text-pink-300 shadow-[0_0_15px_rgba(232,93,158,0.3)]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Games Grid / Cards */}
        <div className="space-y-8">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <SpotlightCard
                key={game.id}
                spotlightColor="rgba(232, 93, 158, 0.2)"
                borderColor="rgba(232, 93, 158, 0.45)"
                className="p-6 sm:p-8 border border-white/10 bg-[#120a1b]/80 transition-all duration-300 hover:border-pink-500/50"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Game Thumbnail / Cover Banner */}
                  <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl border border-white/10 bg-[#1a0f26]">
                    <div className="aspect-[16/10] w-full overflow-hidden relative">
                      <img
                        src={game.coverUrl}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/LogoMap.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0712] via-transparent to-transparent opacity-60" />
                      
                      {/* Floating status badge on image */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-pink-500/40 text-[11px] font-mono font-semibold text-pink-300">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                        <span>{game.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Game Details */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                    <div>
                      {/* Sub-status & Genre */}
                      <div className="flex flex-wrap items-center gap-3 mb-2.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
                          <Flame className="w-3.5 h-3.5 text-pink-400" />
                          <span>{game.statusTag || 'IN DEVELOPMENT'}</span>
                        </span>
                        {game.genre && (
                          <span className="text-xs font-mono text-gray-400">
                            // {game.genre}
                          </span>
                        )}
                      </div>

                      {/* Game Title */}
                      <h3 className="text-3xl sm:text-4xl font-black font-display text-white tracking-wide uppercase">
                        {game.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed font-sans">
                        {game.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {game.tags && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {game.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <a
                        href={game.playUrl || data.studio.robloxGroupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wider uppercase text-white bg-pink-600 hover:bg-pink-500 shadow-[0_0_20px_rgba(232,93,158,0.4)] transition-all duration-300"
                      >
                        <Gamepad2 className="w-4 h-4" />
                        <span>JOIN DEVELOPMENT / SNEAK PEEKS</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                      
                      <div className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span>Alpha Playtest Coming Soon</span>
                      </div>
                    </div>

                  </div>

                </div>
              </SpotlightCard>
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-[#120a1b]/40">
              <p className="font-mono text-gray-400 text-sm">
                No games found in this category.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
