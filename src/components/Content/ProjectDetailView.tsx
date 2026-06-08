'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Play, Wrench, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectData } from '@/types/sanity';
import ImageLightbox from '@/components/ui/ImageLightbox';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { useData } from '@/providers/DataProvider';

interface ProjectDetailProps {
  project: ProjectData;
  onClose: () => void;
  onProjectSelect: (project: ProjectData) => void;
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

const ProjectDetailView: React.FC<ProjectDetailProps> = ({ project, onClose, onProjectSelect }) => {
  const { portfolioData } = useData();

  // Collect all media items
  const mediaItems = useMemo(() => {
    const items: { type: 'image' | 'video'; src: string; caption?: string; embedUrl?: string; lqip?: string }[] = [];
    
    if (project.imageUrl) {
      items.push({ type: 'image', src: project.imageUrl, caption: project.coverCaption, lqip: project.lqip });
    }
    
    if (project.images && project.images.length > 0) {
      project.images.forEach(img => {
        const src = img.imageUrl || img.sanityImage || '';
        if (src) {
          items.push({ type: 'image', src, caption: img.caption, lqip: img.lqip });
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

  const [activeMediaIndex, setActiveMediaIndex] = useState(() => {
    // If project has video, auto-focus to video slide
    const videoIndex = mediaItems.findIndex(m => m.type === 'video');
    return videoIndex >= 0 ? videoIndex : 0;
  });
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
  
  // Keyboard navigation for gallery
  useEffect(() => {
    if (!hasMultipleMedia || lightboxOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveMediaIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        setActiveMediaIndex(prev => (prev < mediaItems.length - 1 ? prev + 1 : prev));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasMultipleMedia, lightboxOpen, mediaItems.length]);
  
  // Get random projects (excluding the current one)
  const relatedProjects = useMemo(() => {
    if (!portfolioData) return [];
    
    // Flatten all projects from all categories
    const allProjects = portfolioData.flatMap(cat => cat.items);
    
    // Filter out current project
    const others = allProjects.filter(p => p.slug.current !== project.slug.current);
    
    // Shuffle and pick 2 projects
    const shuffled = [...others].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, [portfolioData, project]);

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
              className="relative flex items-center justify-center h-[40vh] md:h-[60vh] w-full group/media"
            >
              <div 
                className="absolute inset-0 cursor-zoom-in"
                onClick={handleImageClick}
              >
                <Image 
                  src={activeMedia.src} 
                  alt={activeMedia.caption || project.title} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain transition-transform duration-300 hover:scale-[1.02]"
                  priority
                  placeholder={activeMedia.lqip ? 'blur' : 'empty'}
                  blurDataURL={activeMedia.lqip || undefined}
                />
              </div>

              {/* Navigation Arrows */}
              {hasMultipleMedia && activeMediaIndex > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveMediaIndex(activeMediaIndex - 1); }}
                  className="absolute left-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white/70 hover:text-white transition-all opacity-0 group-hover/media:opacity-100 backdrop-blur-sm shadow-lg"
                  aria-label="Previous Media"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {hasMultipleMedia && activeMediaIndex < mediaItems.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveMediaIndex(activeMediaIndex + 1); }}
                  className="absolute right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white/70 hover:text-white transition-all opacity-0 group-hover/media:opacity-100 backdrop-blur-sm shadow-lg"
                  aria-label="Next Media"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Zoom indicator — appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center 
                              opacity-0 group-hover/media:opacity-100 transition-opacity duration-300 pointer-events-none">
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
                  <Image 
                    src={item.src} 
                    alt={item.caption || `Media ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
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
            <div className="text-gray-300 leading-relaxed text-base space-y-4 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>a]:text-yellow-400 [&>a]:underline [&>h3]:text-xl [&>h3]:text-white [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3">
              {typeof project.description === 'string' ? (
                <p className="whitespace-pre-line">{project.description}</p>
              ) : (
                <PortableText value={project.description as any} />
              )}
            </div>
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

          {/* Related Projects / Infinite Discovery */}
          {relatedProjects.length > 0 && (
            <div className="pt-12 mt-12 border-t border-white/10">
              <h4 className="text-lg md:text-xl font-bold text-yellow-400 mb-6 uppercase tracking-wider">
                Explore More Projects
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedProjects.map((rp, idx) => (
                  <button
                    key={idx}
                    onClick={() => onProjectSelect(rp)}
                    className="group relative text-left rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-white/5 hover:border-yellow-400/50 transition-all duration-300 shadow-lg block"
                  >
                    <Image
                      src={rp.imageUrl}
                      alt={rp.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-60 group-hover:opacity-100"
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                      <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        View Project
                      </span>
                      <h5 className="text-white font-bold text-lg md:text-xl leading-tight group-hover:text-yellow-400 transition-colors drop-shadow-md">
                        {rp.title}
                      </h5>
                    </div>
                  </button>
                ))}
              </div>
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