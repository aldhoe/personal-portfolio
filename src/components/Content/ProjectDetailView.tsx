'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';

// ... (Interface ProjectDetail dan ProjectDetailProps tetap sama) ...

interface ProjectDetail {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  liveLink: string;
  type: string;
}

interface ProjectDetailProps {
  project: ProjectDetail;
  onClose: () => void;
}

// Varian untuk slide-in/out halaman (dipertahankan)
const pageTransitionVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }, 
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
};

const ProjectDetailView: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  
  return (
    // Wrapper Full-Screen Konten (Scrollable Area)
    <motion.div
        variants={pageTransitionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        // Wrapper: Batasi lebar, aktifkan scrollbar-hide
        className="w-full h-full max-w-5xl mx-auto px-4 md:px-0 overflow-y-auto scrollbar-hide"
        // Padding Top/Bottom
        style={{ paddingTop: '1.5rem', paddingBottom: '8rem' }} 
    >
        {/* Tombol Back */}
        <button 
            onClick={onClose} 
            className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors text-base font-bold mb-8 mt-2" 
        >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Project List
        </button>
        
        {/* KUNCI PERBAIKAN: Gambar Proyek (Menghilangkan aspect-ratio) */}
        <div className="rounded-xl overflow-hidden mb-8 shadow-2xl max-w-xl">
            <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-auto object-cover" // Menggunakan h-auto untuk mempertahankan rasio
            />
        </div>
        
        {/* Detail Proyek */}
        <div className="space-y-10 md:space-y-12"> 
            
            {/* Title Section */}
            <div className="border-l-4 border-yellow-400 pl-4 md:pl-6">
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    {project.title}
                </h3>
                <p className="text-lg font-medium text-yellow-400">
                    {project.subtitle} - <span className="text-gray-400">{project.type}</span>
                </p>
            </div>


            {/* About The Project */}
            <div>
                <h4 className="text-xl font-bold text-yellow-400 mb-4 uppercase tracking-wider">
                    About The Project
                </h4>
                <p className="text-gray-300 leading-relaxed text-base">
                    {project.description}
                </p>
            </div>
            
            {/* Live Project Link */}
            <a 
                href={project.liveLink} 
                target="_blank" 
                className="inline-flex items-center text-white font-bold hover:text-yellow-300 transition-colors text-base"
            >
                Live Project 
                <ExternalLink className="w-5 h-5 ml-2" />
            </a>
            
        </div>
    </motion.div>
  );
};

export default ProjectDetailView;