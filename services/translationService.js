// Dynamic Translation Service
// Provides real-time translation for content while caching results for performance
import { TRANSLATION_CONFIG, MOCK_TRANSLATIONS } from '../config/translationConfig';
import alternativeTranslationService from './alternativeTranslationService';
import { logTranslation, logError, logWarn } from '../utils/logger';

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
    logTranslation(`Translating: "${text.substring(0, 50)}..." from ${fromLang} to ${toLang}`);
    
    // Use enhanced alternative translation service as primary method (CORS-free)
    try {
      logTranslation(`Calling alternative translation service...`);
      const alternativeResult = await alternativeTranslationService.translateWithBackup(text, toLang);
      logTranslation(`Alternative service returned: "${alternativeResult.substring(0, 50)}..."`);
      
      if (alternativeResult && alternativeResult !== text) {
        logTranslation(`Alternative translation successful: "${alternativeResult.substring(0, 50)}..."`);
        return alternativeResult;
      } else {
        logTranslation(`Alternative translation returned same text or empty result`);
      }
    } catch (altError) {
      logWarn('Alternative translation failed:', altError.message);
    }
    
    // Fallback to mock translations
    logTranslation('Using mock translations as fallback');
    return this.getMockTranslation(text, fromLang, toLang);
  }

  // Fallback method for mock translations
  getMockTranslation(text, fromLang, toLang) {
    const key = `${fromLang}-${toLang}`;
    const translations = MOCK_TRANSLATIONS[key] || {};
    
    // Try exact match first
    if (translations[text]) {
      logTranslation(`Using mock translation for: "${text.substring(0, 30)}..."`);
      return translations[text];
    }
    
    // For longer text, try to find partial matches
    if (text.length > 50) {
      for (const [mockText, translation] of Object.entries(translations)) {
        if (text.includes(mockText) && mockText.length > 10) {
          logTranslation(`Using partial mock translation for: "${mockText}"`);
          return translation;
        }
      }
    }
    
    logTranslation(`No mock translation found for: "${text.substring(0, 30)}...", using original`);
    return text; // Return original if no translation found
  }

  // Split long text into sentences for better translation
  splitIntoSentences(text) {
    if (!text) return [];
    // Split by periods, exclamation marks, question marks while preserving the punctuation
    return text.split(/([.!?]+\s+)/).filter(chunk => chunk.trim().length > 0);
  }

  // Add request debouncing to prevent too many API calls
  async debounceTranslation(text, targetLanguage, sourceLanguage) {
    const key = `${sourceLanguage}-${targetLanguage}-${text}`;
    
    if (this.pendingTranslations && this.pendingTranslations[key]) {
      return this.pendingTranslations[key];
    }
    
    const translationPromise = this.translateText(text, targetLanguage, sourceLanguage);
    
    if (!this.pendingTranslations) this.pendingTranslations = {};
    this.pendingTranslations[key] = translationPromise;
    
    try {
      const result = await translationPromise;
      delete this.pendingTranslations[key];
      return result;
    } catch (error) {
      delete this.pendingTranslations[key];
      throw error;
    }
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
      // For long text, break into sentences and translate each
      if (text.length > 200) {
        const sentences = this.splitIntoSentences(text);
        const translatedSentences = [];
        
        for (const sentence of sentences) {
          if (sentence.trim()) {
            const translatedSentence = await this.translateWithAPI(sentence.trim(), sourceLanguage, targetLanguage);
            translatedSentences.push(translatedSentence);
          } else {
            translatedSentences.push(sentence); // Keep spacing/punctuation
          }
        }
        
        const result = translatedSentences.join(' ');
        this.cache.set(cacheKey, result);
        return result;
      } else {
        // Translate short text directly
        const translated = await this.translateWithAPI(text, sourceLanguage, targetLanguage);
        
        // Cache the result
        this.cache.set(cacheKey, translated);
        
        return translated;
      }
    } catch (error) {
      logWarn('Translation failed, using original text:', error);
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
      logWarn('Story translation failed:', error);
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
      logWarn('Category translation failed:', error);
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