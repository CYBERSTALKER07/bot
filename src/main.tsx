import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { QueryProvider } from './context/QueryProvider';
import './index.css';
import { createOptimizedQueryClient } from './lib/queryConfig';

// Create optimized query client with aggressive caching
const queryClient = createOptimizedQueryClient();

// Initialize performance monitoring in development
// if (process.env.NODE_ENV === 'development') {
//   console.log('%c🚀 TalentLink Performance Optimizations Enabled', 'color: #00ff00; font-size: 16px; font-weight: bold; background: black; padding: 10px;');
//   console.log('%c📊 Caching Strategy:', 'color: #00aaff; font-size: 14px; font-weight: bold;');
//   console.log(`
//     ✅ 4-Layer Caching System:
//        - Memory Cache (0.1ms) - Fastest
//        - localStorage (1-5ms) - Persistent
//        - sessionStorage (1-5ms) - Session-scoped
//        - React Query (0.5-2ms) - Server state

//     ✅ Performance Targets:
//        - 85-90% reduction in API calls
//        - 40-45% faster page load
//        - 90%+ cache hit rate
//        - Zero-latency data access

//     ✅ Auto TTL Expiration:
//        - Profiles: 1 hour
//        - Posts: 10 minutes
//        - Follow Status: 30 minutes
//        - Jobs: 30 minutes
//        - Companies: 1 hour
//        - Notifications: 5 minutes

//     💡 Monitoring: Import { performanceMonitor } from './lib/performanceMonitor' to view stats
//   `);
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
