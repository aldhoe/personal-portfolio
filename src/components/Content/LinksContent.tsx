'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { SocialLink, ContactItem } from '@/types/sanity';

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

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
    case 'phone': return WhatsappIcon;
    case 'email':
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
                <div className="flex flex-wrap items-center gap-4">
                    {socialData.map((link, index) => {
                      const iconSrc = link.iconUrl || link.sanityIcon || '';

                      return (
                        <a 
                            key={index} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`group w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl overflow-hidden transition-all duration-300 hover:scale-110 ${
                              link.bgColor || ''
                            }`}
                            aria-label={link.name}
                        >
                            {iconSrc ? (
                              <img 
                                src={iconSrc} 
                                alt={link.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xl text-white bg-neutral-700">
                                {link.name.charAt(0)}
                              </div>
                            )}
                        </a>
                      );
                    })}
                </div>
            </motion.div>
            
            {/* CTA / Direct Contact */}
            {contactData.length > 0 && (
              <motion.div 
                  variants={itemVariants}
                  className="mt-16 bg-neutral-900/40 border border-white/5 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
              >
                  {/* Subtle Background Glows */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none"></div>

                  <div className="relative z-10">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                        Have an <span className="text-yellow-400">Idea?</span> Let's Talk.
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
                        I'm currently available for freelance work and open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      {contactData.map((contact, index) => {
                        const isEmail = contact.type === 'email';
                        const Icon = getContactIcon(contact.type);
                        
                        return isEmail ? (
                          <a 
                            key={index}
                            href={contact.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2.5 bg-yellow-400 hover:bg-yellow-500 text-black px-7 py-3.5 rounded-full font-bold transition-all duration-300 hover:scale-105 w-full sm:w-auto shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                          >
                            <Icon className="w-5 h-5" />
                            <span>Drop an Email</span>
                          </a>
                        ) : (
                          <a 
                            key={index}
                            href={contact.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-7 py-3.5 rounded-full font-bold transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                          >
                            <Icon className="w-5 h-5" />
                            <span>WhatsApp Me</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
              </motion.div>
            )}

        </div>
      </div>
    </motion.div>
  );
};

export default LinksContent;