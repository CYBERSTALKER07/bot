/**
 * AUT Handshake Design System
 * Centralized design tokens and configuration for American University of Technology
 */

// Design Tokens
export const designTokens = {
  // Color System - University Academic Palette
  colors: {
    // University Brand Colors
    brand: {
      primary: '#1B365D', // Deep Academic Blue
      secondary: '#8B5A3C', // Warm Brown (representing knowledge/books)
      accent: '#D4AF37', // Academic Gold
      burgundy: '#8C1D40', // Traditional University Burgundy
      sage: '#9CAF88', // Sage Green (representing growth)
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    
    // Academic-themed colors
    university: {
      navy: '#1B365D',
      gold: '#D4AF37',
      burgundy: '#8C1D40',
      sage: '#9CAF88',
      cream: '#F7F5F3',
      parchment: '#F4F1EA',
      ink: '#2C3E50',
      scholar: '#5D4E75', // Deep purple for academic distinction
    },
    
    // Neutral Colors (Enhanced for academic readability)
    neutral: {
      0: '#FFFFFF',
      50: '#F8F9FA',
      100: '#F1F3F4',
      200: '#E8EAED',
      300: '#DADCE0',
      400: '#9AA0A6',
      500: '#5F6368',
      600: '#3C4043',
      700: '#202124',
      800: '#1A1A1A',
      900: '#0F0F0F',
      950: '#080808',
    },
    
    // Semantic Colors for University Context
    semantic: {
      background: {
        light: '#FFFFFF',
        dark: '#1A1A1A',
        academic: '#F7F5F3', // Warm academic background
      },
      surface: {
        light: '#F8F9FA',
        dark: '#202124',
        paper: '#F4F1EA', // Paper-like surface
      },
      border: {
        light: '#E8EAED',
        dark: '#3C4043',
        academic: '#D4AF37', // Gold borders for emphasis
      },
    },
  },
  
  // Academic Typography Scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Playfair Display', 'Georgia', 'serif'], // Academic serif for headings
      mono: ['JetBrains Mono', 'monospace'],
      academic: ['Crimson Text', 'Times New Roman', 'serif'], // Traditional academic font
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.6rem' }], // Better reading line height
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1.1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  
  // University-themed spacing (8px grid system)
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    14: '3.5rem',    // 56px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
    academic: '1.618rem', // Golden ratio spacing for academic layouts
  },
  
  // Academic Border Radius (more conservative for university feel)
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    academic: '0.375rem', // Standard academic radius
    traditional: '0.25rem', // Conservative traditional radius
    full: '9999px',
  },
  
  // University-appropriate shadows
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    academic: '0 2px 8px 0 rgb(27 54 93 / 0.1)', // Subtle university blue shadow
    paper: '0 4px 12px 0 rgb(0 0 0 / 0.08)', // Paper-like shadow
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  // Professional academic animations
  animation: {
    duration: {
      instant: '100ms',
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      academic: '400ms', // Dignified timing for university interfaces
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      academic: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Smoother academic feel
    },
  },
  
  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// University-themed Component Variants
export const componentVariants = {
  // Academic button variants
  button: {
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3.5 text-lg',
      academic: 'px-6 py-3 text-base', // Golden ratio proportions
    },
    variant: {
      primary: 'bg-university-navy text-white hover:bg-opacity-90 shadow-academic',
      secondary: 'bg-university-gold text-university-navy hover:bg-opacity-90',
      academic: 'bg-university-burgundy text-white hover:bg-opacity-90',
      outline: 'border-2 border-university-navy bg-transparent text-university-navy hover:bg-university-navy hover:text-white',
      ghost: 'bg-transparent text-university-navy hover:bg-university-cream',
      scholar: 'bg-university-scholar text-white hover:bg-opacity-90',
    },
  },
  
  // Academic card variants
  card: {
    variant: {
      elevated: 'shadow-academic bg-white border border-neutral-200',
      paper: 'shadow-paper bg-semantic-surface-paper border border-university-gold/20',
      outlined: 'border-2 border-university-navy/20 bg-white',
      academic: 'bg-university-cream border-l-4 border-university-gold shadow-sm',
    },
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      academic: 'p-6', // Consistent academic spacing
    },
  },
  
  // University typography variants
  typography: {
    heading: {
      primary: 'font-serif font-bold text-university-navy',
      secondary: 'font-sans font-semibold text-university-ink',
      academic: 'font-academic font-bold text-university-scholar',
    },
    body: {
      primary: 'font-sans text-neutral-700 leading-relaxed',
      academic: 'font-academic text-neutral-600 leading-loose',
      caption: 'font-sans text-sm text-neutral-500',
    },
  },
} as const;

// University-specific utility functions
export const getUniversityColor = (colorPath: string) => {
  const keys = colorPath.split('.');
  let value: typeof designTokens.colors | string | undefined = designTokens.colors;
  
  for (const key of keys) {
    if (typeof value === 'object' && value !== null) {
      value = (value as any)[key];
    }
    if (value === undefined) return null;
  }
  
  return value;
};

export const getAcademicSpacing = (spacing: keyof typeof designTokens.spacing) => {
  return designTokens.spacing[spacing];
};

export const getUniversityShadow = (shadow: keyof typeof designTokens.shadows) => {
  return designTokens.shadows[shadow];
};

// University-focused responsive breakpoints
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
  ultrawide: '1536px',
} as const;

// Academic layout constants
export const layout = {
  maxWidth: '1200px',
  contentWidth: '800px', // Optimal reading width for academic content
  headerHeight: '72px', // Slightly taller for university branding
  sidebarWidth: '280px',
  footerHeight: '120px', // More space for university links
  academicMargin: '2rem', // Consistent academic margins
} as const;

// University brand assets
export const universityBrand = {
  name: 'American University of Technology',
  shortName: 'AUT',
  tagline: 'Connect • Learn • Succeed',
  motto: 'Building Tomorrow\'s Leaders',
  colors: {
    primary: designTokens.colors.university.navy,
    secondary: designTokens.colors.university.gold,
    accent: designTokens.colors.university.burgundy,
  },
  fonts: {
    primary: 'Inter',
    heading: 'Playfair Display',
    academic: 'Crimson Text',
  },
} as const;

export default designTokens;