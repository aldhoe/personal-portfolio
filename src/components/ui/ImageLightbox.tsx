'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: { src: string; caption?: string }[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}) => {
  const hasMultiple = images.length > 1;
  const current = images[currentIndex];
  const [isDragging, setIsDragging] = useState(false);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (currentIndex > 0) onNavigate(currentIndex - 1);
        break;
      case 'ArrowRight':
        if (currentIndex < images.length - 1) onNavigate(currentIndex + 1);
        break;
    }
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 
                       flex items-center justify-center text-white/70 hover:text-white
                       transition-all duration-200"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Counter */}
          {hasMultiple && (
            <div className="absolute top-4 left-4 z-[110] text-white/50 text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {hasMultiple && currentIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-[110]
                         w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 
                         flex items-center justify-center text-white/70 hover:text-white
                         transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {hasMultiple && currentIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-[110]
                         w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 
                         flex items-center justify-center text-white/70 hover:text-white
                         transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image with Zoom/Pan */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-[105] w-full h-full flex flex-col items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full flex-1 relative flex items-center justify-center overflow-hidden">
                <TransformWrapper
                  initialScale={1}
                  minScale={0.5}
                  maxScale={5}
                  centerOnInit={true}
                  wheel={{ 
                    step: 0.1,
                    smoothStep: 0.005,
                  }}
                  doubleClick={{ step: 1 }}
                  panning={{ velocityDisabled: false }}
                  onPanningStart={() => setIsDragging(true)}
                  onPanningStop={() => setIsDragging(false)}
                  onPinchingStart={() => setIsDragging(true)}
                  onPinchingStop={() => setIsDragging(false)}
                >
                  <TransformComponent 
                    wrapperClass="!w-full !h-full" 
                    contentClass="!w-full !h-full flex items-center justify-center"
                    contentStyle={{ transition: isDragging ? 'none' : 'transform 0.15s ease-out' }}
                  >
                    <img
                      src={current.src}
                      alt={current.caption || 'Zoomed image'}
                      className="max-w-[95vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing"
                      draggable={false}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
              
              {/* Zoom Hint (Fades out) */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-20 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 
                           text-white/60 text-xs md:text-sm font-medium bg-black/40 backdrop-blur-sm 
                           px-4 py-2 rounded-full pointer-events-none z-[115]"
              >
                <ZoomIn className="w-4 h-4" />
                <span className="hidden md:inline">Scroll to zoom, drag to pan</span>
                <span className="md:hidden">Pinch to zoom, drag to pan</span>
              </motion.div>

              {/* Caption */}
              {current.caption && (
                <p className="absolute bottom-6 md:bottom-4 left-1/2 -translate-x-1/2 
                              text-white/60 text-sm font-medium bg-black/40 backdrop-blur-sm 
                              px-3 py-1 rounded-full whitespace-nowrap z-[115]">
                  {current.caption}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Dots */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110] flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
                  className={`rounded-full transition-all duration-300 
                    ${i === currentIndex 
                      ? 'w-6 h-2 bg-yellow-400' 
                      : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                    }`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;
