'use client';

import React from 'react';
import { Home, Briefcase, FileText, Layers, Link } from 'lucide-react'; 
import { motion, LayoutGroup } from 'framer-motion'; // Pastikan Framer Motion di-import

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'summary', icon: Briefcase, label: 'Summary' },
  { id: 'experience', icon: FileText, label: 'Experience' },
  { id: 'portfolio', icon: Layers, label: 'Portfolio' },
  { id: 'links', icon: Link, label: 'Links' },
];

const TabNavigation: React.FC<any> = ({ activeTab, onTabChange }) => {
  const isTabActive = (id: string) => id === activeTab; 

  const radiusClass = 'rounded-[2rem]'; 
  const menuBgClass = 'bg-neutral-800/60'; 

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <LayoutGroup>
        <motion.div // Menggunakan motion.div untuk LayoutGroup
          className={`flex relative ${menuBgClass} backdrop-blur-lg p-2 ${radiusClass} shadow-2xl space-x-4 sm:space-x-2`} 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5, delay: 1 }} 
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center justify-center ${radiusClass} relative z-10
                
                // STYLING NON-AKTIF (Mobile Default): Fixed Size & Rounded Full
                p-2.5 hover:bg-white/10 w-10 h-10 rounded-full flex-shrink-0 
                
                // STYLING DESKTOP (Persegi Panjang): Menimpa Mobile
                sm:w-auto sm:h-auto sm:py-2.5 sm:px-4 sm:space-x-2 sm:${radiusClass}
                
                // STYLING AKTIF
                ${isTabActive(item.id) 
                  ? '!text-neutral-800' 
                  : 'text-gray-300' 
                }
              `}
            >
              
              {/* 2. THE MOVING PILL (motion.div) - DIPERBAIKI TOTAL */}
              {isTabActive(item.id) && (
                <motion.div
                  // KUNCI: AKTIFKAN KEMBALI ANIMASI BERJALAN
                  layout 
                  layoutId="active-pill" 
                  transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30, 
                      mass: 0.8 
                  }}
                  // Styling Pill: Rounded-full di mobile, rounded-[2rem] di desktop
                  className={`absolute inset-0 bg-white shadow-md rounded-full sm:${radiusClass} z-[-1]`}
                />
              )}

              {/* Ikon */}
              <item.icon 
                  className={`
                      w-6 h-6 transition-colors 
                      sm:w-4 sm:h-4 
                      ${isTabActive(item.id) ? '!text-neutral-800' : ''}
                  `} 
              />
              
              {/* Label Teks */}
              <span 
                  className={`
                      hidden text-sm font-medium
                      sm:block 
                      ${isTabActive(item.id) ? 'sm:!text-neutral-800' : 'sm:text-gray-300'}
                  `}
              >
                {item.label}
              </span>
              
            </button>
          ))}
          
        </motion.div>
      </LayoutGroup>
    </div>
  );
};

export default TabNavigation;