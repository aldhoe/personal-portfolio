'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { SocialLink, ContactItem } from '@/types/sanity';

interface LinksContentProps {
  socialLinks?: SocialLink[];
  contactInfo?: ContactItem[];
}

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      delay: 0,    
      when: "beforeChildren",
      staggerChildren: 0.1
    } 
  },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, 
};

// Fallback data
const fallbackSocialLinks: SocialLink[] = [
  { name: "Upwork", iconUrl: "/icons/upwork.svg", url: "https://www.upwork.com/freelancers/~010c1403e9a9b67f91", bgColor: "bg-white" },
  { name: "LinkedIn", iconUrl: "/icons/linkedin.png", url: "https://linkedin.com/in/renaldosemmadasilva", bgColor: "bg-black" },
];

const fallbackContactInfo: ContactItem[] = [
  { type: "email", label: "renaldosemma@gmail.com", url: "mailto:renaldosemma@gmail.com" },
  { type: "phone", label: "+62 813 6558 0283", url: "tel:+6281365580283" },
];

// Map contact type to icon
const getContactIcon = (type: string) => {
  switch (type) {
    case 'email': return Mail;
    case 'phone': return Phone;
    default: return Mail;
  }
};

const LinksContent: React.FC<LinksContentProps> = ({ socialLinks, contactInfo }) => {
  const socialData = socialLinks && socialLinks.length > 0 ? socialLinks : fallbackSocialLinks;
  const contactData = contactInfo 
    ? contactInfo.filter(c => c.type === 'email' || c.type === 'phone')
    : fallbackContactInfo;

  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto px-6 sm:px-10 md:px-14 py-8 md:py-20"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
        
        {/* Kolom Kiri: Judul */}
        <motion.div 
            variants={itemVariants}
            className="md:col-span-1"
        >
          <h2 className="text-4xl font-extrabold text-white tracking-wide mb-2 uppercase">
            Links
          </h2>
          <div className="w-12 h-1 bg-yellow-500 mt-2 rounded-full"></div>
        </motion.div>
        
        {/* Kolom Kanan: Content */}
        <div className="md:col-span-2 text-gray-200">
            
            {/* Social Media Icons — flex-wrap for scalability */}
            <motion.div 
                variants={itemVariants}
                className="mb-12"
            >
                <div className="flex flex-wrap gap-4">
                    {socialData.map((link, index) => {
                      const iconSrc = link.iconUrl || link.sanityIcon || '';
                      return (
                        <a 
                            key={index} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`group p-3 rounded-xl transition-transform hover:scale-105 ${link.bgColor || 'bg-white'}`}
                            aria-label={link.name}
                        >
                            {iconSrc ? (
                              <img 
                                src={iconSrc} 
                                alt={link.name}
                                loading="lazy"
                                className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-10 h-10 flex items-center justify-center font-bold text-lg">
                                {link.name.charAt(0)}
                              </div>
                            )}
                        </a>
                      );
                    })}
                </div>
            </motion.div>
            
            {/* Direct Contact */}
            {contactData.length > 0 && (
              <motion.div 
                  variants={itemVariants}
                  className="space-y-6"
              >
                  <h3 className="text-xl font-bold text-white mb-2 uppercase">
                      Direct Contact
                  </h3>
                  
                  {contactData.map((contact, index) => {
                    const Icon = getContactIcon(contact.type);
                    return (
                      <a 
                        key={index}
                        href={contact.url} 
                        className="flex items-center space-x-3 text-lg font-semibold text-gray-200 hover:text-yellow-400 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-yellow-400" />
                        <span>{contact.label}</span>
                      </a>
                    );
                  })}
              </motion.div>
            )}

        </div>
      </div>
    </motion.div>
  );
};

export default LinksContent;