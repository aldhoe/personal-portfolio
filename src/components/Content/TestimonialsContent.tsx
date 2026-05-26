'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { TestimonialData } from '@/types/sanity';

interface TestimonialsContentProps {
  testimonials: TestimonialData[];
}

const TestimonialsContent: React.FC<TestimonialsContentProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll effect
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) return null;

  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < testimonials.length - 1;

  const goLeft = () => {
    if (canGoLeft) setCurrentIndex(prev => prev - 1);
  };

  const goRight = () => {
    if (canGoRight) setCurrentIndex(prev => prev + 1);
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = offset.x;
    const swipeThreshold = 50;
    if (swipe < -swipeThreshold && canGoRight) {
      goRight();
    } else if (swipe > swipeThreshold && canGoLeft) {
      goLeft();
    }
  };

  const current = testimonials[currentIndex];

  // Render rating stars
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1 mt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-20 md:mt-24 pt-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
        {/* Kolom Kiri: Judul */}
        <div className="md:col-span-1">
          <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2 uppercase">
            Testimonials
          </h2>
          <div className="w-12 h-1 bg-yellow-500 mt-2 rounded-full"></div>
        </div>

        {/* Kolom Kanan: Testimonial Card */}
        <div className="md:col-span-2">
          <div className="relative">
            {/* Testimonial Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="relative bg-white/5 backdrop-blur-sm border border-white/10 
                           rounded-2xl p-6 md:p-8 min-h-[200px] cursor-grab active:cursor-grabbing"
              >
                {/* Quote Mark */}
                <Quote className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 text-yellow-400/20" />

                {/* Content */}
                <p className="text-gray-200 text-base md:text-lg leading-relaxed italic pr-8">
                  &ldquo;{current.content}&rdquo;
                </p>

                {/* Author Info */}
                <div className="mt-6 flex items-center gap-4">
                  {/* Avatar */}
                  {current.avatarUrl && (
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-yellow-400/30">
                      <img 
                        src={current.avatarUrl} 
                        alt={current.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  
                  {/* Name & Role */}
                  <div>
                    <p className="font-bold text-white text-base">{current.name}</p>
                    <p className="text-sm text-yellow-400/80">{current.role}</p>
                    {renderStars(current.rating)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Netflix-style Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={goLeft}
                  disabled={!canGoLeft}
                  className={`absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-lg
                    ${canGoLeft 
                      ? 'bg-black/80 hover:bg-black border border-white/20 text-white cursor-pointer' 
                      : 'bg-black/40 border border-white/5 text-white/20 cursor-not-allowed opacity-0'
                    }`}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goRight}
                  disabled={!canGoRight}
                  className={`absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-lg
                    ${canGoRight 
                      ? 'bg-black/80 hover:bg-black border border-white/20 text-white cursor-pointer' 
                      : 'bg-black/40 border border-white/5 text-white/20 cursor-not-allowed opacity-0'
                    }`}
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots indicator at the bottom */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`rounded-full transition-all duration-300 
                        ${i === currentIndex 
                          ? 'w-6 h-2 bg-yellow-400' 
                          : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                        }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialsContent;
