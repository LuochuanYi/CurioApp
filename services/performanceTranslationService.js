import { enhancedTranslationCache } from './enhancedTranslationCache';
import translationService from './translationService';
import { logTranslation, logError, logInfo } from '../utils/logger';

/**
 * Performance-First Translation Service
 * Combines instant UI switching with smart content translation
 */
class PerformanceTranslationService {
  constructor() {
    this.isInitialized = false;
    this.backgroundQueue = [];
    this.isProcessingBackground = false;
    
    // Content priority configuration
    this.contentPriority = {
      // High priority content for immediate translation
      high: ['title', 'description', 'summary'],
      // Medium priority - translate on demand with caching
      medium: ['lyrics', 'content', 'text'],
      // Low priority - background translation when idle
      low: ['metadata', 'tags', 'notes']
    };

    // Popular content tracking
    this.popularContent = {
      stories: [],
      songs: [],
      activities: []
    };
  }

  /**
   * Initialize service and start background processes
   */
  async initialize(userLanguage = 'en') {
    if (this.isInitialized) return;

    logInfo('Initializing performance translation service...');
    
    try {
      // Extract popular content for pre-loading
      await this.identifyPopularContent();
      
      // Start background pre-loading for Chinese if user might need it
      if (userLanguage === 'zh' || userLanguage === 'en') {
        this.startBackgroundPreloading();
      }

      this.isInitialized = true;
      logInfo('Performance translation service initialized successfully');
    } catch (error) {
      logError('Failed to initialize translation service:', error);
    }
  }

  /**
   * Translate content with performance optimizations
   */
  async translateContent(content, targetLanguage, options = {}) {
    const {
      priority = 'medium',
      fallbackToOriginal = true,
      showProgress = false
    } = options;

    // Return original if same language
    if (targetLanguage === 'en' || !targetLanguage) {
      return content;
    }

    try {
      // Handle different content types
      if (typeof content === 'string') {
        return await this.translateText(content, targetLanguage, { priority, fallbackToOriginal });
      } else if (Array.isArray(content)) {
        return await this.translateArray(content, targetLanguage, { priority, showProgress });
      } else if (typeof content === 'object') {
        return await this.translateObject(content, targetLanguage, { priority, showProgress });
      }

      return content;
    } catch (error) {
      logError('Translation error:', error);
      return fallbackToOriginal ? content : null;
    }
  }

  /**
   * Translate single text with caching and fallbacks
   */
  async translateText(text, targetLanguage, options = {}) {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return text;
    }

    const { priority = 'medium', fallbackToOriginal = true } = options;

    try {
      // Check cache first (fastest path)
      const cached = await enhancedTranslationCache.getFromCache(text, targetLanguage);
      if (cached) {
        return cached;
      }

      // High priority: translate immediately
      if (priority === 'high') {
        const translation = await translationService.translateText(text, targetLanguage);
        if (translation && translation !== text) {
          await enhancedTranslationCache.storeInCache(text, translation, targetLanguage);
          return translation;
        }
      }

      // Medium priority: translate with timeout
      if (priority === 'medium') {
        const translation = await Promise.race([
          translationService.translateText(text, targetLanguage),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Translation timeout')), 5000)
          )
        ]);

        if (translation && translation !== text) {
          await enhancedTranslationCache.storeInCache(text, translation, targetLanguage);
          return translation;
        }
      }

      // Low priority: add to background queue
      if (priority === 'low') {
        this.addToBackgroundQueue(text, targetLanguage);
        return fallbackToOriginal ? text : null;
      }

      return fallbackToOriginal ? text : null;

    } catch (error) {
      logError(`Translation failed for "${text.substring(0, 50)}...":`, error);
      return fallbackToOriginal ? text : null;
    }
  }

  /**
   * Translate array of content with progress tracking
   */
  async translateArray(contentArray, targetLanguage, options = {}) {
    const { priority = 'medium', showProgress = false } = options;
    const results = [];
    
    for (let i = 0; i < contentArray.length; i++) {
      const item = contentArray[i];
      
      if (showProgress && i % 5 === 0) {
        logTranslation(`Translating array progress: ${i + 1}/${contentArray.length}`);
      }

      const translated = await this.translateContent(item, targetLanguage, { priority });
      results.push(translated);

      // Small delay for large arrays to prevent overwhelming
      if (contentArray.length > 20 && i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  /**
   * Translate object properties intelligently
   */
  async translateObject(contentObj, targetLanguage, options = {}) {
    if (!contentObj || typeof contentObj !== 'object') {
      return contentObj;
    }

    const { priority = 'medium', showProgress = false } = options;
    const translated = { ...contentObj };

    // Define which properties to translate based on priority
    const translatableProps = {
      high: ['title', 'name', 'summary'],
      medium: ['description', 'content', 'text', 'line'],
      low: ['notes', 'metadata', 'tags']
    };

    const propsToTranslate = [
      ...(translatableProps.high || []),
      ...(priority !== 'low' ? (translatableProps.medium || []) : []),
      ...(priority === 'high' ? (translatableProps.low || []) : [])
    ];

    for (const prop of propsToTranslate) {
      if (contentObj[prop]) {
        if (showProgress) {
          logTranslation(`Translating property: ${prop}`);
        }

        translated[prop] = await this.translateContent(
          contentObj[prop], 
          targetLanguage, 
          { priority: this.getPropertyPriority(prop) }
        );
      }
    }

    // Handle nested arrays (like lyrics)
    if (contentObj.lyrics && Array.isArray(contentObj.lyrics)) {
      translated.lyrics = await this.translateArray(
        contentObj.lyrics, 
        targetLanguage, 
        { priority: 'medium' }
      );
    }

    return translated;
  }

  /**
   * Get priority level for specific properties
   */
  getPropertyPriority(propName) {
    if (this.contentPriority.high.includes(propName)) return 'high';
    if (this.contentPriority.medium.includes(propName)) return 'medium';
    return 'low';
  }

  /**
   * Add content to background translation queue
   */
  addToBackgroundQueue(text, targetLanguage) {
    this.backgroundQueue.push({ text, targetLanguage, timestamp: Date.now() });
    
    // Start processing if not already running
    if (!this.isProcessingBackground) {
      this.processBackgroundQueue();
    }
  }

  /**
   * Process background translation queue during idle time
   */
  async processBackgroundQueue() {
    if (this.isProcessingBackground || this.backgroundQueue.length === 0) return;

    this.isProcessingBackground = true;
    logInfo(`Processing ${this.backgroundQueue.length} background translations...`);

    while (this.backgroundQueue.length > 0) {
      const { text, targetLanguage } = this.backgroundQueue.shift();
      
      try {
        // Check if still needed (not in cache)
        const cached = await enhancedTranslationCache.getFromCache(text, targetLanguage);
        if (!cached) {
          const translation = await translationService.translateText(text, targetLanguage);
          if (translation && translation !== text) {
            await enhancedTranslationCache.storeInCache(text, translation, targetLanguage);
          }
        }
      } catch (error) {
        logError('Background translation error:', error);
      }

      // Small delay between background translations
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    this.isProcessingBackground = false;
    logInfo('Background translation queue processed');
  }

  /**
   * Identify popular content for pre-loading
   */
  async identifyPopularContent() {
    // This would typically be based on analytics, but for now we'll use a simple approach
    try {
      // Import content using existing exports
      const { SONGS_LIBRARY } = await import('../data/songs');
      const { STORIES } = await import('../data/stories');
      
      // Get first few items as "popular" content (most commonly accessed)
      const songs = SONGS_LIBRARY ? SONGS_LIBRARY.slice(0, 10) : [];
      const stories = STORIES ? STORIES.slice(0, 10) : [];

      this.popularContent = {
        songs: songs.map(song => ({
          title: song.title,
          description: song.description,
          lyrics: song.lyrics?.slice(0, 5).map(lyric => lyric.line || lyric) // First 5 lyrics lines
        })),
        stories: stories.map(story => ({
          title: story.title,
          description: story.description,
          content: typeof story.content === 'string' 
            ? story.content.substring(0, 500) // First 500 chars
            : story.summary || story.title // Use summary if content is not string
        }))
      };

      logInfo(`Identified popular content: ${songs.length} songs, ${stories.length} stories`);
    } catch (error) {
      logError('Error identifying popular content:', error);
      // Fallback to empty content if imports fail
      this.popularContent = { songs: [], stories: [] };
    }
  }

  /**
   * Start background pre-loading for Chinese content
   */
  startBackgroundPreloading() {
    logInfo('Starting Chinese content pre-loading...');
    
    // Pre-load popular content
    setTimeout(async () => {
      try {
        const contentToPreload = [];
        
        // Add popular songs
        this.popularContent.songs.forEach(song => {
          if (song.title) contentToPreload.push(song.title);
          if (song.description) contentToPreload.push(song.description);
        });

        // Add popular stories
        this.popularContent.stories.forEach(story => {
          if (story.title) contentToPreload.push(story.title);
          if (story.description) contentToPreload.push(story.description);
        });

        await enhancedTranslationCache.preloadChineseContent(contentToPreload);
      } catch (error) {
        logError('Pre-loading error:', error);
      }
    }, 2000); // Start after 2 seconds to not block initial app loading
  }

  /**
   * Get service statistics
   */
  getStats() {
    return {
      cache: enhancedTranslationCache.getStats(),
      backgroundQueue: this.backgroundQueue.length,
      isProcessing: this.isProcessingBackground,
      popularContentSize: Object.keys(this.popularContent).reduce(
        (acc, key) => acc + this.popularContent[key].length, 0
      )
    };
  }

  /**
   * Clear all caches and reset service
   */
  async reset() {
    this.backgroundQueue = [];
    this.isProcessingBackground = false;
    await enhancedTranslationCache.clearCache();
    logInfo('Translation service reset completed');
  }
}

// Export singleton instance
export const performanceTranslationService = new PerformanceTranslationService();
export default performanceTranslationService;