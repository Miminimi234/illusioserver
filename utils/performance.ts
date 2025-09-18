// Performance optimization utilities

// Debounce function for API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for frequent updates
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Cache for API responses
class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 30000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const apiCache = new APICache();

// Performance monitoring
export class PerformanceMonitor {
  private metrics: { [key: string]: number[] } = {};

  startTiming(key: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (!this.metrics[key]) {
        this.metrics[key] = [];
      }
      this.metrics[key].push(duration);
    };
  }

  getAverageTime(key: string): number {
    const times = this.metrics[key];
    if (!times || times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  getMetrics(): { [key: string]: { average: number; count: number } } {
    const result: { [key: string]: { average: number; count: number } } = {};
    for (const [key, times] of Object.entries(this.metrics)) {
      result[key] = {
        average: this.getAverageTime(key),
        count: times.length
      };
    }
    return result;
  }

  clear() {
    this.metrics = {};
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Optimized fetch with caching and retry
export async function optimizedFetch(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  ttl: number = 30000
): Promise<Response> {
  // Check cache first
  if (cacheKey) {
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (response.ok && cacheKey) {
      const data = await response.clone().json();
      apiCache.set(cacheKey, data, ttl);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Cleanup expired cache entries every 5 minutes
setInterval(() => {
  apiCache.cleanup();
}, 5 * 60 * 1000);
