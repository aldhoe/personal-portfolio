'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import NavigationMenu from '@/components/Home/NavigationMenu';
import TabNavigation from '@/components/Home/TabNavigation';
import ContentContainer from '@/components/ContentContainer';
import { motion, AnimatePresence } from 'framer-motion'; 

// Definisikan tipe data ProjectDetail (diasumsikan)
interface ProjectData { 
    title: string;
    description: string;
    subtitle: string;
    achievements: string;
    imageUrl: string;
    liveLink: string;
    type: string;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
  const profileImageUrl = '/images/profile-dark-bg.jpg'; 
  
  const isHome = activeTab === 'home';
  // KUNCI PERBAIKAN: Blur hanya aktif jika BUKAN home DAN BUKAN links
  const isBlurTarget = activeTab !== 'home' && activeTab !== 'links';
  const [isBlurActive, setIsBlurActive] = useState(isBlurTarget); 
  
  // STATE BARU: Untuk mengontrol tampilan detail proyek
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);


  const handleTabChange = (tabId: string) => {
    // Pastikan modal tertutup saat berpindah tab
    setSelectedProject(null);
    setActiveTab(tabId);
    console.log(`Mengganti tab ke: ${tabId}`);
  };
  
  const handleProjectClose = () => {
    setSelectedProject(null);
  };
  
  // Logika untuk mengaktifkan blur overlay saat pindah tab
  useEffect(() => {
    // Update state blur berdasarkan kondisi isBlurTarget
    // Kita juga mengaktifkan blur jika selectedProject aktif (untuk menyamarkan transisi detail)
    setIsBlurActive(isBlurTarget || selectedProject !== null); 
  }, [isBlurTarget, selectedProject]);


  // Logic untuk memastikan tombol navigasi bawah hilang saat detail proyek aktif
  const showTabNavigation = selectedProject === null;


  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col bg-black"> 
      
      {/* OVERLAY HITAM UNTUK FADE-OUT HANYA SAAT INITIAL LOAD */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, pointerEvents: 'none' }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="fixed inset-0 bg-black z-40"
      />

      <NavigationMenu activeTab={activeTab} />

      {/* 1. Gambar Background dan Gradien DRAMATIS */}
      <div className="absolute inset-0 z-0">
        <Image
          src={profileImageUrl}
          alt="Renaldo Dasilva Profile"
          fill 
          quality={100}
          priority
          className="object-cover opacity-70" 
        />
        {/* KEMBALIKAN OVERLAY GELAP/ORANGE UNTUK EFEK DRAMATIS */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-orange-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>

        {/* BLUR OVERLAY (Aktif saat isBlurTarget TRUE atau Project Detail aktif) */}
        <AnimatePresence>
          {isBlurActive && ( 
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }} 
              className="absolute inset-0 z-0 bg-black/10 backdrop-blur-xl pointer-events-none"
            />
          )}
        </AnimatePresence>

      </div>
      
      {/* 2. KONTEN UTAMA */}
      <div className="relative z-10 flex-grow 
          flex items-center justify-start 
          px-10 md:px-24 lg:px-48 py-20 
        "
      >
        {/* Teruskan state modal ke ContentContainer */}
        <ContentContainer 
          activeTab={activeTab} 
          selectedProject={selectedProject} 
          onProjectSelect={setSelectedProject}
          onProjectClose={handleProjectClose}
        />
      </div>
      
      {/* KUNCI: Sembunyikan Navigasi saat detail proyek aktif */}
      <AnimatePresence initial={false}>
        {showTabNavigation && (
          <motion.div
            key="tab-nav"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <TabNavigation 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}