import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import translationService from '../services/translationService';
import { logTranslation, logWarn } from '../utils/logger';

// Custom hook for dynamic content translation
export const useDynamicTranslation = () => {
  const { getCurrentLanguageInfo } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);

  // Get target language code (map display names to codes)
  const getTargetLanguageCode = () => {
    const currentLang = getCurrentLanguageInfo();
    const langMap = {
      'English': 'en',
      'Chinese': 'zh', 
      'French': 'fr',
      'Spanish': 'es',
      'Ukrainian': 'uk',
      'Flemish': 'nl'
    };
    return langMap[currentLang?.name] || 'en';
  };

  // Translate a single text
  const translateContent = async (text, sourceLanguage = 'en') => {
    const targetLang = getTargetLanguageCode();
    
    if (targetLang === 'en' || !text) {
      return text;
    }

    setIsTranslating(true);
    try {
      const translated = await translationService.translateText(text, targetLang, sourceLanguage);
      return translated;
    } finally {
      setIsTranslating(false);
    }
  };

  // Translate story with all its properties
  const translateStory = async (story) => {
    const targetLang = getTargetLanguageCode();
    
    if (targetLang === 'en' || !story) {
      return story;
    }

    setIsTranslating(true);
    try {
      const translated = await translationService.translateStory(story, targetLang);
      return translated;
    } finally {
      setIsTranslating(false);
    }
  };

  // Translate array of stories
  const translateStories = async (stories) => {
    const targetLang = getTargetLanguageCode();
    
    if (targetLang === 'en' || !stories?.length) {
      return stories;
    }

    setIsTranslating(true);
    try {
      const translatedStories = await Promise.all(
        stories.map(story => translationService.translateStory(story, targetLang))
      );
      return translatedStories;
    } finally {
      setIsTranslating(false);
    }
  };

  // Translate category
  const translateCategory = async (category) => {
    const targetLang = getTargetLanguageCode();
    
    if (targetLang === 'en' || !category) {
      return category;
    }

    setIsTranslating(true);
    try {
      const translated = await translationService.translateCategory(category, targetLang);
      return translated;
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    translateContent,
    translateStory,
    translateStories,
    translateCategory,
    isTranslating,
    currentLanguage: getTargetLanguageCode()
  };
};

// Hook for translating text with automatic re-translation on language change
export const useTranslatedText = (text, sourceLanguage = 'en') => {
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const translate = async () => {
      if (!text || !text.trim()) {
        setTranslatedText(text);
        return;
      }

      // Get target language code
      const langMap = {
        'English': 'en',
        'Chinese': 'zh', 
        'French': 'fr',
        'Spanish': 'es',
        'Ukrainian': 'uk',
        'Flemish': 'nl'
      };
      
      // currentLanguage is already the display name (e.g., "Chinese"), not an object
      const targetLang = langMap[currentLanguage] || 'en';
      
      logTranslation(`🎯 Current language: "${currentLanguage}" → Target code: "${targetLang}"`);
      
      // If target is English or same as source, no translation needed
      if (targetLang === 'en' || targetLang === sourceLanguage) {
        setTranslatedText(text);
        return;
      }
      
      setIsLoading(true);
      try {
        logTranslation(`🔄 Starting translation for: "${text.substring(0, 50)}..."`);
        logTranslation(`📍 Source: ${sourceLanguage} → Target: ${targetLang}`);
        
        // Use the translation service directly for real-time translation
        const result = await translationService.translateText(text, targetLang, sourceLanguage);
        
        logTranslation(`✅ Translation result: "${result.substring(0, 50)}..."`);
        logTranslation(`🔍 Text changed: ${text !== result ? 'YES' : 'NO'}`);
        
        setTranslatedText(result);
      } catch (error) {
        logWarn('❌ Translation failed:', error);
        setTranslatedText(text); // Fallback to original
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [text, currentLanguage, sourceLanguage]);

  return { translatedText, isLoading };
};

// Hook for stories that automatically translate when language changes
export const useTranslatedStories = (stories) => {
  const [translatedStories, setTranslatedStories] = useState(stories || []);
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage } = useLanguage();
  const { translateStories } = useDynamicTranslation();

  useEffect(() => {
    const translate = async () => {
      if (!stories?.length) return;
      
      setIsLoading(true);
      try {
        const result = await translateStories(stories);
        setTranslatedStories(result);
      } catch (error) {
        logWarn('Stories translation failed:', error);
        setTranslatedStories(stories); // Fallback to original
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [stories, currentLanguage]);

  return { translatedStories, isLoading };
};
