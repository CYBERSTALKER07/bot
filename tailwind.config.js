/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ASU Brand Colors
        asu: {
          maroon: '#8C1D40',
          gold: '#FFC627',
          'maroon-dark': '#7A1B3A',
          'gold-dark': '#E6B122',
        },

        // Material Design 3 Color System
        primary: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107', // Primary
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
        },
        
        secondary: {
          50: '#F3E5F5',
          100: '#E1BEE7',
          200: '#CE93D8',
          300: '#BA68C8',
          400: '#AB47BC',
          500: '#9C27B0', // Secondary
          600: '#8E24AA',
          700: '#7B1FA2',
          800: '#6A1B9A',
          900: '#4A148C',
        },

        // Surface Colors (Material Design 3)
        surface: {
          50: '#FEFEFE',
          100: '#FDFDFD',
          200: '#FAFAFA',
          300: '#F7F7F7',
          400: '#F5F5F5',
          500: '#F0F0F0',
          600: '#E8E8E8',
          700: '#E0E0E0',
          800: '#D6D6D6',
          900: '#CCCCCC',
        },

        // Semantic Colors
        success: {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },

        warning: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107',
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
        },

        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },

        info: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },

        // Custom Colors (keeping your existing ones)
        deepgreen: '#003432',
        burgundy: '#80003A',
        blueaccent: '#2C43DE',
        gold: '#A87026',
        blackbase: '#21201E',
        mintgreen: '#CCEFBA',
        aqua: '#AADED9',
        cream: '#F0EFE3',
        lime: '#E3FF70',
        
        // Dark theme colors
        'dark-bg': '#001B1A',
        'dark-surface': '#003432',
        'dark-accent': '#E3FF70',
        'dark-text': '#F0F9FF',
        'dark-muted': '#94A3B8',
        
        // Material Design Gray Scale
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        }
      },

      // Material Design Typography Scale
      fontSize: {
        'display-large': ['3.5rem', { lineHeight: '4rem', fontWeight: '400' }],
        'display-medium': ['2.8125rem', { lineHeight: '3.25rem', fontWeight: '400' }],
        'display-small': ['2.25rem', { lineHeight: '2.75rem', fontWeight: '400' }],
        'headline-large': ['2rem', { lineHeight: '2.5rem', fontWeight: '400' }],
        'headline-medium': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '400' }],
        'headline-small': ['1.5rem', { lineHeight: '2rem', fontWeight: '400' }],
        'title-large': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        'title-medium': ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        'title-small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        'label-large': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        'label-medium': ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
        'label-small': ['0.6875rem', { lineHeight: '1rem', fontWeight: '500' }],
        'body-large': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-medium': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'body-small': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
      },

      // Material Design Spacing Scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Material Design Border Radius
      borderRadius: {
        'none': '0',
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        'full': '9999px',
      },

      // Material Design Shadows
      boxShadow: {
        'elevation-1': '0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24)',
        'elevation-2': '0 3px 6px 0 rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.23)',
        'elevation-3': '0 10px 20px 0 rgba(0, 0, 0, 0.19), 0 6px 6px 0 rgba(0, 0, 0, 0.23)',
        'elevation-4': '0 14px 28px 0 rgba(0, 0, 0, 0.25), 0 10px 10px 0 rgba(0, 0, 0, 0.22)',
        'elevation-5': '0 19px 38px 0 rgba(0, 0, 0, 0.30), 0 15px 12px 0 rgba(0, 0, 0, 0.22)',
      },

      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },

      // Material Design Animations
      animation: {
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-up': 'scaleUp 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        'ripple': 'ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-subtle': 'bounceSubtle 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        bounceSubtle: {
          '0%': { transform: 'scale(0.9)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
      },

      // Material Design Transitions
      transitionTimingFunction: {
        'material-standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'material-decelerate': 'cubic-bezier(0, 0, 0.2, 1)',
        'material-accelerate': 'cubic-bezier(0.4, 0, 1, 1)',
        'material-sharp': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },

      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },

      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};