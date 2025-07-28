export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    link: string;
  }>;
}

export interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
}

// Color themes using ASU brand colors
export const colorThemes: ColorTheme[] = [
  { name: 'ASU Maroon', primary: '#8C1D40', secondary: '#FFC627', accent: '#E3FF70', text: '#1f2937' },
  { name: 'ASU Gold', primary: '#FFC627', secondary: '#8C1D40', accent: '#E3FF70', text: '#1f2937' },
  { name: 'ASU Lime', primary: '#E3FF70', secondary: '#8C1D40', accent: '#FFC627', text: '#1f2937' },
  { name: 'Professional Maroon', primary: '#8C1D40', secondary: '#6B1530', accent: '#B8B8B8', text: '#1f2937' },
  { name: 'Modern Gold', primary: '#FFC627', secondary: '#CC9900', accent: '#E3FF70', text: '#1c1917' },
  { name: 'Classic Dark', primary: '#1f2937', secondary: '#8C1D40', accent: '#FFC627', text: '#111827' },
];

// Resume templates - removed creative template, keeping essential ones
export const templates: Template[] = [
  { id: 'modern', name: 'Modern', description: 'Clean and professional design' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant layout' },
  { id: 'professional', name: 'Professional', description: 'Traditional business format' }
];