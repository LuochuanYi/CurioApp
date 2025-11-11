import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeLanguage, getCurrentLanguage, getCurrentDisplayLanguage, LANGUAGE_MAPPING, DISPLAY_LANGUAGE_MAPPING } from '../i18n';
import { logInfo, logError } from '../utils/logger';

const LanguageContext = createContext();

const LANGUAGE_STORAGE_KEY = '@curio_app_language';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentDisplayLanguage());
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language preference on app start
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && LANGUAGE_MAPPING[savedLanguage]) {
          await changeLanguage(LANGUAGE_MAPPING[savedLanguage]);
          setCurrentLanguage(savedLanguage);
          console.log('Loaded saved language:', savedLanguage);
        } else {
          // Use current i18n language as fallback
          const currentLang = getCurrentDisplayLanguage();
          setCurrentLanguage(currentLang);
          console.log('Using default language:', currentLang);
        }
      } catch (error) {
        console.error('Error loading saved language:', error);
        setCurrentLanguage('English'); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedLanguage();
  }, []);

  // Function to change language and save preference
  const setLanguage = async (displayLanguageName) => {
    try {
      const languageCode = LANGUAGE_MAPPING[displayLanguageName];
      
      if (!languageCode) {
        console.error('Unsupported language:', displayLanguageName);
        return false;
      }

      console.log('Changing language from', currentLanguage, 'to', displayLanguageName);
      
      // Change i18n language
      await changeLanguage(languageCode);
      
      // Update local state
      setCurrentLanguage(displayLanguageName);
      
      // Save preference to storage
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, displayLanguageName);
      
      console.log('Language changed successfully to:', displayLanguageName);
      return true;
      
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    }
  };

  // Get available languages
  const getAvailableLanguages = () => {
    return [
      { id: 'en', name: 'English', label: 'English' },
      { id: 'fr', name: 'French', label: 'Français' },
      { id: 'zh', name: 'Chinese', label: '中文' },
      { id: 'uk', name: 'Ukrainian', label: 'Українська' },
      { id: 'es', name: 'Spanish', label: 'Español' },
      { id: 'nl', name: 'Flemish', label: 'Vlaams (Dutch)' }
    ];
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    const languages = getAvailableLanguages();
    return languages.find(lang => lang.name === currentLanguage) || languages[0];
  };

  const value = {
    currentLanguage,
    setLanguage,
    getAvailableLanguages,
    getCurrentLanguageInfo,
    isLoading,
    t, // Translation function
    i18n // i18next instance
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};