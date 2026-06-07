'use client';

import React, { useRef, useState, useEffect } from 'react'; 
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import HeroSection from './Home/HeroSection'; 
import { SummaryContent } from './Content/SummaryContent'; 
import ExperienceContent from './Content/ExperienceContent'; 
import PortfolioContent from './Content/PortfolioContent'; 
import ProjectDetailView from './Content/ProjectDetailView';
import LinksContent from './Content/LinksContent'; 
import { 
  ProjectData, 
  PortfolioCategory, 
  SiteSettings, 
  ExperienceData, 
  TestimonialData 
} from '@/types/sanity';

import { useData } from '@/providers/DataProvider';

interface ContentContainerProps {
  activeTab: string;
  selectedProject: ProjectData | null;
  onProjectSelect: (project: ProjectData) => void;
  onProjectClose: () => void;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ 
  activeTab, 
  selectedProject, 
  onProjectSelect, 
  onProjectClose
}) => {
  const { siteSettings, experiences, testimonials, portfolioData } = useData();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 500);

    const element = scrollRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      setShowTopFade(scrollTop > 50);
      setShowBottomFade(scrollTop + clientHeight < scrollHeight - 50);
      
      // Calculate scroll progress percentage (0 to 100)
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };
  
  // Reset scroll progress immediately when tab changes
  useEffect(() => {
    // Reset all scroll-related state instantly to avoid stale values
    setScrollProgress(0);
    setShowTopFade(false);
    setShowBottomFade(true);
    setIsScrolling(false);

    // Scroll the container back to top and recalculate after new content mounts
    // Use a small delay + rAF to ensure the new DOM is ready
    const resetTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
          handleScroll();
        }
      });
    }, 50);

    return () => {
      clearTimeout(resetTimeout);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [activeTab]);

  const scrollableContentWrapper = (content: React.ReactNode) => (
    <div className="relative w-full max-w-5xl mx-auto h-full pt-6">
      {/* Scroll Progress Indicator - Edge-to-Edge on Desktop, Hidden on Mobile */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/10 z-[100] hidden md:block">
        <div 
          className="h-full bg-yellow-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className={`w-full h-full overflow-y-auto mt-2 ${isScrolling ? 'scroll-visible' : 'scroll-hidden'}`}
        style={{ 
          paddingTop: '2rem', 
          paddingBottom: '9rem',
          maskImage: `linear-gradient(to bottom, 
            transparent 0%, 
            black ${showTopFade ? '80px' : '0px'}, 
            black calc(100% - ${showBottomFade ? '120px' : '0px'}), 
            transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, 
            transparent 0%, 
            black ${showTopFade ? '80px' : '0px'}, 
            black calc(100% - ${showBottomFade ? '120px' : '0px'}), 
            transparent 100%)`
        }}
      >
        {content}
      </div>
    </div>
  );

  const commonContentWrapper = (content: React.ReactNode) => (
    <div 
      className="w-full max-w-5xl mx-auto max-h-screen overflow-y-auto scrollbar-hide"
      style={{ paddingTop: '2rem', paddingBottom: '9rem' }} 
    >
      {content}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HeroSection 
            name={siteSettings?.name}
            jobTitle={siteSettings?.jobTitle}
            isOpenToWork={siteSettings?.isOpenToWork}
            contactInfo={siteSettings?.contactInfo}
          />
        );
      case 'summary':
        return commonContentWrapper(
          <SummaryContent 
            paragraphs={siteSettings?.summaryParagraphs}
            quote={siteSettings?.summaryQuote}
          />
        );
      case 'experience':
        return scrollableContentWrapper(
          <ExperienceContent 
            experiences={experiences}
            skills={siteSettings?.skills}
            tools={siteSettings?.tools}
            testimonials={testimonials}
          />
        );
      case 'portfolio':
        return scrollableContentWrapper(
          <PortfolioContent 
            onCardClick={onProjectSelect}
            data={portfolioData}
            loading={false}
            error={null}
          />
        );
      case 'links':
        return commonContentWrapper(
          <LinksContent 
            socialLinks={siteSettings?.socialLinks}
            contactInfo={siteSettings?.contactInfo}
          />
        );
      default:
        return (
          <HeroSection 
            name={siteSettings?.name}
            jobTitle={siteSettings?.jobTitle}
            isOpenToWork={siteSettings?.isOpenToWork}
            contactInfo={siteSettings?.contactInfo}
          />
        );
    }
  };

  const showPageOverlay = activeTab !== 'home' && activeTab !== 'links';

  return (
    <>
      {/* 
        STABLE OVERLAY LAYER — This div provides the blur/bg overlay.
        It does NOT get unmounted during detail→portfolio transitions.
        This fixes the blur flickering issue.
      */}
      <AnimatePresence>
        {showPageOverlay && (
          <motion.div
            key="page-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-5 bg-neutral-900/20 backdrop-blur-xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* CONTENT LAYER — Transitions between tabs and detail view */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selectedProject ? 'detail-view' : activeTab} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.15 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className={`w-full h-full z-10 
            ${showPageOverlay || selectedProject
              ? 'absolute inset-0 flex items-start justify-center pt-20'
              : 'flex items-center justify-start h-full'
            }
          `}
        >
          {selectedProject 
            ? <ProjectDetailView project={selectedProject} onClose={onProjectClose} />
            : renderTabContent()
          }
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ContentContainer;