'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Play, Wrench, ZoomIn } from 'lucide-react';
import { ProjectData } from '@/types/sanity';
import ImageLightbox from '@/components/ui/ImageLightbox';

interface ProjectDetailProps {
  project: ProjectData;
  onClose: () => void;
}

// Extract YouTube/Vimeo embed URL
function getEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}

const ProjectDetailView: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  // Collect all media items
  const mediaItems = useMemo(() => {
    const items: { type: 'image' | 'video'; src: string; caption?: string; embedUrl?: string }[] = [];
    
    if (project.imageUrl) {
      items.push({ type: 'image', src: project.imageUrl, caption: project.coverCaption });
    }
    
    if (project.images && project.images.length > 0) {
      project.images.forEach(img => {
        const src = img.imageUrl || img.sanityImage || '';
        if (src) {
          items.push({ type: 'image', src, caption: img.caption });
        }
      });
    }
    
    if (project.videoUrl) {
      const embedUrl = getEmbedUrl(project.videoUrl);
      if (embedUrl) {
        items.push({ type: 'video', src: project.videoUrl, embedUrl, caption: 'Video' });
      }
    }
    
    return items;
  }, [project]);

  // Only image items for the lightbox (no videos)
  const imageItems = useMemo(() => 
    mediaItems.filter(m => m.type === 'image').map(m => ({ src: m.src, caption: m.caption })),
    [mediaItems]
  );

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const activeMedia = mediaItems[activeMediaIndex] || mediaItems[0];
  const hasMultipleMedia = mediaItems.length > 1;

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = () => {
    if (activeMedia?.type !== 'image') return;
    // Find which image index in imageItems corresponds to the active media
    const imgIndex = imageItems.findIndex(img => img.src === activeMedia.src);
    setLightboxIndex(imgIndex >= 0 ? imgIndex : 0);
    setLightboxOpen(true);
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full h-full max-w-5xl mx-auto px-4 md:px-0 overflow-y-auto scrollbar-hide"
        style={{ paddingTop: '1.5rem', paddingBottom: '8rem' }} 
      >
        {/* Back Button */}
        <button 
          onClick={onClose} 
          className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors text-base font-bold mb-6 mt-2 group" 
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Projects
        </button>
        
        {/* Main Media Display */}
        <div className="rounded-xl overflow-hidden mb-4 shadow-2xl">
          {activeMedia?.type === 'video' && activeMedia.embedUrl ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={activeMedia.embedUrl}
                title={project.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : activeMedia?.src ? (
            /* Clickable image with zoom hint */
            <div 
              className="relative flex items-center justify-center cursor-zoom-in group/zoom"
              onClick={handleImageClick}
            >
              <img 
                src={activeMedia.src} 
                alt={activeMedia.caption || project.title} 
                className="max-w-full max-h-[60vh] md:max-h-[500px] w-auto h-auto rounded-xl 
                           transition-transform duration-300 group-hover/zoom:scale-[1.02]"
                loading="lazy"
              />
              {/* Zoom indicator — appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center 
                              opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 shadow-lg">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Thumbnail Strip */}
        {hasMultipleMedia && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveMediaIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden 
                           border-2 transition-all duration-200
                           ${index === activeMediaIndex 
                             ? 'border-yellow-400 ring-2 ring-yellow-400/30' 
                             : 'border-transparent hover:border-white/30 opacity-60 hover:opacity-100'
                           }`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <Play className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  </div>
                ) : (
                  <img 
                    src={item.src} 
                    alt={item.caption || `Media ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* Project Details */}
        <div className="space-y-8 md:space-y-10"> 
          
          {/* Title */}
          <div className="border-l-4 border-yellow-400 pl-4 md:pl-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">
              {project.title}
            </h3>
            <p className="text-base md:text-lg font-medium text-yellow-400">
              {project.subtitle}
              {project.type && (
                <> — <span className="text-gray-400">{project.type}</span></>
              )}
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="text-lg md:text-xl font-bold text-yellow-400 mb-3 uppercase tracking-wider">
              About The Project
            </h4>
            <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Tools Used */}
          {project.toolsUsed && project.toolsUsed.length > 0 && (
            <div>
              <h4 className="text-lg md:text-xl font-bold text-yellow-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Tools Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.toolsUsed.map((tool, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-sm font-medium text-gray-200
                               hover:bg-yellow-400/10 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Links */}
          {(project.liveLink || project.videoUrl) && (
            <div className="flex flex-wrap gap-4">
              {project.liveLink && (
                <a 
                  href={project.liveLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-yellow-400 
                             text-white hover:text-black font-bold rounded-full transition-all duration-300
                             border border-white/10 hover:border-yellow-400 text-sm"
                >
                  Live Project 
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.videoUrl && (
                <a 
                  href={project.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 
                             text-white font-bold rounded-full transition-all duration-300
                             border border-white/10 text-sm"
                >
                  <Play className="w-4 h-4" />
                  Watch Video
                </a>
              )}
            </div>
          )}
          
        </div>
      </motion.div>

      {/* Image Lightbox — renders at root level (z-100) */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={imageItems}
        currentIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
      />
    </>
  );
};

export default ProjectDetailView;