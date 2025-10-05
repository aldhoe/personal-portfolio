'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Impor ikon-ikon tools (Ini harus Anda sediakan atau instal dari library ikon seperti Lucide React)
// Contoh: import { Figma, Photoshop, Illustrator, Sketch, Blender } from 'lucide-react';
// Untuk demo ini, saya asumsikan ada SVG atau komponen React untuk setiap ikon.
// Jika tidak ada, Anda bisa menggunakan tag <img> dengan path ke aset gambar.

// Asumsi: Anda memiliki komponen SVG atau gambar di folder assets/icons/
// Untuk contoh ini, saya akan menggunakan placeholder atau Anda bisa menggantinya.
const FramerIcon = () => 
  <img src="/icons/framer.svg" alt="Framer" className="w-12 h-12 md:w-16 md:h-16 object-contain" />;
const FigmaIcon = () => 
  <img src="/icons/figma.svg" alt="Figma" className="w-12 h-12 md:w-16 md:h-16 object-contain" />;
const PhotoshopIcon = () => 
  <img src="/icons/photoshop.svg" alt="Photoshop" className="w-12 h-12 md:w-16 md:h-16 object-contain" />;
const IllustratorIcon = () => 
  <img src="/icons/illustrator.svg" alt="Illustrator" className="w-12 h-12 md:w-16 md:h-16 object-contain" />;
const SketchIcon = () => 
  <img src="/icons/sketch.svg" alt="Sketch" className="w-12 h-12 md:w-16 md:h-16 object-contain" />;
const MidjourneyIcon = () => 
  <img src="/icons/midjourney.svg" alt="Midjourney" className="w-12 h-12 md:w-16 md:h-16 object-contain" />;
const SplineIcon = () => 
  <img src="/icons/spline.svg" alt="Spline" className="w-12 h-12 md:w-16 md:h-16 object-contain" />;
const BlenderIcon = () => 
  <img src="/icons/blender.svg" alt="Blender" className="w-12 h-12 md:w-16 md:h-16 object-contain" />;


const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.1, 
      delay: 0,    
      when: "beforeChildren",
      staggerChildren: 0.2 
    } 
  },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }, 
};

// Varian untuk ikon tools (bisa disamakan atau disesuaikan)
const toolIconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


const ExperienceContent: React.FC = () => {
  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto px-10 md:px-14 py-8 md:py-20"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
        
        {/* Kolom Kiri: Judul Utama Work Experience */}
        <motion.div 
            variants={itemVariants}
            className="md:col-span-1"
        >
          <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2 uppercase">
            Work Experience
          </h2>
          <div className="w-12 h-1 bg-yellow-500 mt-2 rounded-full"></div>
        </motion.div>
        
        {/* Kolom Kanan: Konten Timeline Work Experience */}
        <div className="md:col-span-2 text-gray-200">

          {/* === BLOK PENGALAMAN 1: Creative Solutions Agency === */}
          <motion.div 
            variants={itemVariants} 
            className="relative pb-12 border-l border-gray-700 pl-4 md:pl-6"
          >
            
            <div className="absolute -left-1.5 top-0 w-3 h-3 bg-yellow-400 rounded-full"></div>

            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase">
                        GRAPHIC DESIGNER
                    </p>
                    <p className="text-base text-yellow-400">
                        Rezolva
                    </p>
                </div>
                <span className="text-sm font-bold text-gray-400 whitespace-nowrap pt-1">
                    2024 – 2025
                </span>
            </div>

            <p className="text-base leading-relaxed mb-6">
                At Creative Solutions Agency, I lead design efforts on a range of high-profile projects, focusing on enhancing user experience across multiple platforms, from web to mobile applications. I collaborate closely with developers and stakeholders to ensure that design solutions meet both user needs and business objectives.
            </p>

            <h4 className="text-sm font-semibold text-yellow-400 mb-2 uppercase">
                Key Responsibilities:
            </h4>
            <ul className="list-disc list-outside space-y-2 text-sm ml-5">
                <li>Conducted user research and usability testing to drive design decisions</li>
                <li>Created wireframes, prototypes, and high-fidelity visual designs</li>
                <li>Developed and maintained design systems for consistent branding and user experience</li>
            </ul>

          </motion.div>

          {/* === BLOK PENGALAMAN 2: Junior Graphic Designer === */}
          <motion.div 
            variants={itemVariants} 
            className="relative pb-12 border-l border-gray-700 pl-4 md:pl-6 mt-6"
          >
            <div className="absolute -left-1.5 top-0 w-3 h-3 bg-yellow-400 rounded-full"></div>

            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase">
                        VIDEO EDITOR
                    </p>
                    <p className="text-base text-yellow-400">
                        Farrel Studio
                    </p>
                </div>
                <span className="text-sm font-bold text-gray-400 whitespace-nowrap pt-1">
                    2016 – 2023
                </span>
                </div>

            <p className="text-base leading-relaxed mb-6">
                Assisted the lead designer in developing brand assets and marketing materials. Focused on optimizing visual content for social media and website deployment.
            </p>

            <h4 className="text-sm font-semibold text-yellow-400 mb-2 uppercase">
                Key Responsibilities:
            </h4>
            <ul className="list-disc list-outside space-y-2 text-sm ml-5">
                <li>Designed promotional graphics for weekly campaigns.</li>
                <li>Managed and maintained the company's digital asset library.</li>
            </ul>

          </motion.div>
          
        </div>
        
      </div>

      {/* ========================================================= */}
      {/* BAGIAN BARU: SKILLS & TOOLS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mt-20 md:mt-24 pt-10">
        
        {/* Kolom Kiri: Judul Skills & Tools */}
        <motion.div 
            variants={itemVariants} 
            className="md:col-span-1"
        >
          <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2 uppercase">
            Skills & Tools
          </h2>
          <div className="w-12 h-1 bg-yellow-500 mt-2 rounded-full"></div>
        </motion.div>

        {/* Kolom Kanan: Daftar Skills dan Ikon Tools */}
        <div className="md:col-span-2 font-bold text-gray-200">
            {/* Sub-bagian Skills */}
            <motion.div variants={itemVariants} className="mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-base">
                    <p className="flex items-center"><span className="text-yellow-400 text-lg mr-2">&bull;</span> Creative Direction</p>
                    <p className="flex items-center"><span className="text-yellow-400 text-lg mr-2">&bull;</span> Video Editing</p>
                    <p className="flex items-center"><span className="text-yellow-400 text-lg mr-2">&bull;</span> Generative AI</p>
                    <p className="flex items-center"><span className="text-yellow-400 text-lg mr-2">&bull;</span> Visual Design</p>
                    <p className="flex items-center"><span className="text-yellow-400 text-lg mr-2">&bull;</span> Photo Editing</p>
                    <p className="flex items-center"><span className="text-yellow-400 text-lg mr-2">&bull;</span> Visual Effects</p>
                </div>
            </motion.div>

            {/* Sub-bagian Tools */}
            <motion.div variants={itemVariants} className="mt-8">
                <h3 className="text-xl font-bold text-yellow-500 mb-6">Tools</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
                    <motion.div variants={toolIconVariants} className="flex flex-col items-center justify-center text-center">
                        <FramerIcon />
                        <span className="text-sm font-bold text-white mt-2">Framer</span>
                    </motion.div>
                    <motion.div variants={toolIconVariants} className="flex flex-col items-center justify-center text-center">
                        <FigmaIcon />
                        <span className="text-sm font-bold text-white mt-2">Figma</span>
                    </motion.div>
                    <motion.div variants={toolIconVariants} className="flex flex-col items-center justify-center text-center">
                        <PhotoshopIcon />
                        <span className="text-sm font-bold text-white mt-2">Photoshop</span>
                    </motion.div>
                    <motion.div variants={toolIconVariants} className="flex flex-col items-center justify-center text-center">
                        <IllustratorIcon />
                        <span className="text-sm font-bold text-white mt-2">Illustrator</span>
                    </motion.div>
                    <motion.div variants={toolIconVariants} className="flex flex-col items-center justify-center text-center">
                        <SketchIcon />
                        <span className="text-sm font-bold text-white mt-2">Sketch</span>
                    </motion.div>
                    <motion.div variants={toolIconVariants} className="flex flex-col items-center justify-center text-center">
                        <MidjourneyIcon />
                        <span className="text-sm font-bold text-white mt-2">Midjourney</span>
                    </motion.div>
                    <motion.div variants={toolIconVariants} className="flex flex-col items-center justify-center text-center">
                        <SplineIcon />
                        <span className="text-sm font-bold text-white mt-2">Spline</span>
                    </motion.div>
                    <motion.div variants={toolIconVariants} className="flex flex-col items-center justify-center text-center">
                        <BlenderIcon />
                        <span className="text-sm font-bold text-white mt-2">Blender</span>
                    </motion.div>
                </div>
            </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceContent;