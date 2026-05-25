'use client';

import React from 'react';
import { Home, Briefcase, FileText, Layers, Link } from 'lucide-react'; 
import { motion, LayoutGroup } from 'framer-motion';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'summary', icon: Briefcase, label: 'Summary' },
  { id: 'experience', icon: FileText, label: 'Experience' },
  { id: 'portfolio', icon: Layers, label: 'Portfolio' },
  { id: 'links', icon: Link, label: 'Links' },
];

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const isTabActive = (id: string) => id === activeTab; 

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-[calc(100%-2rem)] sm:w-auto max-w-lg sm:max-w-none">
      <LayoutGroup>
        <motion.div
          className="flex relative bg-neutral-800/60 backdrop-blur-lg p-1.5 sm:p-2 rounded-2xl sm:rounded-[2rem] shadow-2xl justify-between sm:justify-start sm:space-x-2" 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5, delay: 1 }} 
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center justify-center relative z-10 transition-colors
                
                /* Mobile: icon + mini label, better touch targets */
                flex-col gap-0.5 px-3 py-2 rounded-xl min-w-[3rem]
                
                /* Desktop: horizontal layout with label */
                sm:flex-row sm:gap-2 sm:px-4 sm:py-2.5 sm:rounded-[2rem] sm:min-w-0
                
                ${isTabActive(item.id) 
                  ? '!text-neutral-800' 
                  : 'text-gray-400 hover:text-gray-200' 
                }
              `}
            >
              
              {/* Moving Pill Background */}
              {isTabActive(item.id) && (
                <motion.div
                  layout 
                  layoutId="active-pill" 
                  transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30, 
                      mass: 0.8 
                  }}
                  className="absolute inset-0 bg-white shadow-md rounded-xl sm:rounded-[2rem] z-[-1]"
                />
              )}

              {/* Icon */}
              <item.icon 
                  className={`
                      w-5 h-5 sm:w-4 sm:h-4 transition-colors flex-shrink-0
                      ${isTabActive(item.id) ? '!text-neutral-800' : ''}
                  `} 
              />
              
              {/* Label — visible on both mobile (tiny) and desktop (normal) */}
              <span 
                  className={`
                      text-[10px] font-medium leading-tight
                      sm:text-sm
                      ${isTabActive(item.id) ? '!text-neutral-800' : ''}
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