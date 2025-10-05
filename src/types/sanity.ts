export interface ProjectData {
  title: string;
  description: string;
  subtitle: string;
  achievements: string;
  imageUrl: string;
  liveLink: string;
  type: string;
}

export interface PortfolioCategory {
  category: string;
  items: ProjectData[];
}