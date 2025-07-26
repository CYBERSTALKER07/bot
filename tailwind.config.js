/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      // Custom breakpoints for specific devices
      'mobile': '320px',
      'tablet': '768px',
      'laptop': '1024px',
      'desktop': '1280px',
      // iOS specific breakpoints
      'iphone-se': '375px',
      'iphone': '390px',
      'iphone-pro': '393px',
      'iphone-pro-max': '430px',
    },
    extend: {
      colors: {
        // Enhanced Brand Colors
        brand: {
          primary: '#8C1D40',
          secondary: '#FFC627',
          accent: '#E3FF70',
        },

        // Professional Color System
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#8C1D40', // ASU Maroon
          700: '#7A1B3A',
          800: '#6B1A33',
          900: '#5C182D',
          950: '#4D1526',
          DEFAULT: '#8C1D40',
          foreground: '#FFFFFF',
        },

        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFC627', // ASU Gold
          600: '#E6B122',
          700: '#CC9E1E',
          800: '#B38B1A',
          900: '#997816',
          DEFAULT: '#FFC627',
          foreground: '#18181B',
        },

        // Neutral Palette (Enhanced)
        border: '#E4E4E7',
        input: '#E4E4E7',
        ring: '#8C1D40',
        background: '#FFFFFF',
        foreground: '#18181B',
        
        muted: {
          DEFAULT: '#F4F4F5',
          foreground: '#71717A',
        },
        
        accent: {
          DEFAULT: '#F4F4F5',
          foreground: '#18181B',
        },
        
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#18181B',
        },
        
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#18181B',
        },

        neutral: {
          0: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },

        // Semantic Colors
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        
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
        },

        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#ef4444',
        },

        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#3b82f6',
        },

        // Dark theme colors
        dark: {
          bg: '#0A0A0A',
          surface: '#111111',
          border: '#27272A',
          text: '#F4F4F5',
          muted: '#71717A',
        },

        // Legacy support (keeping for compatibility)
        'asu-maroon': '#8C1D40',
        'asu-gold': '#FFC627',
        lime: '#E3FF70',
        'dark-bg': '#0A0A0A',
        'dark-surface': '#111111',
        'dark-accent': '#E3FF70',
        'dark-text': '#F4F4F5',
        'dark-muted': '#71717A',
      },

      // Enhanced Typography with responsive sizing
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Professional typography scale with responsive sizing
        xs: ['clamp(0.625rem, 1.5vw, 0.75rem)', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        sm: ['clamp(0.75rem, 2vw, 0.875rem)', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        base: ['clamp(0.875rem, 2.5vw, 1rem)', { lineHeight: '1.5rem', letterSpacing: '0rem' }],
        lg: ['clamp(1rem, 3vw, 1.125rem)', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
        xl: ['clamp(1.125rem, 3.5vw, 1.25rem)', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
        '2xl': ['clamp(1.25rem, 4vw, 1.5rem)', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
        '3xl': ['clamp(1.5rem, 5vw, 1.875rem)', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
        '4xl': ['clamp(1.875rem, 6vw, 2.25rem)', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
        '5xl': ['clamp(2.25rem, 7vw, 3rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        '6xl': ['clamp(2.5rem, 8vw, 3.75rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        '7xl': ['clamp(3rem, 9vw, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        '8xl': ['clamp(4rem, 10vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        '9xl': ['clamp(5rem, 12vw, 8rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
      },

      // Enhanced Spacing with responsive values
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        144: '36rem',
        // Responsive spacing utilities
        'responsive-xs': 'clamp(0.25rem, 1vw, 0.5rem)',
        'responsive-sm': 'clamp(0.5rem, 2vw, 1rem)',
        'responsive-md': 'clamp(1rem, 4vw, 2rem)',
        'responsive-lg': 'clamp(1.5rem, 6vw, 3rem)',
        'responsive-xl': 'clamp(2rem, 8vw, 4rem)',
        'responsive-2xl': 'clamp(3rem, 10vw, 6rem)',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // iOS-style radius
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
      },

      // Professional Shadows with responsive scaling
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': 'none',
        
        // Material Design elevation
        'elevation-1': '0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24)',
        'elevation-2': '0 3px 6px 0 rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.23)',
        'elevation-3': '0 10px 20px 0 rgba(0, 0, 0, 0.19), 0 6px 6px 0 rgba(0, 0, 0, 0.23)',
        'elevation-4': '0 14px 28px 0 rgba(0, 0, 0, 0.25), 0 10px 10px 0 rgba(0, 0, 0, 0.22)',
        'elevation-5': '0 19px 38px 0 rgba(0, 0, 0, 0.30), 0 15px 12px 0 rgba(0, 0, 0, 0.22)',
      },

      // Professional Animations with responsive considerations
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-out': 'fadeOut 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-left': 'slideLeft 0.2s ease-out',
        'slide-right': 'slideRight 0.2s ease-out',
        'scale-up': 'scaleUp 0.15s ease-out',
        'scale-down': 'scaleDown 0.15s ease-out',
        'bounce-subtle': 'bounceSubtle 0.5s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleDown: {
          '0%': { transform: 'scale(1.05)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },

      // Enhanced Transitions
      transitionTimingFunction: {
        'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'ease-in-quart': 'cubic-bezier(0.5, 0, 0.75, 0)',
        'ease-in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
        'material-standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'material-decelerate': 'cubic-bezier(0, 0, 0.2, 1)',
        'material-accelerate': 'cubic-bezier(0.4, 0, 1, 1)',
      },

      transitionDuration: {
        '50': '50ms',
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },

      // Z-index scale for better layering
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // Enhanced backdrop blur
      backdropBlur: {
        xs: '2px',
      },

      // Grid template columns for responsive layouts
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        // Responsive grid patterns
        'responsive-1': 'repeat(1, minmax(0, 1fr))',
        'responsive-2': 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
        'responsive-3': 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
        'responsive-4': 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
      },

      // Enhanced container sizes
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          xs: '0.5rem',
          sm: '1rem',
          md: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
        },
        screens: {
          xs: '475px',
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },

      // Enhanced aspect ratios for responsive images and videos
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
        '1/2': '1 / 2',
        '2/1': '2 / 1',
      },

      // Enhanced line height for better readability
      lineHeight: {
        'extra-tight': '1.1',
        'tight': '1.2',
        'snug': '1.3',
        'relaxed': '1.6',
        'loose': '1.8',
        'extra-loose': '2',
      },

      // Enhanced letter spacing
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
        'ultra-wide': '0.25em',
      },

      // Enhanced max width utilities
      maxWidth: {
        'responsive-xs': 'min(100% - 2rem, 320px)',
        'responsive-sm': 'min(100% - 2rem, 480px)',
        'responsive-md': 'min(100% - 2rem, 640px)',
        'responsive-lg': 'min(100% - 2rem, 800px)',
        'responsive-xl': 'min(100% - 2rem, 1024px)',
        'responsive-2xl': 'min(100% - 2rem, 1280px)',
      },

      // Enhanced min height utilities
      minHeight: {
        'screen-1/2': '50vh',
        'screen-1/3': '33.333333vh',
        'screen-2/3': '66.666667vh',
        'screen-1/4': '25vh',
        'screen-3/4': '75vh',
        'touch-target': '44px',
        'touch-target-lg': '48px',
      },
    },
  },
  plugins: [
    // Custom plugin for responsive utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Responsive text utilities
        '.text-responsive': {
          'font-size': 'clamp(0.875rem, 2.5vw, 1rem)',
          'line-height': '1.6',
        },
        '.text-responsive-lg': {
          'font-size': 'clamp(1rem, 3vw, 1.25rem)',
          'line-height': '1.5',
        },
        '.text-responsive-xl': {
          'font-size': 'clamp(1.25rem, 4vw, 1.5rem)',
          'line-height': '1.4',
        },
        '.text-responsive-2xl': {
          'font-size': 'clamp(1.5rem, 5vw, 2rem)',
          'line-height': '1.3',
        },
        
        // Responsive spacing utilities
        '.p-responsive': {
          'padding': 'clamp(1rem, 4vw, 2rem)',
        },
        '.px-responsive': {
          'padding-left': 'clamp(1rem, 4vw, 2rem)',
          'padding-right': 'clamp(1rem, 4vw, 2rem)',
        },
        '.py-responsive': {
          'padding-top': 'clamp(1rem, 4vw, 2rem)',
          'padding-bottom': 'clamp(1rem, 4vw, 2rem)',
        },
        '.m-responsive': {
          'margin': 'clamp(1rem, 4vw, 2rem)',
        },
        
        // Responsive grid utilities
        '.grid-responsive': {
          'display': 'grid',
          'grid-template-columns': 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
          'gap': 'clamp(1rem, 4vw, 2rem)',
        },
        '.grid-responsive-sm': {
          'display': 'grid',
          'grid-template-columns': 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
          'gap': 'clamp(0.75rem, 3vw, 1.5rem)',
        },
        '.grid-responsive-lg': {
          'display': 'grid',
          'grid-template-columns': 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          'gap': 'clamp(1.5rem, 5vw, 3rem)',
        },
        
        // Responsive flex utilities
        '.flex-responsive': {
          'display': 'flex',
          'flex-direction': 'column',
          'gap': 'clamp(1rem, 4vw, 2rem)',
          '@media (min-width: 768px)': {
            'flex-direction': 'row',
          },
        },
        
        // Touch-friendly utilities
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px',
        },
        '.touch-target-lg': {
          'min-height': '48px',
          'min-width': '48px',
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
};