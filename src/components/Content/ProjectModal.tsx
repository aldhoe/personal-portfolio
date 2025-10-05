'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';

// Definisikan tipe data untuk proyek
interface ProjectDetail {
  title: string;
  subtitle: string;
  description: string;
  achievements: string;
  imageUrl: string;
  liveLink: string;
}

interface ProjectModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

// Varian animasi untuk modal
const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

// Varian untuk card konten agar pop-in dari bawah
const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  exit: { y: 50, opacity: 0, transition: { duration: 0.2 } },
};

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          // Overlay Hitam
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={onClose} // Tutup modal saat klik di luar card
        >
          {/* Card Konten Utama */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-4xl mx-auto bg-neutral-900 rounded-xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()} // Cegah penutupan saat klik di dalam card
          >
            {/* Tombol Back */}
            <button 
                onClick={onClose} 
                className="absolute top-4 left-4 z-10 flex items-center text-gray-400 hover:text-white transition-colors text-sm font-semibold"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home Page
            </button>
            
            {/* Gambar Proyek */}
            <div className="rounded-t-xl overflow-hidden aspect-video">
                <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover" 
                />
            </div>
            
            {/* Detail Proyek */}
            <div className="p-8 space-y-6">
                <h3 className="text-4xl font-extrabold text-yellow-400">
                    {project.title}
                </h3>
                <p className="text-xl font-medium text-white mb-4">
                    {project.subtitle}
                </p>

                {/* About The Project */}
                <div>
                    <h4 className="text-xl font-bold text-white mb-3">About The Project</h4>
                    <p className="text-gray-400 leading-relaxed">
                        {project.description}
                    </p>
                </div>
                
                {/* Achievements */}
                <div>
                    <h4 className="text-xl font-bold text-white mb-3">Achievements</h4>
                    <p className="text-green-400 font-semibold leading-relaxed">
                        {project.achievements}
                    </p>
                </div>

                {/* Live Project Link */}
                <a 
                    href={project.liveLink} 
                    target="_blank" 
                    className="inline-flex items-center text-yellow-400 font-bold hover:text-yellow-300 transition-colors"
                >
                    Live Project 
                    <ExternalLink className="w-5 h-5 ml-2" />
                </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;