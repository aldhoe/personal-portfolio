// ============================
// Portfolio Types
// ============================

export interface GalleryImage {
  imageUrl?: string;       // External URL (hemat storage)
  sanityImage?: string;    // Sanity-hosted image URL
  caption?: string;
}

export interface ProjectData {
  title: string;
  description: string;
  subtitle: string;
  toolsUsed?: string[];    // Tools/tech used — shown as tags
  imageUrl: string;
  coverCaption?: string;   // Description shown only in lightbox zoom
  images?: GalleryImage[]; // Multi-image gallery
  videoUrl?: string;       // YouTube/Vimeo embed URL
  liveLink?: string;       // Optional — hidden if empty
  type: string;
}

export interface PortfolioCategory {
  category: string;
  items: ProjectData[];
}

// ============================
// Site Settings Types
// ============================

export interface ContactItem {
  type: string;            // "email", "phone", "linkedin", "location"
  label: string;           // Display text
  url: string;             // Link href
}

export interface ToolItem {
  name: string;
  iconUrl?: string;        // External icon URL
  sanityIcon?: string;     // Sanity-hosted icon URL
}

export interface SocialLink {
  name: string;
  iconUrl?: string;        // External URL
  sanityIcon?: string;     // Sanity-hosted
  url: string;
  bgColor?: string;        // e.g., "bg-white"
}

export interface SiteSettings {
  name: string;
  jobTitle: string;
  isOpenToWork: boolean;
  profileImageUrl?: string;
  cvFileUrl?: string;
  contactInfo: ContactItem[];
  summaryParagraphs: string[];
  summaryQuote: string;
  skills: string[];
  tools: ToolItem[];
  socialLinks: SocialLink[];
}

// ============================
// Experience Types
// ============================

export interface ExperienceData {
  jobTitle: string;
  company: string;
  startYear: string;
  endYear: string;
  description: string;
  responsibilities: string[];
  order: number;
}

// ============================
// Testimonial Types
// ============================

export interface TestimonialData {
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
  rating?: number;         // 1-5
  order: number;
}