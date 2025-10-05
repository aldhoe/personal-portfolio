'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CornerRightUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { client } from '@/lib/sanity';

interface ProjectData {
    title: string;
    description: string;
    subtitle: string;
    achievements: string;
    imageUrl: string;
    liveLink: string;
    type: string;
}

interface PortfolioContentProps {
    onCardClick: (project: ProjectData) => void;
}

// KUNCI: Single parent container variant
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.12, // Jarak antar elemen (natural flow)
    } 
  },
};

// Item muncul dari bawah dengan smooth
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    } 
  }, 
};

const PortfolioContent: React.FC<PortfolioContentProps> = ({ onCardClick }) => {
  const [portfolioData, setPortfolioData] = useState<{ category: string; items: ProjectData[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollStates, setScrollStates] = useState<{ canScrollLeft: boolean; canScrollRight: boolean }[]>([]);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const query = `*[_type == "portfolioCategory"] | order(order asc) {
          category,
          "items": items[]-> {
            title,
            description,
            subtitle,
            achievements,
            "imageUrl": imageUrl.asset->url,
            liveLink,
            type
          }
        }`;
        
        const [data] = await Promise.all([
          client.fetch(query),
          new Promise(resolve => setTimeout(resolve, 500)) // Min 500ms delay
        ]);
        
        setPortfolioData(data);
        setScrollStates(data.map(() => ({ canScrollLeft: false, canScrollRight: true })));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio data');
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const checkScrollability = (index: number) => {
    const container = scrollContainerRefs.current[index];
    if (!container) return;

    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 1;

    setScrollStates(prev => {
      const newStates = [...prev];
      newStates[index] = { canScrollLeft, canScrollRight };
      return newStates;
    });
  };

  useEffect(() => {
    const containers = scrollContainerRefs.current;
    
    const handleScroll = (index: number) => () => checkScrollability(index);
    const handleResize = () => {
      containers.forEach((_, index) => checkScrollability(index));
    };

    containers.forEach((container, index) => {
      if (container) {
        container.addEventListener('scroll', handleScroll(index));
        checkScrollability(index); // Initial check
      }
    });

    window.addEventListener('resize', handleResize);

    return () => {
      containers.forEach((container, index) => {
        if (container) {
          container.removeEventListener('scroll', handleScroll(index));
        }
      });
      window.removeEventListener('resize', handleResize);
    };
  }, [portfolioData]);

  const scroll = (index: number, direction: 'left' | 'right') => {
    const container = scrollContainerRefs.current[index];
    if (!container) return;
    
    const scrollAmount = 300;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-light tracking-wide">Loading</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-1">Failed to load</p>
          <p className="text-gray-600 text-xs">Please try again</p>
        </div>
      </div>
    );
  }

  if (portfolioData.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p className="text-gray-600 text-sm">No projects found</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto px-6 md:px-10 lg:px-14 py-8 md:py-20 overflow-x-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Judul Utama (Item 1) */}
      <motion.div 
        variants={itemVariants} 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-12"
      >
        <div className="md:col-span-1">
          <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2 uppercase">
            Projects
          </h2>
          <div className="w-12 h-1 bg-yellow-500 mt-2 rounded-full"></div>
        </div>
        
        <div className="md:col-span-2 text-gray-200">
          <p className="text-base md:text-lg leading-relaxed">
            This collection highlights selected projects combining design expertise, development, and AI-driven visual exploration.
          </p>
        </div>
      </motion.div>

      {/* Kategori & Cards (Items 2, 3, 4...) */}
      <div className="space-y-16 mt-12">
        {portfolioData.map((category, categoryIndex) => (
          <motion.div 
            key={categoryIndex}
            variants={itemVariants} // Setiap kategori = 1 item dalam stagger
          >
            {/* Category Title */}
            <h3 className="text-2xl font-bold text-white tracking-wider mb-6 ml-1 uppercase">
              {category.category}
            </h3>

            {/* Scroll Horizontal Cards */}
            <div className="relative group/scroll">
              {/* Left Arrow - Only show if more than 3 items and can scroll left */}
              {category.items.length > 3 && scrollStates[categoryIndex]?.canScrollLeft && (
                <button
                  onClick={() => scroll(categoryIndex, 'left')}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 
                           items-center justify-center w-10 h-10 rounded-full 
                           bg-neutral-900/90 hover:bg-neutral-800 
                           text-white/70 hover:text-yellow-400
                           opacity-0 group-hover/scroll:opacity-100
                           transition-all duration-300 -translate-x-5
                           shadow-lg backdrop-blur-sm"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Right Arrow - Only show if more than 3 items and can scroll right */}
              {category.items.length > 3 && scrollStates[categoryIndex]?.canScrollRight && (
                <button
                  onClick={() => scroll(categoryIndex, 'right')}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 
                           items-center justify-center w-10 h-10 rounded-full 
                           bg-neutral-900/90 hover:bg-neutral-800 
                           text-white/70 hover:text-yellow-400
                           opacity-0 group-hover/scroll:opacity-100
                           transition-all duration-300 translate-x-5
                           shadow-lg backdrop-blur-sm"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              <div 
                ref={(el) => scrollContainerRefs.current[categoryIndex] = el}
                className="flex overflow-x-auto space-x-6 pb-4 pt-1 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
              >
                {category.items.map((item, itemIndex) => (
                  <motion.div 
                    key={itemIndex}
                    onClick={() => onCardClick(item)} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.01, margin: "0px 100px 0px 0px" }}
                    transition={{ 
                      duration: 0.4, 
                      delay: itemIndex * 0.1, // Stagger untuk cards dalam 1 kategori
                      ease: "easeOut" 
                    }}
                    className="group relative flex-shrink-0 snap-center rounded-2xl overflow-hidden shadow-xl 
                             bg-neutral-900/80 hover:bg-neutral-800/90 transition duration-300
                             w-[75vw] max-w-[280px] md:w-72 h-[320px] cursor-pointer" 
                  >
                    <div className="relative w-full h-full">
                      <img 
                        src={item.imageUrl || '/mockups/placeholder.png'} 
                        alt={item.title} 
                        onError={(e) => e.currentTarget.src = '/mockups/placeholder.png'}
                        className="w-full h-full object-cover transition-transform duration-500 scale-110 group-hover:scale-100" 
                      />
                      
                      <div className="absolute inset-0 z-10 bg-black/20 transition-opacity duration-500 group-hover:opacity-0" />
                      
                      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white 
                                    bg-gradient-to-t from-black/80 via-black/0 to-transparent">
                        <span className="text-sm text-yellow-400 font-medium uppercase mb-1">
                          {item.type}
                        </span>
                        <h4 className="text-2xl font-extrabold">
                          {item.title}
                        </h4>
                        
                        <CornerRightUp className="absolute top-4 right-4 w-6 h-6 text-white/50 group-hover:text-yellow-400 transition-colors duration-300" />
                      </div>
                    </div>
                  </motion.div> 
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PortfolioContent;