import React from 'react';
import { StudioProvider } from './context/StudioContext';
import ParticlesBackground from './components/reactbits/ParticlesBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GamesSection from './components/GamesSection';
import TeamSection from './components/TeamSection';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';
import NotificationToast from './components/NotificationToast';

export default function App() {
  return (
    <StudioProvider>
      <div className="relative min-h-screen bg-[#070c18] text-[#f0f9ff] overflow-x-hidden selection:bg-sky-500 selection:text-white">
        
        {/* React Bits Ambient Particles Background (Electric Blue & Cyan) */}
        <ParticlesBackground
          particleCount={45}
          particleColors={['#38bdf8', '#0284c7', '#00f2fe', '#60a5fa', '#93c5fd']}
          speed={0.4}
        />

        {/* Ambient Subtle Cyber Grid Texture */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-45" />

        {/* Top Glow bar */}
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent z-50 opacity-75" />

        {/* Main Layout */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-1">
            <Hero />
            <GamesSection />
            <TeamSection />
          </main>

          <Footer />
        </div>

        {/* Admin Backoffice Modal & Toasts */}
        <AdminModal />
        <NotificationToast />

      </div>
    </StudioProvider>
  );
}
