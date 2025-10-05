'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

// Varian untuk animasi stagger dan item
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

// Data Kontak dan Sosial (Menggunakan path image)
const socialLinks = [
    { name: "Upwork", icon: "/icons/upwork.svg", url: "https://www.upwork.com/freelancers/~010c1403e9a9b67f91", color: "bg-white" },
    { name: "LinkedIn", icon: "/icons/linkedin.png", url: "https://linkedin.com/in/renaldosemmadasilva", color: "bg-black" },
];


const LinksContent: React.FC = () => {
  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto px-10 md:px-14 py-8 md:py-20"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
        
        {/* Kolom Kiri: Judul Utama */}
        <motion.div 
            variants={itemVariants}
            className="md:col-span-1"
        >
          <h2 className="text-4xl font-extrabold text-white tracking-wide mb-2 uppercase">
            Links
          </h2>
          <div className="w-12 h-1 bg-yellow-500 mt-2 rounded-full"></div>
        </motion.div>
        
        {/* Kolom Kanan: Konten Link */}
        <div className="md:col-span-2 text-gray-200">
            
            {/* Bagian 1: Social Media Icons */}
            <motion.div 
                variants={itemVariants}
                className="mb-12"
            >
                <div className="flex space-x-4">
                    {socialLinks.map((link, index) => (
                        <a 
                            key={index} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`group p-3 rounded-xl transition-transform hover:scale-105 ${link.color}`}
                            aria-label={link.name}
                        >
                            <img 
                                src={link.icon} 
                                alt={link.name}
                                className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-120"
                            />
                        </a>
                    ))}
                </div>
            </motion.div>
            
            {/* Bagian 2: Kontak Langsung */}
            <motion.div 
                variants={itemVariants}
                className="space-y-6"
            >
                <h3 className="text-xl font-bold text-white mb-2 uppercase">
                    Direct Contact
                </h3>
                
                {/* Email */}
                <a 
                    href="mailto:renaldosemma@gmail.com" 
                    className="flex items-center space-x-3 text-lg font-semibold text-gray-200 hover:text-yellow-400 transition-colors"
                >
                    <Mail className="w-5 h-5 text-yellow-400" />
                    <span>renaldosemma@gmail.com</span>
                </a>

                {/* Telepon */}
                <a 
                    href="tel:+6281365580283" 
                    className="flex items-center space-x-3 text-lg font-semibold text-gray-200 hover:text-yellow-400 transition-colors"
                >
                    <Phone className="w-5 h-5 text-yellow-400" />
                    <span>+628 13655 80283</span>
                </a>

            </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default LinksContent;