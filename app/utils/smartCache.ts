/**
 * Smart Caching System for Cryptocurrency Search
 * Handles local search first, then API fallback for comprehensive results
 */

import { type CryptoCurrency } from "~/services/coinbase.server";

export interface CacheEntry {
  data: CryptoCurrency[];
  timestamp: number;
  isLiveData: boolean;
  searchQuery?: string;
  totalAvailable: number;
}

export interface SearchResult {
  cryptocurrencies: CryptoCurrency[];
  totalAvailable: number;
  isLiveData: boolean;
  lastUpdated: string;
  fromCache: boolean;
  searchQuery: string;
  hasMoreResults: boolean;
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const SEARCH_CACHE_KEY = 'crypto-search-cache';
const BASE_CACHE_KEY = 'crypto-base-cache';

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Smart search function that searches locally first, then falls back to API
 */
export class SmartCryptoCache {
  private searchCache: Map<string, CacheEntry> = new Map();
  private baseCache: CacheEntry | null = null;

  /**
   * Initialize cache from localStorage
   */
  constructor() {
    if (isBrowser) {
      this.loadFromStorage();
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      // Load base cache
      const baseData = localStorage.getItem(BASE_CACHE_KEY);
      if (baseData) {
        const parsed = JSON.parse(baseData);
        if (this.isValidCacheEntry(parsed)) {
          this.baseCache = parsed;
        }
      }

      // Load search cache
      const searchData = localStorage.getItem(SEARCH_CACHE_KEY);
      if (searchData) {
        const parsed = JSON.parse(searchData);
        Object.entries(parsed).forEach(([key, value]) => {
          if (this.isValidCacheEntry(value as CacheEntry)) {
            this.searchCache.set(key, value as CacheEntry);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    if (!isBrowser) return;

    try {
      // Save base cache
      if (this.baseCache) {
        localStorage.setItem(BASE_CACHE_KEY, JSON.stringify(this.baseCache));
      }

      // Save search cache (convert Map to Object)
      const searchObject = Object.fromEntries(this.searchCache);
      localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(searchObject));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Validate cache entry structure
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isValidCacheEntry(entry: any): entry is CacheEntry {
    return (
      entry &&
      typeof entry === 'object' &&
      Array.isArray(entry.data) &&
      typeof entry.timestamp === 'number' &&
      typeof entry.isLiveData === 'boolean' &&
      typeof entry.totalAvailable === 'number'
    );
  }

  /**
   * Check if cache entry is still valid
   */
  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  }

  /**
   * Store base cryptocurrency data
   */
  updateBaseCache(data: CryptoCurrency[], isLiveData: boolean, totalAvailable: number): void {
    this.baseCache = {
      data,
      timestamp: Date.now(),
      isLiveData,
      totalAvailable,
    };
    this.saveToStorage();
  }

  /**
   * Store search results
   */
  updateSearchCache(query: string, data: CryptoCurrency[], isLiveData: boolean): void {
    const cacheKey = query.toLowerCase().trim();
    this.searchCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      isLiveData,
      searchQuery: query,
      totalAvailable: data.length,
    });
    this.saveToStorage();
  }

  /**
   * Perform smart search: local first, then API fallback
   */
  async smartSearch(
    query: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiSearchFn: (query: string) => Promise<any>
  ): Promise<SearchResult> {
    const searchTerm = query.toLowerCase().trim();

    // No search query - return base data
    if (!searchTerm) {
      if (this.baseCache && this.isCacheValid(this.baseCache)) {
        return {
          cryptocurrencies: this.baseCache.data,
          totalAvailable: this.baseCache.totalAvailable,
          isLiveData: this.baseCache.isLiveData,
          lastUpdated: new Date(this.baseCache.timestamp).toISOString(),
          fromCache: true,
          searchQuery: '',
          hasMoreResults: false,
        };
      }
    }

    // Check search cache first
    const cachedSearch = this.searchCache.get(searchTerm);
    if (cachedSearch && this.isCacheValid(cachedSearch)) {
      console.log(`📦 Using cached search results for: "${query}"`);
      return {
        cryptocurrencies: cachedSearch.data,
        totalAvailable: cachedSearch.totalAvailable,
        isLiveData: cachedSearch.isLiveData,
        lastUpdated: new Date(cachedSearch.timestamp).toISOString(),
        fromCache: true,
        searchQuery: query,
        hasMoreResults: false,
      };
    }

    // Local search in base cache
    if (this.baseCache && this.isCacheValid(this.baseCache)) {
      const localResults = this.baseCache.data.filter(crypto => {
        const nameMatch = crypto.name.toLowerCase().includes(searchTerm);
        const symbolMatch = crypto.symbol.toLowerCase().includes(searchTerm);
        return nameMatch || symbolMatch;
      });

      // If we found results locally and the base cache has limited data,
      // we might want to search API for more comprehensive results
      const shouldSearchAPI = localResults.length === 0 ||
        (localResults.length < 3 && this.baseCache.data.length < 15);

      if (!shouldSearchAPI && localResults.length > 0) {
        console.log(`🔍 Using local search results for: "${query}"`);
        this.updateSearchCache(query, localResults, this.baseCache.isLiveData);
        return {
          cryptocurrencies: localResults,
          totalAvailable: localResults.length,
          isLiveData: this.baseCache.isLiveData,
          lastUpdated: new Date(this.baseCache.timestamp).toISOString(),
          fromCache: true,
          searchQuery: query,
          hasMoreResults: false,
        };
      }
    }

    // Fallback to API search
    console.log(`🌐 Searching API for: "${query}"`);
    try {
      const apiResult = await apiSearchFn(query);

      // Cache the API results
      this.updateSearchCache(query, apiResult.cryptocurrencies, apiResult.isLiveData);

      return {
        cryptocurrencies: apiResult.cryptocurrencies,
        totalAvailable: apiResult.totalAvailable || apiResult.cryptocurrencies.length,
        isLiveData: apiResult.isLiveData,
        lastUpdated: apiResult.lastUpdated,
        fromCache: false,
        searchQuery: query,
        hasMoreResults: apiResult.cryptocurrencies.length >= 20,
      };
    } catch (error) {
      console.error('API search failed:', error);

      // Last resort: return any local results we might have
      if (this.baseCache) {
        const localResults = this.baseCache.data.filter(crypto => {
          const nameMatch = crypto.name.toLowerCase().includes(searchTerm);
          const symbolMatch = crypto.symbol.toLowerCase().includes(searchTerm);
          return nameMatch || symbolMatch;
        });

        return {
          cryptocurrencies: localResults,
          totalAvailable: localResults.length,
          isLiveData: this.baseCache.isLiveData,
          lastUpdated: new Date(this.baseCache.timestamp).toISOString(),
          fromCache: true,
          searchQuery: query,
          hasMoreResults: false,
        };
      }

      throw error;
    }
  }

  /**
   * Clear all cache data
   */
  clearCache(): void {
    this.baseCache = null;
    this.searchCache.clear();

    if (isBrowser) {
      localStorage.removeItem(BASE_CACHE_KEY);
      localStorage.removeItem(SEARCH_CACHE_KEY);
    }
  }

  /**
   * Get cache status for debugging
   */
  getCacheStatus(): {
    baseCacheValid: boolean;
    searchCacheSize: number;
    baseCacheAge?: number;
  } {
    return {
      baseCacheValid: this.baseCache ? this.isCacheValid(this.baseCache) : false,
      searchCacheSize: this.searchCache.size,
      baseCacheAge: this.baseCache ? Date.now() - this.baseCache.timestamp : undefined,
    };
  }
}

// Export singleton instance
export const smartCache = new SmartCryptoCache();