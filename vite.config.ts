import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom']
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
    cssMinify: true,
    // Remove console logs in production
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Performance optimizations
  server: {
    fs: {
      cachedChecks: false
    }
  },
  esbuild: {
    // Remove console logs and debugger statements in production
    drop: ['console', 'debugger']
  }
});
