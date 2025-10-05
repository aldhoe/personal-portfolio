'use client';

import React, { useRef, useState, useEffect } from 'react'; 
import { AnimatePresence, motion } from 'framer-motion';
import HeroSection from './Home/HeroSection'; 
import { SummaryContent } from './Content/SummaryContent'; 
import ExperienceContent from './Content/ExperienceContent'; 
import PortfolioContent from './Content/PortfolioContent'; 
import ProjectDetailView from './Content/ProjectDetailView';
import LinksContent from './Content/LinksContent'; 

interface ProjectData {
    title: string;
    description: string;
    subtitle: string;
    achievements: string;
    imageUrl: string;
    liveLink: string;
    type: string;
}

interface ContentContainerProps {
  activeTab: string;
  selectedProject: ProjectData | null;
  onProjectSelect: (project: ProjectData) => void;
  onProjectClose: () => void;
}

const transitionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.01 } }, 
  exit: { opacity: 0, transition: { duration: 0 } }, 
};

const ContentContainer: React.FC<ContentContainerProps> = ({ 
  activeTab, 
  selectedProject, 
  onProjectSelect, 
  onProjectClose 
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

    // Deteksi posisi scroll untuk fade gradient
    const element = scrollRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      
      // Show top fade kalo udah scroll ke bawah
      setShowTopFade(scrollTop > 50);
      
      // Show bottom fade kalo belum sampe paling bawah
      setShowBottomFade(scrollTop + clientHeight < scrollHeight - 50);
    }
  };
  
  useEffect(() => {
    // Check initial scroll position
    handleScroll();
    
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [activeTab]);

  // Wrapper untuk konten scrollable dengan dynamic gradient masks
  const scrollableContentWrapper = (content: React.ReactNode) => (
    <div className="relative w-full max-w-5xl mx-auto px-4 md:px-0 h-full">
      {/* Scrollable Content with CSS Mask */}
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

  // Wrapper untuk konten non-scrollable (tanpa mask)
  const commonContentWrapper = (content: React.ReactNode) => (
    <div 
      className="w-full max-w-5xl mx-auto px-4 md:px-0 max-h-screen overflow-y-auto scrollbar-hide"
      style={{ paddingTop: '2rem', paddingBottom: '9rem' }} 
    >
      {content}
    </div>
  );

  const renderContent = () => {
    if (selectedProject) {
      return <ProjectDetailView project={selectedProject} onClose={onProjectClose} />;
    }

    switch (activeTab) {
      case 'home':
        return <HeroSection />;
        
      case 'summary':
        return commonContentWrapper(<SummaryContent />);
        
      case 'experience':
        return scrollableContentWrapper(<ExperienceContent />);
        
      case 'portfolio':
        return scrollableContentWrapper(<PortfolioContent onCardClick={onProjectSelect} />);
        
      case 'links':
        return commonContentWrapper(<LinksContent />);
        
      default:
        return <HeroSection />;
    }
  };

  const showPageOverlay = activeTab !== 'home' && activeTab !== 'links';

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={selectedProject ? 'detail-view' : activeTab} 
        variants={transitionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`w-full h-full z-10 
          ${showPageOverlay 
            ? 'absolute inset-0 flex items-start justify-center pt-20 bg-neutral-900/20 backdrop-blur-xl'
            : 'flex items-center justify-start h-full'
          }
        `}
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
};

export default ContentContainer;