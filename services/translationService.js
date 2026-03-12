// Dynamic Translation Service
// Provides real-time translation for content while caching results for performance
import { TRANSLATION_CONFIG, MOCK_TRANSLATIONS, translateWithMyMemory } from '../config/translationConfig';
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

  // Guard against mixed/failed Chinese output from weak fallback translators
  isLowQualityChineseTranslation(translatedText, originalText) {
    if (!translatedText || translatedText === originalText) return true;

    const chineseChars = (translatedText.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishChars = (translatedText.match(/[A-Za-z]/g) || []).length;

    // If there's no Chinese, or English dominates heavily, treat as low quality.
    return chineseChars === 0 || englishChars > chineseChars * 1.2;
  }

  // Generate cache key for translations
  getCacheKey(text, fromLang, toLang) {
    return `${fromLang}-${toLang}-${text.substring(0, 50)}`;
  }

  // Translation API with configurable providers
  async translateWithAPI(text, fromLang = 'en', toLang = 'zh') {
    logTranslation(`Translating: "${text.substring(0, 50)}..." from ${fromLang} to ${toLang}`);
    logTranslation(`Using provider: ${TRANSLATION_CONFIG.provider}`);
    
    // Check provider configuration
    if (TRANSLATION_CONFIG.provider === 'mock') {
      logTranslation('Using mock provider directly');
      return this.getMockTranslation(text, fromLang, toLang);
    }
    
    // Try MyMemory API (free, no key required).
    // Also use it as the first real attempt when provider is disabled for Chinese.
    if (TRANSLATION_CONFIG.provider === 'mymemory' || (TRANSLATION_CONFIG.provider === 'disabled' && toLang === 'zh')) {
      try {
        logTranslation('Using MyMemory API for translation');
        const result = await translateWithMyMemory(text, toLang, fromLang);
        if (toLang === 'zh' && this.isLowQualityChineseTranslation(result, text)) {
          throw new Error('MyMemory returned low-quality Chinese translation');
        }
        logTranslation(`MyMemory translation successful: "${result.substring(0, 50)}..."`);
        return result;
      } catch (error) {
        logWarn('MyMemory API failed:', error.message);
        // Fall through to alternative service
      }
    }
    
    // Use alternative service (CORS-free)
    if (TRANSLATION_CONFIG.provider === 'alternative') {
      try {
        logTranslation('Using alternative translation service');
        const result = await alternativeTranslationService.translateWithBackup(text, toLang);
        logTranslation(`Alternative translation successful: "${result.substring(0, 50)}..."`);
        return result;
      } catch (error) {
        logWarn('Alternative service failed:', error.message);
        // Fall through to mock
      }
    }
    
    // For other providers, use enhanced alternative translation service as primary method (CORS-free)
    try {
      logTranslation(`Calling alternative translation service...`);
      const alternativeResult = await alternativeTranslationService.translateWithBackup(text, toLang);
      logTranslation(`Alternative service returned: "${alternativeResult.substring(0, 50)}..."`);

      if (toLang === 'zh' && this.isLowQualityChineseTranslation(alternativeResult, text)) {
        throw new Error('Alternative service returned mixed/low-quality Chinese output');
      }
      
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
    
    console.log('🔍 MOCK TRANSLATION DEBUG (StoryDetail):');
    console.log('Text to translate:', `"${text}"`);
    console.log('From language:', fromLang);
    console.log('To language:', toLang);
    console.log('Translation key:', key);
    console.log('Available translations count:', Object.keys(translations).length);
    console.log('First few available keys:', Object.keys(translations).slice(0, 5));
    
    // Try exact match first
    if (translations[text]) {
      console.log('✅ Found exact match:', translations[text]);
      logTranslation(`Using mock translation for: "${text.substring(0, 30)}..."`);
      return translations[text];
    }
    
    // Try partial matches for any text length
    for (const [mockText, translation] of Object.entries(translations)) {
      if (text.includes(mockText) && mockText.length > 3) {
        console.log('✅ Found partial match:', mockText, '→', translation);
        logTranslation(`Using partial mock translation for: "${mockText}"`);
        return translation;
      }
    }
    
    // Try case-insensitive exact matches
    const lowerText = text.toLowerCase();
    for (const [mockText, translation] of Object.entries(translations)) {
      if (lowerText === mockText.toLowerCase()) {
        console.log('✅ Found case-insensitive match:', mockText, '→', translation);
        return translation;
      }
    }
    
    console.log('❌ No translation found, returning original text');
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