'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import NavigationMenu from '@/components/Home/NavigationMenu';
import TabNavigation from '@/components/Home/TabNavigation';
import ContentContainer from '@/components/ContentContainer';
import { motion, AnimatePresence } from 'framer-motion'; 
import { ProjectData } from '@/types/sanity';
import { useData } from '@/providers/DataProvider';

interface ClientPageManagerProps {
  initialProject: ProjectData | null;
}

export default function ClientPageManager({ initialProject }: ClientPageManagerProps) {
  // Initialize tab to 'portfolio' if there's an initial project via deep link
  const [activeTab, setActiveTab] = useState(initialProject ? 'portfolio' : 'home');
  const profileImageUrl = '/images/profile-dark-bg.jpg'; 
  
  const isBlurTarget = activeTab !== 'home' && activeTab !== 'links';
  const [isBlurActive, setIsBlurActive] = useState(isBlurTarget); 
  
  // Project detail state initialized with deep linked project
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(initialProject);

  const { siteSettings } = useData();

  const handleTabChange = (tabId: string) => {
    setSelectedProject(null);
    window.history.pushState({}, '', window.location.pathname); // Clear URL params
    setActiveTab(tabId);
  };
  
  const handleProjectClose = () => {
    setSelectedProject(null);
    window.history.pushState({}, '', window.location.pathname); // Clear URL params
  };

  const handleProjectSelect = (project: ProjectData) => {
    setSelectedProject(project);
    if (project.slug?.current) {
      window.history.pushState({}, '', `?project=${project.slug.current}`);
    }
  };
  
  useEffect(() => {
    setIsBlurActive(isBlurTarget || selectedProject !== null); 
  }, [isBlurTarget, selectedProject]);

  const showTabNavigation = selectedProject === null;

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col bg-black"> 
      
      {/* We removed the initial loading overlay entirely since we use Server Components now! */}

      <NavigationMenu activeTab={activeTab} cvUrl={siteSettings?.cvFileUrl} />

      {/* Background Image + Gradients */}
      <div className="absolute inset-0 z-0">
        <Image
          src={profileImageUrl}
          alt="Renaldo Dasilva Profile"
          fill 
          quality={85}
          priority
          className="object-cover opacity-70" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-orange-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>

        {/* Blur Overlay */}
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
      
      {/* Main Content */}
      <div className="relative z-10 flex-grow 
          flex items-center justify-start 
          px-6 sm:px-10 md:px-24 lg:px-32 py-0 
        "
      >
        <ContentContainer 
          activeTab={activeTab} 
          selectedProject={selectedProject} 
          onProjectSelect={handleProjectSelect}
          onProjectClose={handleProjectClose}
        />
      </div>
      
      {/* Tab Navigation */}
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
