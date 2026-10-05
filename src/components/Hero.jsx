import React from 'react';
import { useStudio } from '../context/StudioContext';
import confetti from 'canvas-confetti';
import { ChevronRight, ExternalLink, Flame } from 'lucide-react';
import DecryptedText from './reactbits/DecryptedText';
import ShinyText from './reactbits/ShinyText';
import Magnet from './reactbits/Magnet';
import TiltedCard from './reactbits/TiltedCard';

export default function Hero() {
  const { data } = useStudio();

  const handleJoinClick = () => {
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#0284c7', '#00f2fe', '#60a5fa', '#e0f2fe'],
    });
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      
      {/* Background radial glow spots */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-950/40 border border-sky-500/30 text-sky-300 text-xs font-mono tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <span className="text-sky-400 font-bold">//</span>
              <DecryptedText
                text={data.studio.badge || 'ROBLOX GAME STUDIO'}
                speed={30}
                animateOn="view"
                className="font-semibold tracking-widest text-sky-300 uppercase"
              />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            </div>

            {/* Giant Studio Title */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight text-white uppercase leading-[0.95]">
                <span className="block drop-shadow-[0_0_35px_rgba(56,189,248,0.35)]">
                  PROJECT
                </span>
                <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  <ShinyText text="UNLEASH" speed={3.5} />
                </span>
              </h1>
            </div>

            {/* Studio Tagline & Description */}
            <p className="text-base sm:text-lg text-gray-300 font-sans max-w-xl leading-relaxed font-normal">
              {data.studio.description}
            </p>

            {/* Announcement / Status ticker banner */}
            {data.studio.announcement && (
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-sky-950/50 border border-sky-500/25 text-xs font-mono text-sky-200/90 max-w-xl">
                <Flame className="w-4 h-4 text-sky-400 flex-shrink-0 animate-bounce" />
                <span className="truncate">{data.studio.announcement}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Magnet padding={50} magnetStrength={0.3}>
                <a
                  href={data.studio.robloxGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleJoinClick}
                  className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wider uppercase text-white bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.45)] hover:shadow-[0_0_40px_rgba(56,189,248,0.7)] active:scale-95"
                >
                  <span className="text-sky-200">▲</span>
                  <span>JOIN OUR ROBLOX GROUP</span>
                  <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </Magnet>

              <a
                href="#games"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-semibold tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-500/40 transition-all duration-300"
              >
                <span>EXPLORE GAMES</span>
                <ChevronRight className="w-4 h-4 text-sky-400" />
              </a>
            </div>

            {/* Stats Ticker */}
            <div className="pt-6 grid grid-cols-3 gap-6 sm:gap-10 border-t border-sky-500/10 w-full max-w-lg">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-display font-black text-white">
                    {stat.value}
                  </span>
                  <span className="text-[11px] font-mono tracking-wider text-gray-400 uppercase mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: High-Impact Logo Emblem with 3D Tilt */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            
            {/* Background glowing halo behind the logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-sky-600/30 via-blue-600/20 to-transparent blur-[90px]" />
            </div>

            <TiltedCard
              maxTilt={16}
              scale={1.04}
              className="relative w-full max-w-[420px] aspect-square flex items-center justify-center p-6"
            >
              <div className="relative w-full h-full rounded-3xl p-6 bg-gradient-to-b from-[#0c1833]/80 to-[#070e1c]/90 border border-sky-500/25 shadow-[0_0_50px_rgba(56,189,248,0.2)] backdrop-blur-xl flex flex-col items-center justify-center group overflow-hidden">
                
                {/* Decorative Tech Grid Lines */}
                <div className="absolute top-3 left-3 text-[10px] font-mono text-sky-400/60">
                  SYS // P_UNLEASH
                </div>
                <div className="absolute top-3 right-3 text-[10px] font-mono text-cyan-400/60">
                  BUILD.2026
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono text-gray-500">
                  STATUS: LIVE
                </div>
                <div className="absolute bottom-3 right-3 text-[10px] font-mono text-sky-400/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                  ONLINE
                </div>

                {/* Main Logo Image */}
                <div className="relative w-4/5 h-4/5 flex items-center justify-center p-4">
                  <img
                    src={data.studio.logoUrl}
                    alt={data.studio.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(56,189,248,0.5)] group-hover:scale-105 transition-transform duration-500 animate-float"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/LogoMap.png';
                    }}
                  />
                </div>

                {/* Subtitle pill */}
                <div className="mt-2 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-500/30 text-[11px] font-mono tracking-widest text-sky-300">
                  OFFICIAL STUDIO EMBLEM
                </div>
              </div>
            </TiltedCard>

          </div>

        </div>
      </div>
    </section>
  );
}
