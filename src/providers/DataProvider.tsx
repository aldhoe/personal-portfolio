'use client';

import React, { createContext, useContext } from 'react';
import { 
  SiteSettings, 
  ExperienceData, 
  TestimonialData, 
  PortfolioCategory 
} from '@/types/sanity';

interface DataContextType {
  siteSettings: SiteSettings | null;
  experiences: ExperienceData[];
  testimonials: TestimonialData[];
  portfolioData: PortfolioCategory[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ 
  children, 
  initialData 
}: { 
  children: React.ReactNode; 
  initialData: DataContextType; 
}) {
  return (
    <DataContext.Provider value={initialData}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
