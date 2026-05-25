'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExperienceData, ToolItem, TestimonialData } from '@/types/sanity';
import TestimonialsContent from './TestimonialsContent';

interface ExperienceContentProps {
  experiences?: ExperienceData[];
  skills?: string[];
  tools?: ToolItem[];
  testimonials?: TestimonialData[];
}

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

const toolIconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Fallback data sementara (akan digantikan CMS nanti)
const fallbackExperiences: ExperienceData[] = [
  {
    jobTitle: 'GRAPHIC DESIGNER',
    company: 'Rezolva',
    startYear: '2024',
    endYear: '2025',
    description: 'At Creative Solutions Agency, I lead design efforts on a range of high-profile projects, focusing on enhancing user experience across multiple platforms, from web to mobile applications. I collaborate closely with developers and stakeholders to ensure that design solutions meet both user needs and business objectives.',
    responsibilities: [
      'Conducted user research and usability testing to drive design decisions',
      'Created wireframes, prototypes, and high-fidelity visual designs',
      'Developed and maintained design systems for consistent branding and user experience',
    ],
    order: 1,
  },
  {
    jobTitle: 'VIDEO EDITOR',
    company: 'Farrel Studio',
    startYear: '2016',
    endYear: '2023',
    description: 'Assisted the lead designer in developing brand assets and marketing materials. Focused on optimizing visual content for social media and website deployment.',
    responsibilities: [
      'Designed promotional graphics for weekly campaigns.',
      'Managed and maintained the company\'s digital asset library.',
    ],
    order: 2,
  },
];

const fallbackSkills = [
  'Creative Direction', 'Video Editing', 'Generative AI',
  'Visual Design', 'Photo Editing', 'Visual Effects',
];

const fallbackTools: ToolItem[] = [
  { name: 'Nano Banana', iconUrl: '/icons/nanobanana.png' },
  { name: 'Premiere', iconUrl: '/icons/premiere.png' },
  { name: 'Photoshop', iconUrl: '/icons/photoshop.png' },
  { name: 'Capcut', iconUrl: '/icons/capcut.png' },
  { name: 'Canva', iconUrl: '/icons/canva.png' },
  { name: 'Midjourney', iconUrl: '/icons/midjourney.png' },
];

const fallbackTestimonials: TestimonialData[] = [
  {
    name: 'Sarah Mitchell',
    role: 'Marketing Director at BrandCo',
    content: 'Renaldo delivered exceptional design work that exceeded our expectations. His attention to detail and creative vision transformed our brand identity completely. Highly recommended for any creative project!',
    rating: 5,
    order: 1,
  },
  {
    name: 'David Chen',
    role: 'Founder at StartupXYZ',
    content: 'Working with Renaldo was an absolute pleasure. He understood our vision from day one and delivered stunning visuals that perfectly captured our brand essence. The AI-generated artwork was truly next level.',
    rating: 5,
    order: 2,
  },
  {
    name: 'Amanda Rivera',
    role: 'Creative Lead at DesignStudio',
    content: 'Renaldo brings a unique combination of technical skill and artistic sensibility. His video editing work helped us achieve a 40% increase in social media engagement. A true professional.',
    rating: 4,
    order: 3,
  },
];

const ExperienceContent: React.FC<ExperienceContentProps> = ({ 
  experiences,
  skills,
  tools,
  testimonials,
}) => {
  const expData = experiences && experiences.length > 0 ? experiences : fallbackExperiences;
  const skillData = skills && skills.length > 0 ? skills : fallbackSkills;
  const toolData = tools && tools.length > 0 ? tools : fallbackTools;
  const testimonialData = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;


  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto px-6 sm:px-10 md:px-14 py-8 md:py-20"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ========== WORK EXPERIENCE ========== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
        
        {/* Kolom Kiri: Judul */}
        <motion.div 
            variants={itemVariants}
            className="md:col-span-1"
        >
          <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2 uppercase">
            Work Experience
          </h2>
          <div className="w-12 h-1 bg-yellow-500 mt-2 rounded-full"></div>
        </motion.div>
        
        {/* Kolom Kanan: Timeline */}
        <div className="md:col-span-2 text-gray-200">
          {expData.map((exp, index) => (
            <motion.div 
              key={index}
              variants={itemVariants} 
              className={`relative pb-12 border-l border-gray-700 pl-4 md:pl-6 ${index > 0 ? 'mt-6' : ''}`}
            >
              <div className="absolute -left-1.5 top-0 w-3 h-3 bg-yellow-400 rounded-full"></div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                <div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-widest uppercase">
                    {exp.jobTitle}
                  </p>
                  <p className="text-base text-yellow-400">
                    {exp.company}
                  </p>
                </div>
                <span className="text-sm font-bold text-gray-400 whitespace-nowrap pt-1">
                  {exp.startYear} – {exp.endYear}
                </span>
              </div>

              <p className="text-base leading-relaxed mb-6">
                {exp.description}
              </p>

              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2 uppercase">
                    Key Responsibilities:
                  </h4>
                  <ul className="list-disc list-outside space-y-2 text-sm ml-5">
                    {exp.responsibilities.map((resp, rIndex) => (
                      <li key={rIndex}>{resp}</li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ========== SKILLS & TOOLS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mt-20 md:mt-24 pt-10">
        
        {/* Kolom Kiri: Judul */}
        <motion.div 
            variants={itemVariants} 
            className="md:col-span-1"
        >
          <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2 uppercase">
            Skills & Tools
          </h2>
          <div className="w-12 h-1 bg-yellow-500 mt-2 rounded-full"></div>
        </motion.div>

        {/* Kolom Kanan: Skills Grid + Tools */}
        <div className="md:col-span-2 font-bold text-gray-200">
          {/* Skills — auto-wrap grid */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-base">
              {skillData.map((skill, index) => (
                <p key={index} className="flex items-center">
                  <span className="text-yellow-400 text-lg mr-2">&bull;</span>
                  {skill}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Tools — flex-wrap grid */}
          <motion.div variants={itemVariants} className="mt-8">
            <h3 className="text-xl font-bold text-yellow-500 mb-6">Tools</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-8 justify-start">
              {toolData.map((tool, index) => {
                const iconSrc = tool.iconUrl || tool.sanityIcon || '';
                return (
                  <motion.div 
                    key={index} 
                    variants={toolIconVariants} 
                    className="flex flex-col items-center justify-center text-center w-16 md:w-20"
                  >
                    {iconSrc ? (
                      <img 
                        src={iconSrc} 
                        alt={tool.name} 
                        loading="lazy"
                        className="w-12 h-12 md:w-16 md:h-16 object-contain" 
                      />
                    ) : (
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-yellow-400">{tool.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="text-sm font-bold text-white mt-2">{tool.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ========== TESTIMONIALS ========== */}
      <TestimonialsContent testimonials={testimonialData} />
    </motion.div>
  );
};

export default ExperienceContent;