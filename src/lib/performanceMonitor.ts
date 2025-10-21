/**
 * Performance monitoring and optimization utilities
 * Tracks cache hits, API calls, and rendering performance
 */

interface PerformanceMetrics {
  cacheHits: number;
  cacheMisses: number;
  apiCalls: number;
  totalLoadTime: number;
  componentRenderTimes: Map<string, number[]>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    apiCalls: 0,
    totalLoadTime: 0,
    componentRenderTimes: new Map(),
  };

  private isEnabled = true;

  /**
   * Track cache hit
   */
  recordCacheHit(key: string): void {
    if (!this.isEnabled) return;
    this.metrics.cacheHits++;
    console.debug(`[Cache Hit] ${key}`);
  }

  /**
   * Track cache miss
   */
  recordCacheMiss(key: string): void {
    if (!this.isEnabled) return;
    this.metrics.cacheMisses++;
    console.debug(`[Cache Miss] ${key}`);
  }

  /**
   * Track API call
   */
  recordApiCall(endpoint: string, duration: number): void {
    if (!this.isEnabled) return;
    this.metrics.apiCalls++;
    console.debug(`[API Call] ${endpoint} - ${duration}ms`);
  }

  /**
   * Track component render time
   */
  recordComponentRender(componentName: string, duration: number): void {
    if (!this.isEnabled) return;
    if (!this.metrics.componentRenderTimes.has(componentName)) {
      this.metrics.componentRenderTimes.set(componentName, []);
    }
    this.metrics.componentRenderTimes.get(componentName)!.push(duration);
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    cacheHitRate: string;
    totalApiCalls: number;
    averageRenderTimes: Record<string, number>;
  } {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    const hitRate = total > 0 ? ((this.metrics.cacheHits / total) * 100).toFixed(2) : '0';

    const avgRenderTimes: Record<string, number> = {};
    this.metrics.componentRenderTimes.forEach((times, name) => {
      avgRenderTimes[name] = times.reduce((a, b) => a + b, 0) / times.length;
    });

    return {
      cacheHitRate: `${hitRate}%`,
      totalApiCalls: this.metrics.apiCalls,
      averageRenderTimes: avgRenderTimes,
    };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      totalLoadTime: 0,
      componentRenderTimes: new Map(),
    };
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Only enable in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.setEnabled(true);
  console.log('%c🚀 Performance Monitoring Enabled', 'color: green; font-size: 14px; font-weight: bold;');
}
