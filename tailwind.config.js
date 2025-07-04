/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom Colors
        deepgreen: '#003432', // HEX (Pantone 2217 C)
        burgundy: '#80003A', // HEX (Pantone 208 C)
        blueaccent: '#2C43DE', // HEX (Pantone 2132 C)
        gold: '#A87026', // HEX (Pantone 730 C)
        blackbase: '#21201E', // HEX
        mintgreen: '#CCEFBA', // HEX (Pantone 9561 C)
        aqua: '#AADED9', // HEX (Pantone 9501 C)
        cream: '#F0EFE3', // HEX
        lime: '#E3FF70', // HEX (Pantone 930 C)
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce': 'bounce 1s infinite',
        'scroll': 'scroll 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};