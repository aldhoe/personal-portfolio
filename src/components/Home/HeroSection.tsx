'use client';

import React from 'react';
import { Mail, Linkedin, MapPin, Phone, LucideIcon } from 'lucide-react'; 
import { motion } from 'framer-motion'; 
import IconLink from '../ui/IconLink';
import { ContactItem } from '@/types/sanity';

interface HeroSectionProps {
  name?: string;
  jobTitle?: string;
  isOpenToWork?: boolean;
  contactInfo?: ContactItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, 
      delayChildren: 0.3, 
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 }, 
  visible: { y: 0, opacity: 1 }, 
};

// Map contact type to icon
const contactIconMap: Record<string, LucideIcon> = {
  email: Mail,
  phone: Phone,
  linkedin: Linkedin,
  location: MapPin,
};

// Fallback data
const fallbackContactInfo: ContactItem[] = [
  { type: 'email', label: 'renaldosemma@gmail.com', url: 'mailto:renaldosemma@gmail.com' },
  { type: 'phone', label: '+62 813 6558 0283', url: 'tel:+6281365580283' },
  { type: 'linkedin', label: 'Renaldo Semma Dasilva', url: 'https://linkedin.com/in/renaldosemmadasilva' },
  { type: 'location', label: 'Kundur, Indonesia', url: '#' },
];

const HeroSection: React.FC<HeroSectionProps> = ({
  name = 'Renaldo Dasilva',
  jobTitle = 'Designer | AI Visual',
  isOpenToWork = true,
  contactInfo,
}) => {
  const contacts = contactInfo && contactInfo.length > 0 ? contactInfo : fallbackContactInfo;

  return (
    <motion.div 
      className="relative z-10 px-6 sm:px-10 pt-24 md:px-24 lg:px-32 md:pt-32 max-w-2xl w-full" 
      variants={containerVariants}
      initial="hidden" 
      animate="visible" 
    >
      
      {/* Availability Badge */}
      <motion.div 
        variants={itemVariants} 
        className="flex items-center space-x-2 mb-4"
      >
        {isOpenToWork ? (
          // Open to Work — Green
          <>
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <span className="text-xs md:text-lg font-medium text-green-400">Open to work</span>
          </>
        ) : (
          // Currently Not Available — Red
          <>
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
            <span className="text-xs md:text-lg font-medium text-red-400">Currently not available</span>
          </>
        )}
      </motion.div>

      {/* Job Title */}
      <motion.p 
        variants={itemVariants}
        className="text-base sm:text-lg md:text-2xl font-bold tracking-widest text-yellow-400 mb-2"
      >
        {jobTitle}
      </motion.p>

      {/* Name — responsive font sizing */}
      <motion.h1 
        variants={itemVariants}
        className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-10 leading-none" 
      >
        {name}
      </motion.h1>

      {/* Contact Info Grid — auto-wrap, scalable */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 gap-y-4 md:gap-y-6 sm:grid-cols-2 sm:gap-x-6 md:gap-x-16 lg:gap-x-24 md:gap-y-8"
      >
        {contacts.map((contact, index) => {
          const Icon = contactIconMap[contact.type] || Mail;
          const isExternal = contact.type === 'linkedin';
          return (
            <IconLink 
              key={index}
              Icon={Icon} 
              text={contact.label} 
              href={contact.url}
              target={isExternal ? '_blank' : '_self'}
              className="md:text-base" 
            />
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;