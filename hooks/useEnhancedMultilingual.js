// Enhanced Multilingual Hook - Best Practice Implementation
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import translationService from '../services/translationService';
import * as Speech from 'expo-speech';
import { logTranslation, logSpeech } from '../utils/logger';

// Voice language mapping for natural pronunciation
const VOICE_LANGUAGE_MAP = {
  'en': { code: 'en-US', voice: 'com.apple.ttsbundle.Samantha-compact' },
  'zh': { code: 'zh-CN', voice: 'com.apple.ttsbundle.Ting-Ting-compact' },
  'fr': { code: 'fr-FR', voice: 'com.apple.ttsbundle.Thomas-compact' },
  'es': { code: 'es-ES', voice: 'com.apple.ttsbundle.Monica-compact' },
  'uk': { code: 'uk-UA', voice: 'com.apple.ttsbundle.Lesya-compact' },
  'nl': { code: 'nl-NL', voice: 'com.apple.ttsbundle.Xander-compact' }
};

// Content priority system for translation strategies
const TRANSLATION_STRATEGIES = {
  INSTANT: 'instant',     // Static pre-translated content
  CACHED: 'cached',       // Previously translated with cache
  REALTIME: 'realtime',   // On-demand API translation
  FALLBACK: 'fallback'    // Mock/alternative service
};

export const useEnhancedMultilingual = () => {
  const { getCurrentLanguageInfo } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationStrategy, setTranslationStrategy] = useState(TRANSLATION_STRATEGIES.CACHED);

  // Get comprehensive language info
  const getLanguageContext = () => {
    const current = getCurrentLanguageInfo();
    const langCode = getLanguageCode(current?.name);
    
    return {
      displayName: current?.name || 'English',
      code: langCode,
      voice: VOICE_LANGUAGE_MAP[langCode] || VOICE_LANGUAGE_MAP['en'],
      isRTL: ['uk'].includes(langCode), // Add RTL languages as needed
      needsTranslation: langCode !== 'en'
    };
  };

  // Enhanced translation with strategy selection
  const translateWithStrategy = async (text, strategy = TRANSLATION_STRATEGIES.CACHED) => {
    const context = getLanguageContext();
    
    if (!context.needsTranslation) return text;

    setIsTranslating(true);
    try {
      switch (strategy) {
        case TRANSLATION_STRATEGIES.INSTANT:
          // Use pre-translated content (fastest)
          return getPreTranslatedContent(text, context.code) || text;
          
        case TRANSLATION_STRATEGIES.CACHED:
          // Use cached translation service (current approach - recommended)
          return await translationService.translateText(text, context.code);
          
        case TRANSLATION_STRATEGIES.REALTIME:
          // Force fresh API call (bypass cache)
          translationService.clearCache();
          return await translationService.translateText(text, context.code);
          
        case TRANSLATION_STRATEGIES.FALLBACK:
          // Use alternative/mock service only
          return await translationService.getMockTranslation(text, 'en', context.code);
          
        default:
          return await translationService.translateText(text, context.code);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  // Voice-synchronized content translation
  const translateForVoice = async (text, includePhonetics = false) => {
    const context = getLanguageContext();
    const translated = await translateWithStrategy(text);
    
    return {
      text: translated,
      voiceConfig: {
        language: context.voice.code,
        voice: context.voice.voice,
        rate: getOptimalSpeechRate(context.code),
        pitch: getOptimalPitch(context.code)
      },
      phonetics: includePhonetics ? await getPhoneticGuide(translated, context.code) : null
    };
  };

  // Batch translation with performance optimization
  const translateBatch = async (texts, priority = 'normal') => {
    const context = getLanguageContext();
    
    if (!context.needsTranslation) return texts;

    const strategy = priority === 'high' ? TRANSLATION_STRATEGIES.INSTANT : TRANSLATION_STRATEGIES.CACHED;
    
    // Process in chunks for better performance
    const chunkSize = 5;
    const results = [];
    
    for (let i = 0; i < texts.length; i += chunkSize) {
      const chunk = texts.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map(text => translateWithStrategy(text, strategy))
      );
      results.push(...chunkResults);
    }
    
    return results;
  };

  return {
    // Core translation
    translateText: translateWithStrategy,
    translateForVoice,
    translateBatch,
    
    // Language context
    getLanguageContext,
    isTranslating,
    
    // Strategy management
    setTranslationStrategy,
    currentStrategy: translationStrategy,
    
    // Performance utilities
    preloadCommonPhrases: () => preloadTranslations(getLanguageContext().code),
    optimizeCache: () => translationService.clearCache()
  };
};

// Helper functions
const getLanguageCode = (displayName) => {
  const mapping = {
    'English': 'en', 'Chinese': 'zh', 'French': 'fr',
    'Spanish': 'es', 'Ukrainian': 'uk', 'Flemish': 'nl'
  };
  return mapping[displayName] || 'en';
};

const getPreTranslatedContent = (text, langCode) => {
  // Check for pre-translated static content
  // This would be populated with common phrases/content
  const preTranslated = {
    'zh': {
      'Welcome': '欢迎',
      'Story': '故事',
      'Song': '歌曲',
      'Categories': '类别'
    },
    'fr': {
      'Welcome': 'Bienvenue',
      'Story': 'Histoire', 
      'Song': 'Chanson',
      'Categories': 'Catégories'
    }
    // Add more as needed
  };
  
  return preTranslated[langCode]?.[text];
};

const getOptimalSpeechRate = (langCode) => {
  // Language-specific optimal speech rates
  const rates = {
    'en': 1.0, 'zh': 0.8, 'fr': 0.9,
    'es': 0.95, 'uk': 0.85, 'nl': 0.9
  };
  return rates[langCode] || 1.0;
};

const getOptimalPitch = (langCode) => {
  // Language-specific pitch adjustments
  const pitches = {
    'en': 1.0, 'zh': 1.1, 'fr': 0.95,
    'es': 1.05, 'uk': 0.9, 'nl': 1.0
  };
  return pitches[langCode] || 1.0;
};

const getPhoneticGuide = async (text, langCode) => {
  // Optional: Return phonetic pronunciation guide
  // Useful for language learning features
  return null; // Implement if needed
};

const preloadTranslations = async (langCode) => {
  // Preload common phrases for instant access
  const commonPhrases = [
    'Welcome', 'Story', 'Song', 'Play', 'Pause', 'Stop',
    'Categories', 'Settings', 'Help', 'About'
  ];
  
  return Promise.all(
    commonPhrases.map(phrase => 
      translationService.translateText(phrase, langCode)
    )
  );
};

export default useEnhancedMultilingual;