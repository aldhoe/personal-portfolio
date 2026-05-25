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

interface ContentContainerProps {
  activeTab: string;
  selectedProject: ProjectData | null;
  onProjectSelect: (project: ProjectData) => void;
  onProjectClose: () => void;
  portfolioData: PortfolioCategory[];
  portfolioLoading: boolean;
  portfolioError: string | null;
  siteSettings?: SiteSettings | null;
  experiences?: ExperienceData[];
  testimonials?: TestimonialData[];
}

const ContentContainer: React.FC<ContentContainerProps> = ({ 
  activeTab, 
  selectedProject, 
  onProjectSelect, 
  onProjectClose,
  portfolioData,
  portfolioLoading,
  portfolioError,
  siteSettings,
  experiences,
  testimonials,
}) => {

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);
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
    }
  };
  
  useEffect(() => {
    handleScroll();
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [activeTab]);

  const scrollableContentWrapper = (content: React.ReactNode) => (
    <div className="relative w-full max-w-5xl mx-auto px-4 md:px-0 h-full">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className={`w-full h-full overflow-y-auto ${isScrolling ? 'scroll-visible' : 'scroll-hidden'}`}
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
      className="w-full max-w-5xl mx-auto px-4 md:px-0 max-h-screen overflow-y-auto scrollbar-hide"
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
            loading={portfolioLoading}
            error={portfolioError}
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