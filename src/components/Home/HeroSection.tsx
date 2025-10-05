import React from 'react';
import { Mail, Linkedin, MapPin, Phone } from 'lucide-react'; 
import { motion } from 'framer-motion'; 
import IconLink from '../ui/IconLink';

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

const HeroSection: React.FC = () => {
  return (
    // Padding horizontal di desktop: md:px-24 dan lg:px-32
    <motion.div 
      className="relative z-10 px-10 pt-24 md:px-24 lg:px-32 md:pt-32 max-w-2xl w-full" 
      variants={containerVariants}
      initial="hidden" 
      animate="visible" 
    >
      
      {/* 1. Status 'Open to work' */}
      <motion.div 
        variants={itemVariants} 
        className="flex items-center space-x-2 mb-4"
      >
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </div>
        
        <span className="text-xs md:text-lg font-medium text-green-400">Open to work</span>
      </motion.div>

      {/* 2. Jabatan */}
      <motion.p 
        variants={itemVariants}
        className="text-lg md:text-2xl font-bold tracking-widest text-yellow-400 mb-2"
      >
        Designer | AI Visual
      </motion.p>

      {/* 3. Nama (Ukuran Besar dan Rapat) */}
      <motion.h1 
        variants={itemVariants}
        className="text-7xl md:text-9xl font-bold text-white mb-10 leading-none" 
      >
        Renaldo Dasilva
      </motion.h1>

      {/* 4. Info Kontak (Grid 2 Kolom) */}
      <motion.div 
        variants={itemVariants}
        // KUNCI PERBAIKAN: Gunakan grid-cols-1 default, lalu sm:grid-cols-2
        // Hapus gap-x karena di 1 kolom tidak diperlukan
        className="grid grid-cols-1 gap-y-4 md:gap-y-6 sm:grid-cols-2 sm:gap-x-6 md:gap-x-34 md:gap-y-8"
      >
        <IconLink Icon={Mail} text="renaldosemma@gmail.com" href="mailto:renaldosemma@gmail.com" className="md:text-base" />
        <IconLink Icon={Phone} text="+628 13655 80283" href="tel:+6281365580283" className="md:text-base" />
        <IconLink Icon={Linkedin} text="Renaldo Semma Dasilva" href="https://linkedin.com/in/renaldosemmadasilva" target="_blank" className="md:text-base" />
        <IconLink Icon={MapPin} text="Kundur, Indonesia" href="#" className="md:text-base" />
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;