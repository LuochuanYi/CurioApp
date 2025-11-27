import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Simple bilingual content hook - no translation services needed!
 * Just returns the appropriate language version from static data
 */
export const useBilingualContent = () => {
  const { getCurrentLanguageInfo } = useLanguage();
  
  // Get current language code
  const getCurrentLanguage = () => {
    const currentLang = getCurrentLanguageInfo();
    // Map language names to codes
    const langMap = {
      'Chinese': 'zh',
      '中文': 'zh',
      'English': 'en'
    };
    return langMap[currentLang?.name] || 'en';
  };

  // Get content in current language
  const getContent = (bilingualObject, field = null) => {
    const currentLang = getCurrentLanguage();
    
    if (!bilingualObject) return '';
    
    // If it's a simple bilingual object like { en: "Hello", zh: "你好" }
    if (typeof bilingualObject === 'object' && bilingualObject[currentLang]) {
      return bilingualObject[currentLang];
    }
    
    // If it's a story object with language sections
    if (bilingualObject[currentLang] && field) {
      return bilingualObject[currentLang][field];
    }
    
    // If it's a story object and no field specified, return the whole language section
    if (bilingualObject[currentLang]) {
      return bilingualObject[currentLang];
    }
    
    // Fallback to English
    return bilingualObject.en || bilingualObject;
  };

  // Get story in current language
  const getLocalizedStory = (story) => {
    if (!story) return null;
    
    const currentLang = getCurrentLanguage();
    const content = story[currentLang] || story.en;
    
    return {
      ...story,
      ...content, // Spread the localized content
      duration: getContent(story.duration),
      ageGroup: getContent(story.ageGroup),
      tags: getContent(story.tags),
      language: currentLang === 'zh' ? 'Chinese' : 'English'
    };
  };

  return {
    currentLanguage: getCurrentLanguage(),
    getContent,
    getLocalizedStory,
    isChineseMode: getCurrentLanguage() === 'zh'
  };
};

/**
 * Hook for automatic story localization
 * Usage: const localizedStory = useLocalizedStory(bilingualStoryData)
 */
export const useLocalizedStory = (bilingualStory) => {
  const { getLocalizedStory, currentLanguage } = useBilingualContent();
  const [localizedStory, setLocalizedStory] = useState(null);

  useEffect(() => {
    if (bilingualStory) {
      setLocalizedStory(getLocalizedStory(bilingualStory));
    }
  }, [bilingualStory, currentLanguage]);

  return localizedStory;
};

/**
 * Hook for bilingual text
 * Usage: const text = useBilingualText({ en: "Hello", zh: "你好" })
 */
export const useBilingualText = (textObject) => {
  const { getContent, currentLanguage } = useBilingualContent();
  const [text, setText] = useState('');

  useEffect(() => {
    setText(getContent(textObject));
  }, [textObject, currentLanguage]);

  return text;
};