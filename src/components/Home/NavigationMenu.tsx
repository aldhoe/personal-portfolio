'use client'; 

import React, { useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationMenuProps {
  activeTab: string;
  cvUrl?: string;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ activeTab, cvUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Use CMS URL if available, fallback to /cv.pdf
  const cvHref = cvUrl || '/cv.pdf';
  const isExternal = cvUrl?.startsWith('http');

  return (
    <AnimatePresence>
      {(activeTab === 'home' || activeTab === 'links') && (
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 right-0 px-10 pt-10 md:px-14 md:pt-14 z-20 flex justify-end"
        >
          
          <motion.a 
            href={cvHref}
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            
            className="flex items-center justify-center px-4 py-3 text-sm font-semibold 
                       bg-yellow-400 rounded-full transition-colors duration-300
                       hover:bg-white text-center shadow-lg relative overflow-hidden 
                       min-w-[130px]" 
          >
            <div className="relative flex items-center w-full h-5">
                
                <motion.span
                    initial={false}
                    animate={{ 
                        opacity: isHovered ? 0 : 1, 
                        y: isHovered ? 20 : 0,
                        color: isHovered ? '#000000' : '#000000' 
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center font-bold whitespace-nowrap" 
                >
                    Download CV
                </motion.span>

                <motion.div
                    initial={false}
                    animate={{ 
                        opacity: isHovered ? 1 : 0, 
                        y: isHovered ? 0 : -20, 
                        color: isHovered ? '#000000' : '#000000'
                    }}
                    transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <ArrowDownToLine className="w-4 h-4" />
                </motion.div>
            </div>
          </motion.a>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default NavigationMenu;