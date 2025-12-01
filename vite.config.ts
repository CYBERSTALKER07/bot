import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'lucide-react',
      '@tanstack/react-query',
      '@tanstack/react-query-devtools'
    ],
    force: true
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@mui/material', '@mui/icons-material', 'lucide-react'],
          'animation-vendor': ['gsap', '@gsap/react'],
          'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority'],

          // Feature-based chunks
          'auth': ['./src/components/Auth/Login.tsx', './src/components/Auth/Register.tsx'],
          'dashboard': [
            './src/components/Dashboard/StudentDashboard.tsx',
            './src/components/Dashboard/EmployerDashboard.tsx',
            './src/components/Dashboard/AdminDashboard.tsx'
          ],
          'landing': [
            './src/components/LandingPage/HeroSection.tsx',
            './src/components/LandingPage/FeaturesSection.tsx',
            './src/components/LandingPage/CompanyLogosFlowSection.tsx',
            './src/components/LandingPage/StatsSection.tsx',
            './src/components/LandingPage/TestimonialsSection.tsx'
          ]
        }
      }
    },
    // Enable compression and minification
    minify: 'esbuild',
    target: 'es2015',
    cssMinify: true
  },
  // Performance optimizations with CORS proxy support
  server: {
    fs: {
      cachedChecks: false
    },
    hmr: {
      overlay: false // Disable error overlay temporarily
    },
    // CORS proxy for development
    proxy: {
      // Proxy external API calls to avoid CORS issues in development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    // Add CORS headers for development
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  },
  esbuild: {
    // Remove console logs and debugger statements in production
    drop: ['console', 'debugger']
  }
});
