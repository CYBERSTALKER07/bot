import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // University-themed color palette
      colors: {
        // University Brand Colors
        'university-navy': '#1B365D',
        'university-gold': '#D4AF37',
        'university-burgundy': '#8C1D40',
        'university-sage': '#9CAF88',
        'university-cream': '#F7F5F3',
        'university-parchment': '#F4F1EA',
        'university-ink': '#2C3E50',
        'university-scholar': '#5D4E75',

        // ASU Traditional Colors (keeping for compatibility)
        'asu-maroon': '#8C1D40',
        'asu-gold': '#FFC627',
        'asu-maroon-dark': '#7A1A39',

        // Academic color variants
        primary: {
          50: '#E8EDF5',
          100: '#D1DBEB',
          200: '#A3B7D7',
          300: '#7593C3',
          400: '#476FAF',
          500: '#1B365D', // University Navy
          600: '#162B4A',
          700: '#112037',
          800: '#0C1524',
          900: '#070A11',
          DEFAULT: '#1B365D',
          foreground: '#FFFFFF',
        },

        secondary: {
          50: '#FAF7F0',
          100: '#F5EFE1',
          200: '#EBDFC3',
          300: '#E1CFA5',
          400: '#D7BF87',
          500: '#D4AF37', // Academic Gold
          600: '#AA8C2C',
          700: '#7F6921',
          800: '#554616',
          900: '#2A230B',
          DEFAULT: '#D4AF37',
          foreground: '#1B365D',
        },

        accent: {
          50: '#F5F0F4',
          100: '#EBE1E9',
          200: '#D7C3D3',
          300: '#C3A5BD',
          400: '#AF87A7',
          500: '#8C1D40', // University Burgundy
          600: '#701733',
          700: '#541126',
          800: '#380C19',
          900: '#1C060D',
          DEFAULT: '#8C1D40',
          foreground: '#FFFFFF',
        },

        // Academic semantic colors
        academic: {
          navy: '#1B365D',
          gold: '#D4AF37', 
          burgundy: '#8C1D40',
          sage: '#9CAF88',
          cream: '#F7F5F3',
          parchment: '#F4F1EA',
          ink: '#2C3E50',
          scholar: '#5D4E75',
        },

        // Enhanced neutral palette for academic readability
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

        // Semantic colors
        border: '#E8EAED',
        input: '#E8EAED',
        ring: '#1B365D',
        background: '#FFFFFF',
        foreground: '#202124',
        
        muted: {
          DEFAULT: '#F1F3F4',
          foreground: '#5F6368',
        },
        
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#202124',
        },
        
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#202124',
        },

        // Dark theme colors
        dark: {
          bg: '#0A0A0A',
          surface: '#111111',
          text: '#F8F9FA',
          muted: '#9AA0A6',
          accent: '#D4AF37',
        },

        // Status colors for university context
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          DEFAULT: '#22c55e',
          foreground: '#FFFFFF',
        },

        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
          foreground: '#FFFFFF',
        },

        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
      },

      // University-appropriate typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        academic: ['Crimson Text', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },

      // Academic spacing scale
      spacing: {
        'academic': '1.618rem', // Golden ratio
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },

      // University-appropriate border radius
      borderRadius: {
        'academic': '0.375rem',
        'traditional': '0.25rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // Academic shadows
      boxShadow: {
        'academic': '0 2px 8px 0 rgb(27 54 93 / 0.1)',
        'paper': '0 4px 12px 0 rgb(0 0 0 / 0.08)',
        'university': '0 8px 24px 0 rgb(27 54 93 / 0.12)',
      },

      // Academic animations
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'academic-bounce': 'academicBounce 0.6s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        academicBounce: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-8px,0)' },
          '70%': { transform: 'translate3d(0,-4px,0)' },
          '90%': { transform: 'translate3d(0,-2px,0)' },
        },
      },

      // Academic line heights for better readability
      lineHeight: {
        'academic': '1.618', // Golden ratio
        'relaxed': '1.6',
        'loose': '1.8',
      },

      // Typography scale for academic content
      fontSize: {
        'academic-sm': ['0.875rem', { lineHeight: '1.6' }],
        'academic-base': ['1rem', { lineHeight: '1.618' }],
        'academic-lg': ['1.125rem', { lineHeight: '1.618' }],
        'academic-xl': ['1.25rem', { lineHeight: '1.618' }],
      },

      // Academic grid systems
      gridTemplateColumns: {
        'academic': '1fr 2fr 1fr', // Academic layout proportions
        'sidebar': '280px 1fr',
        'content': '1fr 800px 1fr', // Optimal reading width
      },

      // University-themed gradients
      backgroundImage: {
        'university-gradient': 'linear-gradient(135deg, #1B365D 0%, #D4AF37 100%)',
        'academic-gradient': 'linear-gradient(135deg, #1B365D 0%, #8C1D40 50%, #D4AF37 100%)',
        'scholar-gradient': 'linear-gradient(135deg, #5D4E75 0%, #1B365D 100%)',
      },

      // Academic container sizes
      maxWidth: {
        'academic': '800px', // Optimal reading width
        'university': '1200px',
      },
    },
  },
  plugins: [
    // Add any additional plugins for university design
  ],
} satisfies Config

export default config