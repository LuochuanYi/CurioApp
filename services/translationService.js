// Dynamic Translation Service
// Provides real-time translation for content while caching results for performance
import { TRANSLATION_CONFIG, MOCK_TRANSLATIONS } from '../config/translationConfig';

class TranslationService {
  constructor() {
    this.cache = new Map();
    this.isOnline = true;
    this.supportedLanguages = {
      'en': 'English',
      'zh': 'Chinese (Simplified)', 
      'fr': 'French',
      'es': 'Spanish',
      'uk': 'Ukrainian',
      'nl': 'Dutch'
    };
  }

  // Generate cache key for translations
  getCacheKey(text, fromLang, toLang) {
    return `${fromLang}-${toLang}-${text.substring(0, 50)}`;
  }

  // Translation API with configurable providers
  async translateWithAPI(text, fromLang = 'en', toLang = 'zh') {
    // Simulate API call delay for mock provider
    if (TRANSLATION_CONFIG.provider === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const key = `${fromLang}-${toLang}`;
      const translations = MOCK_TRANSLATIONS[key] || {};
      
      return translations[text] || text; // Return original if no translation found
    }
    
    // TODO: Add real API implementations for production
    // For now, fallback to mock translations
    const key = `${fromLang}-${toLang}`;
    const translations = MOCK_TRANSLATIONS[key] || {};
    return translations[text] || text;
  }

  // Main translation method with caching
  async translateText(text, targetLanguage = 'zh', sourceLanguage = 'en') {
    // Return original if same language
    if (sourceLanguage === targetLanguage) {
      return text;
    }

    // Return original if target is English (no translation needed)
    if (targetLanguage === 'en') {
      return text;
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, sourceLanguage, targetLanguage);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Translate using API
      const translated = await this.translateWithAPI(text, sourceLanguage, targetLanguage);
      
      // Cache the result
      this.cache.set(cacheKey, translated);
      
      return translated;
    } catch (error) {
      console.warn('Translation failed, using original text:', error);
      return text; // Fallback to original text
    }
  }

  // Batch translate multiple texts
  async translateBatch(texts, targetLanguage = 'zh', sourceLanguage = 'en') {
    const promises = texts.map(text => this.translateText(text, targetLanguage, sourceLanguage));
    return Promise.all(promises);
  }

  // Translate story object
  async translateStory(story, targetLanguage = 'zh') {
    if (targetLanguage === 'en') return story;

    try {
      const [translatedTitle, translatedSummary] = await Promise.all([
        this.translateText(story.title, targetLanguage),
        this.translateText(story.summary, targetLanguage)
      ]);

      return {
        ...story,
        title: translatedTitle,
        summary: translatedSummary,
        originalTitle: story.title,
        originalSummary: story.summary
      };
    } catch (error) {
      console.warn('Story translation failed:', error);
      return story;
    }
  }

  // Translate category
  async translateCategory(category, targetLanguage = 'zh') {
    if (targetLanguage === 'en') return category;

    try {
      const translatedName = await this.translateText(category.name, targetLanguage);
      return {
        ...category,
        name: translatedName,
        originalName: category.name
      };
    } catch (error) {
      console.warn('Category translation failed:', error);
      return category;
    }
  }

  // Clear cache (useful for memory management)
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      supportedLanguages: Object.keys(this.supportedLanguages)
    };
  }
}

// Create singleton instance
const translationService = new TranslationService();

export default translationService;

// Utility functions for easy use
export const translateText = (text, targetLang) => 
  translationService.translateText(text, targetLang);

export const translateStory = (story, targetLang) => 
  translationService.translateStory(story, targetLang);

export const translateCategory = (category, targetLang) => 
  translationService.translateCategory(category, targetLang);

export const translateBatch = (texts, targetLang) => 
  translationService.translateBatch(texts, targetLang);