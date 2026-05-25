'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import NavigationMenu from '@/components/Home/NavigationMenu';
import TabNavigation from '@/components/Home/TabNavigation';
import ContentContainer from '@/components/ContentContainer';
import { motion, AnimatePresence } from 'framer-motion'; 
import { client } from '@/lib/sanity';
import { 
  ProjectData, 
  PortfolioCategory, 
  SiteSettings, 
  ExperienceData, 
  TestimonialData 
} from '@/types/sanity';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
  const profileImageUrl = '/images/profile-dark-bg.jpg'; 
  
  const isHome = activeTab === 'home';
  const isBlurTarget = activeTab !== 'home' && activeTab !== 'links';
  const [isBlurActive, setIsBlurActive] = useState(isBlurTarget); 
  
  // Project detail state
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // ============================
  // CMS DATA STATE
  // ============================
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);

  // Portfolio data caching
  const [portfolioData, setPortfolioData] = useState<PortfolioCategory[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const portfolioFetched = useRef(false);

  // ============================
  // FETCH CMS DATA ON MOUNT
  // ============================
  useEffect(() => {
    fetchCmsData();
  }, []);

  const fetchCmsData = async () => {
    try {
      const [settings, exps, tests] = await Promise.all([
        // Site Settings (singleton)
        client.fetch(`*[_type == "siteSettings"][0] {
          name,
          jobTitle,
          isOpenToWork,
          profileImageUrl,
          cvFileUrl,
          contactInfo[] {
            type,
            label,
            url
          },
          summaryParagraphs,
          summaryQuote,
          skills,
          tools[] {
            name,
            iconUrl,
            "sanityIcon": icon.asset->url
          },
          socialLinks[] {
            name,
            iconUrl,
            "sanityIcon": icon.asset->url,
            url,
            bgColor
          }
        }`),
        // Experience entries
        client.fetch(`*[_type == "experience"] | order(order asc) {
          jobTitle,
          company,
          startYear,
          endYear,
          description,
          responsibilities,
          order
        }`),
        // Testimonials
        client.fetch(`*[_type == "testimonial"] | order(order asc) {
          name,
          role,
          content,
          avatarUrl,
          "avatarSanity": avatar.asset->url,
          rating,
          order
        }`),
      ]);

      if (settings) setSiteSettings(settings);
      if (exps) setExperiences(exps);
      if (tests) {
        // Merge avatar sources
        const mergedTests = tests.map((t: any) => ({
          ...t,
          avatarUrl: t.avatarUrl || t.avatarSanity || undefined,
        }));
        setTestimonials(mergedTests);
      }
    } catch (err) {
      console.error('Error fetching CMS data:', err);
      // Components will use fallback data
    }
  };

  // ============================
  // PORTFOLIO DATA FETCH (Cached)
  // ============================
  useEffect(() => {
    if (activeTab === 'portfolio' && !portfolioFetched.current) {
      fetchPortfolioData();
    }
  }, [activeTab]);

  const fetchPortfolioData = async () => {
    try {
      setPortfolioLoading(true);
      const query = `*[_type == "portfolioCategory"] | order(order asc) {
        category,
        "items": items[]-> {
          title,
          description,
          subtitle,
          toolsUsed,
          "imageUrl": imageUrl.asset->url,
          coverCaption,
          videoUrl,
          liveLink,
          type,
          "images": galleryImages[] {
            "imageUrl": imageUrl,
            "sanityImage": image.asset->url,
            caption
          }
        }
      }`;
      
      const [data] = await Promise.all([
        client.fetch(query),
        new Promise(resolve => setTimeout(resolve, 800))
      ]);
      
      setPortfolioData(data);
      portfolioFetched.current = true;
      setPortfolioLoading(false);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setPortfolioError('Failed to load portfolio data');
      setPortfolioLoading(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    setSelectedProject(null);
    setActiveTab(tabId);
  };
  
  const handleProjectClose = () => {
    setSelectedProject(null);
  };
  
  useEffect(() => {
    setIsBlurActive(isBlurTarget || selectedProject !== null); 
  }, [isBlurTarget, selectedProject]);

  const showTabNavigation = selectedProject === null;

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col bg-black"> 
      
      {/* Initial Load Overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, pointerEvents: 'none' }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="fixed inset-0 bg-black z-40"
      />

      <NavigationMenu activeTab={activeTab} />

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
          px-6 sm:px-10 md:px-24 lg:px-32 py-20 
        "
      >
        <ContentContainer 
          activeTab={activeTab} 
          selectedProject={selectedProject} 
          onProjectSelect={setSelectedProject}
          onProjectClose={handleProjectClose}
          portfolioData={portfolioData}
          portfolioLoading={portfolioLoading}
          portfolioError={portfolioError}
          siteSettings={siteSettings}
          experiences={experiences}
          testimonials={testimonials}
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