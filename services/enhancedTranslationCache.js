import AsyncStorage from '@react-native-async-storage/async-storage';
import { translationService } from './translationService';
import { logTranslation, logError, logInfo } from '../utils/logger';

/**
 * Enhanced Translation Cache Service
 * High-performance caching with smart pre-loading for Chinese content
 */
class EnhancedTranslationCache {
  constructor() {
    this.memoryCache = new Map(); // In-memory cache for instant access
    this.cacheStats = {
      hits: 0,
      misses: 0,
      preloadHits: 0
    };
    this.preloadQueue = new Set(); // Track what's being pre-loaded
    this.popularContent = new Set(); // Track frequently accessed content
    
    // Cache configuration
    this.config = {
      maxMemoryCacheSize: 1000, // Maximum items in memory
      maxStorageCacheSize: 5000, // Maximum items in AsyncStorage
      cacheExpiryDays: 7,
      preloadLanguages: ['zh'], // Pre-load Chinese content
      popularityThreshold: 3 // Access count to mark as popular
    };
  }

  /**
   * Generate cache key for content
   */
  getCacheKey(text, targetLanguage, sourceLanguage = 'en') {
    const textHash = this.simpleHash(text.substring(0, 100)); // Use first 100 chars for key
    return `${sourceLanguage}_${targetLanguage}_${textHash}`;
  }

  /**
   * Simple hash function for cache keys
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get translation from cache (memory first, then storage)
   */
  async getFromCache(text, targetLanguage, sourceLanguage = 'en') {
    const cacheKey = this.getCacheKey(text, targetLanguage, sourceLanguage);
    
    // Check memory cache first (fastest)
    if (this.memoryCache.has(cacheKey)) {
      const cached = this.memoryCache.get(cacheKey);
      if (this.isValidCache(cached)) {
        this.cacheStats.hits++;
        this.trackPopularity(cacheKey);
        logTranslation(`Memory cache HIT for ${targetLanguage}:`, text.substring(0, 50));
        return cached.translation;
      } else {
        this.memoryCache.delete(cacheKey);
      }
    }

    // Check AsyncStorage cache
    try {
      const storageKey = `@curio_translation_${cacheKey}`;
      const cachedData = await AsyncStorage.getItem(storageKey);
      
      if (cachedData) {
        const cached = JSON.parse(cachedData);
        if (this.isValidCache(cached)) {
          // Move to memory cache for faster future access
          this.memoryCache.set(cacheKey, cached);
          this.cacheStats.hits++;
          this.trackPopularity(cacheKey);
          logTranslation(`Storage cache HIT for ${targetLanguage}:`, text.substring(0, 50));
          return cached.translation;
        } else {
          // Remove expired cache
          await AsyncStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      logError('Error reading from cache:', error);
    }

    this.cacheStats.misses++;
    return null;
  }

  /**
   * Store translation in cache
   */
  async storeInCache(text, translation, targetLanguage, sourceLanguage = 'en') {
    const cacheKey = this.getCacheKey(text, targetLanguage, sourceLanguage);
    const cacheData = {
      translation,
      timestamp: Date.now(),
      sourceText: text.substring(0, 200), // Store beginning for debugging
      accessCount: 1
    };

    // Store in memory cache
    this.memoryCache.set(cacheKey, cacheData);
    
    // Manage memory cache size
    if (this.memoryCache.size > this.config.maxMemoryCacheSize) {
      const oldestKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(oldestKey);
    }

    // Store in AsyncStorage for persistence
    try {
      const storageKey = `@curio_translation_${cacheKey}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(cacheData));
      logTranslation(`Cached translation for ${targetLanguage}:`, text.substring(0, 50));
    } catch (error) {
      logError('Error storing cache:', error);
    }
  }

  /**
   * Check if cached data is still valid
   */
  isValidCache(cached) {
    const maxAge = this.config.cacheExpiryDays * 24 * 60 * 60 * 1000;
    return cached && cached.timestamp && (Date.now() - cached.timestamp < maxAge);
  }

  /**
   * Track content popularity for smart pre-loading
   */
  trackPopularity(cacheKey) {
    const cached = this.memoryCache.get(cacheKey);
    if (cached) {
      cached.accessCount = (cached.accessCount || 0) + 1;
      if (cached.accessCount >= this.config.popularityThreshold) {
        this.popularContent.add(cacheKey);
      }
    }
  }

  /**
   * Pre-load popular content for Chinese users
   */
  async preloadChineseContent(contentList) {
    if (!contentList || contentList.length === 0) return;

    logInfo('Starting Chinese content pre-loading...');
    const preloadPromises = [];

    for (const content of contentList.slice(0, 20)) { // Limit to top 20 items
      if (typeof content === 'string' && content.length > 10) {
        const cacheKey = this.getCacheKey(content, 'zh');
        
        if (!this.preloadQueue.has(cacheKey)) {
          this.preloadQueue.add(cacheKey);
          
          const preloadPromise = this.getFromCache(content, 'zh')
            .then(cached => {
              if (!cached) {
                // Not in cache, translate and store
                return translationService.translateText(content, 'zh')
                  .then(translation => {
                    return this.storeInCache(content, translation, 'zh');
                  });
              }
              return cached;
            })
            .catch(error => {
              logError('Pre-load error:', error);
            })
            .finally(() => {
              this.preloadQueue.delete(cacheKey);
            });

          preloadPromises.push(preloadPromise);
        }
      }
    }

    // Execute pre-loading in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < preloadPromises.length; i += batchSize) {
      const batch = preloadPromises.slice(i, i + batchSize);
      await Promise.allSettled(batch);
      
      // Small delay between batches
      if (i + batchSize < preloadPromises.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    logInfo(`Chinese pre-loading complete. Processed ${preloadPromises.length} items.`);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const totalRequests = this.cacheStats.hits + this.cacheStats.misses;
    const hitRate = totalRequests > 0 ? (this.cacheStats.hits / totalRequests * 100).toFixed(1) : 0;
    
    return {
      ...this.cacheStats,
      hitRate: `${hitRate}%`,
      memoryCacheSize: this.memoryCache.size,
      popularItems: this.popularContent.size,
      preloadQueueSize: this.preloadQueue.size
    };
  }

  /**
   * Clear cache (for debugging/maintenance)
   */
  async clearCache() {
    this.memoryCache.clear();
    this.popularContent.clear();
    this.preloadQueue.clear();
    
    try {
      const keys = await AsyncStorage.getAllKeys();
      const translationKeys = keys.filter(key => key.startsWith('@curio_translation_'));
      await AsyncStorage.multiRemove(translationKeys);
      logInfo('Cache cleared successfully');
    } catch (error) {
      logError('Error clearing cache:', error);
    }
  }
}

// Export singleton instance
export const enhancedTranslationCache = new EnhancedTranslationCache();