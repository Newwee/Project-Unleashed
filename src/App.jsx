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
      <div className="relative min-h-screen bg-[#0b0711] text-[#f3e8ff] overflow-x-hidden selection:bg-pink-500 selection:text-white">
        
        {/* React Bits Ambient Particles Background */}
        <ParticlesBackground
          particleCount={40}
          particleColors={['#e85d9e', '#a855f7', '#60a5fa', '#f472b6']}
          speed={0.4}
        />

        {/* Ambient Subtle Cyber Grid Texture */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-40" />

        {/* Top Glow bar */}
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent z-50 opacity-70" />

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
