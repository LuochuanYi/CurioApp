import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import translationService from '../services/translationService';

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
  const { translateContent } = useDynamicTranslation();

  useEffect(() => {
    const translate = async () => {
      if (!text) return;
      
      setIsLoading(true);
      try {
        const result = await translateContent(text, sourceLanguage);
        setTranslatedText(result);
      } catch (error) {
        console.warn('Translation failed:', error);
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
        console.warn('Stories translation failed:', error);
        setTranslatedStories(stories); // Fallback to original
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [stories, currentLanguage]);

  return { translatedStories, isLoading };
};