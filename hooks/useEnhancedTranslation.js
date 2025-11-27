import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { performanceTranslationService } from '../services/performanceTranslationService';
import { logTranslation, logError, logInfo } from '../utils/logger';

/**
 * Enhanced Dynamic Translation Hook
 * High-performance translation with smart caching and pre-loading
 */
export const useEnhancedTranslation = (options = {}) => {
  const {
    priority = 'medium',
    enablePreloading = true,
    showProgress = false,
    fallbackToOriginal = true
  } = options;

  const { language } = useContext(LanguageContext);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [error, setError] = useState(null);
  
  // Cache for component-level translations
  const translationCache = useRef(new Map());
  const currentLanguage = useRef(language);

  // Initialize service when hook is first used
  useEffect(() => {
    const initializeService = async () => {
      try {
        await performanceTranslationService.initialize(language);
        logInfo('Enhanced translation service initialized for:', language);
      } catch (error) {
        logError('Failed to initialize translation service:', error);
        setError(error.message);
      }
    };

    initializeService();
  }, []);

  // Clear cache when language changes
  useEffect(() => {
    if (currentLanguage.current !== language) {
      translationCache.current.clear();
      currentLanguage.current = language;
      setError(null);
    }
  }, [language]);

  /**
   * Translate content with enhanced performance features
   */
  const translateContent = useCallback(async (content, options = {}) => {
    if (!content) return content;

    const targetLanguage = options.targetLanguage || language;
    const contentPriority = options.priority || priority;

    // Return original for English or same language
    if (targetLanguage === 'en' || !targetLanguage) {
      return content;
    }

    // Check component cache first
    const cacheKey = `${JSON.stringify(content)}_${targetLanguage}`;
    if (translationCache.current.has(cacheKey)) {
      const cached = translationCache.current.get(cacheKey);
      logTranslation('Component cache HIT for:', targetLanguage);
      return cached;
    }

    setIsTranslating(true);
    setError(null);
    setTranslationProgress(0);

    try {
      const translationOptions = {
        priority: contentPriority,
        fallbackToOriginal,
        showProgress: showProgress && (progress => setTranslationProgress(progress))
      };

      const translated = await performanceTranslationService.translateContent(
        content,
        targetLanguage,
        translationOptions
      );

      // Cache the result in component
      translationCache.current.set(cacheKey, translated);
      
      // Manage cache size (keep last 100 translations)
      if (translationCache.current.size > 100) {
        const firstKey = translationCache.current.keys().next().value;
        translationCache.current.delete(firstKey);
      }

      setTranslationProgress(100);
      return translated;

    } catch (error) {
      logError('Translation error in hook:', error);
      setError(error.message);
      return fallbackToOriginal ? content : null;
    } finally {
      setIsTranslating(false);
    }
  }, [language, priority, fallbackToOriginal, showProgress]);

  /**
   * Translate text immediately with high priority
   */
  const translateTextImmediate = useCallback(async (text, targetLang = null) => {
    return await translateContent(text, {
      targetLanguage: targetLang || language,
      priority: 'high'
    });
  }, [translateContent, language]);

  /**
   * Translate object with progress tracking
   */
  const translateObject = useCallback(async (obj, options = {}) => {
    return await translateContent(obj, {
      ...options,
      targetLanguage: options.targetLanguage || language,
      showProgress: true
    });
  }, [translateContent, language]);

  /**
   * Pre-load translations for content
   */
  const preloadTranslations = useCallback(async (contentList, targetLang = null) => {
    if (!enablePreloading || !contentList) return;

    const targetLanguage = targetLang || language;
    if (targetLanguage === 'en') return;

    try {
      logInfo(`Pre-loading ${contentList.length} items for ${targetLanguage}...`);
      
      const preloadPromises = contentList.map(async (content) => {
        try {
          return await performanceTranslationService.translateContent(content, targetLanguage, {
            priority: 'low', // Use low priority for pre-loading
            fallbackToOriginal: false
          });
        } catch (error) {
          logError('Pre-load item error:', error);
          return null;
        }
      });

      // Process in batches to avoid overwhelming
      const batchSize = 5;
      for (let i = 0; i < preloadPromises.length; i += batchSize) {
        const batch = preloadPromises.slice(i, i + batchSize);
        await Promise.allSettled(batch);
        
        // Small delay between batches
        if (i + batchSize < preloadPromises.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      logInfo(`Pre-loading complete for ${targetLanguage}`);
    } catch (error) {
      logError('Pre-loading error:', error);
    }
  }, [enablePreloading, language]);

  /**
   * Clear translation cache
   */
  const clearCache = useCallback(() => {
    translationCache.current.clear();
    setError(null);
    setTranslationProgress(0);
    logInfo('Component translation cache cleared');
  }, []);

  /**
   * Get current cache statistics
   */
  const getStats = useCallback(() => {
    return {
      service: performanceTranslationService.getStats(),
      component: {
        cacheSize: translationCache.current.size,
        currentLanguage: language,
        isTranslating,
        error: error
      }
    };
  }, [language, isTranslating, error]);

  /**
   * Check if content is likely already cached
   */
  const isCached = useCallback((content, targetLang = null) => {
    const targetLanguage = targetLang || language;
    const cacheKey = `${JSON.stringify(content)}_${targetLanguage}`;
    return translationCache.current.has(cacheKey);
  }, [language]);

  return {
    // Translation functions
    translateContent,
    translateTextImmediate,
    translateObject,
    preloadTranslations,
    
    // State
    isTranslating,
    translationProgress,
    error,
    language,
    
    // Utilities
    clearCache,
    getStats,
    isCached,
    
    // Service access
    service: performanceTranslationService
  };
};

/**
 * Simplified hook for quick text translation
 */
export const useQuickTranslation = () => {
  const { translateTextImmediate, isTranslating, error } = useEnhancedTranslation({
    priority: 'high',
    enablePreloading: false
  });

  return {
    translate: translateTextImmediate,
    isTranslating,
    error
  };
};

/**
 * Hook for pre-loading content translations
 */
export const useTranslationPreloader = () => {
  const { preloadTranslations, getStats } = useEnhancedTranslation({
    priority: 'low',
    enablePreloading: true
  });

  return {
    preload: preloadTranslations,
    getStats
  };
};

export default useEnhancedTranslation;