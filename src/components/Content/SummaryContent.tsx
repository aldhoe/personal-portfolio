'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';

interface SummaryContentProps {
  paragraphs?: string[];
  quote?: string;
}

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }, 
};

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

// Fallback data (Portable Text format)
const fallbackParagraphs = [
  {
    _type: 'block',
    _key: 'fallback_1',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'span_1',
        text: 'I am a Creative Designer and AI Visual Specialist dedicated to transforming complex ideas into elegant, user-centric digital experiences. My design philosophy is rooted in empathy, clarity, and continuous learning, allowing me to adapt quickly to new trends and deliver impactful results for any project.',
        marks: [],
      }
    ]
  },
  {
    _type: 'block',
    _key: 'fallback_2',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'span_2',
        text: 'I thrive in collaborative environments, working closely with marketing and development teams to ensure brand consistency and seamless implementation.',
        marks: [],
      }
    ]
  }
];

const fallbackQuote = 'Driven by a curiosity to learn and improve, I continuously explore new tools and methodologies to enhance my work.';

export const SummaryContent: React.FC<SummaryContentProps> = ({ paragraphs, quote }) => {
  const paraData = paragraphs && paragraphs.length > 0 ? paragraphs : fallbackParagraphs;
  const quoteData = quote || fallbackQuote;

  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto px-6 sm:px-10 md:px-14 py-8 md:py-20"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
        
        <motion.div 
            variants={itemVariants} 
            className="md:col-span-1"
        >
          <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2 uppercase">
            Summary
          </h2>
          <div className="w-12 h-1 bg-yellow-500 mt-2 rounded-full"></div>
        </motion.div>
        
        <div className="md:col-span-2 text-gray-200 space-y-6 text-base md:text-lg leading-relaxed">
          
          <motion.div variants={itemVariants} className="space-y-6 [&>p]:mb-4 [&>p]:leading-relaxed">
            {typeof paraData[0] === 'string' ? (
              // Handle old string array data gracefully
              paraData.map((para, index) => (
                <p key={index}>{para as string}</p>
              ))
            ) : (
              <PortableText value={paraData as any} />
            )}
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="border-l-4 border-yellow-400 pl-4 md:pl-6 pt-2"
          >
            <p className="text-xl md:text-2xl font-extrabold text-white">
              {quoteData}
            </p>
          </motion.div>
          
        </div>
        
      </div>
    </motion.div>
  );
};