import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,webp}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        globIgnores: ['**/side-img.svg'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      includeAssets: ['favicon.ico', 'vite.svg'],
      manifest: {
        name: 'AUT Handshake',
        short_name: 'AUT Handshake',
        description: 'Professional networking platform connecting AUT students, graduates, and employers for career success.',
        theme_color: '#8C1D40',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        
        icons: [
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      
      devOptions: {
        enabled: false // Disable in development to avoid issues
      }
    })
  ],
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
    cssMinify: true
  },
  // Performance optimizations
  server: {
    fs: {
      cachedChecks: false
    },
    hmr: {
      overlay: false // Disable error overlay temporarily
    }
  },
  esbuild: {
    // Remove console logs and debugger statements in production
    drop: ['console', 'debugger']
  }
});
